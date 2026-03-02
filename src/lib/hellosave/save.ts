import type { JSONSaveData } from '$lib/json';
import { applyJsonMap, reverseJsonMap, trimTrailingNuls } from '.';
import { decodeBlock } from './crypto';

export function validateSaveData(data: JSONSaveData): boolean {
  if (!data) return false;
  if (typeof data !== 'object') return false;
  if (!data.CommonStateData || typeof data.CommonStateData !== 'object') return false;
  return true;
}

const MAGIC = 0xfeeda1e5;

export function decryptSaveFile(data: ArrayBuffer): JSONSaveData {
  const DECODER = new TextDecoder();

  try {
    const view = new DataView(data);
    const bytes = new Uint8Array(data);

    let offset = 0;
    const size = data.byteLength;

    const blocks: Uint8Array[] = [];
    let totalUncompressed = 0;

    while (offset < size) {
      if (offset + 16 > size) throw new Error('Truncated header');

      const magic = view.getUint32(offset, true);
      if (magic !== MAGIC) throw new Error('Invalid magic number in save file');

      const compressedSize = view.getUint32(offset + 4, true);
      const uncompressedSize = view.getUint32(offset + 8, true);

      // skip +12 (sizes) +4 (padding)
      const blockStart = offset + 16;
      const blockEnd = blockStart + compressedSize;

      if (blockEnd > size) throw new Error('Truncated block');

      // Prepare buffers
      const compressedBlock = bytes.subarray(blockStart, blockEnd);
      const uncompressedBlock = new Uint8Array(uncompressedSize);

      // Decompress
      decodeBlock(compressedBlock, uncompressedBlock);

      blocks.push(uncompressedBlock);
      totalUncompressed += uncompressedSize;

      // Advance pointer
      offset = blockEnd;
    }

    // Concatenate all uncompressed bytes once
    const all = new Uint8Array(totalUncompressed);
    let pos = 0;
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      all.set(b, pos);
      pos += b.length;
    }

    // Trim trailing NUL bytes before decoding
    const trimmed = trimTrailingNuls(all);
    const jsonString = DECODER.decode(trimmed).trim();

    return applyJsonMap(JSON.parse(jsonString));
  } catch {
    // Fallback: raw JSON in the file
    const bytes = trimTrailingNuls(new Uint8Array(data));
    const jsonString = DECODER.decode(bytes).trim();
    return applyJsonMap(JSON.parse(jsonString));
  }
}

export function encryptSaveFile(data: JSONSaveData): { buffer: Uint8Array; sizeCompressed: number; sizeUncompressed: number } {
  const reversedData = reverseJsonMap(data);
  const stringData = JSON.stringify(reversedData) + '\u0000'; // Append null character
  const encoder = new TextEncoder();
  const buffer = encoder.encode(stringData);

  return {
    buffer,
    sizeCompressed: buffer.length,
    sizeUncompressed: buffer.length
  };
}
