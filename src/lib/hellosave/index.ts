import jsonmapAccount from '$lib/../data/jsonmap/account.json';

export function decryptAccountFile(data: ArrayBuffer): any {
  const stringData = new TextDecoder()
    .decode(data)
    .replace(/\u0000+$/g, '') // Remove trailing nulls
    .trim();
  return applyJsonMap(JSON.parse(stringData), jsonmapAccount);
}

export function encryptAccountFile(data: any): ArrayBuffer {
  const reversedData = reverseJsonMap(data, jsonmapAccount);
  const stringData = JSON.stringify(reversedData) + '\u0000'; // Append null character
  const encoder = new TextEncoder();
  return encoder.encode(stringData).buffer;
}

function applyJsonMap(json: any, jsonmap: Record<string, string>): any {
  if (typeof json === 'string' || typeof json === 'number' || typeof json === 'boolean' || json === null) return json;

  if (Array.isArray(json)) return json.map((item) => applyJsonMap(item, jsonmap));

  if (typeof json === 'object') {
    const newObj: any = {};
    for (const key in json) {
      if (!jsonmap.hasOwnProperty(key)) console.debug(`No jsonmap/account.json mapping for key: ${key}`);
      const mappedKey = jsonmap[key] || key;
      newObj[mappedKey] = applyJsonMap(json[key], jsonmap);
    }
    return newObj;
  }

  return json;
}

function reverseJsonMap(json: any, jsonmap: Record<string, string>): any {
  if (typeof json === 'string' || typeof json === 'number' || typeof json === 'boolean' || json === null) return json;

  if (Array.isArray(json)) return json.map((item) => reverseJsonMap(item, jsonmap));

  if (typeof json === 'object') {
    const newObj: any = {};
    for (const key in json) {
      const originalKey = Object.keys(jsonmap).find((k) => jsonmap[k] === key) || key;
      newObj[originalKey] = reverseJsonMap(json[key], jsonmap);
    }
    return newObj;
  }

  return json;
}
