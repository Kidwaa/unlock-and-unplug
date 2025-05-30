
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

// Function to safely import Capacitor modules
async function importCapacitorModules() {
  try {
    const [appModule, deviceModule, preferencesModule] = await Promise.all([
      import('@capacitor/app').catch(() => null),
      import('@capacitor/device').catch(() => null),
      import('@capacitor/preferences').catch(() => null)
    ]);

    return {
      App: appModule?.App || null,
      Device: deviceModule?.Device || null,
      Preferences: preferencesModule?.Preferences || null
    };
  } catch (error) {
    console.log('Capacitor not available - running in web mode');
    return {
      App: null,
      Device: null,
      Preferences: null
    };
  }
}

class MobileService {
  private isInitialized = false;
  private settings: any = null;
  private onUnlockCallback: (() => void) | null = null;
  private capacitorModules: any = null;

  async initialize(settings: any, onUnlock: () => void) {
    if (this.isInitialized) return;

    this.settings = settings;
    this.onUnlockCallback = onUnlock;

    // Import Capacitor modules
    this.capacitorModules = await importCapacitorModules();

    // Listen for app state changes only if Capacitor is available
    if (this.capacitorModules.App) {
      this.capacitorModules.App.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
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
      if (this.capacitorModules?.Preferences) {
        const { value } = await this.capacitorModules.Preferences.get({ key: 'touchgrass_stats' });
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
      if (this.capacitorModules?.Preferences) {
        await this.capacitorModules.Preferences.set({
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
      if (this.capacitorModules?.Device) {
        const info = await this.capacitorModules.Device.getInfo();
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
