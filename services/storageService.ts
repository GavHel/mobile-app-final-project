// Minh Khoi Ha part
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StoredAppState } from "../types/weather";

const STORAGE_KEY = "frosty-forecast-state";

export async function loadAppState(): Promise<StoredAppState | null> {
  try {
    const savedValue = await AsyncStorage.getItem(STORAGE_KEY);

    if (!savedValue) return null;

    return JSON.parse(savedValue) as StoredAppState;
  } catch {
    return null;
  }
}

export async function saveAppState(state: StoredAppState) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The app can still work during this session if storage is unavailable.
  }
}
