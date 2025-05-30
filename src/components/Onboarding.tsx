
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Shield, Settings, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to TouchGrass",
      description: "Take control of your phone usage with mindful unlock prompts",
      icon: <Smartphone className="w-16 h-16 text-emerald-600" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            TouchGrass helps you break the habit of mindless phone checking by adding intentional friction to your unlock process.
          </p>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-emerald-800 font-medium">
              🌱 Every pause is a step toward mindful technology use
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Permissions Required",
      description: "We need these permissions to help you stay mindful",
      icon: <Shield className="w-16 h-16 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium">Accessibility Service</p>
                <p className="text-sm text-gray-600">Detect when you unlock your phone</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium">Display Over Other Apps</p>
                <p className="text-sm text-gray-600">Show mindful pause overlay</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Your privacy is protected - no data leaves your device
          </p>
        </div>
      )
    },
    {
      title: "Configure Your Experience",
      description: "Customize how TouchGrass works for you",
      icon: <Settings className="w-16 h-16 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2">PIN Retries</h4>
            <p className="text-sm text-gray-600 mb-3">How many times should you re-enter your PIN?</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className="w-10 h-10 rounded-lg border border-emerald-200 hover:bg-emerald-50 flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Emergency Apps</h4>
            <p className="text-sm text-gray-600">Choose up to 3 apps for quick access</p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps[currentStep].content}
          
          <div className="flex justify-center space-x-2 py-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={nextStep}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
