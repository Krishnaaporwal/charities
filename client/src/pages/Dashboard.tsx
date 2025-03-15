import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Campaign } from '@shared/schema';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { calculateCampaignProgress } from '@/lib/web3';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Wallet, Clock, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { account, isConnected } = useWallet();
  
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['/api/campaigns'],
    refetchOnWindowFocus: false,
  });
  
  if (!isConnected) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Connect your wallet to view your dashboard</p>
          <div className="mt-6">
            <Button
              onClick={() => document.querySelector('[data-implementation="Show wallet connection modal"]')?.dispatchEvent(new Event('click'))}
              className="crypto-gradient"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Filter campaigns created by the current user
  const userCampaigns = campaigns?.filter((campaign: Campaign) => 
    campaign.walletAddress.toLowerCase() === account?.toLowerCase()
  ) || [];

  const totalRaised = userCampaigns.reduce((sum: number, campaign: Campaign) => 
    sum + parseFloat(campaign.raisedAmount), 0
  );

  const activeCampaigns = userCampaigns.filter((campaign: Campaign) => 
    campaign.isActive && new Date(campaign.deadline) > new Date()
  );

  const completedCampaigns = userCampaigns.filter((campaign: Campaign) => 
    !campaign.isActive || new Date(campaign.deadline) <= new Date()
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Creator Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your crowdfunding campaigns</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/create">
            <Button className="crypto-gradient">
              <Plus className="mr-2 h-4 w-4" />
              Create New Campaign
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Raised</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">{totalRaised.toFixed(2)} ETH</div>
              <div className="ml-1 text-xs text-muted-foreground">
                ~${(totalRaised * 2000).toFixed(2)}
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <Wallet className="h-4 w-4 text-accent mr-1" />
              <span className="text-xs text-muted-foreground">
                Across {userCampaigns.length} campaign{userCampaigns.length !== 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns.length}</div>
            <div className="mt-2 flex items-center">
              <Activity className="h-4 w-4 text-primary mr-1" />
              <span className="text-xs text-muted-foreground">
                {activeCampaigns.length > 0 
                  ? 'Currently accepting donations'
                  : 'No active campaigns'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCampaigns.length}</div>
            <div className="mt-2 flex items-center">
              <Clock className="h-4 w-4 text-secondary mr-1" />
              <span className="text-xs text-muted-foreground">
                {completedCampaigns.length > 0 
                  ? 'Campaigns that have ended'
                  : 'No completed campaigns'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Campaigns</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : activeCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCampaigns.map((campaign: Campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>You don't have any active campaigns.</p>
                <Link href="/create">
                  <Button className="mt-4 crypto-gradient">Create Campaign</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="pt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : completedCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCampaigns.map((campaign: Campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>You don't have any completed campaigns yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="pt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : userCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCampaigns.map((campaign: Campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>You haven't created any campaigns yet.</p>
                <Link href="/create">
                  <Button className="mt-4 crypto-gradient">Create Your First Campaign</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
