import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Campaign } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import ModelTraining from '@/components/admin/ModelTraining';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, MoreVertical, AlertTriangle, Check, X, Settings } from 'lucide-react';
import { Link } from 'wouter';

const Admin: React.FC = () => {
  const { account } = useWallet();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFee, setPlatformFee] = useState('2.5');
  const [blacklistedWallet, setBlacklistedWallet] = useState('');
  const [adminAccess, setAdminAccess] = useState(false);
  
  // Check if user is an admin - in a real app this would be verified via backend
  const checkAdminAccess = () => {
    // Mock check - in production this would verify with backend
    if (account === '0x1234567890abcdef') {
      setAdminAccess(true);
      return true;
    }
    return false;
  };

  // Simulating admin access request
  const requestAdminAccess = () => {
    const isAdmin = checkAdminAccess();
    if (isAdmin) {
      toast({
        title: "Admin Access Granted",
        description: "You now have access to the admin panel",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
    }
  };

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['/api/campaigns'],
    refetchOnWindowFocus: false,
  });

  const handleUpdatePlatformFee = () => {
    // This would actually update a smart contract or backend configuration
    toast({
      title: "Platform Fee Updated",
      description: `Platform fee has been set to ${platformFee}%`,
    });
  };

  const handleBlacklistWallet = () => {
    if (!blacklistedWallet || !blacklistedWallet.startsWith('0x')) {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid Ethereum wallet address",
        variant: "destructive",
      });
      return;
    }
    
    // This would blacklist the wallet in the backend
    toast({
      title: "Wallet Blacklisted",
      description: `Wallet ${blacklistedWallet} has been blacklisted`,
    });
    setBlacklistedWallet('');
  };

  const handleToggleCampaignStatus = (campaignId: number, currentStatus: boolean) => {
    // This would update the campaign status in the backend
    toast({
      title: `Campaign ${currentStatus ? 'Deactivated' : 'Activated'}`,
      description: `Campaign ID: ${campaignId} has been ${currentStatus ? 'deactivated' : 'activated'}`,
    });
    
    // In a real implementation, we would also invalidate the query cache
    queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
  };

  // Filter campaigns based on search query
  const filteredCampaigns = campaigns?.filter((campaign: Campaign) => 
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!account) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="mt-2 text-muted-foreground">Connect your wallet to access the admin panel</p>
          <div className="mt-6">
            <Button
              onClick={() => document.querySelector('[data-implementation="Show wallet connection modal"]')?.dispatchEvent(new Event('click'))}
              className="crypto-gradient"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!adminAccess) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              You need admin privileges to access this section
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <p className="mb-4 text-center">
              If you're an admin, please verify your wallet to continue.
            </p>
            <Button onClick={requestAdminAccess}>
              Verify Admin Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage platform campaigns and settings</p>
        </div>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="ml-training">AI Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>
                Monitor and manage all campaigns on the platform
              </CardDescription>
              <div className="mt-4">
                <Input 
                  placeholder="Search campaigns..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : error ? (
                <div className="text-center text-destructive">
                  Failed to load campaigns. Please try again.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Raised</TableHead>
                        <TableHead>Goal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns?.map((campaign: Campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>{campaign.id}</TableCell>
                          <TableCell className="font-medium">{campaign.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{campaign.category}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {campaign.walletAddress.substring(0, 6)}...{campaign.walletAddress.substring(38)}
                          </TableCell>
                          <TableCell>{campaign.raisedAmount} ETH</TableCell>
                          <TableCell>{campaign.goalAmount} ETH</TableCell>
                          <TableCell>
                            <Badge variant={campaign.isActive ? "default" : "secondary"}>
                              {campaign.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Link href={`/campaign/${campaign.id}`}>
                                    <div className="flex items-center w-full">
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>View Campaign</span>
                                    </div>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleCampaignStatus(campaign.id, campaign.isActive)}>
                                  {campaign.isActive ? (
                                    <>
                                      <X className="mr-2 h-4 w-4" />
                                      <span>Deactivate</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check className="mr-2 h-4 w-4" />
                                      <span>Activate</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                      <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                                      <span className="text-destructive">Flag as Scam</span>
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Flag Campaign as Scam?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will immediately deactivate the campaign and prevent further donations.
                                        Are you sure you want to proceed?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction className="bg-destructive">
                                        Flag as Scam
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredCampaigns?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6">
                            No campaigns found matching your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure platform-wide settings and fees
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="platform-fee"
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="10"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button onClick={handleUpdatePlatformFee}>Update</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This fee is taken from successfully funded campaigns
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-approval" />
                    <Label htmlFor="auto-approval">Auto-approve new campaigns</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When disabled, new campaigns will require manual approval
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="maintenance-mode" />
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When enabled, the platform will be in read-only mode
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
                <CardDescription>
                  Overview of platform metrics and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Campaigns</p>
                    <p className="text-2xl font-bold">{campaigns?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Raised</p>
                    <p className="text-2xl font-bold">
                      {campaigns?.reduce((sum: number, campaign: Campaign) => 
                        sum + parseFloat(campaign.raisedAmount), 0).toFixed(2)
                      } ETH
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Campaigns</p>
                    <p className="text-2xl font-bold">
                      {campaigns?.filter((c: Campaign) => c.isActive).length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Platform Fees Collected</p>
                    <p className="text-2xl font-bold">
                      {((campaigns?.reduce((sum: number, campaign: Campaign) => 
                        sum + parseFloat(campaign.raisedAmount), 0) || 0) * 
                        parseFloat(platformFee) / 100).toFixed(2)
                      } ETH
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Controls</CardTitle>
              <CardDescription>
                Manage security settings and blacklisted wallets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="blacklist-wallet">Blacklist Wallet Address</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="blacklist-wallet"
                    placeholder="0x..."
                    value={blacklistedWallet}
                    onChange={(e) => setBlacklistedWallet(e.target.value)}
                    className="font-mono"
                  />
                  <Button onClick={handleBlacklistWallet} variant="destructive">Blacklist</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Blacklisted wallets will not be able to create campaigns or donate
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label>Smart Contract Withdrawal Delay</Label>
                    <p className="text-xs text-muted-foreground">
                      Enforce a 24-hour delay for large withdrawals
                    </p>
                  </div>
                  <Switch id="withdrawal-delay" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label>Scam Detection</Label>
                    <p className="text-xs text-muted-foreground">
                      Use AI to automatically detect potentially fraudulent campaigns
                    </p>
                  </div>
                  <Switch id="scam-detection" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label>Large Donation Alert</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when donations exceed 5 ETH
                    </p>
                  </div>
                  <Switch id="large-donation-alert" defaultChecked />
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({
                    title: "Security Audit Started",
                    description: "A security audit of all campaigns has been initiated",
                  })}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Run Security Audit
                  </Button>
                  
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({
                    title: "Smart Contract Synced",
                    description: "Platform data has been synced with the blockchain",
                  })}>
                    <Settings className="mr-2 h-4 w-4" />
                    Sync Smart Contract
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ml-training" className="pt-6">
          <ModelTraining />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
