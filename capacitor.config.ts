import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.opdreminder',
  appName: 'OPD Reminder',
  webDir: 'www',
  server: {
    // androidScheme: 'https'
    androidScheme: 'http'
  },
  plugins: {
    GoogleMaps: {
      apiKey: 'AIzaSyCQLlBBXjwA1sm-r4K44BDF2zj2DQLgduI'
    },
    Geolocation: {
      // iOS specific
      iosUseSignificantChanges: false,
      // Android specific
      androidActivityName: "MainActivity",
      androidMorphActivityAfterResume: true,
      // Common options
      permissions: {
        ios: ["location"],
        android: ["android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"]
      }
    }
  }
};

export default config;
