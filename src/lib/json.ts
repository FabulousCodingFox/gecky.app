export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONArray = Array<JSONValue>;

export type JSONSaveData = any;
