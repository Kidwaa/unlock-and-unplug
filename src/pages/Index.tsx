import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LockScreen from '../components/LockScreen';
import Configure from '../components/Configure';
import Dashboard from '../components/Dashboard';
import Onboarding from '../components/Onboarding';

const Index = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [settings, setSettings] = useState({
    pinRetries: 3,
    emergencyApps: ['Phone', 'Messages', 'Emergency'],
    isEnabled: true,
    userPin: '1234'
  });

  useEffect(() => {
    // Check if user has completed onboarding
    const setupComplete = localStorage.getItem('touchgrass-setup');
    if (setupComplete) {
      setIsSetupComplete(true);
    }
  }, []);

  const handleSetupComplete = () => {
    localStorage.setItem('touchgrass-setup', 'true');
    setIsSetupComplete(true);
  };

  const simulateUnlock = () => {
    if (settings.isEnabled) {
      setIsLocked(true);
    }
  };

  const handleUnlock = () => {
    setIsLocked(false);
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
