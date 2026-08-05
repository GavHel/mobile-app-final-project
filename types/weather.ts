export interface CurrentWeather {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

export interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
}