import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ForecastRow from "../../components/ForecastRow";
import { getForecast } from "../../services/weatherService";

export default function ForecastScreen() {
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      const data = await getForecast();
      setForecast(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (date: string) => {
    return new Date(date).toLocaleDateString("en-CA", {
      weekday: "long",
    });
  };

  const calculateAverageTemp = () => {
    if (!forecast.length) return 0;

    const total = forecast.reduce((sum, day) => sum + day.tempMax, 0);

    return Math.round(total / forecast.length);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading Forecast...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>7-Day Forecast</Text>

      <Text style={styles.location}>Calgary</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Weekly Summary</Text>

        <Text style={styles.summaryText}>
          Current forecast for the next seven days. Temperatures will average
          around {calculateAverageTemp()}°C.
        </Text>
      </View>

      <View style={styles.forecastCard}>
        {forecast.map((day, index) => (
          <ForecastRow
            key={index}
            day={getDayName(day.date)}
            high={day.tempMax}
            low={day.tempMin}
          />
        ))}
      </View>

      <View style={styles.statsCard}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Weekly Average</Text>

          <Text style={styles.statValue}>{calculateAverageTemp()}°</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statLabel}>Forecast Days</Text>

          <Text style={styles.statValue}>{forecast.length}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF6FB",
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
  },

  location: {
    fontSize: 18,
    color: "#526D82",
    marginBottom: 15,
  },

  summaryCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  summaryText: {
    color: "#526D82",
  },

  forecastCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  statsCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  stat: {
    alignItems: "center",
    flex: 1,
  },

  statLabel: {
    color: "#526D82",
    marginBottom: 4,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
