import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useWallet } from '@/contexts/WalletContext';
import { CrowdfundingContract } from '@/lib/smartContract';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { calculateCampaignProgress, formatWalletAddress } from '@/lib/web3';
import { Campaign } from '@shared/schema';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Users, ExternalLink } from 'lucide-react';

interface CampaignDetailsProps {
  campaignId: number;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaignId }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const { account, signer } = useWallet();
  const { toast } = useToast();

  const { data: campaign, isLoading, error } = useQuery({
    queryKey: [`/api/campaigns/${campaignId}`],
  });

  const { data: donations } = useQuery({
    queryKey: [`/api/campaigns/${campaignId}/donations`],
    enabled: !!campaign,
  });

  const donateMutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!account || !signer) {
        throw new Error("Please connect your wallet to donate");
      }
      
      let txHash = "";
      let blockchainSuccess = false;
      
      // Try to call smart contract to donate
      try {
        const contract = new CrowdfundingContract(signer);
        const result = await contract.donateToCampaign(campaignId, amount);
        
        if (result.success && result.txHash) {
          blockchainSuccess = true;
          txHash = result.txHash;
          console.log("✅ Blockchain donation successful:", result.txHash);
        } else {
          console.warn("⚠️ Blockchain donation failed, using demo mode:", result.error);
        }
      } catch (error: any) {
        console.warn("⚠️ Blockchain error, using demo mode:", error.message);
      }
      
      // Record donation in our API (works in both blockchain and demo mode)
      const donationData = {
        campaignId,
        donorAddress: account,
        amount,
        transactionHash: txHash || `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      const response = await apiRequest('POST', '/api/donations', donationData);
      return { 
        data: await response.json(), 
        blockchainSuccess,
        demoMode: !blockchainSuccess 
      };
    },
    onSuccess: (result) => {
      toast({
        title: result.demoMode ? "Demo Donation Recorded!" : "Donation Successful!",
        description: result.demoMode 
          ? `Demo: Recorded ${donationAmount} SEP ETH donation. Enable blockchain for real transactions.`
          : `Thank you for your donation of ${donationAmount} SEP ETH.`,
        variant: result.demoMode ? "default" : "default",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}/donations`] });
      setDonationAmount('');
      setIsDonationDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Donation Failed",
        description: error.message || "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDonate = () => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to donate.",
        variant: "destructive",
      });
      return;
    }
    
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }
    
    donateMutation.mutate(donationAmount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            Failed to load campaign details. The campaign may not exist or there was an error.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </CardFooter>
      </Card>
    );
  }

  const progress = calculateCampaignProgress(campaign.raisedAmount, campaign.goalAmount);
  const isCreator = account && account.toLowerCase() === campaign.walletAddress.toLowerCase();
  const isActive = campaign.isActive && new Date(campaign.deadline) > new Date();
  const donorCount = donations?.length || 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
            <img 
              src={campaign.imageUrl || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&h=600&q=80"} 
              alt={campaign.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="text-xs font-semibold px-3 py-1">
                {campaign.category}
              </Badge>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold">{campaign.title}</h1>
            <div className="flex items-center mt-4 text-sm text-muted-foreground">
              <span className="flex items-center mr-4">
                <Calendar className="h-4 w-4 mr-1" />
                Created on {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(campaign.deadline) > new Date() 
                  ? `Ends on ${new Date(campaign.deadline).toLocaleDateString()}`
                  : 'Campaign ended'}
              </span>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">About this campaign</h2>
              <p className="text-base text-muted-foreground whitespace-pre-line">
                {campaign.description}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Campaign Status</CardTitle>
              <CardDescription>
                {isActive ? 'This campaign is active and accepting donations' : 'This campaign has ended'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Raised</span>
                  <span className="font-mono font-semibold">{parseFloat(campaign.raisedAmount).toFixed(4)} SEP ETH</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Goal</span>
                  <span className="font-mono font-semibold">{parseFloat(campaign.goalAmount).toFixed(4)} SEP ETH</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="py-2 border-y border-border flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{donorCount} Donor{donorCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {progress.toFixed(0)}% funded
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-semibold">Creator:</span>{' '}
                  <span className="font-mono text-muted-foreground">{formatWalletAddress(campaign.walletAddress)}</span>
                </div>
                {isActive && (
                  <div>
                    <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full crypto-gradient">
                          Donate Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Donate to {campaign.title}</DialogTitle>
                          <DialogDescription>
                            Enter the amount of SEP ETH (Sepolia testnet) you wish to donate. This transaction will be processed through your connected wallet.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label htmlFor="amount" className="text-sm font-medium">
                              Donation Amount (SEP ETH)
                            </label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="0.00"
                              value={donationAmount}
                              onChange={(e) => setDonationAmount(e.target.value)}
                            />
                          </div>
                          <div className="text-sm text-muted-foreground bg-amber-500/10 border border-amber-500/30 rounded p-3">
                            💡 This is testnet ETH with no real value. Get free SEP ETH from Sepolia faucets to test donations.
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDonationDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleDonate} disabled={donateMutation.isPending}>
                            {donateMutation.isPending ? "Processing..." : "Confirm Donation"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                {isCreator && parseFloat(campaign.raisedAmount) > 0 && (
                  <Button variant="outline" className="w-full">
                    Withdraw Funds
                  </Button>
                )}
                <div className="text-center text-xs text-muted-foreground mt-4">
                  <a 
                    href={`https://sepolia.etherscan.io/address/${campaign.walletAddress}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center hover:text-primary"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Sepolia Etherscan
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {donations && donations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
          <div className="space-y-3">
            {donations.slice(0, 5).map((donation: any) => (
              <Card key={donation.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-mono text-sm">{formatWalletAddress(donation.donorAddress)}</div>
                    <div className="text-xs text-muted-foreground">{new Date(donation.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="font-mono font-semibold">{parseFloat(donation.amount).toFixed(4)} SEP ETH</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
