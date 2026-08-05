import { View, Text, StyleSheet } from "react-native";

type Props = {
  label: string;
  value: string;
};

export default function WeatherMetric({
  label,
  value,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
  },

  label: {
    color: "#666",
    marginBottom: 5,
  },

  value: {
    fontSize: 20,
    fontWeight: "bold",
  },
});