// Minh Khoi Ha part
import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useApp } from "../context/AppContext";
import { getAppTheme } from "../utils/theme";

type IconName = React.ComponentProps<typeof FontAwesome>["name"];

interface Props {
  title: string;
  actionIcon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
  lightText?: boolean;
}

export default function ScreenHeader({
  title,
  actionIcon,
  actionLabel,
  onAction,
  lightText,
}: Props) {
  const { settings } = useApp();
  const theme = getAppTheme(settings.backgroundStyle);
  const useLightText = lightText ?? theme.isDark;

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: useLightText ? "#FFFFFF" : theme.text }]}>
        {title}
      </Text>

      {actionIcon && onAction ? (
        <Pressable
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
          hitSlop={10}
          onPress={onAction}
          style={styles.action}
        >
          <FontAwesome
            name={actionIcon}
            size={21}
            color={useLightText ? "#FFFFFF" : theme.text}
          />
        </Pressable>
      ) : (
        <View style={styles.action} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    color: "#102A43",
    fontSize: 18,
    fontWeight: "800",
  },
  action: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
