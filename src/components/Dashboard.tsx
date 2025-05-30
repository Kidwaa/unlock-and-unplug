
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Smartphone, BarChart3, Leaf, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  settings: {
    pinRetries: number;
    emergencyApps: string[];
    isEnabled: boolean;
  };
  onSimulateUnlock: () => void;
}

const Dashboard = ({ settings, onSimulateUnlock }: DashboardProps) => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Leaf className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">TouchGrass</h1>
          </div>
          <Link to="/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        {/* Status Card */}
        <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {settings.isEnabled ? 'Protection Active' : 'Protection Disabled'}
                </h2>
                <p className="text-emerald-100">
                  {settings.isEnabled 
                    ? `${settings.pinRetries} PIN entries required after unlock`
                    : 'Your phone unlocks normally'
                  }
                </p>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                settings.isEnabled ? 'bg-white/20' : 'bg-white/10'
              }`}>
                <Smartphone className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-emerald-600" />
              <span>Try the Experience</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Experience how TouchGrass works by simulating a phone unlock.
            </p>
            <Button 
              onClick={onSimulateUnlock}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!settings.isEnabled}
            >
              Simulate Phone Unlock
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Today's Pauses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 mb-2">12</div>
              <p className="text-sm text-gray-600">Mindful moments created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Time Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 mb-2">47m</div>
              <p className="text-sm text-gray-600">Estimated screen time reduced</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 mb-2">5 days</div>
              <p className="text-sm text-gray-600">Consistent mindful usage</p>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Apps */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {settings.emergencyApps.map((app, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-emerald-600 font-semibold">
                      {app.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{app}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-emerald-800 mb-2">💡 Mindful Tech Tips</h3>
            <p className="text-emerald-700 text-sm">
              Remember: The goal isn't to never use your phone, but to use it intentionally. 
              Each pause is an opportunity to check in with yourself.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
