
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Settings, Shield, Smartphone, BarChart3, Play, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mobileService, UsageStats } from '../services/mobileService';

interface DashboardProps {
  settings: {
    pinRetries: number;
    emergencyApps: string[];
    isEnabled: boolean;
    userPin: string;
  };
  onSimulateUnlock: () => void;
  usageStats: UsageStats;
  onRefreshStats: () => void;
}

const Dashboard = ({ settings, onSimulateUnlock, usageStats, onRefreshStats }: DashboardProps) => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const checkPlatform = async () => {
      const native = await mobileService.isNativePlatform();
      setIsNative(native);
    };
    checkPlatform();
  }, []);

  const handleResetStats = async () => {
    await mobileService.resetStats();
    onRefreshStats();
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <Leaf className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">TouchGrass</h1>
          </div>
          <p className="text-gray-600">
            {isNative ? 'Mindful phone usage on mobile' : 'Mindful phone usage demo'}
          </p>
        </div>

        {/* Platform Status */}
        {!isNative && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Smartphone className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <p className="font-medium text-orange-900">Demo Mode</p>
                  <p className="text-sm text-orange-700">
                    You're viewing a demo. To get real unlock detection, run this as a mobile app on Android/iOS.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className={`border-2 ${settings.isEnabled ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className={`w-5 h-5 ${settings.isEnabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>Protection Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`font-medium ${settings.isEnabled ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {settings.isEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">PIN Entries:</span>
                  <span className="font-medium">{settings.pinRetries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Emergency Apps:</span>
                  <span className="font-medium">{settings.emergencyApps.length}/3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <span>Today's Stats</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefreshStats}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Unlock Attempts:</span>
                  <span className="font-medium">{usageStats.unlockAttempts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mindful Pauses:</span>
                  <span className="font-medium">{usageStats.mindfulPauses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time Saved:</span>
                  <span className="font-medium text-emerald-600">{usageStats.timeSaved} minutes</span>
                </div>
              </div>
              {usageStats.unlockAttempts > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetStats}
                    className="w-full text-xs"
                  >
                    Reset Stats
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Emergency Apps Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              <span>Emergency Apps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {settings.emergencyApps.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {settings.emergencyApps.map((app) => (
                  <span
                    key={app}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                  >
                    {app}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No emergency apps configured</p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={onSimulateUnlock}
            className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={!settings.isEnabled}
          >
            <Play className="w-5 h-5 mr-2" />
            {settings.isEnabled 
              ? (isNative ? 'Test Mindful Pause' : 'Simulate Unlock Experience')
              : 'Enable Protection First'
            }
          </Button>
          
          <Link to="/configure">
            <Button variant="outline" className="h-14 w-full border-emerald-200 hover:bg-emerald-50">
              <Settings className="w-5 h-5 mr-2" />
              Configure Settings
            </Button>
          </Link>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="space-y-2">
                <p className="font-medium text-blue-900">How TouchGrass Works</p>
                <p className="text-sm text-blue-700">
                  {isNative 
                    ? "TouchGrass detects when you unlock your phone and creates a mindful pause by requiring you to re-enter your PIN. This brief moment helps you be intentional about your phone usage while still allowing emergency access to essential apps."
                    : "When deployed as a mobile app, TouchGrass will detect when you unlock your phone and create a mindful pause by requiring you to re-enter your PIN. This demo shows how the experience works."
                  }
                </p>
                {isNative && (
                  <p className="text-xs text-blue-600 mt-2">
                    Time saved calculation: Based on pause duration + estimated 30% reduction in session time due to mindfulness.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
