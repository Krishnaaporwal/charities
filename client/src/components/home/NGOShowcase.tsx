import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Heart } from 'lucide-react';

interface NGOWork {
  id: number;
  ngoName: string;
  projectTitle: string;
  image: string;
  received: string;
  spent: string;
  spentPercentage: number;
  beneficiaries: number;
  category: string;
  description: string;
}

const ngoWorks: NGOWork[] = [
  {
    id: 1,
    ngoName: "Clean Water Foundation",
    projectTitle: "Rural Water Supply Initiative",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    received: "15.5 ETH",
    spent: "14.2 ETH",
    spentPercentage: 92,
    beneficiaries: 2500,
    category: "Water & Sanitation",
    description: "Providing clean water access to remote villages through sustainable well systems."
  },
  {
    id: 2,
    ngoName: "Education for All",
    projectTitle: "Digital Learning Centers",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop",
    received: "22.8 ETH",
    spent: "19.5 ETH",
    spentPercentage: 85,
    beneficiaries: 1200,
    category: "Education",
    description: "Building technology-enabled learning centers in underserved communities."
  },
  {
    id: 3,
    ngoName: "Green Earth Initiative",
    projectTitle: "Reforestation Campaign 2025",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
    received: "18.3 ETH",
    spent: "17.9 ETH",
    spentPercentage: 98,
    beneficiaries: 5000,
    category: "Environment",
    description: "Planting 50,000 trees across deforested areas to combat climate change."
  },
  {
    id: 4,
    ngoName: "Healthcare Heroes",
    projectTitle: "Mobile Medical Units",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    received: "32.7 ETH",
    spent: "28.4 ETH",
    spentPercentage: 87,
    beneficiaries: 8500,
    category: "Healthcare",
    description: "Providing free medical services to remote areas through mobile clinics."
  },
  {
    id: 5,
    ngoName: "Feed the Future",
    projectTitle: "Community Food Banks",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    received: "12.4 ETH",
    spent: "11.8 ETH",
    spentPercentage: 95,
    beneficiaries: 3200,
    category: "Food Security",
    description: "Establishing community food banks to eliminate hunger in urban areas."
  }
];

const NGOShowcase: React.FC = () => {
  const [, navigate] = useLocation();

  const handleViewReport = (ngoId: number) => {
    navigate(`/ngo-report/${ngoId}`);
  };

  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 blockchain-grid opacity-30 z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent crypto-gradient">Impact Stories</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See the real-world impact of blockchain-powered charitable giving. Every donation is tracked transparently on-chain.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal scrollable container */}
          <div className="overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <div className="flex gap-6 min-w-max px-2">
              {ngoWorks.map((work) => (
                <Card 
                  key={work.id} 
                  className="w-[380px] flex-shrink-0 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                >
                  <div className="relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="crypto-gradient text-white border-0">
                        {work.category}
                      </Badge>
                    </div>
                    <img 
                      src={work.image} 
                      alt={work.projectTitle}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground font-medium">{work.ngoName}</p>
                      <h3 className="text-xl font-bold text-foreground mt-1 line-clamp-2">
                        {work.projectTitle}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {work.description}
                    </p>

                    {/* Financial Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          Received
                        </span>
                        <span className="font-mono font-bold text-primary">{work.received}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          Deployed
                        </span>
                        <span className="font-mono font-bold text-accent">{work.spent}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Fund Utilization</span>
                          <span className="font-mono">{work.spentPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                            style={{ width: `${work.spentPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Beneficiaries */}
                    <div className="pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Beneficiaries</span>
                        </div>
                        <span className="font-mono font-bold text-foreground">
                          {work.beneficiaries.toLocaleString()}+
                        </span>
                      </div>
                    </div>

                    {/* View Details Link */}
                    <button 
                      onClick={() => handleViewReport(work.id)}
                      className="mt-4 w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-primary/20 rounded-lg hover:bg-primary/5"
                    >
                      View Detailed Report →
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none hidden md:block"></div>
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full crypto-gradient mb-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">
              {ngoWorks.reduce((sum, work) => sum + parseFloat(work.received.split(' ')[0]), 0).toFixed(1)} ETH
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Funds Raised</p>
          </div>
          
          <div className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full crypto-gradient mb-3">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">
              {ngoWorks.reduce((sum, work) => sum + parseFloat(work.spent.split(' ')[0]), 0).toFixed(1)} ETH
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Funds Deployed</p>
          </div>
          
          <div className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full crypto-gradient mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">
              {ngoWorks.reduce((sum, work) => sum + work.beneficiaries, 0).toLocaleString()}+
            </p>
            <p className="text-sm text-muted-foreground mt-1">Lives Impacted</p>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.2);
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.3);
        }
      `}</style>
    </section>
  );
};

export default NGOShowcase;
