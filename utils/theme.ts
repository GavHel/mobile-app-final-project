// Minh Khoi Ha part
import { BackgroundStyle } from "../types/weather";

export function getAppTheme(backgroundStyle: BackgroundStyle) {
  const isDark = backgroundStyle === "dark";

  return {
    isDark,
    screen: isDark ? "#172A3A" : "#EEF6FB",
    forecastScreen: isDark ? "#172A3A" : "#D8ECF7",
    card: isDark ? "#243C4D" : "#FFFFFF",
    softCard: isDark ? "#2D485B" : "#F1F8FC",
    text: isDark ? "#F4F8FB" : "#102A43",
    mutedText: isDark ? "#C6D5DF" : "#526D82",
    border: isDark ? "#476579" : "#CBD9E6",
    inputBorder: isDark ? "#6F8A9C" : "#9FB3C4",
    selected: isDark ? "#31536A" : "#F1F8FC",
    error: isDark ? "#FFB4AB" : "#9B1C1C",
    success: isDark ? "#A7E3B5" : "#256B3D",
    tabBar: isDark ? "#0B1723" : "#102A43",
  };
}
