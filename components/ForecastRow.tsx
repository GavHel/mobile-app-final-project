import { StyleSheet, Text, View } from "react-native";

import { useApp } from "../context/AppContext";
import { getAppTheme } from "../utils/theme";

interface Props {
  day: string;
  icon: string;
  condition: string;
  high: string;
  low: string;
  precipitationChance: number;
}

export default function ForecastRow({
  day,
  icon,
  condition,
  high,
  low,
  precipitationChance,
}: Props) {
  const { settings } = useApp();
  // Minh Khoi Ha part
  const theme = getAppTheme(settings.backgroundStyle);

  return (
    <View style={[styles.row, { borderColor: theme.border }]}>
      <View style={styles.dayColumn}>
        <Text style={[styles.day, { color: theme.text }]}>{day}</Text>
        <Text style={[styles.rain, { color: theme.mutedText }]}>
          {precipitationChance}% rain
        </Text>
      </View>

      <View style={styles.conditionColumn}>
        <Text style={styles.icon}>{icon}</Text>
        <Text
          style={[styles.condition, { color: theme.mutedText }]}
          numberOfLines={1}
        >
          {condition}
        </Text>
      </View>

      <Text style={[styles.temperature, { color: theme.text }]}>
        {high} / {low}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#D6E1EA",
  },
  dayColumn: {
    width: 88,
  },
  day: {
    color: "#102A43",
    fontWeight: "700",
  },
  rain: {
    marginTop: 3,
    color: "#526D82",
    fontSize: 12,
  },
  conditionColumn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 7,
    fontSize: 22,
  },
  condition: {
    flex: 1,
    color: "#526D82",
    fontSize: 13,
  },
  temperature: {
    marginLeft: 8,
    color: "#102A43",
    fontSize: 13,
    fontWeight: "700",
  },
});
