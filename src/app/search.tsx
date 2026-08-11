import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  CurrentWeather,
  getWeatherByLocation,
  searchCity,
} from "../../services/weatherService";

export default function Search() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (city === "") {
      setMessage("Enter a city");
      setWeather(null);
      return;
    }

    const result = await searchCity(city);

    if (result) {
      const weatherData = await getWeatherByLocation(
        result.latitude,
        result.longitude,
        result.name,
      );

      setWeather(weatherData);
      setMessage("");
    } else {
      setWeather(null);
      setMessage("City not found");
    }
  };

  const saveLocation = async () => {
    if (!weather) {
      return;
    }

    const saved = await AsyncStorage.getItem("savedLocations");

    let locations = [];

    if (saved) {
      locations = JSON.parse(saved);
    }

    const alreadySaved = locations.find(
      (item: any) => item.city === weather.city,
    );

    if (!alreadySaved) {
      locations.push(weather);

      await AsyncStorage.setItem("savedLocations", JSON.stringify(locations));

      setMessage("Location saved");
    } else {
      setMessage("Location already saved");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search City</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {message !== "" && <Text style={styles.message}>{message}</Text>}

      {weather && (
        <View style={styles.card}>
          <Text style={styles.cityName}>{weather.city}</Text>

          <Text style={styles.temperature}>{weather.temperature}°C</Text>

          <Text>Humidity: {weather.humidity}%</Text>
          <Text>Wind: {weather.windSpeed} km/h</Text>
          <Text>High: {weather.high}°C</Text>
          <Text>Low: {weather.low}°C</Text>
          <TouchableOpacity style={styles.saveButton} onPress={saveLocation}>
            <Text style={styles.buttonText}>Save Location</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf6ff",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: "#1db36d",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },

  message: {
    marginTop: 15,
    color: "red",
  },

  card: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
  },

  cityName: {
    fontSize: 20,
    fontWeight: "bold",
  },

  temperature: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
