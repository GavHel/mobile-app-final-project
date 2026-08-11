import {
  CurrentWeather,
  ForecastDay,
  WeatherLocation,
} from "../types/weather";

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

async function readJson(response: Response) {
  if (!response.ok) {
    throw new Error("The weather service could not complete the request.");
  }

  return response.json();
}

export async function getCurrentWeather(
  location: WeatherLocation,
): Promise<CurrentWeather> {
  const response = await fetch(
    `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}` +
      "&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code" +
      "&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto",
  );
  const data = await readJson(response);

  if (!data.current || !data.daily) {
    throw new Error("Weather data is unavailable for this location.");
  }

  return {
    temperature: Math.round(data.current.temperature_2m),
    apparentTemperature: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    weatherCode: data.current.weather_code,
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
  };
}

export async function getForecast(
  location: WeatherLocation,
): Promise<ForecastDay[]> {
  const response = await fetch(
    `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}` +
      "&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max" +
      "&forecast_days=7&timezone=auto",
  );
  const data = await readJson(response);

  if (!data.daily?.time) {
    throw new Error("Forecast data is unavailable for this location.");
  }

  return data.daily.time.map((date: string, index: number) => ({
    date,
    tempMax: Math.round(data.daily.temperature_2m_max[index]),
    tempMin: Math.round(data.daily.temperature_2m_min[index]),
    weatherCode: data.daily.weather_code[index],
    precipitationChance:
      data.daily.precipitation_probability_max[index] ?? 0,
  }));
}

export async function searchLocations(query: string): Promise<WeatherLocation[]> {
  const response = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=8&language=en&format=json`,
  );
  const data = await readJson(response);

  if (!data.results) return [];

  return data.results.map(
    (result: {
      id: number;
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
    }) => ({
      id: String(result.id),
      name: result.name,
      region: result.admin1 ?? "",
      country: result.country ?? "",
      latitude: result.latitude,
      longitude: result.longitude,
    }),
  );
}
