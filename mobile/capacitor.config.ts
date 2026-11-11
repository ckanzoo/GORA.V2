import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gora.app',
  appName: 'GORA',
  webDir: 'dist',
  plugins: {
    // Use native networking for the separately hosted API from the bundled app.
    CapacitorHttp: { enabled: true },
  },
  server: {
    hostname: 'localhost',
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
};

export default config;
