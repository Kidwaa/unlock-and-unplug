
// Capacitor imports with fallbacks for web environment
let App: any = null;
let Device: any = null; 
let Preferences: any = null;

try {
  // Dynamic imports to handle web environment where Capacitor isn't available
  const { App: CapApp } = await import('@capacitor/app');
  const { Device: CapDevice } = await import('@capacitor/device');
  const { Preferences: CapPreferences } = await import('@capacitor/preferences');
  
  App = CapApp;
  Device = CapDevice;
  Preferences = CapPreferences;
} catch (error) {
  console.log('Capacitor not available - running in web mode');
}

export interface UsageStats {
  unlockAttempts: number;
  mindfulPauses: number;
  timeSaved: number; // in minutes
  lastUpdated: string;
}

export interface UnlockSession {
  timestamp: number;
  completed: boolean;
  pauseDuration: number; // in seconds
}

class MobileService {
  private isInitialized = false;
  private settings: any = null;
  private onUnlockCallback: (() => void) | null = null;

  async initialize(settings: any, onUnlock: () => void) {
    if (this.isInitialized) return;

    this.settings = settings;
    this.onUnlockCallback = onUnlock;

    // Listen for app state changes only if Capacitor is available
    if (App) {
      App.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
        if (isActive && this.settings?.isEnabled) {
          this.handleAppActivation();
        }
      });
    }

    this.isInitialized = true;
  }

  private async handleAppActivation() {
    console.log('App activated - triggering mindful pause');
    await this.recordUnlockAttempt();
    
    if (this.onUnlockCallback) {
      this.onUnlockCallback();
    }
  }

  async recordUnlockAttempt() {
    const stats = await this.getUsageStats();
    stats.unlockAttempts += 1;
    stats.lastUpdated = new Date().toISOString();
    await this.saveUsageStats(stats);
  }

  async recordMindfulPause(pauseDuration: number) {
    const stats = await this.getUsageStats();
    stats.mindfulPauses += 1;
    
    // Calculate time saved: assume average phone session is 10 minutes
    // Time saved = pause duration + reduced session time due to mindfulness
    const avgSessionTime = 10; // minutes
    const mindfulnessReduction = 0.3; // 30% reduction in session time
    const savedFromPause = pauseDuration / 60; // convert seconds to minutes
    const savedFromMindfulness = avgSessionTime * mindfulnessReduction;
    
    stats.timeSaved += Math.round(savedFromPause + savedFromMindfulness);
    stats.lastUpdated = new Date().toISOString();
    
    await this.saveUsageStats(stats);
  }

  async getUsageStats(): Promise<UsageStats> {
    try {
      if (Preferences) {
        const { value } = await Preferences.get({ key: 'touchgrass_stats' });
        if (value) {
          return JSON.parse(value);
        }
      } else {
        // Fallback to localStorage for web
        const value = localStorage.getItem('touchgrass_stats');
        if (value) {
          return JSON.parse(value);
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }

    // Return default stats
    return {
      unlockAttempts: 0,
      mindfulPauses: 0,
      timeSaved: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  async saveUsageStats(stats: UsageStats) {
    try {
      if (Preferences) {
        await Preferences.set({
          key: 'touchgrass_stats',
          value: JSON.stringify(stats)
        });
      } else {
        // Fallback to localStorage for web
        localStorage.setItem('touchgrass_stats', JSON.stringify(stats));
      }
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }

  async resetStats() {
    const defaultStats: UsageStats = {
      unlockAttempts: 0,
      mindfulPauses: 0,
      timeSaved: 0,
      lastUpdated: new Date().toISOString()
    };
    await this.saveUsageStats(defaultStats);
  }

  async getDeviceInfo() {
    try {
      if (Device) {
        const info = await Device.getInfo();
        return info;
      }
    } catch (error) {
      console.error('Error getting device info:', error);
    }
    return null;
  }

  async isNativePlatform(): Promise<boolean> {
    const info = await this.getDeviceInfo();
    return info?.platform === 'android' || info?.platform === 'ios';
  }
}

export const mobileService = new MobileService();
