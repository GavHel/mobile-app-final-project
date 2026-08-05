export interface CurrentWeather {
  city: string;
  temperature: number;
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

const LAT = 51.0447;
const LON = -114.0719;

export async function getCurrentWeather(): Promise<CurrentWeather> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=1`
  );

  const data = await response.json();

  return {
    city: "Calgary",
    temperature: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    weatherCode: data.current.weather_code,
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
  };
}

export async function getForecast(): Promise<ForecastDay[]> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&forecast_days=7`
  );

  const data = await response.json();

  return data.daily.time.map(
    (date: string, index: number) => ({
      date,
      tempMax: Math.round(
        data.daily.temperature_2m_max[index]
      ),
      tempMin: Math.round(
        data.daily.temperature_2m_min[index]
      ),
      weatherCode: data.daily.weather_code[index],
      precipitationChance:
        data.daily.precipitation_probability_max[index],
    })
  );
}