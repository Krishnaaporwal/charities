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
import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FraudRiskCheckerProps {
  campaignData: {
    campaignId?: number;
    description: string;
    goalAmount: string;
  };
}

interface RiskAssessment {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | string;
  flaggedPhrases: string[];
  recommendations: string[];
}

export function FraudRiskChecker({ campaignData }: FraudRiskCheckerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const { toast } = useToast();

  const checkCampaign = async () => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('POST', '/api/campaigns/fraud-check', campaignData);
      const data = await response.json();
      
      setRiskAssessment(data);
      
      toast({
        title: "Risk Assessment Complete",
        description: "Fraud risk analysis is ready",
      });
    } catch (error) {
      console.error("Error checking campaign:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to assess fraud risk at this time.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get the appropriate color based on risk level
  const getRiskColor = (riskLevel: string) => {
    if (riskLevel === 'low') return "bg-green-500";
    if (riskLevel === 'medium') return "bg-yellow-500";
    return "bg-red-500";
  };

  // Helper function to get the appropriate icon based on risk level
  const getRiskIcon = (riskLevel: string) => {
    if (riskLevel === 'low') return <ShieldCheck className="h-5 w-5 text-green-500" />;
    if (riskLevel === 'medium') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <ShieldAlert className="h-5 w-5 text-red-500" />;
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          AI Fraud Risk Assessment
        </CardTitle>
        <CardDescription>
          Check your campaign for potential fraud flags that could affect trust
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!riskAssessment ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-6">
              Our AI will analyze your campaign for any elements that might trigger
              fraud detection systems or reduce trust with potential donors.
            </p>
            <Button 
              onClick={checkCampaign} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Analyzing..." : "Check Trust & Safety Score"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Risk Assessment</h3>
                <Badge 
                  variant={riskAssessment.riskLevel === 'low' ? "default" : "outline"}
                  className={
                    riskAssessment.riskLevel === 'high' 
                      ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                      : riskAssessment.riskLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                      : ''
                  }
                >
                  {riskAssessment.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <Progress 
                  value={riskAssessment.riskScore} 
                  className={`h-2 ${getRiskColor(riskAssessment.riskLevel)}`}
                />
                <span className="font-bold text-lg min-w-[3rem] text-right">
                  {riskAssessment.riskScore}%
                </span>
              </div>
              
              <p className="mt-2 text-sm flex items-center gap-2">
                {getRiskIcon(riskAssessment.riskLevel)}
                <span>
                  {riskAssessment.riskLevel === 'low' 
                    ? "Your campaign appears to have low fraud risk." 
                    : riskAssessment.riskLevel === 'medium'
                    ? "Your campaign has some elements that might trigger trust concerns."
                    : "Your campaign has several elements that could trigger fraud warnings."}
                </span>
              </p>
            </div>
            
            {riskAssessment.flaggedPhrases.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Flagged phrases in your description:</h3>
                <div className="flex flex-wrap gap-2">
                  {riskAssessment.flaggedPhrases.map((phrase, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      "{phrase}"
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {riskAssessment.recommendations.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Recommendations to improve trust:</h3>
                <ul className="space-y-1">
                  {riskAssessment.recommendations.map((recommendation, index) => (
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
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {riskAssessment && (
        <CardFooter className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setRiskAssessment(null)}>
            Reset Analysis
          </Button>
          <Button onClick={checkCampaign} disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze Again"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}