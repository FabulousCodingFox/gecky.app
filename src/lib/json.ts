export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONArray = Array<JSONValue>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSONSaveData = any;
