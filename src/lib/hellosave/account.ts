import { applyJsonMap, reverseJsonMap } from '.';
import { sha256, spookyHash128 } from './crypto';

/**
 * Rotate a 32-bit unsigned integer left by `bits`.
 */
function rotateLeft32(value: number, bits: number): number {
  return ((value << bits) | (value >>> (32 - bits))) >>> 0;
}

/**
 * Convert bytes into 32-bit words (little-endian).
 */
function bytesToWords(data: Uint8Array): Uint32Array {
  const words = new Uint32Array(data.length >>> 2);
  for (let i = 0, j = 0; i < words.length; i++, j += 4) {
    words[i] = data[j] | (data[j + 1] << 8) | (data[j + 2] << 16) | (data[j + 3] << 24);
  }
  return words;
}

/**
 * Convert 32-bit words back into bytes (little-endian).
 */
function wordsToBytes(words: Uint32Array): Uint8Array {
  const out = new Uint8Array(words.length << 2);
  for (let i = 0, j = 0; i < words.length; i++, j += 4) {
    const w = words[i];
    out[j] = w & 0xff;
    out[j + 1] = (w >>> 8) & 0xff;
    out[j + 2] = (w >>> 16) & 0xff;
    out[j + 3] = (w >>> 24) & 0xff;
  }
  return out;
}

/**
 * Write a 32-bit little-endian integer into a Uint8Array.
 * @param buf Target buffer
 * @param offset Offset in bytes (must be multiple of 4, >= 8)
 * @param value 32-bit integer to write
 */
function writeInt(buf: Uint8Array, offset: number, value: number): void {
  if (offset < 8 || (offset & 3) !== 0) {
    throw new Error(`Invalid offset: ${offset}`);
  }
  buf[offset - 8] = value & 0xff;
  buf[offset - 7] = (value >>> 8) & 0xff;
  buf[offset - 6] = (value >>> 16) & 0xff;
  buf[offset - 5] = (value >>> 24) & 0xff;
}

/**
 * Generate an MF file with header + encrypted payload.
 */
async function generateMfFile(slotId: number, formatId: number, payload: Uint8Array, encryptionRounds: number) {
  // Generate key
  const seed = ((slotId + 2) ^ 0x1422cb8c) >>> 0;
  const keyBytes = new Uint8Array([78, 65, 69, 83, 69, 86, 65, 68, 78, 65, 89, 82, 84, 78, 82, 71]);
  const key = bytesToWords(keyBytes);
  key[0] = (Math.imul(rotateLeft32(seed, 13), 5) + 0xe62ac1e4) >>> 0;

  // Block
  const dataWords = bytesToWords(payload);
  const block = new Uint32Array(2 + dataWords.length);
  block[0] = 0xeefa053e; // HEADER_MAGIC
  block[1] = formatId >>> 0; // format ID
  block.set(dataWords, 2);

  // Encryption
  const lastIndex = block.length - 1;
  let sum = 0 >>> 0;
  let prevWord = 0 >>> 0;

  for (let round = 0; round < encryptionRounds; round++) {
    sum = (sum + 0x9e3779b9) >>> 0; // TEA delta
    const keyIndex = (sum >>> 2) & 3;

    // Process all but last word
    for (let i = 0; i < lastIndex; i++) {
      const nextWord = block[i + 1];

      let mix = ((nextWord >>> 3) ^ ((prevWord & 0x0fffffff) << 4)) + ((nextWord << 2) ^ (prevWord >>> 5));
      mix ^= (prevWord ^ key[(i & 3) ^ keyIndex]) + (nextWord ^ sum);

      block[i] = (block[i] + (mix >>> 0)) >>> 0;
      prevWord = block[i];
    }

    // Process last word against first
    const nextWord = block[0];
    let mix = ((nextWord >>> 3) ^ ((prevWord & 0x0fffffff) << 4)) + ((nextWord << 2) ^ (prevWord >>> 5));
    mix ^= (prevWord ^ key[(lastIndex & 3) ^ keyIndex]) + (nextWord ^ sum);

    block[lastIndex] = (block[lastIndex] + (mix >>> 0)) >>> 0;
    prevWord = block[lastIndex];
  }

  return wordsToBytes(block);
}

export async function createMfAccountFile(payload: Uint8Array) {
  const sha = new Uint8Array(sha256(payload)); // 32B
  const spooky = spookyHash128(payload); // 16B

  const metadata = new Uint8Array(376);
  metadata.set(spooky, 0);
  metadata.set(sha, 16);

  writeInt(metadata, 56, payload.length); // Decompressed size
  writeInt(metadata, 60, payload.length); // Compressed size

  const encoded = await generateMfFile(-1, 2004, metadata, 6);

  const result = new Uint8Array(384 + 16 + 32);
  result.set(encoded, 0);
  result.set(spooky, 384);
  result.set(sha, 384 + 16);

  return result;
}

export function decryptAccountFile(data: ArrayBuffer): any {
  const stringData = new TextDecoder()
    .decode(data)
    .replace(/\u0000+$/g, '') // Remove trailing nulls
    .trim();
  return applyJsonMap(JSON.parse(stringData));
}

export function encryptAccountFile(data: any): ArrayBuffer {
  const reversedData = reverseJsonMap(data);
  const stringData = JSON.stringify(reversedData) + '\u0000'; // Append null character
  const encoder = new TextEncoder();
  return encoder.encode(stringData).buffer;
}
