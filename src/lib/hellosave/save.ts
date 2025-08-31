import { applyJsonMap } from '.';
import { decodeBlock } from './crypto';

export function validateSaveData(data: any): boolean {
  if (!data) return false;
  if (typeof data !== 'object') return false;
  return true;
}

export function decryptSaveFile(data: ArrayBuffer): any {
  const view = new DataView(data);
  const bytes = new Uint8Array(data);

  const decoder = new TextDecoder();
  const decodedParts: string[] = [];

  let offset = 0;
  const size = data.byteLength;

  while (offset < size) {
    const magic = view.getUint32(offset, true);
    if (magic !== 0xfeeda1e5) {
      throw new Error('Invalid magic number in save file');
    }

    const compressedSize = view.getUint32(offset + 4, true);
    const uncompressedSize = view.getUint32(offset + 8, true);
    // skip +12 (sizes) +4 (padding)
    const blockStart = offset + 16;
    const blockEnd = blockStart + compressedSize;

    // Prepare buffers
    const compressedBlock = bytes.subarray(blockStart, blockEnd);
    const uncompressedBlock = new Uint8Array(uncompressedSize);

    // Decompress
    decodeBlock(compressedBlock, uncompressedBlock);

    // Decode to text & collect
    decodedParts.push(decoder.decode(uncompressedBlock));

    // Advance pointer
    offset = blockEnd;
  }

  const jsonString = decodedParts
    .join('')
    .replace(/\u0000+$/g, '') // Remove trailing nulls
    .trim();

  return applyJsonMap(JSON.parse(jsonString));
}
