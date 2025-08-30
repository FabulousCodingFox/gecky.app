import jsonmapAccount from '$lib/../data/mapping.json';

export function applyJsonMap(json: any): any {
  if (typeof json === 'string' || typeof json === 'number' || typeof json === 'boolean' || json === null) return json;

  if (Array.isArray(json)) return json.map((item) => applyJsonMap(item));

  if (typeof json === 'object') {
    const newObj: any = {};
    for (const key in json) {
      if (!jsonmapAccount.hasOwnProperty(key)) console.debug(`No mapping.json mapping for key: ${key}`);
      const mappedKey = (jsonmapAccount as Record<string, string>)[key] || key;
      newObj[mappedKey] = applyJsonMap(json[key]);
    }
    return newObj;
  }

  return json;
}

export function reverseJsonMap(json: any): any {
  if (typeof json === 'string' || typeof json === 'number' || typeof json === 'boolean' || json === null) return json;

  if (Array.isArray(json)) return json.map((item) => reverseJsonMap(item));

  if (typeof json === 'object') {
    const newObj: any = {};
    for (const key in json) {
      const originalKey = Object.keys(jsonmapAccount).find((k) => (jsonmapAccount as Record<string, string>)[k] === key) || key;
      newObj[originalKey] = reverseJsonMap(json[key]);
    }
    return newObj;
  }

  return json;
}
