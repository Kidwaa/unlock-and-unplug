
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.ee1f8f50027846eab29a33707225aa2f',
  appName: 'unlock-and-unplug',
  webDir: 'dist',
  server: {
    url: 'https://ee1f8f50-0278-46ea-b29a-33707225aa2f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    App: {
      launchAutoHide: false
    }
  }
};

export default config;
