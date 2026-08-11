import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import { useApp } from "../../context/AppContext";
import { WeatherLocation } from "../../types/weather";
import { getAppTheme } from "../../utils/theme";

export default function SavedScreen() {
  const router = useRouter();
  const {
    savedLocations,
    selectedLocation,
    selectLocation,
    removeLocation,
    settings,
  } = useApp();
  // Minh Khoi Ha part
  const theme = getAppTheme(settings.backgroundStyle);

  function openLocation(location: WeatherLocation) {
    selectLocation(location, false);
    router.replace("/");
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.screen }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Saved Locations" />
        <Text style={[styles.title, { color: theme.text }]}>Your cities</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Quick access to saved weather locations.
        </Text>

        {savedLocations.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <FontAwesome name="star-o" size={34} color={theme.mutedText} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No saved locations</Text>
            <Text style={[styles.emptyText, { color: theme.mutedText }]}>
              Search for a city, open its weather, and save it from the Home screen.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {savedLocations.map((location) => {
              const isSelected = location.id === selectedLocation.id;
              const subtitle = [location.region, location.country]
                .filter(Boolean)
                .join(", ");

              return (
                <View
                  style={[
                    styles.locationCard,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                  key={location.id}
                >
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => openLocation(location)}
                    style={({ pressed }) => [
                      styles.locationMain,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.star}>★</Text>
                    <View style={styles.locationText}>
                      <Text style={[styles.locationName, { color: theme.text }]}>{location.name}</Text>
                      <Text
                        style={[styles.locationSubtitle, { color: theme.mutedText }]}
                        numberOfLines={1}
                      >
                        {subtitle}
                      </Text>
                    </View>
                    {isSelected && <Text style={styles.selectedBadge}>Selected</Text>}
                  </Pressable>

                  <Pressable
                    accessibilityLabel={`Remove ${location.name}`}
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => removeLocation(location.id)}
                    style={styles.removeButton}
                  >
                    <FontAwesome name="trash-o" size={20} color={theme.error} />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>Saved Locations Summary</Text>
          <Text style={[styles.summaryText, { color: theme.mutedText }]}>
            You have {savedLocations.length} saved {savedLocations.length === 1 ? "city" : "cities"}.
            Select a city to view its current weather and forecast.
          </Text>
        </View>

        <PrimaryButton
          label="Add Another Location"
          onPress={() => router.push("/search")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF6FB",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    marginTop: 4,
    color: "#102A43",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 3,
    color: "#526D82",
  },
  list: {
    marginTop: 16,
    gap: 10,
  },
  locationCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD9E6",
    borderRadius: 15,
  },
  locationMain: {
    flex: 1,
    minHeight: 70,
    paddingLeft: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  star: {
    marginRight: 10,
    color: "#F0B429",
    fontSize: 20,
  },
  locationText: {
    flex: 1,
  },
  locationName: {
    color: "#102A43",
    fontSize: 16,
    fontWeight: "700",
  },
  locationSubtitle: {
    marginTop: 3,
    color: "#526D82",
    fontSize: 13,
  },
  selectedBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: "hidden",
    color: "#1E4E8C",
    backgroundColor: "#DFF3FF",
    borderRadius: 10,
    fontSize: 11,
    fontWeight: "700",
  },
  removeButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    marginTop: 16,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD9E6",
    borderRadius: 18,
  },
  emptyTitle: {
    marginTop: 10,
    color: "#102A43",
    fontSize: 17,
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 5,
    color: "#526D82",
    lineHeight: 20,
    textAlign: "center",
  },
  summaryCard: {
    marginTop: 16,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD9E6",
    borderRadius: 18,
  },
  summaryTitle: {
    marginBottom: 6,
    color: "#102A43",
    fontSize: 17,
    fontWeight: "700",
  },
  summaryText: {
    color: "#526D82",
    lineHeight: 20,
  },
});
