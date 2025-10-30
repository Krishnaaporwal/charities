import React from 'react';
import { Link, useLocation } from 'wouter';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Check, Zap, ShieldCheck } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { connectWallet, isConnected } = useWallet();
  const [, navigate] = useLocation();

  const handleStartCampaign = () => {
    if (isConnected) {
      navigate('/create');
    } else {
      connectWallet();
    }
  };
  
  const handleExploreCampaigns = () => {
    navigate('/explore');
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="blockchain-grid absolute inset-0 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block">Raise Funds in Crypto</span>
              <span className="block mt-2 bg-clip-text text-transparent crypto-gradient">With Transparency</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              NustarFund is a decentralized platform where anyone can create, fund, and manage Charities using cryptocurrencies like ETH or MATIC.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button 
                onClick={handleStartCampaign}
                className="px-8 py-6 rounded-lg font-medium text-white crypto-gradient hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                size="lg"
              >
                Start a Charity
              </Button>
              <Button 
                onClick={handleExploreCampaigns}
                variant="outline" 
                className="px-8 py-6 rounded-lg font-medium"
                size="lg"
              >
                Explore Charities
              </Button>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full crypto-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-mono font-bold text-lg">100%</p>
                  <p className="text-xs text-muted-foreground">Transparent</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full crypto-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-mono font-bold text-lg">Fast</p>
                  <p className="text-xs text-muted-foreground">Transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full crypto-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-mono font-bold text-lg">Secure</p>
                  <p className="text-xs text-muted-foreground">Blockchain-Based</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="w-full h-[480px] relative">
              <div className="absolute inset-0 bg-muted rounded-2xl overflow-hidden shadow-xl shadow-background/50">
                <div className="h-1/2 w-full blockchain-grid relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted"></div>
                  <div className="h-32 w-32 bg-primary/30 absolute top-10 left-10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="h-24 w-24 bg-secondary/30 absolute bottom-10 right-10 rounded-full blur-2xl animate-pulse"></div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="h-10 w-36 rounded-full bg-primary/20 flex items-center px-3">
                      <div className="h-4 w-4 rounded-full bg-accent mr-2"></div>
                      <span className="text-xs text-accent font-medium">Active Campaign</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Renewable Energy Blockchain</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Help us build a sustainable future with blockchain technology that allows for energy credit trading.</p>
                  <div className="mt-6">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>Raised: <span className="font-mono font-medium text-foreground">6.4 ETH</span></span>
                      <span>Goal: <span className="font-mono font-medium text-foreground">10 ETH</span></span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full w-[64%] bg-gradient-to-r from-accent to-primary rounded-full"></div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-background border-2 border-muted flex items-center justify-center text-xs font-medium">GD</div>
                        <div className="w-8 h-8 rounded-full bg-background border-2 border-muted flex items-center justify-center text-xs font-medium">JL</div>
                        <div className="w-8 h-8 rounded-full bg-background border-2 border-muted flex items-center justify-center text-xs font-medium">MS</div>
                        <div className="w-8 h-8 rounded-full bg-background border-2 border-muted flex items-center justify-center text-xs font-medium">+5</div>
                      </div>
                      <Button 
                        size="sm"
                        className="px-4 py-1 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
                      >
                        Donate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 top-10 w-24 h-24 hexagon crypto-gradient p-[2px]">
                <div className="bg-background w-full h-full hexagon flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.95 21.5H4.05c-1.3 0-2.4-.76-2.37-2.37V4.87c0-1.31.72-2.37 2.37-2.37h15.9c1.3 0 2.37.76 2.37 2.37v14.26c0 1.61-1.07 2.37-2.37 2.37z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8.5v7M15.5 12h-7" />
                  </svg>
                </div>
              </div>
              <div className="absolute -left-6 bottom-10 w-20 h-20 hexagon crypto-gradient p-[2px]">
                <div className="bg-background w-full h-full hexagon flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
