
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, MessageCircle, AlertTriangle, Leaf } from 'lucide-react';

interface LockScreenProps {
  settings: {
    pinRetries: number;
    emergencyApps: string[];
    userPin: string;
  };
  onUnlock: () => void;
}

const LockScreen = ({ settings, onUnlock }: LockScreenProps) => {
  const [pinInput, setPinInput] = useState('');
  const [retriesLeft, setRetriesLeft] = useState(settings.pinRetries);
  const [showError, setShowError] = useState(false);

  const emergencyAppIcons = {
    'Phone': <Phone className="w-8 h-8" />,
    'Messages': <MessageCircle className="w-8 h-8" />,
    'Emergency': <AlertTriangle className="w-8 h-8" />
  };

  const handlePinSubmit = () => {
    if (pinInput === settings.userPin) {
      const newRetries = retriesLeft - 1;
      setRetriesLeft(newRetries);
      setPinInput('');
      
      if (newRetries <= 0) {
        onUnlock();
      } else {
        setShowError(false);
      }
    } else {
      setShowError(true);
      setPinInput('');
    }
  };

  const handleNumberPress = (num: string) => {
    if (pinInput.length < 4) {
      setPinInput(pinInput + num);
    }
  };

  const handleBackspace = () => {
    setPinInput(pinInput.slice(0, -1));
  };

  useEffect(() => {
    if (pinInput.length === 4) {
      handlePinSubmit();
    }
  }, [pinInput]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center z-50">
      <div className="text-center text-white space-y-8 p-6 max-w-sm w-full">
        <div className="space-y-4">
          <Leaf className="w-16 h-16 mx-auto opacity-90" />
          <h1 className="text-2xl font-bold">Take a mindful moment</h1>
          <p className="text-emerald-100">
            Enter your PIN {retriesLeft} more time{retriesLeft !== 1 ? 's' : ''} to continue
          </p>
        </div>

        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="space-y-4">
            <div className="flex justify-center space-x-3">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 border-white transition-all ${
                    index < pinInput.length ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            {showError && (
              <p className="text-red-200 text-sm">Incorrect PIN. Try again.</p>
            )}

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="ghost"
                  className="h-12 text-white hover:bg-white/20 border border-white/30"
                  onClick={() => handleNumberPress(num.toString())}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="h-12 text-white hover:bg-white/20 border border-white/30"
                onClick={() => handleNumberPress('0')}
              >
                0
              </Button>
              <Button
                variant="ghost"
                className="h-12 text-white hover:bg-white/20 border border-white/30"
                onClick={handleBackspace}
              >
                ⌫
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <p className="text-emerald-100 text-sm">Emergency access:</p>
          <div className="flex justify-center space-x-4">
            {settings.emergencyApps.map((app) => (
              <Button
                key={app}
                variant="ghost"
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white"
                onClick={() => console.log(`Opening ${app}`)}
              >
                {emergencyAppIcons[app as keyof typeof emergencyAppIcons]}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
