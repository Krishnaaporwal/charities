import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useWallet } from '@/contexts/WalletContext';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { formatWalletAddress, calculateCampaignProgress } from '@/lib/web3';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Building2, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Upload, 
  Plus,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const Profile: React.FC = () => {
  const { account } = useWallet();
  const { toast } = useToast();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  // Fetch user's campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<any[]>({
    queryKey: ['/api/campaigns', account],
    queryFn: async () => {
      const response = await fetch('/api/campaigns');
      const allCampaigns = await response.json();
      // Filter campaigns by wallet address
      return allCampaigns.filter((c: any) => 
        c.walletAddress.toLowerCase() === account?.toLowerCase()
      );
    },
    enabled: !!account,
  });

  // Fetch NGO reports for user's campaigns
  const { data: ngoReports } = useQuery<any[]>({
    queryKey: ['/api/ngo-reports', account],
    enabled: !!account && campaigns?.some(c => c.creatorType === 'ngo'),
  });

  // Fetch NGO milestones
  const { data: ngoMilestones } = useQuery<any[]>({
    queryKey: ['/api/ngo-milestones', account],
    enabled: !!account && campaigns?.some(c => c.creatorType === 'ngo'),
  });

  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    beneficiariesHelped: '',
    fundsSpent: '',
    imageUrls: ''
  });

  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    targetDate: '',
    status: 'pending'
  });

  // Add report mutation
  const addReportMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/ngo-reports', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Added!",
        description: "Your report has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ngo-reports'] });
      setIsReportDialogOpen(false);
      setReportForm({
        title: '',
        description: '',
        beneficiariesHelped: '',
        fundsSpent: '',
        imageUrls: ''
      });
    },
  });

  // Add milestone mutation
  const addMilestoneMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/ngo-milestones', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Milestone Added!",
        description: "Your milestone has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ngo-milestones'] });
      setIsMilestoneDialogOpen(false);
      setMilestoneForm({
        title: '',
        description: '',
        targetDate: '',
        status: 'pending'
      });
    },
  });

  const handleAddReport = () => {
    if (!selectedCampaignId) return;

    const reportData = {
      campaignId: selectedCampaignId,
      title: reportForm.title,
      description: reportForm.description,
      reportData: {
        beneficiariesHelped: parseInt(reportForm.beneficiariesHelped) || 0,
        fundsSpent: reportForm.fundsSpent,
      },
      images: reportForm.imageUrls.split(',').map(url => url.trim()).filter(Boolean),
    };

    addReportMutation.mutate(reportData);
  };

  const handleAddMilestone = () => {
    if (!selectedCampaignId) return;

    const milestoneData = {
      campaignId: selectedCampaignId,
      title: milestoneForm.title,
      description: milestoneForm.description,
      targetDate: milestoneForm.targetDate ? new Date(milestoneForm.targetDate).toISOString() : null,
      status: milestoneForm.status,
    };

    addMilestoneMutation.mutate(milestoneData);
  };

  if (!account) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connect Your Wallet</AlertTitle>
            <AlertDescription>
              Please connect your wallet to view your profile.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const ngoCampaigns = campaigns?.filter(c => c.creatorType === 'ngo') || [];
  const individualCampaigns = campaigns?.filter(c => c.creatorType === 'individual') || [];
  const totalRaised = campaigns?.reduce((sum, c) => sum + parseFloat(c.raisedAmount || 0), 0) || 0;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground font-mono">{formatWalletAddress(account)}</p>
            </div>
            <Link href="/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {ngoCampaigns.length} NGO, {individualCampaigns.length} Individual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRaised.toFixed(4)} SEP ETH</div>
              <p className="text-xs text-muted-foreground">
                Across all campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Type</CardTitle>
              {ngoCampaigns.length > 0 ? (
                <Building2 className="h-4 w-4 text-muted-foreground" />
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ngoCampaigns.length > 0 ? 'NGO' : 'Individual'}
              </div>
              <p className="text-xs text-muted-foreground">
                {ngoCampaigns.length > 0 ? 'Verified organization' : 'Personal creator'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
            {ngoCampaigns.length > 0 && (
              <>
                <TabsTrigger value="reports">Reports & Updates</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            {campaignsLoading ? (
              <div>Loading campaigns...</div>
            ) : campaigns && campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((campaign) => {
                  const progress = calculateCampaignProgress(campaign.raisedAmount, campaign.goalAmount);
                  const isActive = campaign.isActive && new Date(campaign.deadline) > new Date();

                  return (
                    <Card key={campaign.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{campaign.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {campaign.creatorType === 'ngo' && campaign.ngoName && (
                                <span className="flex items-center gap-1 mb-1">
                                  <Building2 className="h-3 w-3" />
                                  {campaign.ngoName}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Created {new Date(campaign.createdAt).toLocaleDateString()}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge variant={isActive ? "default" : "secondary"}>
                            {isActive ? "Active" : "Ended"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{parseFloat(campaign.raisedAmount).toFixed(4)} SEP ETH</span>
                            <span className="text-muted-foreground">{parseFloat(campaign.goalAmount).toFixed(4)} SEP ETH</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(0)}% funded</p>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/campaign/${campaign.id}`}>
                            <Button variant="outline" size="sm" className="flex-1">
                              View Campaign
                            </Button>
                          </Link>
                          {campaign.creatorType === 'ngo' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedCampaignId(campaign.id);
                                setIsReportDialogOpen(true);
                              }}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Add Report
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first campaign to get started</p>
                  <Link href="/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reports Tab (NGO only) */}
          {ngoCampaigns.length > 0 && (
            <TabsContent value="reports" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Impact Reports</h2>
                <Button onClick={() => setIsReportDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Report
                </Button>
              </div>

              {ngoReports && ngoReports.length > 0 ? (
                <div className="space-y-4">
                  {ngoReports.map((report: any) => (
                    <Card key={report.id}>
                      <CardHeader>
                        <CardTitle>{report.title}</CardTitle>
                        <CardDescription>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                        {report.reportData && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted p-3 rounded">
                              <div className="text-2xl font-bold">{report.reportData.beneficiariesHelped || 0}</div>
                              <div className="text-xs text-muted-foreground">People Helped</div>
                            </div>
                            <div className="bg-muted p-3 rounded">
                              <div className="text-2xl font-bold">{report.reportData.fundsSpent || 0} ETH</div>
                              <div className="text-xs text-muted-foreground">Funds Spent</div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
                    <p className="text-muted-foreground">Add your first impact report</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          {/* Milestones Tab (NGO only) */}
          {ngoCampaigns.length > 0 && (
            <TabsContent value="milestones" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Project Milestones</h2>
                <Button onClick={() => setIsMilestoneDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>

              {ngoMilestones && ngoMilestones.length > 0 ? (
                <div className="space-y-4">
                  {ngoMilestones.map((milestone: any) => (
                    <Card key={milestone.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              {milestone.status === 'completed' ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : milestone.status === 'in-progress' ? (
                                <Clock className="h-5 w-5 text-blue-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{milestone.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                              {milestone.targetDate && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Target: {new Date(milestone.targetDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge 
                            variant={
                              milestone.status === 'completed' ? 'default' : 
                              milestone.status === 'in-progress' ? 'secondary' : 
                              'outline'
                            }
                          >
                            {milestone.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No milestones yet</h3>
                    <p className="text-muted-foreground">Add your first project milestone</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>

        {/* Add Report Dialog */}
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Impact Report</DialogTitle>
              <DialogDescription>
                Share updates about your campaign's impact and progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign">Campaign</Label>
                <select
                  id="campaign"
                  className="w-full mt-1 p-2 border rounded"
                  value={selectedCampaignId || ''}
                  onChange={(e) => setSelectedCampaignId(parseInt(e.target.value))}
                >
                  <option value="">Select a campaign</option>
                  {ngoCampaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="reportTitle">Report Title</Label>
                <Input
                  id="reportTitle"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  placeholder="Q1 2025 Impact Report"
                />
              </div>

              <div>
                <Label htmlFor="reportDesc">Description</Label>
                <Textarea
                  id="reportDesc"
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  placeholder="Describe your progress and impact..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="beneficiaries">Beneficiaries Helped</Label>
                  <Input
                    id="beneficiaries"
                    type="number"
                    value={reportForm.beneficiariesHelped}
                    onChange={(e) => setReportForm({ ...reportForm, beneficiariesHelped: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="fundsSpent">Funds Spent (ETH)</Label>
                  <Input
                    id="fundsSpent"
                    value={reportForm.fundsSpent}
                    onChange={(e) => setReportForm({ ...reportForm, fundsSpent: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Input
                  id="images"
                  value={reportForm.imageUrls}
                  onChange={(e) => setReportForm({ ...reportForm, imageUrls: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddReport} disabled={addReportMutation.isPending}>
                {addReportMutation.isPending ? 'Adding...' : 'Add Report'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Milestone Dialog */}
        <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Milestone</DialogTitle>
              <DialogDescription>
                Track your project's key achievements and goals
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="milestoneCampaign">Campaign</Label>
                <select
                  id="milestoneCampaign"
                  className="w-full mt-1 p-2 border rounded"
                  value={selectedCampaignId || ''}
                  onChange={(e) => setSelectedCampaignId(parseInt(e.target.value))}
                >
                  <option value="">Select a campaign</option>
                  {ngoCampaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="milestoneTitle">Title</Label>
                <Input
                  id="milestoneTitle"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  placeholder="Distribute 1000 meals"
                />
              </div>

              <div>
                <Label htmlFor="milestoneDesc">Description</Label>
                <Textarea
                  id="milestoneDesc"
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  placeholder="Describe this milestone..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={milestoneForm.targetDate}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, targetDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full mt-1 p-2 border rounded"
                  value={milestoneForm.status}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMilestoneDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMilestone} disabled={addMilestoneMutation.isPending}>
                {addMilestoneMutation.isPending ? 'Adding...' : 'Add Milestone'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
