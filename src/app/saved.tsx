import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Saved() {
  const [locations, setLocations] = useState<any[]>([]);

  const loadLocations = async () => {
    const saved = await AsyncStorage.getItem("savedLocations");

    if (saved) {
      setLocations(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const removeLocation = async (city: string) => {
    const newLocations = locations.filter((item) => item.city !== city);

    setLocations(newLocations);

    await AsyncStorage.setItem("savedLocations", JSON.stringify(newLocations));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Locations</Text>

      {locations.length === 0 && <Text>No saved locations</Text>}

      {locations.map((item, index) => (
        <View style={styles.card} key={index}>
          <Text style={styles.city}>{item.city}</Text>
          <Text>{item.temperature}°C</Text>
          <Text>Humidity: {item.humidity}%</Text>

          <Text
            style={styles.removeButton}
            onPress={() => removeLocation(item.city)}
          >
            Remove
          </Text>
        </View>
      ))}
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

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },

  removeButton: {
    backgroundColor: "#dc2626",
    color: "white",
    padding: 8,
    marginTop: 10,
    borderRadius: 6,
    textAlign: "center",
    fontWeight: "bold",
  },

  city: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
