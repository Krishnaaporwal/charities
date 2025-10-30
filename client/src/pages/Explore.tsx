import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { ArrowLeft, Calendar, Target, TrendingUp, Users } from 'lucide-react';
import { calculateCampaignProgress } from '@/lib/web3';
import { format } from 'date-fns';

const Explore: React.FC = () => {
  const { data: campaigns, isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/campaigns'],
    refetchOnWindowFocus: false,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'TECHNOLOGY', 'EDUCATION', 'HEALTHCARE', 'ENVIRONMENT', 'ENERGY', 'COMMUNITY', 'ARTS', 'OTHER'];

  const filteredCampaigns = React.useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((campaign: any) => 
      selectedCategory === 'all' || campaign.category === selectedCategory
    );
  }, [campaigns, selectedCategory]);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-clip-text text-transparent crypto-gradient">Explore Campaigns</span>
              </h1>
              <p className="text-muted-foreground">
                Discover and support amazing projects powered by blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "crypto-gradient" : ""}
            >
              {category === 'all' ? 'All Categories' : category.charAt(0) + category.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading campaigns...</p>
            </div>
          )}
          
          {error && (
            <div className="col-span-full text-center py-12">
              <p className="text-destructive">Error loading campaigns. Please try again.</p>
            </div>
          )}
          
          {!isLoading && !error && filteredCampaigns && filteredCampaigns.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No campaigns found in this category.</p>
            </div>
          )}
          
          {filteredCampaigns?.map((campaign: any) => {
            const progress = calculateCampaignProgress(campaign.raisedAmount || '0', campaign.goalAmount);
            const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            
            return (
              <Card key={campaign.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="crypto-gradient text-white border-0">
                      {campaign.category}
                    </Badge>
                    {campaign.isActive ? (
                      <Badge variant="outline" className="border-green-500/50 text-green-500">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted-foreground">
                        Ended
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl line-clamp-2">
                    {campaign.title}
                  </CardTitle>
                  
                  <CardDescription className="line-clamp-3">
                    {campaign.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  {campaign.imageUrl && (
                    <img 
                      src={campaign.imageUrl} 
                      alt={campaign.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Raised</span>
                        <span className="font-mono font-bold text-primary">
                          {campaign.raisedAmount || '0'} / {campaign.goalAmount} ETH
                        </span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>{progress.toFixed(0)}% funded</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{daysLeft} days left</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <p>Created: {format(new Date(campaign.createdAt), 'MMM dd, yyyy')}</p>
                      <p className="mt-1">By: {campaign.walletAddress.substring(0, 6)}...{campaign.walletAddress.substring(38)}</p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Link href={`/campaign/${campaign.id}`} className="w-full">
                    <Button className="w-full crypto-gradient text-white">
                      View Campaign
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Explore;
