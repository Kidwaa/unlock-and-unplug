
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LockScreen from '../components/LockScreen';
import Configure from '../components/Configure';
import Dashboard from '../components/Dashboard';
import Onboarding from '../components/Onboarding';
import { mobileService, UsageStats } from '../services/mobileService';

const Index = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    unlockAttempts: 0,
    mindfulPauses: 0,
    timeSaved: 0,
    lastUpdated: new Date().toISOString()
  });
  const [settings, setSettings] = useState({
    pinRetries: 3,
    emergencyApps: ['Phone', 'Messages', 'Emergency'],
    isEnabled: true,
    userPin: '1234'
  });

  useEffect(() => {
    const initializeApp = async () => {
      // Check if user has completed onboarding
      const setupComplete = localStorage.getItem('touchgrass-setup');
      if (setupComplete) {
        setIsSetupComplete(true);
      }

      // Load usage stats
      const stats = await mobileService.getUsageStats();
      setUsageStats(stats);

      // Initialize mobile service
      await mobileService.initialize(settings, () => {
        if (settings.isEnabled) {
          setIsLocked(true);
        }
      });
    };

    initializeApp();
  }, [settings]);

  const handleSetupComplete = () => {
    localStorage.setItem('touchgrass-setup', 'true');
    setIsSetupComplete(true);
  };

  const simulateUnlock = () => {
    if (settings.isEnabled) {
      setIsLocked(true);
    }
  };

  const handleUnlock = async () => {
    const pauseStartTime = Date.now();
    
    setIsLocked(false);
    
    // Calculate pause duration and record analytics
    const pauseDuration = (Date.now() - pauseStartTime) / 1000;
    await mobileService.recordMindfulPause(pauseDuration);
    
    // Refresh stats
    const updatedStats = await mobileService.getUsageStats();
    setUsageStats(updatedStats);
  };

  const refreshStats = async () => {
    const stats = await mobileService.getUsageStats();
    setUsageStats(stats);
  };

  if (!isSetupComplete) {
    return <Onboarding onComplete={handleSetupComplete} />;
  }

  if (isLocked) {
    return (
      <LockScreen 
        settings={settings} 
        onUnlock={handleUnlock}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <Routes>
        <Route path="/" element={
          <Dashboard 
            settings={settings} 
            onSimulateUnlock={simulateUnlock}
            usageStats={usageStats}
            onRefreshStats={refreshStats}
          />
        } />
        <Route path="/configure" element={
          <Configure 
            settings={settings} 
            onSettingsChange={setSettings}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default Index;
