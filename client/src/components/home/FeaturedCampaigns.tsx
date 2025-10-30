import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { Campaign } from '@shared/schema';
import { ChevronRight } from 'lucide-react';

const FeaturedCampaigns: React.FC = () => {
  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['/api/campaigns'],
    refetchOnWindowFocus: false,
  });

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Featured Charities</h2>
          <Link href="/explore">
            <a className="text-primary hover:text-primary/80 flex items-center">
              View all
              <ChevronRight className="ml-1 h-5 w-5" />
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-card rounded-xl overflow-hidden shadow-lg shadow-background/50 h-96 animate-pulse">
                <div className="h-48 bg-background/50"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-background/50 rounded w-3/4"></div>
                  <div className="h-4 bg-background/50 rounded w-full"></div>
                  <div className="h-4 bg-background/50 rounded w-5/6"></div>
                  <div className="h-2 bg-background/50 rounded w-full mt-6"></div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-8 w-8 bg-background/50 rounded-full"></div>
                    <div className="h-8 w-20 bg-background/50 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-8">
            Failed to load campaigns. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns?.slice(0, 3).map((campaign: Campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
