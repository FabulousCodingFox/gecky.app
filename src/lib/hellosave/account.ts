import type { JSONSaveData } from '$lib/json';
import { applyJsonMap, reverseJsonMap } from '.';

export function decryptAccountFile(data: ArrayBuffer): JSONSaveData {
  const stringData = new TextDecoder()
    .decode(data)
    .replace(/\u0000+$/g, '') // Remove trailing nulls
    .trim();
  return applyJsonMap(JSON.parse(stringData));
}

export function encryptAccountFile(data: JSONSaveData): { buffer: Uint8Array; sizeCompressed: number; sizeUncompressed: number } {
  const reversedData = reverseJsonMap(data);
  const stringData = JSON.stringify(reversedData) + '\u0000'; // Append null character
  const encoder = new TextEncoder();
  const buffer = encoder.encode(stringData);

  return {
    buffer,
    sizeCompressed: buffer.length,
    sizeUncompressed: buffer.length
  };
}

export function validateAccountData(data: JSONSaveData): boolean {
  if (!data) return false;
  if (typeof data !== 'object') return false;
  if (!data.UserSettingsData || typeof data.UserSettingsData !== 'object') return false;
  if (!data.UserSettingsData.UnlockedSeasonRewards || !Array.isArray(data.UserSettingsData.UnlockedSeasonRewards)) return false;
  if (!data.UserSettingsData.UnlockedTwitchRewards || !Array.isArray(data.UserSettingsData.UnlockedTwitchRewards)) return false;
  if (!data.UserSettingsData.UnlockedPlatformRewards || !Array.isArray(data.UserSettingsData.UnlockedPlatformRewards)) return false;
  return true;
}
