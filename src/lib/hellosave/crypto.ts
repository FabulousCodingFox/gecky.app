/**
 * Decompresses a single LZ4 block into the provided output buffer.
 *
 * @param input - Compressed LZ4 block (no frame headers, just block).
 * @param output - Preallocated buffer to write decompressed bytes into.
 * @returns Number of bytes written to `output`.
 */
export function decodeBlock(input: Uint8Array, output: Uint8Array): number {
  let inputPointer = 0; // input pointer
  let outputPointer = 0; // output pointer

  const inputLength = input.length;

  while (inputPointer < inputLength) {
    const token = input[inputPointer++];

    // ----- Literals -----
    let literalLength = token >>> 4;

    // Extended literal length
    if (literalLength === 15) {
      let lengthByte = 255;
      while (lengthByte === 255) {
        lengthByte = input[inputPointer++];
        literalLength += lengthByte;
      }
    }

    // Copy literals (bulk copy)
    if (literalLength !== 0) {
      const literalEnd = inputPointer + literalLength;
      output.set(input.subarray(inputPointer, literalEnd), outputPointer);
      outputPointer += literalLength;
      inputPointer = literalEnd;
    }

    if (inputPointer >= inputLength) break; // reached end: no more matches

    // ----- Match -----
    const offset = input[inputPointer++] | (input[inputPointer++] << 8);

    let matchLength = token & 0x0f;

    // Extended match length
    if (matchLength === 15) {
      let lengthByte = 255;
      while (lengthByte === 255) {
        lengthByte = input[inputPointer++];
        matchLength += lengthByte;
      }
    }

    matchLength += 4; // minimum match length

    const matchPosition = outputPointer - offset;

    // Fast path (No overlap)
    if (offset >= matchLength) {
      output.set(output.subarray(matchPosition, matchPosition + matchLength), outputPointer);
      outputPointer += matchLength;
      continue;
    }

    // Seed copy (no overlap yet)
    output.set(output.subarray(matchPosition, matchPosition + offset), outputPointer);
    outputPointer += offset;

    let producedLength = offset;
    let remainingLength = matchLength - offset;

    // Exponential growth copy
    while (remainingLength > 0) {
      const copyLength = producedLength < remainingLength ? producedLength : remainingLength;

      const copySource = outputPointer - producedLength;
      output.set(output.subarray(copySource, copySource + copyLength), outputPointer);

      outputPointer += copyLength;
      producedLength += copyLength;
      remainingLength -= copyLength;
    }
  }

  return outputPointer; // number of decompressed bytes
}
