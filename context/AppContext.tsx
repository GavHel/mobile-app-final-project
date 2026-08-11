// Minh Khoi Ha part
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { loadAppState, saveAppState } from "../services/storageService";
import { AppSettings, WeatherLocation } from "../types/weather";

export const CALGARY: WeatherLocation = {
  id: "5913490",
  name: "Calgary",
  region: "Alberta",
  country: "Canada",
  latitude: 51.05011,
  longitude: -114.08529,
};

export const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: "celsius",
  weatherAlerts: true,
  useCurrentLocation: false,
  saveSearchHistory: true,
  backgroundStyle: "automatic",
};

interface AppContextValue {
  selectedLocation: WeatherLocation;
  savedLocations: WeatherLocation[];
  recentSearches: WeatherLocation[];
  settings: AppSettings;
  selectLocation: (location: WeatherLocation, addToHistory?: boolean) => void;
  saveLocation: (location: WeatherLocation) => void;
  removeLocation: (locationId: string) => void;
  isLocationSaved: (locationId: string) => boolean;
  updateSettings: (newSettings: AppSettings) => void;
  clearRecentSearches: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function keepUniqueLocations(locations: WeatherLocation[]) {
  return locations.filter(
    (location, index) =>
      locations.findIndex((item) => item.id === location.id) === index,
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState(CALGARY);
  const [savedLocations, setSavedLocations] = useState<WeatherLocation[]>([
    CALGARY,
  ]);
  const [recentSearches, setRecentSearches] = useState<WeatherLocation[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function restoreState() {
      const savedState = await loadAppState();

      if (savedState) {
        setSelectedLocation(savedState.selectedLocation ?? CALGARY);
        setSavedLocations(savedState.savedLocations ?? [CALGARY]);
        setRecentSearches(savedState.recentSearches ?? []);
        setSettings({ ...DEFAULT_SETTINGS, ...savedState.settings });
      }

      setIsReady(true);
    }

    restoreState();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    saveAppState({
      selectedLocation,
      savedLocations,
      recentSearches,
      settings,
    });
  }, [isReady, recentSearches, savedLocations, selectedLocation, settings]);

  function selectLocation(location: WeatherLocation, addToHistory = true) {
    setSelectedLocation(location);

    if (addToHistory && settings.saveSearchHistory) {
      setRecentSearches((current) =>
        keepUniqueLocations([location, ...current]).slice(0, 5),
      );
    }
  }

  function saveLocation(location: WeatherLocation) {
    setSavedLocations((current) =>
      keepUniqueLocations([...current, location]),
    );
  }

  function removeLocation(locationId: string) {
    setSavedLocations((current) =>
      current.filter((location) => location.id !== locationId),
    );
  }

  function isLocationSaved(locationId: string) {
    return savedLocations.some((location) => location.id === locationId);
  }

  function updateSettings(newSettings: AppSettings) {
    setSettings(newSettings);

    if (!newSettings.saveSearchHistory) {
      setRecentSearches([]);
    }
  }

  if (!isReady) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading The Frosty Forecast...</Text>
      </View>
    );
  }

  return (
    <AppContext.Provider
      value={{
        selectedLocation,
        savedLocations,
        recentSearches,
        settings,
        selectLocation,
        saveLocation,
        removeLocation,
        isLocationSaved,
        updateSettings,
        clearRecentSearches: () => setRecentSearches([]),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error("useApp must be used inside AppProvider.");
  }

  return value;
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF6FB",
  },
  loadingText: {
    marginTop: 12,
    color: "#526D82",
  },
});
