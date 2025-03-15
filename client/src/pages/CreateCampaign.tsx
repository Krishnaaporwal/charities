import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import CampaignForm from '@/components/campaigns/CampaignForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletConnectButton } from '@/components/ui/wallet-connect';

const CreateCampaign: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Create a Campaign</h1>
        <p className="mt-2 text-muted-foreground">
          Launch your project on the blockchain and start raising funds
        </p>
      </div>

      {!isConnected ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              You need to connect your cryptocurrency wallet to create a campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletConnectButton />
          </CardContent>
        </Card>
      ) : (
        <CampaignForm />
      )}
    </div>
  );
};

export default CreateCampaign;
