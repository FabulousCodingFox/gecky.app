export function decryptAccountFile(data: ArrayBuffer): any {
  const stringData = new TextDecoder()
    .decode(data)
    .replace(/\u0000+$/g, '') // Remove trailing nulls
    .trim();
  return JSON.parse(stringData);
}
