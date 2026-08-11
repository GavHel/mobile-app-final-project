export type TemperatureUnit = "celsius" | "fahrenheit";

export type BackgroundStyle = "automatic" | "light" | "dark";

export interface WeatherLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  high: number;
  low: number;
}

export interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationChance: number;
}

// Minh Khoi Ha part
export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  weatherAlerts: boolean;
  useCurrentLocation: boolean;
  saveSearchHistory: boolean;
  backgroundStyle: BackgroundStyle;
}

export interface StoredAppState {
  selectedLocation: WeatherLocation;
  savedLocations: WeatherLocation[];
  recentSearches: WeatherLocation[];
  settings: AppSettings;
}
