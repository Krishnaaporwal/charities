import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ModelTraining() {
  const [isTrainingSuccess, setIsTrainingSuccess] = useState(false);
  const [isTrainingFraud, setIsTrainingFraud] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [fraudResult, setFraudResult] = useState<any>(null);
  const { toast } = useToast();

  const trainSuccessModel = async () => {
    try {
      setIsTrainingSuccess(true);
      const response = await apiRequest('POST', '/api/train/success-model', {});
      const data = await response.json();
      setSuccessResult(data);
      toast({
        title: "Success Model Trained",
        description: `Model trained successfully!`,
      });
    } catch (error) {
      console.error("Error training success model:", error);
      toast({
        title: "Training Failed",
        description: "There was an error training the success prediction model.",
        variant: "destructive"
      });
    } finally {
      setIsTrainingSuccess(false);
    }
  };

  const trainFraudModel = async () => {
    try {
      setIsTrainingFraud(true);
      const response = await apiRequest('POST', '/api/train/fraud-model', {});
      const data = await response.json();
      setFraudResult(data);
      toast({
        title: "Fraud Model Trained",
        description: `Model trained successfully!`,
      });
    } catch (error) {
      console.error("Error training fraud model:", error);
      toast({
        title: "Training Failed",
        description: "There was an error training the fraud detection model.",
        variant: "destructive"
      });
    } finally {
      setIsTrainingFraud(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Model Training</CardTitle>
          <CardDescription>
            Train the AI models with the latest campaign data to improve prediction accuracy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Success Prediction Model</CardTitle>
                <CardDescription>
                  Trains the model to predict campaign success probability
                </CardDescription>
              </CardHeader>
              <CardContent>
                {successResult && (
                  <div className="text-sm mb-4">
                    <p>Last trained: {new Date().toLocaleString()}</p>
                    <p>Status: {successResult.status || 'Unknown'}</p>
                    <p>Message: {successResult.message || 'No details available'}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={trainSuccessModel} 
                  disabled={isTrainingSuccess}
                  className="w-full"
                >
                  {isTrainingSuccess ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Training...
                    </>
                  ) : "Train Success Model"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Fraud Detection Model</CardTitle>
                <CardDescription>
                  Trains the model to identify potentially fraudulent campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fraudResult && (
                  <div className="text-sm mb-4">
                    <p>Last trained: {new Date().toLocaleString()}</p>
                    <p>Status: {fraudResult.status || 'Unknown'}</p>
                    <p>Message: {fraudResult.message || 'No details available'}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={trainFraudModel} 
                  disabled={isTrainingFraud}
                  className="w-full"
                >
                  {isTrainingFraud ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Training...
                    </>
                  ) : "Train Fraud Model"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}