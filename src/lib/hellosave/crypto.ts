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

    const matchPos = op - offset;
    for (let i = 0; i < matchLength; i++) {
      output[op++] = output[matchPos + i];
    }
  }

  return op; // number of decompressed bytes
}
