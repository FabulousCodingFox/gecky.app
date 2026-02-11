import mappings from '$lib/../data/mapping.json';
import type { JSONObject, JSONValue } from '$lib/json';

export function applyJsonMap(json: JSONValue): JSONValue {
  if (typeof json === 'string' || typeof json === 'number' || typeof json === 'boolean' || json === null) return json;

  if (Array.isArray(json)) return json.map((item) => applyJsonMap(item));

  if (typeof json === 'object') {
    const newObj: JSONObject = {};
    for (const key in json) {
      if (!Object.hasOwn(mappings, key)) console.debug(`No mapping.json mapping for key: ${key}`);
      const mappedKey = (mappings as Record<string, string>)[key] || key;
      newObj[mappedKey] = applyJsonMap(json[key]);
    }
    return newObj;
  }

  return json;
}

export function reverseJsonMap(json: JSONValue): JSONValue {
  if (typeof json === 'string' || typeof json === 'number' || typeof json === 'boolean' || json === null) return json;

  if (Array.isArray(json)) return json.map((item) => reverseJsonMap(item));

  if (typeof json === 'object') {
    const newObj: JSONObject = {};
    for (const key in json) {
      const originalKey = Object.keys(mappings).find((k) => (mappings as Record<string, string>)[k] === key) || key;
      newObj[originalKey] = reverseJsonMap(json[key]);
    }
    return newObj;
  }

  return json;
}
