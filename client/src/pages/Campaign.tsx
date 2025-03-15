import React from 'react';
import { useParams } from 'wouter';
import CampaignDetails from '@/components/campaigns/CampaignDetails';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

const Campaign: React.FC = () => {
  const { id } = useParams();
  const campaignId = id ? parseInt(id) : 0;

  if (!campaignId) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Campaign Not Found</h1>
          <p className="mt-2 text-muted-foreground">The campaign you're looking for doesn't exist or was removed.</p>
          <div className="mt-6">
            <Link href="/explore">
              <Button>Explore Campaigns</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Button>
        </Link>
      </div>
      
      <CampaignDetails campaignId={campaignId} />
    </div>
  );
};

export default Campaign;
