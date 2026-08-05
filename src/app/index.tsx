import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import WeatherMetric from "../../components/WeatherMetric";
import { getCurrentWeather } from "../../services/weatherService";

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      setError("");

      const data = await getCurrentWeather();
      setWeather(data);
    } catch (err) {
      setError(
        "Unable to retrieve weather information. Check your internet connection.",
      );
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code <= 3) return "☀️";
    if (code <= 48) return "☁️";
    if (code <= 67) return "🌧️";
    return "❄️";
  };

  const getWeatherDescription = (code: number) => {
    if (code <= 3) return "Sunny";
    if (code <= 48) return "Cloudy";
    if (code <= 67) return "Rainy";
    return "Snowy";
  };

  const getBackgroundColor = (code: number) => {
    if (code <= 3) return "#DFF3FF";
    if (code <= 48) return "#C7D8E5";
    if (code <= 67) return "#7C95B3";
    return "#F4F9FF";
  };

  if (error) {
    return (
      <View style={styles.loading}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.loading}>
        <Text>Loading Weather...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(weather.weatherCode),
        },
      ]}
    >
      <View style={styles.hero}>
        <Text style={styles.city}>{weather.city}</Text>

        <Text style={styles.icon}>{getWeatherIcon(weather.weatherCode)}</Text>

        <Text style={styles.temperature}>{weather.temperature}°</Text>

        <Text style={styles.condition}>{getWeatherDescription(weather.weatherCode)}</Text>
      </View>

      <View style={styles.grid}>
        <WeatherMetric label="Humidity" value={`${weather.humidity}%`} />

        <WeatherMetric label="Wind" value={`${weather.windSpeed} km/h`} />
      </View>

      <View style={styles.grid}>
        <WeatherMetric label="High" value={`${weather.high}°`} />

        <WeatherMetric label="Low" value={`${weather.low}°`} />
      </View>

      <Text style={styles.feelsLike}>Feels Like {weather.temperature}°</Text>

      <View style={styles.alert}>
        <Text style={styles.alertTitle}>⚠ Weather Alert</Text>

        <Text>Weather conditions may change throughout the day. Check the 7-day forecast for upcoming changes and temperature trends.
        </Text>
      </View>

      <Pressable style={styles.refreshButton} onPress={() => loadWeather()}>
        <Text style={styles.refreshText}>Refresh Weather</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    padding: 20,
  },

  hero: {
    alignItems: "center",
    marginBottom: 20,
  },

  city: {
    fontSize: 32,
    fontWeight: "bold",
  },

  icon: {
    fontSize: 70,
    marginVertical: 10,
  },

  temperature: {
    fontSize: 72,
    fontWeight: "bold",
  },

  condition: {
    fontSize: 18,
    color: "#555",
  },

  grid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  alert: {
    marginTop: 15,
    backgroundColor: "#FFF7D6",
    padding: 15,
    borderRadius: 15,
  },

  alertTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  feelsLike: {
  textAlign: "center",
  marginTop: 10,
  fontSize: 16,
  color: "#526D82",
  },

  refreshButton: {
  backgroundColor: "#2563EB",
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 15,
  },

refreshText: {
  color: "#FFFFFF",
  fontWeight: "bold",
  fontSize: 16,
  },
});
