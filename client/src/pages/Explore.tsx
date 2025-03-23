
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

const Explore: React.FC = () => {
  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['/api/campaigns'],
    refetchOnWindowFocus: false,
  });

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
      
      <h1 className="text-3xl font-bold mb-8">Explore Campaigns</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && <p>Loading campaigns...</p>}
        {error && <p>Error loading campaigns</p>}
        {campaigns?.map((campaign: any) => (
          <div key={campaign.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
            <p className="text-muted-foreground mb-4">{campaign.description}</p>
            <Link href={`/campaign/${campaign.id}`}>
              <Button>View Campaign</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
