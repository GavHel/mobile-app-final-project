// Minh Khoi Ha part
import { useState } from "react";
import * as Location from "expo-location";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import { useApp } from "../../context/AppContext";
import { AppSettings, BackgroundStyle } from "../../types/weather";
import { getAppTheme } from "../../utils/theme";

function SettingSwitch({
  label,
  value,
  onValueChange,
  theme,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  theme: ReturnType<typeof getAppTheme>;
}) {
  return (
    <View style={[styles.settingRow, { borderColor: theme.border }]}>
      <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      <Switch
        accessibilityLabel={label}
        onValueChange={onValueChange}
        thumbColor="#FFFFFF"
        trackColor={{ false: theme.inputBorder, true: "#2563EB" }}
        value={value}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const {
    settings,
    updateSettings,
    selectLocation,
    recentSearches,
    clearRecentSearches,
  } = useApp();
  const [draft, setDraft] = useState<AppSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const previewTheme = getAppTheme(draft.backgroundStyle);

  function changeSetting<Key extends keyof AppSettings>(
    key: Key,
    value: AppSettings[Key],
  ) {
    setMessage("");
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function saveSettings() {
    try {
      setSaving(true);
      setMessage("");
      let nextSettings = draft;

      if (draft.useCurrentLocation && !settings.useCurrentLocation) {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status !== "granted") {
          nextSettings = { ...draft, useCurrentLocation: false };
          setDraft(nextSettings);
          Alert.alert(
            "Location permission denied",
            "The other settings were saved, but the app will keep using the selected city.",
          );
        } else {
          const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          selectLocation(
            {
              id: "current-location",
              name: "Current Location",
              region: "Device location",
              country: "",
              latitude: current.coords.latitude,
              longitude: current.coords.longitude,
            },
            false,
          );
        }
      }

      updateSettings(nextSettings);
      setMessage("Settings saved on this device.");
    } catch {
      setMessage("The location could not be read. The other settings were not changed.");
    } finally {
      setSaving(false);
    }
  }

  function chooseBackground(value: BackgroundStyle) {
    changeSetting("backgroundStyle", value);
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: previewTheme.screen }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Settings" lightText={previewTheme.isDark} />
        <Text style={[styles.title, { color: previewTheme.text }]}>App Settings</Text>
        <Text style={[styles.subtitle, { color: previewTheme.mutedText }]}>
          Choose how weather information is displayed.
        </Text>
        <Text style={[styles.previewNote, { color: previewTheme.mutedText }]}>
          Theme choices preview immediately. Press Save Settings to keep your changes.
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: previewTheme.card, borderColor: previewTheme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: previewTheme.text }]}>Preferences</Text>
          <SettingSwitch
            label="Use Celsius"
            theme={previewTheme}
            value={draft.temperatureUnit === "celsius"}
            onValueChange={(value) =>
              changeSetting(
                "temperatureUnit",
                value ? "celsius" : "fahrenheit",
              )
            }
          />
          <SettingSwitch
            label="Weather Alerts"
            theme={previewTheme}
            value={draft.weatherAlerts}
            onValueChange={(value) => changeSetting("weatherAlerts", value)}
          />
          <SettingSwitch
            label="Use Current Location"
            theme={previewTheme}
            value={draft.useCurrentLocation}
            onValueChange={(value) => changeSetting("useCurrentLocation", value)}
          />
          <SettingSwitch
            label="Save Search History"
            theme={previewTheme}
            value={draft.saveSearchHistory}
            onValueChange={(value) => changeSetting("saveSearchHistory", value)}
          />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: previewTheme.card, borderColor: previewTheme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: previewTheme.text }]}>Background Style</Text>
          {(["automatic", "light", "dark"] as BackgroundStyle[]).map(
            (value) => {
              const selected = draft.backgroundStyle === value;
              const label =
                value === "automatic"
                  ? "Automatic Weather Background"
                  : `${value[0].toUpperCase()}${value.slice(1)} Theme`;

              return (
                <Pressable
                  accessibilityLabel={label}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  key={value}
                  onPress={() => chooseBackground(value)}
                  style={[
                    styles.radioRow,
                    selected && styles.selectedRadioRow,
                    selected && { backgroundColor: previewTheme.selected },
                  ]}
                >
                  <View
                    style={[
                      styles.radio,
                      { borderColor: previewTheme.inputBorder },
                      selected && styles.selectedRadio,
                    ]}
                  >
                    {selected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.radioLabel, { color: previewTheme.text }]}>{label}</Text>
                </Pressable>
              );
            },
          )}
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: previewTheme.card, borderColor: previewTheme.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: previewTheme.text }]}>Search History</Text>
          <Text style={[styles.cardText, { color: previewTheme.mutedText }]}>
            {recentSearches.length} recent {recentSearches.length === 1 ? "location" : "locations"}
            {recentSearches.length === 1 ? " is" : " are"} stored on this device.
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={recentSearches.length === 0}
            onPress={clearRecentSearches}
            style={styles.clearButton}
          >
            <Text
              style={[
                styles.clearButtonText,
                recentSearches.length === 0 && styles.disabledText,
              ]}
            >
              Clear Recent Searches
            </Text>
          </Pressable>
        </View>

        {saving ? (
          <ActivityIndicator style={styles.saving} color="#2563EB" />
        ) : (
          <PrimaryButton label="Save Settings" onPress={saveSettings} />
        )}
        {message ? (
          <Text style={[styles.message, { color: previewTheme.success }]}>{message}</Text>
        ) : null}
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
  previewNote: {
    marginTop: 7,
    lineHeight: 19,
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
    marginBottom: 7,
    color: "#102A43",
    fontSize: 17,
    fontWeight: "700",
  },
  cardText: {
    color: "#526D82",
    lineHeight: 20,
  },
  settingRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#E1EAF0",
  },
  settingLabel: {
    flex: 1,
    color: "#102A43",
    fontWeight: "600",
  },
  radioRow: {
    minHeight: 50,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
  },
  selectedRadioRow: {
    backgroundColor: "#F1F8FC",
  },
  radio: {
    width: 22,
    height: 22,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#9FB3C4",
    borderRadius: 11,
  },
  selectedRadio: {
    borderColor: "#2563EB",
  },
  radioDot: {
    width: 10,
    height: 10,
    backgroundColor: "#2563EB",
    borderRadius: 5,
  },
  radioLabel: {
    flex: 1,
    color: "#102A43",
  },
  clearButton: {
    minHeight: 42,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "#9B1C1C",
    fontWeight: "700",
  },
  disabledText: {
    color: "#9FB3C4",
  },
  saving: {
    marginTop: 22,
  },
  message: {
    marginTop: 12,
    color: "#256B3D",
    textAlign: "center",
  },
});
