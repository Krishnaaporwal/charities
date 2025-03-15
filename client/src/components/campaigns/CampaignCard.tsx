import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Campaign } from '@shared/schema';
import { calculateCampaignProgress } from '@/lib/web3';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progress = calculateCampaignProgress(campaign.raisedAmount, campaign.goalAmount);

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg shadow-background/50 hover:translate-y-[-4px] transition-transform duration-300">
      <div className="h-48 relative">
        <img 
          src={campaign.imageUrl || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&h=300&q=80"} 
          alt={campaign.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute top-4 right-4 bg-accent/90 text-white text-xs font-bold px-2 py-1 rounded-md">
          {campaign.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">
          {campaign.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {campaign.description.length > 100 
            ? `${campaign.description.substring(0, 100)}...` 
            : campaign.description}
        </p>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Raised: <span className="font-mono font-medium text-foreground">{campaign.raisedAmount} ETH</span></span>
          <span>Goal: <span className="font-mono font-medium text-foreground">{campaign.goalAmount} ETH</span></span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-accent to-primary rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-xs font-medium">
              {campaign.creatorId ? `ID${campaign.creatorId}` : 'CF'}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(campaign.createdAt).toLocaleDateString()}
            </span>
          </div>
          <Link href={`/campaign/${campaign.id}`}>
            <Button size="sm" className="crypto-gradient hover:opacity-90">
              Donate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
