import React from 'react';
import { Plus, Coins, CreditCard } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our decentralized crowdfunding platform leverages blockchain technology for complete transparency and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="bg-card rounded-xl p-6 relative z-10 h-full border border-border">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Create Campaign</h3>
              <p className="text-muted-foreground">
                Connect your wallet and fill in your campaign details. Our smart contract stores all information securely on the blockchain.
              </p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Connect wallet (MetaMask, WalletConnect)
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Fill in campaign details
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Pay minimal gas fee to deploy
                </div>
              </div>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-12 transform translate-x-1/2 -translate-y-1/2 z-20">
              <ChevronRight className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-card rounded-xl p-6 relative z-10 h-full border border-border">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <Coins className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Receive Funding</h3>
              <p className="text-muted-foreground">
                Donors can send crypto directly to your campaign. Every donation is recorded on the blockchain for complete transparency.
              </p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Donors send ETH/MATIC directly
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Smart contract records donations
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time funding progress updates
                </div>
              </div>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-12 transform translate-x-1/2 -translate-y-1/2 z-20">
              <ChevronRight className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div>
            <div className="bg-card rounded-xl p-6 relative z-10 h-full border border-border">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-accent/20 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Withdraw Funds</h3>
              <p className="text-muted-foreground">
                When your goal is met, withdraw funds directly to your wallet. Smart contract ensures only authorized withdrawal.
              </p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Goal met = funds available
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Only campaign creator can withdraw
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Automatic fund transfer via smart contract
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
