# The Frosty Forecast

The Frosty Forecast is a React Native weather app built with Expo Router. It follows the Phase 2 architecture and the five-screen Phase 3 mock-up.

## Features

- Live current weather and seven-day forecast from Open-Meteo
- City search using the Open-Meteo geocoding API
- Home, Search, Forecast, Saved Locations, and Settings tabs
- Saved cities, recent searches, selected city, and settings stored with AsyncStorage
- Celsius and Fahrenheit display
- Optional weather alerts and search history
- Automatic, light, and dark weather backgrounds
- Optional current-device location using Expo Location
- Loading, empty, invalid-search, and network-error states

## Run the app

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Expo:

   ```bash
   npx expo start
   ```

3. Scan the QR code with Expo Go on Android, or press `a` to open an Android emulator.

The app needs an internet connection for live weather and city search. Current Location also needs foreground location permission.

## Main folders

- `src/app/` contains the five screens and tab layout.
- `context/` shares the selected location, saved locations, history, and settings.
- `services/` contains Weather API and AsyncStorage functions.
- `components/` contains reusable interface pieces.
- `utils/` contains weather descriptions, icons, colours, alerts, and temperature conversion.
- `types/` contains the TypeScript data shapes.

## Verification

The project passes `tsc --noEmit` and Expo's Android export command.
