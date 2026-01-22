export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONArray = Array<JSONValue>;

// Save data can be any valid JSON structure
export type JSONSaveData = JSONObject;
