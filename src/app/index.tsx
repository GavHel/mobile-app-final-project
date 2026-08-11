import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import WeatherMetric from "../../components/WeatherMetric";
import { useApp } from "../../context/AppContext";
import { getCurrentWeather } from "../../services/weatherService";
import { CurrentWeather } from "../../types/weather";
import {
  formatTemperature,
  getWeatherAlert,
  getWeatherBackground,
  getWeatherDescription,
  getWeatherIcon,
} from "../../utils/weather";
import { getAppTheme } from "../../utils/theme";

export default function HomeScreen() {
  const router = useRouter();
  const {
    selectedLocation,
    settings,
    saveLocation,
    isLocationSaved,
  } = useApp();
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Minh Khoi Ha part
  const theme = getAppTheme(settings.backgroundStyle);

  const loadWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCurrentWeather(selectedLocation);
      setWeather(data);
    } catch {
      setError(
        "Unable to retrieve weather information. Check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    // Show the loading state while a newly selected city's API request runs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadWeather();
  }, [loadWeather]);

  const backgroundColor = weather
    ? getWeatherBackground(weather.weatherCode, settings.backgroundStyle)
    : theme.screen;
  const lightText = theme.isDark;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title="The Frosty Forecast"
          actionIcon="search"
          actionLabel="Search for a location"
          onAction={() => router.push("/search")}
          lightText={lightText}
        />

        {loading ? (
          <View style={styles.messageBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={[styles.messageText, { color: theme.mutedText }]}>Loading weather...</Text>
          </View>
        ) : error || !weather ? (
          <View style={styles.messageBox}>
            <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            <PrimaryButton label="Try Again" onPress={loadWeather} />
          </View>
        ) : (
          <>
            <View style={styles.hero}>
              <Text style={[styles.city, lightText && styles.lightText]}>
                {selectedLocation.name}
              </Text>
              <Text style={[styles.date, lightText && styles.lightSubtle]}>
                {new Date().toLocaleDateString("en-CA", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text style={styles.icon}>{getWeatherIcon(weather.weatherCode)}</Text>
              <Text style={[styles.temperature, lightText && styles.lightText]}>
                {formatTemperature(weather.temperature, settings.temperatureUnit)}
              </Text>
              <Text style={[styles.condition, lightText && styles.lightText]}>
                {getWeatherDescription(weather.weatherCode)}
              </Text>
              <Text style={[styles.date, lightText && styles.lightSubtle]}>
                Feels like {formatTemperature(
                  weather.apparentTemperature,
                  settings.temperatureUnit,
                )}
              </Text>
            </View>

            <View style={styles.grid}>
              <WeatherMetric label="Humidity" value={`${weather.humidity}%`} />
              <WeatherMetric label="Wind" value={`${weather.windSpeed} km/h`} />
            </View>
            <View style={styles.grid}>
              <WeatherMetric
                label="High"
                value={formatTemperature(weather.high, settings.temperatureUnit)}
              />
              <WeatherMetric
                label="Low"
                value={formatTemperature(weather.low, settings.temperatureUnit)}
              />
            </View>

            {settings.weatherAlerts && (
              <View
                style={[
                  styles.card,
                  styles.alertCard,
                  theme.isDark && styles.darkAlertCard,
                ]}
              >
                <Text style={[styles.cardTitle, theme.isDark && styles.lightText]}>
                  ⚠ Weather Alert
                </Text>
                <Text style={[styles.cardText, theme.isDark && styles.lightSubtle]}>
                  {getWeatherAlert(weather.weatherCode)}
                </Text>
              </View>
            )}

            <PrimaryButton
              label="View 7-Day Forecast"
              onPress={() => router.push("/forecast")}
            />
            <PrimaryButton
              label={
                isLocationSaved(selectedLocation.id)
                  ? "Location Saved"
                  : "Save This Location"
              }
              onPress={() => saveLocation(selectedLocation)}
              secondary
              disabled={isLocationSaved(selectedLocation.id)}
            />
            <PrimaryButton label="Refresh Weather" onPress={loadWeather} secondary />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  messageBox: {
    minHeight: 360,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    marginTop: 12,
    color: "#526D82",
  },
  errorText: {
    color: "#9B1C1C",
    textAlign: "center",
  },
  hero: {
    paddingVertical: 8,
    alignItems: "center",
  },
  city: {
    color: "#102A43",
    fontSize: 28,
    fontWeight: "800",
  },
  date: {
    marginTop: 3,
    color: "#526D82",
  },
  icon: {
    marginVertical: 6,
    fontSize: 68,
  },
  temperature: {
    color: "#102A43",
    fontSize: 58,
    fontWeight: "800",
  },
  condition: {
    marginTop: 4,
    color: "#102A43",
    fontSize: 18,
    fontWeight: "700",
  },
  lightText: {
    color: "#FFFFFF",
  },
  lightSubtle: {
    color: "#E8F1F8",
  },
  grid: {
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
  },
  card: {
    marginTop: 4,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD9E6",
    borderRadius: 18,
  },
  alertCard: {
    backgroundColor: "#FFF7D6",
    borderColor: "#E8CE67",
  },
  darkAlertCard: {
    backgroundColor: "#4A3F1D",
    borderColor: "#8B762F",
  },
  cardTitle: {
    marginBottom: 5,
    color: "#102A43",
    fontSize: 17,
    fontWeight: "700",
  },
  cardText: {
    color: "#526D82",
    lineHeight: 20,
  },
});
