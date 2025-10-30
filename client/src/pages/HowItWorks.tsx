import React from 'react';
import { Plus, Coins, CreditCard, Shield, Lock, TrendingUp, Users, CheckCircle, AlertTriangle, Wallet, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 crypto-gradient opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How NustarFund Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A transparent, secure, and decentralized crowdfunding platform powered by blockchain technology
            </p>
          </div>
        </div>
      </section>

      {/* Main Process Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Simple 3-Step Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're creating a campaign or supporting one, our platform makes it easy and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-card rounded-xl p-8 border-2 border-primary/20 hover:border-primary/50 transition-all h-full">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-3">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Create Campaign</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Connect your wallet and fill in your campaign details. Our smart contract stores all information securely on the Sepolia testnet blockchain.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Connect MetaMask or WalletConnect</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Fill campaign details (title, goal, deadline)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Pay 0.01 SEP ETH platform fee</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Campaign deployed on blockchain</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2 z-20">
                <ArrowRight className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-card rounded-xl p-8 border-2 border-secondary/20 hover:border-secondary/50 transition-all h-full">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-secondary/20 flex items-center justify-center">
                  <Coins className="h-8 w-8 text-secondary" />
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold mr-3">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Receive Funding</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Donors can send SEP ETH directly to your campaign. Every donation is recorded on the blockchain for complete transparency.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Donors connect wallet and donate</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Smart contract records all donations</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Real-time progress tracking</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">100% transparent transaction history</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2 z-20">
                <ArrowRight className="h-8 w-8 text-secondary" />
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="bg-card rounded-xl p-8 border-2 border-accent/20 hover:border-accent/50 transition-all h-full">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-accent" />
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold mr-3">
                    3
                  </div>
                  <h3 className="text-xl font-bold">Withdraw Funds</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  When your goal is met, withdraw funds directly to your wallet. Smart contract ensures only authorized withdrawal.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Goal reached = funds unlocked</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Only campaign owner can withdraw</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Instant transfer to your wallet</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">No intermediaries or delays</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose NustarFund?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform leverages blockchain technology to provide unmatched security and transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">100% Secure</h3>
              <p className="text-sm text-muted-foreground">
                Smart contracts on Sepolia testnet ensure your funds are protected. Only campaign owners can withdraw when goals are met.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 mb-4 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Lock className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Complete Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Every transaction is recorded on the blockchain. Anyone can verify donations and withdrawals at any time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 mb-4 rounded-xl bg-accent/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get success predictions and fraud detection powered by machine learning algorithms to make informed decisions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Global Reach</h3>
              <p className="text-sm text-muted-foreground">
                Accept donations from anyone, anywhere in the world. No borders, no restrictions, no traditional banking limits.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 mb-4 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Low Fees</h3>
              <p className="text-sm text-muted-foreground">
                Only 0.01 SEP ETH platform fee to create campaigns. No hidden charges, no percentage cuts from donations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 mb-4 rounded-xl bg-accent/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">Tax Information</h3>
              <p className="text-sm text-muted-foreground">
                Get comprehensive tax guidelines for both donors and campaign creators to stay compliant with regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technical Details</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on Ethereum's Sepolia testnet with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Blockchain Details */}
            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                Blockchain Technology
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-semibold">Sepolia Testnet</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Chain ID:</span>
                  <span className="font-semibold">11155111</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Contract Standard:</span>
                  <span className="font-semibold">Solidity 0.8.28</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Platform Fee:</span>
                  <span className="font-semibold">0.01 SEP ETH</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Wallet Support:</span>
                  <span className="font-semibold">MetaMask, WalletConnect</span>
                </div>
              </div>
            </div>

            {/* Smart Contract Features */}
            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-secondary" />
                </div>
                Smart Contract Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Escrow Protection</div>
                    <div className="text-sm text-muted-foreground">Funds held securely until goals are met</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Owner Verification</div>
                    <div className="text-sm text-muted-foreground">Only campaign creator can withdraw funds</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Immutable Records</div>
                    <div className="text-sm text-muted-foreground">All transactions permanently recorded</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Refund Mechanism</div>
                    <div className="text-sm text-muted-foreground">Automatic refunds if campaign fails</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Gas Optimized</div>
                    <div className="text-sm text-muted-foreground">Efficient code for lower transaction costs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-8">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-amber-500">Important: Testnet Platform</h3>
                <p className="text-muted-foreground mb-4">
                  NustarFund currently operates on the Sepolia testnet for demonstration and testing purposes. 
                  This means:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>All transactions use test ETH (SEP ETH) with no real monetary value</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You can get free test ETH from Sepolia faucets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Perfect for learning and testing without financial risk</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>All blockchain features work exactly like mainnet</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Create your first campaign or explore existing campaigns to support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-campaign">
              <Button size="lg" className="w-full sm:w-auto">
                <Plus className="h-5 w-5 mr-2" />
                Create Campaign
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Coins className="h-5 w-5 mr-2" />
                Explore Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
