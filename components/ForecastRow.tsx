import { View, Text, StyleSheet } from "react-native";

type Props = {
  day: string;
  high: number;
  low: number;
};

export default function ForecastRow({
  day,
  high,
  low,
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.day}>{day}</Text>

      <Text style={styles.temperature}>
        {high}° / {low}°
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  day: {
    fontWeight: "600",
  },

  temperature: {
    fontWeight: "700",
  },
});