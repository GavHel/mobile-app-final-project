import { BackgroundStyle, TemperatureUnit } from "../types/weather";

export function getWeatherDescription(code: number) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

export function getWeatherIcon(code: number) {
  if (code === 0) return "☀️";
  if (code <= 3) return "🌤️";
  if (code <= 48) return "☁️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "🌨️";
  return "⛈️";
}

// Minh Khoi Ha part
export function getWeatherBackground(
  code: number,
  backgroundStyle: BackgroundStyle,
) {
  if (backgroundStyle === "light") return "#EEF6FB";
  if (backgroundStyle === "dark") return "#233C55";

  if (code <= 3) return "#DFF3FF";
  if (code <= 48) return "#D8ECF7";
  if (code <= 67) return "#B6CBDD";
  if (code <= 86) return "#F4F9FF";
  return "#94A3B8";
}

export function convertTemperature(value: number, unit: TemperatureUnit) {
  if (unit === "fahrenheit") {
    return Math.round((value * 9) / 5 + 32);
  }

  return Math.round(value);
}

export function formatTemperature(value: number, unit: TemperatureUnit) {
  const convertedValue = convertTemperature(value, unit);
  const symbol = unit === "celsius" ? "C" : "F";

  return `${convertedValue}°${symbol}`;
}

export function getWeatherAlert(code: number) {
  if (code >= 95) {
    return "Thunderstorms are possible. Stay indoors when thunder is nearby.";
  }

  if (code >= 71 && code <= 86) {
    return "Snow may reduce visibility and make roads slippery.";
  }

  if (code >= 51 && code <= 67) {
    return "Wet weather is expected. Take a rain jacket or umbrella.";
  }

  return "Weather conditions can change during the day. Check the forecast before travelling.";
}
