
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Smartphone, Shield, Settings as SettingsIcon, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ConfigureProps {
  settings: {
    pinRetries: number;
    emergencyApps: string[];
    isEnabled: boolean;
    userPin: string;
  };
  onSettingsChange: (newSettings: any) => void;
}

const Configure = ({ settings, onSettingsChange }: ConfigureProps) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinUpdate, setShowPinUpdate] = useState(false);
  const [currentPinVerified, setCurrentPinVerified] = useState(false);

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

  const verifyCurrentPin = () => {
    if (currentPin === localSettings.userPin) {
      setCurrentPinVerified(true);
    }
  };

  const handlePinUpdate = () => {
    if (newPin.length === 4 && newPin === confirmPin) {
      updateSettings('userPin', newPin);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setShowPinUpdate(false);
      setCurrentPinVerified(false);
    }
  };

  const cancelPinUpdate = () => {
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setShowPinUpdate(false);
    setCurrentPinVerified(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Configure</h1>
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

        {/* PIN Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-emerald-600" />
              <span>PIN Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current PIN</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPinUpdate(!showPinUpdate)}
                >
                  {showPinUpdate ? 'Cancel' : 'Change PIN'}
                </Button>
              </div>
              
              {showPinUpdate && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  {!currentPinVerified ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="current-pin">Enter Current PIN</Label>
                        <Input
                          id="current-pin"
                          type="password"
                          maxLength={4}
                          value={currentPin}
                          onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="Enter current PIN"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={verifyCurrentPin}
                          disabled={currentPin.length !== 4}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Verify PIN
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={cancelPinUpdate}
                        >
                          Cancel
                        </Button>
                      </div>
                      {currentPin.length === 4 && currentPin !== localSettings.userPin && (
                        <p className="text-red-600 text-sm">Incorrect PIN</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-green-600 text-sm mb-3">
                        <span>✓ Current PIN verified</span>
                      </div>
                      <div>
                        <Label htmlFor="new-pin">New PIN (4 digits)</Label>
                        <Input
                          id="new-pin"
                          type="password"
                          maxLength={4}
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="Enter new PIN"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-pin">Confirm New PIN</Label>
                        <Input
                          id="confirm-pin"
                          type="password"
                          maxLength={4}
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="Confirm new PIN"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handlePinUpdate}
                          disabled={newPin.length !== 4 || newPin !== confirmPin}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Update PIN
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={cancelPinUpdate}
                        >
                          Cancel
                        </Button>
                      </div>
                      {newPin.length === 4 && confirmPin.length === 4 && newPin !== confirmPin && (
                        <p className="text-red-600 text-sm">PINs do not match</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* PIN Retries */}
        <Card>
          <CardHeader>
            <CardTitle>PIN Entry Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              How many times should you re-enter your PIN after unlocking?
            </p>
            <div className="grid grid-cols-6 gap-2">
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
            
            {localSettings.emergencyApps.length > 0 && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                <p className="text-sm font-medium text-emerald-800 mb-2">Selected Apps:</p>
                <div className="flex flex-wrap gap-2">
                  {localSettings.emergencyApps.map((app) => (
                    <span
                      key={app}
                      className="px-2 py-1 bg-emerald-200 text-emerald-800 rounded-full text-xs"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
              <span className="text-emerald-700">PIN Entries Required:</span>
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
                setNewPin('');
                setConfirmPin('');
                setShowPinUpdate(false);
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

export default Configure;
