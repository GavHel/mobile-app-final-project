import { useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import { useApp } from "../../context/AppContext";
import { searchLocations } from "../../services/weatherService";
import { WeatherLocation } from "../../types/weather";
import { getAppTheme } from "../../utils/theme";

const POPULAR_LOCATIONS: WeatherLocation[] = [
  {
    id: "5913490",
    name: "Calgary",
    region: "Alberta",
    country: "Canada",
    latitude: 51.05011,
    longitude: -114.08529,
  },
  {
    id: "5946768",
    name: "Edmonton",
    region: "Alberta",
    country: "Canada",
    latitude: 53.55014,
    longitude: -113.46871,
  },
  {
    id: "6167865",
    name: "Toronto",
    region: "Ontario",
    country: "Canada",
    latitude: 43.70011,
    longitude: -79.4163,
  },
  {
    id: "6173331",
    name: "Vancouver",
    region: "British Columbia",
    country: "Canada",
    latitude: 49.24966,
    longitude: -123.11934,
  },
];

function LocationButton({
  location,
  onPress,
}: {
  location: WeatherLocation;
  onPress: () => void;
}) {
  const { settings } = useApp();
  // Minh Khoi Ha part
  const theme = getAppTheme(settings.backgroundStyle);
  const subtitle = [location.region, location.country].filter(Boolean).join(", ");

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.locationButton,
        { backgroundColor: theme.softCard, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.locationText}>
        <Text style={[styles.locationName, { color: theme.text }]}>{location.name}</Text>
        <Text
          style={[styles.locationSubtitle, { color: theme.mutedText }]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export default function SearchScreen() {
  const router = useRouter();
  const { recentSearches, selectLocation, settings } = useApp();
  // Minh Khoi Ha part
  const theme = getAppTheme(settings.backgroundStyle);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WeatherLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch() {
    const searchText = query.trim();

    if (searchText.length < 2) {
      setError("Enter at least two letters of a city or location.");
      return;
    }

    try {
      Keyboard.dismiss();
      setLoading(true);
      setError("");
      setHasSearched(true);
      const locations = await searchLocations(searchText);
      setResults(locations);

      if (locations.length === 0) {
        setError("No locations were found. Check the spelling and try again.");
      }
    } catch {
      setError("Search is unavailable. Check your internet connection and try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function chooseLocation(location: WeatherLocation) {
    selectLocation(location);
    router.replace("/");
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.screen }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title="Search Location" />
        <Text style={[styles.title, { color: theme.text }]}>Find a city</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>Search for another weather location.</Text>

        <Text style={[styles.label, { color: theme.text }]}>City or location</Text>
        <TextInput
          accessibilityLabel="City or location"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholder="Example: Edmonton"
          placeholderTextColor={theme.mutedText}
          returnKeyType="search"
          style={[
            styles.input,
            {
              color: theme.text,
              backgroundColor: theme.card,
              borderColor: theme.inputBorder,
            },
          ]}
          value={query}
        />
        <PrimaryButton label="Search" onPress={handleSearch} disabled={loading} />

        {loading && (
          <ActivityIndicator style={styles.loader} size="large" color="#2563EB" />
        )}
        {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

        {hasSearched && results.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Search Results</Text>
            {results.map((location) => (
              <LocationButton
                key={location.id}
                location={location}
                onPress={() => chooseLocation(location)}
              />
            ))}
          </View>
        )}

        {recentSearches.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Recent Searches</Text>
            {recentSearches.map((location) => (
              <LocationButton
                key={location.id}
                location={location}
                onPress={() => chooseLocation(location)}
              />
            ))}
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Popular Locations</Text>
          {POPULAR_LOCATIONS.map((location) => (
            <LocationButton
              key={location.id}
              location={location}
              onPress={() => chooseLocation(location)}
            />
          ))}
        </View>
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
    marginBottom: 18,
    color: "#526D82",
  },
  label: {
    marginBottom: 7,
    color: "#102A43",
    fontWeight: "700",
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 14,
    color: "#102A43",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#9FB3C4",
    borderRadius: 14,
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    marginTop: 14,
    color: "#9B1C1C",
    textAlign: "center",
  },
  card: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD9E6",
    borderRadius: 18,
  },
  cardTitle: {
    marginBottom: 10,
    color: "#102A43",
    fontSize: 17,
    fontWeight: "700",
  },
  locationButton: {
    minHeight: 62,
    marginBottom: 9,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FBFD",
    borderWidth: 1,
    borderColor: "#D6E1EA",
    borderRadius: 14,
  },
  pressed: {
    opacity: 0.7,
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
  chevron: {
    marginLeft: 10,
    color: "#2563EB",
    fontSize: 26,
  },
});
