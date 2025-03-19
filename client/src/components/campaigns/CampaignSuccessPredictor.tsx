import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CampaignSuccessPredictorProps {
  campaignData: {
    title: string;
    description: string;
    goalAmount: string;
    category: string;
    mediaUrls?: string[];
    durationInDays: number;
    creatorId?: number;
  };
}

interface PredictionResult {
  successProbability: number;
  isLikelySuccessful: boolean;
  confidenceLevel: string;
  suggestions: string[];
}

export function CampaignSuccessPredictor({ campaignData }: CampaignSuccessPredictorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const analyzeCampaign = async () => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('POST', '/api/campaigns/predict-success', campaignData);
      const data = await response.json();
      
      setPrediction(data);
      
      toast({
        title: "Analysis Complete",
        description: "Campaign success prediction is ready",
      });
    } catch (error) {
      console.error("Error analyzing campaign:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to predict campaign success at this time.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get the appropriate color based on probability
  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return "bg-green-500";
    if (probability >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Helper function to get the appropriate icon based on probability
  const getProbabilityIcon = (probability: number) => {
    if (probability >= 70) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (probability >= 40) return <HelpCircle className="h-5 w-5 text-yellow-500" />;
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-primary"
          >
            <path d="M12 2H2v10h10V2z"></path>
            <path d="M12 12h10v10H12V12z"></path>
            <path d="m4.93 21.93 14.14-14.14"></path>
          </svg>
          AI Campaign Success Predictor
        </CardTitle>
        <CardDescription>
          Use AI to analyze your campaign and predict its likelihood of success
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!prediction ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-6">
              Our AI will analyze your campaign details and provide insights on how likely 
              it is to reach its funding goal based on historical data from thousands of campaigns.
            </p>
            <Button 
              onClick={analyzeCampaign} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Analyzing..." : "Analyze Campaign Success Chance"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Success Probability</h3>
                <Badge 
                  variant={prediction.isLikelySuccessful ? "default" : "destructive"}
                >
                  {prediction.confidenceLevel.toUpperCase()} CONFIDENCE
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <Progress 
                  value={prediction.successProbability} 
                  className={`h-2 ${getProbabilityColor(prediction.successProbability)}`}
                />
                <span className="font-bold text-lg min-w-[3rem] text-right">
                  {prediction.successProbability}%
                </span>
              </div>
              
              <p className="mt-2 text-sm flex items-center gap-2">
                {getProbabilityIcon(prediction.successProbability)}
                <span>
                  {prediction.successProbability >= 70 
                    ? "Your campaign has a high chance of success!" 
                    : prediction.successProbability >= 40
                    ? "Your campaign has a moderate chance of success."
                    : "Your campaign may struggle to reach its funding goal."}
                </span>
              </p>
            </div>
            
            {prediction.suggestions.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Suggestions to improve your chances:</h3>
                <ul className="space-y-1">
                  {prediction.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="mt-1 text-primary"
                      >
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {prediction && (
        <CardFooter className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setPrediction(null)}>
            Reset Analysis
          </Button>
          <Button onClick={analyzeCampaign} disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze Again"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}