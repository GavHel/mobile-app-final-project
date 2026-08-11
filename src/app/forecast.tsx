import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ForecastRow from "../../components/ForecastRow";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import { useApp } from "../../context/AppContext";
import { getForecast } from "../../services/weatherService";
import { ForecastDay } from "../../types/weather";
import {
  convertTemperature,
  formatTemperature,
  getWeatherDescription,
  getWeatherIcon,
} from "../../utils/weather";
import { getAppTheme } from "../../utils/theme";

export default function ForecastScreen() {
  const { selectedLocation, settings } = useApp();
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Minh Khoi Ha part
  const theme = getAppTheme(settings.backgroundStyle);

  const loadForecast = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getForecast(selectedLocation);
      setForecast(data);
    } catch {
      setError(
        "Unable to load the forecast. Check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    // Show the loading state while a newly selected city's forecast request runs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadForecast();
  }, [loadForecast]);

  function getDayName(date: string, index: number) {
    if (index === 0) return "Today";

    return new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
      weekday: "long",
    });
  }

  function calculateAverageTemperature() {
    if (forecast.length === 0) return 0;

    const total = forecast.reduce((sum, day) => sum + day.tempMax, 0);
    return convertTemperature(total / forecast.length, settings.temperatureUnit);
  }

  function calculateRainChance() {
    if (forecast.length === 0) return 0;

    const total = forecast.reduce(
      (sum, day) => sum + day.precipitationChance,
      0,
    );
    return Math.round(total / forecast.length);
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.forecastScreen }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="7-Day Forecast" />
        <Text style={[styles.title, { color: theme.text }]}>{selectedLocation.name}</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>Weekly outlook</Text>

        {loading ? (
          <View style={styles.messageBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={[styles.messageText, { color: theme.mutedText }]}>Loading forecast...</Text>
          </View>
        ) : error ? (
          <View style={styles.messageBox}>
            <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            <PrimaryButton label="Try Again" onPress={loadForecast} />
          </View>
        ) : (
          <>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Weekly Summary</Text>
              <Text style={[styles.cardText, { color: theme.mutedText }]}>
                The next seven days have an average high of {calculateAverageTemperature()}°
                {settings.temperatureUnit === "celsius" ? "C" : "F"}. Select another
                city from Search or Saved Locations to update this forecast.
              </Text>
            </View>

            <View style={[styles.forecastCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {forecast.map((day, index) => (
                <ForecastRow
                  key={day.date}
                  day={getDayName(day.date, index)}
                  icon={getWeatherIcon(day.weatherCode)}
                  condition={getWeatherDescription(day.weatherCode)}
                  high={formatTemperature(day.tempMax, settings.temperatureUnit)}
                  low={formatTemperature(day.tempMin, settings.temperatureUnit)}
                  precipitationChance={day.precipitationChance}
                />
              ))}
            </View>

            <View style={[styles.summaryGrid, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.metric, { backgroundColor: theme.softCard }]}>
                <Text style={[styles.metricLabel, { color: theme.mutedText }]}>Rain Chance</Text>
                <Text style={[styles.metricValue, { color: theme.text }]}>{calculateRainChance()}%</Text>
              </View>
              <View style={[styles.metric, { backgroundColor: theme.softCard }]}>
                <Text style={[styles.metricLabel, { color: theme.mutedText }]}>Weekly Average</Text>
                <Text style={[styles.metricValue, { color: theme.text }]}>
                  {calculateAverageTemperature()}°
                  {settings.temperatureUnit === "celsius" ? "C" : "F"}
                </Text>
              </View>
            </View>

            <PrimaryButton label="Refresh Forecast" onPress={loadForecast} secondary />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D8ECF7",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    marginTop: 4,
    color: "#102A43",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 3,
    color: "#526D82",
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
  card: {
    marginTop: 16,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD9E6",
    borderRadius: 18,
  },
  cardTitle: {
    marginBottom: 6,
    color: "#102A43",
    fontSize: 17,
    fontWeight: "700",
  },
  cardText: {
    color: "#526D82",
    lineHeight: 20,
  },
  forecastCard: {
    marginTop: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD9E6",
    borderRadius: 18,
  },
  summaryGrid: {
    marginTop: 14,
    padding: 10,
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD9E6",
    borderRadius: 18,
  },
  metric: {
    flex: 1,
    padding: 11,
    alignItems: "center",
    backgroundColor: "#F1F8FC",
    borderRadius: 13,
  },
  metricLabel: {
    color: "#526D82",
    fontSize: 13,
  },
  metricValue: {
    marginTop: 4,
    color: "#102A43",
    fontSize: 18,
    fontWeight: "800",
  },
});
