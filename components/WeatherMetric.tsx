// Minh Khoi Ha part
import { View, Text, StyleSheet } from "react-native";

import { useApp } from "../context/AppContext";
import { getAppTheme } from "../utils/theme";

type Props = {
  label: string;
  value: string;
};

export default function WeatherMetric({
  label,
  value,
}: Props) {
  const { settings } = useApp();
  const theme = getAppTheme(settings.backgroundStyle);

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.label, { color: theme.mutedText }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
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
