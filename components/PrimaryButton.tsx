// Minh Khoi Ha part
import { Pressable, StyleSheet, Text } from "react-native";

import { useApp } from "../context/AppContext";
import { getAppTheme } from "../utils/theme";

interface Props {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}

export default function PrimaryButton({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: Props) {
  const { settings } = useApp();
  const theme = getAppTheme(settings.backgroundStyle);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && [
          styles.secondaryButton,
          { backgroundColor: theme.card, borderColor: theme.border },
        ],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.label,
          secondary && styles.secondaryLabel,
          secondary && { color: theme.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    marginTop: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    borderRadius: 14,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD9E6",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryLabel: {
    color: "#102A43",
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
