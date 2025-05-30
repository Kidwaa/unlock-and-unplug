
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Smartphone, Shield, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SettingsProps {
  settings: {
    pinRetries: number;
    emergencyApps: string[];
    isEnabled: boolean;
    userPin: string;
  };
  onSettingsChange: (newSettings: any) => void;
}

const Settings = ({ settings, onSettingsChange }: SettingsProps) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const availableApps = [
    'Phone', 'Messages', 'Emergency', 'Maps', 'Camera', 'Clock', 
    'Calculator', 'Weather', 'Calendar', 'Contacts'
  ];

  const updateSettings = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const toggleEmergencyApp = (app: string) => {
    const currentApps = localSettings.emergencyApps;
    let newApps;
    
    if (currentApps.includes(app)) {
      newApps = currentApps.filter(a => a !== app);
    } else if (currentApps.length < 3) {
      newApps = [...currentApps, app];
    } else {
      return; // Can't add more than 3 apps
    }
    
    updateSettings('emergencyApps', newApps);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <SettingsIcon className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* App Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>TouchGrass Protection</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="app-enabled" className="text-base font-medium">
                  Enable Protection
                </Label>
                <p className="text-sm text-gray-600">
                  Activate mindful pause after unlocking
                </p>
              </div>
              <Switch
                id="app-enabled"
                checked={localSettings.isEnabled}
                onCheckedChange={(checked) => updateSettings('isEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* PIN Retries */}
        <Card>
          <CardHeader>
            <CardTitle>PIN Retry Count</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              How many times should you re-enter your PIN after unlocking?
            </p>
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Button
                  key={num}
                  variant={localSettings.pinRetries === num ? "default" : "outline"}
                  size="sm"
                  className={localSettings.pinRetries === num ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  onClick={() => updateSettings('pinRetries', num)}
                >
                  {num}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Setting to 0 disables PIN requirement but keeps the mindful pause
            </p>
          </CardContent>
        </Card>

        {/* Emergency Apps */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Apps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Select up to 3 apps for quick access during the mindful pause (
              {localSettings.emergencyApps.length}/3 selected)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {availableApps.map((app) => {
                const isSelected = localSettings.emergencyApps.includes(app);
                const canSelect = localSettings.emergencyApps.length < 3 || isSelected;
                
                return (
                  <Button
                    key={app}
                    variant={isSelected ? "default" : "outline"}
                    className={`justify-start ${
                      isSelected 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : !canSelect 
                          ? "opacity-50 cursor-not-allowed" 
                          : ""
                    }`}
                    onClick={() => canSelect && toggleEmergencyApp(app)}
                    disabled={!canSelect}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    {app}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Configuration Summary */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Current Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-emerald-700">Status:</span>
              <span className="font-medium text-emerald-800">
                {localSettings.isEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">PIN Retries:</span>
              <span className="font-medium text-emerald-800">
                {localSettings.pinRetries}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">Emergency Apps:</span>
              <span className="font-medium text-emerald-800">
                {localSettings.emergencyApps.length} selected
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Reset to Defaults */}
        <Card>
          <CardContent className="pt-6">
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => {
                const defaultSettings = {
                  pinRetries: 3,
                  emergencyApps: ['Phone', 'Messages', 'Emergency'],
                  isEnabled: true,
                  userPin: '1234'
                };
                setLocalSettings(defaultSettings);
                onSettingsChange(defaultSettings);
              }}
            >
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
