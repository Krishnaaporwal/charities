import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useWallet } from '@/contexts/WalletContext';
import { CrowdfundingContract } from '@/lib/smartContract';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CampaignSuccessPredictor } from './CampaignSuccessPredictor';
import { FraudRiskChecker } from './FraudRiskChecker';

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { CalendarIcon, Sparkles } from 'lucide-react';

// Form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must not exceed 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description must not exceed 1000 characters"),
  category: z.string().min(1, "Please select a category"),
  goalAmount: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 
    { message: "Goal amount must be a positive number" }
  ),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  deadline: z.date().min(new Date(), "Deadline must be in the future"),
});

type FormData = z.infer<typeof formSchema>;

const CampaignForm = () => {
  const { account, signer } = useWallet();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      goalAmount: '',
      imageUrl: '',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
    },
  });

  const campaignMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!account) {
        throw new Error("Please connect your wallet first");
      }
      
      // 1. First create the campaign on the blockchain
      const contract = new CrowdfundingContract(signer);
      const result = await contract.createCampaign(
        data.title,
        data.description,
        data.goalAmount,
        data.deadline
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // 2. Then store campaign metadata in our API
      const apiData = {
        title: data.title,
        description: data.description,
        category: data.category,
        goalAmount: data.goalAmount,
        imageUrl: data.imageUrl || '',
        deadline: data.deadline,
        creatorId: 1, // Mock ID for now, would come from authenticated user
        walletAddress: account,
      };
      
      const response = await apiRequest('POST', '/api/campaigns', apiData);
      
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Campaign created!",
        description: "Your campaign has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      
      // Redirect to the new campaign page
      navigate(`/campaign/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating campaign",
        description: error.message || "There was an error creating your campaign. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    campaignMutation.mutate(data);
  };

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Connection Required</CardTitle>
          <CardDescription>Please connect your wallet to create a campaign</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Effect to update mediaUrls when imageUrl changes
  useEffect(() => {
    const imageUrl = form.watch('imageUrl');
    if (imageUrl) {
      setMediaUrls([imageUrl]);
    } else {
      setMediaUrls([]);
    }
  }, [form.watch('imageUrl')]);

  // Function to get campaign data for AI analysis
  const getCampaignDataForAnalysis = () => {
    const formData = form.getValues();
    return {
      title: formData.title || '',
      description: formData.description || '',
      goalAmount: formData.goalAmount || '0',
      category: formData.category || 'OTHER',
      mediaUrls: mediaUrls,
      durationInDays: formData.deadline ? 
        Math.ceil((formData.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
        30,
      creatorId: 1 // Mock ID
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create a Campaign</CardTitle>
        <CardDescription>
          Fill in the details below to create your crowdfunding campaign.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">Campaign Form</TabsTrigger>
            <TabsTrigger 
              value="success-predictor" 
              disabled={!form.getValues().title || !form.getValues().description || !form.getValues().goalAmount}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Success Predictor
            </TabsTrigger>
            <TabsTrigger 
              value="fraud-check" 
              disabled={!form.getValues().description || !form.getValues().goalAmount}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Trust & Safety
            </TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the title of your campaign" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your campaign in detail..." 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                            <SelectItem value="EDUCATION">Education</SelectItem>
                            <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                            <SelectItem value="ENVIRONMENT">Environment</SelectItem>
                            <SelectItem value="ENERGY">Energy</SelectItem>
                            <SelectItem value="COMMUNITY">Community</SelectItem>
                            <SelectItem value="ARTS">Arts & Culture</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="goalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Amount (ETH)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Campaign Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        const isValid = 
                          !!form.getValues().title && 
                          !!form.getValues().description && 
                          !!form.getValues().goalAmount;
                          
                        if (isValid) {
                          setActiveTab("success-predictor");
                        } else {
                          toast({
                            title: "Missing required fields",
                            description: "Please fill in title, description, and goal amount",
                            variant: "destructive"
                          });
                        }
                      }}
                      className="flex items-center"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Success Chance
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="crypto-gradient" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="success-predictor">
            <div className="mb-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("form")}
                className="mb-6"
              >
                &larr; Back to Form
              </Button>
              
              <CampaignSuccessPredictor 
                campaignData={getCampaignDataForAnalysis()} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="fraud-check">
            <div className="mb-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("form")}
                className="mb-6"
              >
                &larr; Back to Form
              </Button>
              
              <FraudRiskChecker
                campaignData={{
                  description: form.getValues().description || '',
                  goalAmount: form.getValues().goalAmount || '0'
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
