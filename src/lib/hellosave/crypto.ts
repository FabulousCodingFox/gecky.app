/**
 * SHA-256 and simplified SpookyHash128 implementations
 *
 * - sha256: Fully compliant with FIPS 180-4, works on any input size.
 *   Returns a 32-byte Uint8Array digest.
 *
 * - spookyHash128: Simplified 16-byte mixing hash (not original SpookyHash),
 *   intended for NMS file use. Returns a 16-byte Uint8Array digest.
 */

/**
 * Compute SHA-256 digest of given data.
 * @param data Input Uint8Array
 * @returns 32-byte SHA-256 digest
 */
export function sha256(data: Uint8Array): Uint8Array {
  const rotr = (n: number, x: number) => (x >>> n) | (x << (32 - n));

  // Round constants
  const k = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f,
    0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
    0xc67178f2
  ]);

  // Initial state
  const h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);

  const withPad = new Uint8Array(((data.length + 72) & ~63) >>> 0);
  withPad.set(data);
  withPad[data.length] = 0x80;
  const bitLen = data.length * 8;
  const n = withPad.length;
  withPad[n - 4] = (bitLen >>> 24) & 0xff;
  withPad[n - 3] = (bitLen >>> 16) & 0xff;
  withPad[n - 2] = (bitLen >>> 8) & 0xff;
  withPad[n - 1] = (bitLen >>> 0) & 0xff;

  const w = new Uint32Array(64);

  // Process 512-bit chunks
  for (let i = 0; i < withPad.length; i += 64) {
    // Message schedule
    for (let j = 0; j < 16; j++) {
      const off = i + (j << 2);
      w[j] = (withPad[off] << 24) | (withPad[off + 1] << 16) | (withPad[off + 2] << 8) | withPad[off + 3];
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(7, w[j - 15]) ^ rotr(18, w[j - 15]) ^ (w[j - 15] >>> 3);
      const s1 = rotr(17, w[j - 2]) ^ rotr(19, w[j - 2]) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }

    // Working vars
    let [a, b, c, d, e, f, g, hh] = h;

    // Main loop
    for (let j = 0; j < 64; j++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (hh + S1 + ch + k[j] + w[j]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      hh = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    // Update state
    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
    h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0;
    h[7] = (h[7] + hh) >>> 0;
  }

  // Serialize output
  const out = new Uint8Array(32);
  const view = new DataView(out.buffer);
  for (let i = 0; i < 8; i++) {
    view.setUint32(i << 2, h[i], false); // big-endian
  }
  return out;
}

/**
 * Simplified 16-byte SpookyHash variant.
 * @param data Input Uint8Array
 * @returns 16-byte digest
 */
export function spookyHash128(data: Uint8Array): Uint8Array {
  let h1 = 0xdeadbeef,
    h2 = 0xdeadbeef,
    h3 = 0xdeadbeef,
    h4 = 0xdeadbeef;
  const mul = 0x5bd1e995;

  for (let i = 0; i < data.length; i++) {
    const b = data[i];

    h1 = Math.imul(h1 ^ b, mul);
    h1 = ((h1 << 15) | (h1 >>> 17)) >>> 0;
    h2 = Math.imul(h2 ^ b, mul);
    h2 = ((h2 << 13) | (h2 >>> 19)) >>> 0;
    h3 = Math.imul(h3 ^ b, mul);
    h3 = ((h3 << 11) | (h3 >>> 21)) >>> 0;
    h4 = Math.imul(h4 ^ b, mul);
    h4 = ((h4 << 7) | (h4 >>> 25)) >>> 0;
  }

  const out = new Uint8Array(16);
  const view = new DataView(out.buffer);
  view.setUint32(0, h1 >>> 0, false);
  view.setUint32(4, h2 >>> 0, false);
  view.setUint32(8, h3 >>> 0, false);
  view.setUint32(12, h4 >>> 0, false);

  return out;
}

/**
 * Decompresses a single LZ4 block into the provided output buffer.
 *
 * @param input - Compressed LZ4 block (no frame headers, just block).
 * @param output - Preallocated buffer to write decompressed bytes into.
 * @returns Number of bytes written to `output`.
 */
export function decodeBlock(input: Uint8Array, output: Uint8Array): number {
  let ip = 0; // input pointer
  let op = 0; // output pointer

  while (ip < input.length) {
    const token = input[ip++];

    // ----- Literals -----
    let literalLength = token >> 4;
    if (literalLength === 0x0f) {
      let len: number;
      while ((len = input[ip++]) === 0xff) {
        literalLength += 0xff;
      }
      literalLength += len;
    }

    // Copy literals
    for (let i = 0; i < literalLength; i++) {
      output[op++] = input[ip++];
    }

    if (ip >= input.length) break; // reached end: no more matches

    // ----- Match -----
    const offset = input[ip++] | (input[ip++] << 8);

    let matchLength = token & 0x0f;
    if (matchLength === 0x0f) {
      let len: number;
      while ((len = input[ip++]) === 0xff) {
        matchLength += 0xff;
      }
      matchLength += len;
    }
    matchLength += 4; // minimum match length

    let matchPos = op - offset;
    for (let i = 0; i < matchLength; i++) {
      output[op++] = output[matchPos + i];
    }
  }

  return op; // number of decompressed bytes
}
