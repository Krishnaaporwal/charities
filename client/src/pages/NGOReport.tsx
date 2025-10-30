import React from 'react';
import { useRoute, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  ArrowLeft, 
  Calendar,
  MapPin,
  CheckCircle2,
  DollarSign,
  PieChart,
  FileText,
  ExternalLink
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  type: 'received' | 'spent';
  txHash: string;
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  date: string;
}

interface Expense {
  category: string;
  amount: string;
  percentage: number;
  color: string;
}

// Mock data for different NGOs
const ngoReportsData: { [key: string]: any } = {
  '1': {
    ngoName: "Clean Water Foundation",
    projectTitle: "Rural Water Supply Initiative",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
    received: "15.5 ETH",
    spent: "14.2 ETH",
    spentPercentage: 92,
    beneficiaries: 2500,
    category: "Water & Sanitation",
    location: "Rural Maharashtra, India",
    startDate: "January 2025",
    description: "Providing clean water access to remote villages through sustainable well systems and water purification technology.",
    impact: [
      "25 new wells constructed",
      "2,500+ people with clean water access",
      "90% reduction in waterborne diseases",
      "50+ local jobs created"
    ],
    expenses: [
      { category: "Well Construction", amount: "8.5 ETH", percentage: 60, color: "#3b82f6" },
      { category: "Water Purification Systems", amount: "3.2 ETH", percentage: 22, color: "#8b5cf6" },
      { category: "Training & Education", amount: "1.5 ETH", percentage: 11, color: "#10b981" },
      { category: "Maintenance Fund", amount: "1.0 ETH", percentage: 7, color: "#f59e0b" }
    ],
    milestones: [
      { id: 1, title: "Site Survey & Planning", description: "Completed geological survey and identified 30 suitable locations", completed: true, date: "Jan 2025" },
      { id: 2, title: "First 10 Wells Completed", description: "Successfully drilled and tested first batch of wells", completed: true, date: "Feb 2025" },
      { id: 3, title: "Water Quality Testing", description: "All wells passed WHO water quality standards", completed: true, date: "Mar 2025" },
      { id: 4, title: "Community Training", description: "Trained 100+ community members in well maintenance", completed: true, date: "Apr 2025" },
      { id: 5, title: "Project Completion", description: "Final 15 wells and distribution systems installed", completed: false, date: "Dec 2025" }
    ],
    transactions: [
      { id: "1", date: "2025-01-15", description: "Initial donation from donors", amount: "+8.2 ETH", type: "received", txHash: "0x1234...5678" },
      { id: "2", date: "2025-01-20", description: "Equipment purchase", amount: "-2.5 ETH", type: "spent", txHash: "0xabcd...efgh" },
      { id: "3", date: "2025-02-10", description: "Community donation round", amount: "+5.3 ETH", type: "received", txHash: "0x9876...5432" },
      { id: "4", date: "2025-02-15", description: "Construction materials", amount: "-4.0 ETH", type: "spent", txHash: "0xijkl...mnop" },
      { id: "5", date: "2025-03-01", description: "Final fundraising campaign", amount: "+2.0 ETH", type: "received", txHash: "0xqrst...uvwx" },
      { id: "6", date: "2025-03-10", description: "Training program expenses", amount: "-1.5 ETH", type: "spent", txHash: "0xyzab...cdef" }
    ]
  },
  '2': {
    ngoName: "Education for All",
    projectTitle: "Digital Learning Centers",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=600&fit=crop",
    received: "22.8 ETH",
    spent: "19.5 ETH",
    spentPercentage: 85,
    beneficiaries: 1200,
    category: "Education",
    location: "Urban slums, Delhi, India",
    startDate: "February 2025",
    description: "Building technology-enabled learning centers in underserved communities to bridge the digital divide.",
    impact: [
      "5 learning centers established",
      "1,200+ students enrolled",
      "98% improvement in digital literacy",
      "15 local teachers trained"
    ],
    expenses: [
      { category: "Technology & Equipment", amount: "10.5 ETH", percentage: 54, color: "#3b82f6" },
      { category: "Infrastructure & Setup", amount: "5.0 ETH", percentage: 26, color: "#8b5cf6" },
      { category: "Teacher Training", amount: "2.5 ETH", percentage: 13, color: "#10b981" },
      { category: "Course Materials", amount: "1.5 ETH", percentage: 7, color: "#f59e0b" }
    ],
    milestones: [
      { id: 1, title: "Location Selection", description: "Identified 5 strategic locations in underserved areas", completed: true, date: "Feb 2025" },
      { id: 2, title: "First Center Launched", description: "Successfully opened first digital learning center", completed: true, date: "Mar 2025" },
      { id: 3, title: "Equipment Installation", description: "Installed 150 computers and high-speed internet", completed: true, date: "Apr 2025" },
      { id: 4, title: "Teacher Training Complete", description: "Trained all 15 instructors in digital pedagogy", completed: true, date: "May 2025" },
      { id: 5, title: "Full Capacity Operation", description: "All 5 centers operating at full capacity", completed: false, date: "Nov 2025" }
    ],
    transactions: [
      { id: "1", date: "2025-02-05", description: "Initial seed funding", amount: "+12.0 ETH", type: "received", txHash: "0x2345...6789" },
      { id: "2", date: "2025-02-12", description: "Computer equipment purchase", amount: "-6.0 ETH", type: "spent", txHash: "0xbcde...fghi" },
      { id: "3", date: "2025-03-08", description: "Corporate sponsorship", amount: "+8.8 ETH", type: "received", txHash: "0x8765...4321" },
      { id: "4", date: "2025-03-20", description: "Infrastructure development", amount: "-5.0 ETH", type: "spent", txHash: "0xjklm...nopq" },
      { id: "5", date: "2025-04-15", description: "Individual donations", amount: "+2.0 ETH", type: "received", txHash: "0xrstu...vwxy" }
    ]
  },
  '3': {
    ngoName: "Green Earth Initiative",
    projectTitle: "Reforestation Campaign 2025",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=600&fit=crop",
    received: "18.3 ETH",
    spent: "17.9 ETH",
    spentPercentage: 98,
    beneficiaries: 5000,
    category: "Environment",
    location: "Western Ghats, Karnataka",
    startDate: "March 2025",
    description: "Planting 50,000 trees across deforested areas to combat climate change and restore biodiversity.",
    impact: [
      "48,500 trees planted",
      "200 acres reforested",
      "5,000+ community members engaged",
      "15 native species restored"
    ],
    expenses: [
      { category: "Saplings & Seeds", amount: "7.0 ETH", percentage: 39, color: "#3b82f6" },
      { category: "Labor & Planting", amount: "6.5 ETH", percentage: 36, color: "#8b5cf6" },
      { category: "Maintenance & Monitoring", amount: "3.0 ETH", percentage: 17, color: "#10b981" },
      { category: "Community Engagement", amount: "1.4 ETH", percentage: 8, color: "#f59e0b" }
    ],
    milestones: [
      { id: 1, title: "Land Assessment", description: "Surveyed and prepared 200 acres for planting", completed: true, date: "Mar 2025" },
      { id: 2, title: "Sapling Production", description: "Cultivated 50,000 native saplings in nurseries", completed: true, date: "Apr 2025" },
      { id: 3, title: "Community Mobilization", description: "Recruited 500+ volunteers for planting drive", completed: true, date: "May 2025" },
      { id: 4, title: "Mass Planting Event", description: "Planted 48,500 trees in coordinated drives", completed: true, date: "Jun-Oct 2025" },
      { id: 5, title: "Monitoring System", description: "Setup long-term monitoring and maintenance", completed: false, date: "Dec 2025" }
    ],
    transactions: [
      { id: "1", date: "2025-03-10", description: "Environmental fund grant", amount: "+10.0 ETH", type: "received", txHash: "0x3456...7890" },
      { id: "2", date: "2025-03-25", description: "Sapling procurement", amount: "-7.0 ETH", type: "spent", txHash: "0xcdef...ghij" },
      { id: "3", date: "2025-05-15", description: "Community fundraiser", amount: "+8.3 ETH", type: "received", txHash: "0x7654...3210" },
      { id: "4", date: "2025-06-01", description: "Planting operations", amount: "-6.5 ETH", type: "spent", txHash: "0xklmn...opqr" }
    ]
  },
  '4': {
    ngoName: "Healthcare Heroes",
    projectTitle: "Mobile Medical Units",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop",
    received: "32.7 ETH",
    spent: "28.4 ETH",
    spentPercentage: 87,
    beneficiaries: 8500,
    category: "Healthcare",
    location: "Remote villages, Rajasthan",
    startDate: "January 2025",
    description: "Providing free medical services to remote areas through fully-equipped mobile clinics.",
    impact: [
      "8,500+ patients treated",
      "3 mobile units deployed",
      "2,000+ vaccinations administered",
      "500+ emergency cases handled"
    ],
    expenses: [
      { category: "Medical Equipment", amount: "12.0 ETH", percentage: 42, color: "#3b82f6" },
      { category: "Vehicle & Setup", amount: "8.5 ETH", percentage: 30, color: "#8b5cf6" },
      { category: "Medical Staff", amount: "5.5 ETH", percentage: 19, color: "#10b981" },
      { category: "Medicines & Supplies", amount: "2.4 ETH", percentage: 9, color: "#f59e0b" }
    ],
    milestones: [
      { id: 1, title: "Vehicle Procurement", description: "Purchased 3 specially equipped medical vans", completed: true, date: "Jan 2025" },
      { id: 2, title: "Medical Team Assembly", description: "Recruited 12 healthcare professionals", completed: true, date: "Feb 2025" },
      { id: 3, title: "First Unit Operational", description: "Launched first mobile clinic in target region", completed: true, date: "Mar 2025" },
      { id: 4, title: "All Units Active", description: "All 3 mobile units providing services", completed: true, date: "May 2025" },
      { id: 5, title: "10,000 Patients Milestone", description: "Reach 10,000 patients treated", completed: false, date: "Dec 2025" }
    ],
    transactions: [
      { id: "1", date: "2025-01-08", description: "Major donor contribution", amount: "+18.0 ETH", type: "received", txHash: "0x4567...8901" },
      { id: "2", date: "2025-01-20", description: "Medical equipment purchase", amount: "-12.0 ETH", type: "spent", txHash: "0xdefg...hijk" },
      { id: "3", date: "2025-02-14", description: "Healthcare fund allocation", amount: "+14.7 ETH", type: "received", txHash: "0x6543...2109" },
      { id: "4", date: "2025-02-28", description: "Vehicle modification", amount: "-8.5 ETH", type: "spent", txHash: "0xlmno...pqrs" }
    ]
  },
  '5': {
    ngoName: "Feed the Future",
    projectTitle: "Community Food Banks",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=600&fit=crop",
    received: "12.4 ETH",
    spent: "11.8 ETH",
    spentPercentage: 95,
    beneficiaries: 3200,
    category: "Food Security",
    location: "Urban poor areas, Mumbai",
    startDate: "February 2025",
    description: "Establishing community food banks to eliminate hunger in urban areas and provide nutritious meals.",
    impact: [
      "3,200+ families served",
      "4 food banks established",
      "96,000+ meals distributed",
      "Zero food waste achieved"
    ],
    expenses: [
      { category: "Food Procurement", amount: "6.5 ETH", percentage: 55, color: "#3b82f6" },
      { category: "Storage Facilities", amount: "2.8 ETH", percentage: 24, color: "#8b5cf6" },
      { category: "Distribution Network", amount: "1.8 ETH", percentage: 15, color: "#10b981" },
      { category: "Operations & Staff", amount: "0.7 ETH", percentage: 6, color: "#f59e0b" }
    ],
    milestones: [
      { id: 1, title: "Partner Network", description: "Established partnerships with local food suppliers", completed: true, date: "Feb 2025" },
      { id: 2, title: "First Food Bank", description: "Opened first community food bank", completed: true, date: "Mar 2025" },
      { id: 3, title: "Distribution System", description: "Implemented efficient food distribution system", completed: true, date: "Apr 2025" },
      { id: 4, title: "Scale to 4 Locations", description: "Expanded to 4 strategic urban locations", completed: true, date: "Jun 2025" },
      { id: 5, title: "100K Meals Goal", description: "Distribute 100,000 nutritious meals", completed: false, date: "Dec 2025" }
    ],
    transactions: [
      { id: "1", date: "2025-02-12", description: "Initial fundraising", amount: "+7.5 ETH", type: "received", txHash: "0x5678...9012" },
      { id: "2", date: "2025-02-20", description: "Food bank setup", amount: "-2.8 ETH", type: "spent", txHash: "0xefgh...ijkl" },
      { id: "3", date: "2025-03-18", description: "Community donations", amount: "+4.9 ETH", type: "received", txHash: "0x5432...1098" },
      { id: "4", date: "2025-04-05", description: "Food procurement", amount: "-6.5 ETH", type: "spent", txHash: "0xmnop...qrst" }
    ]
  }
};

const NGOReport: React.FC = () => {
  const [, params] = useRoute('/ngo-report/:id');
  const [, navigate] = useLocation();
  
  const ngoId = params?.id || '1';
  const data = ngoReportsData[ngoId] || ngoReportsData['1'];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={data.image} 
          alt={data.projectTitle}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 text-white hover:text-white/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <Badge className="mb-3 crypto-gradient text-white border-0">
            {data.category}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {data.projectTitle}
          </h1>
          <p className="text-xl text-white/90">{data.ngoName}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full crypto-gradient flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-mono font-bold">{data.received}</p>
                  <p className="text-sm text-muted-foreground">Funds Received</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full crypto-gradient flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-mono font-bold">{data.spent}</p>
                  <p className="text-sm text-muted-foreground">Funds Deployed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full crypto-gradient flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-mono font-bold">{data.beneficiaries.toLocaleString()}+</p>
                  <p className="text-sm text-muted-foreground">Beneficiaries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full crypto-gradient flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-mono font-bold">{data.spentPercentage}%</p>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Overview */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{data.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{data.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Started</p>
                      <p className="font-medium">{data.startDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Metrics */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Key Impact Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {data.impact.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Fund Utilization Breakdown */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Fund Utilization Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.expenses.map((expense: Expense, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{expense.category}</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-sm">{expense.amount}</span>
                          <span className="text-xs text-muted-foreground ml-2">({expense.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${expense.percentage}%`,
                            backgroundColor: expense.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Project Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.milestones.map((milestone: Milestone) => (
                    <div key={milestone.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          milestone.completed 
                            ? 'crypto-gradient' 
                            : 'bg-border'
                        }`}>
                          <CheckCircle2 className={`h-5 w-5 ${
                            milestone.completed ? 'text-white' : 'text-muted-foreground'
                          }`} />
                        </div>
                        {milestone.id < data.milestones.length && (
                          <div className={`w-0.5 h-16 ${
                            milestone.completed ? 'bg-primary' : 'bg-border'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{milestone.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {milestone.date}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Transactions */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.transactions.map((tx: Transaction) => (
                    <div key={tx.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`font-mono text-sm font-bold ${
                          tx.type === 'received' ? 'text-green-500' : 'text-orange-500'
                        }`}>
                          {tx.amount}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {tx.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{tx.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{tx.date}</span>
                        <a 
                          href={`https://etherscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Donate CTA */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Support This Cause</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your contribution can make a real difference in the lives of thousands.
                </p>
                <Button 
                  className="w-full crypto-gradient text-white"
                  onClick={() => navigate('/explore')}
                >
                  Donate Now
                </Button>
              </CardContent>
            </Card>

            {/* Transparency Badge */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-3 crypto-gradient rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold mb-2">100% Transparent</h4>
                <p className="text-xs text-muted-foreground">
                  All transactions are recorded on the blockchain and publicly verifiable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOReport;
