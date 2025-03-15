import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const waitlistMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest('POST', '/api/waitlist', { email });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist.",
      });
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    waitlistMutation.mutate(email);
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl overflow-hidden shadow-xl shadow-background/50">
          <div className="p-8 sm:p-12 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold">Join the Waitlist</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Be among the first to access our platform when we launch. Get early access and exclusive benefits.
              </p>
              
              <form onSubmit={handleSubmit} className="mt-10 max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow px-4 py-3 rounded-lg bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button 
                    type="submit" 
                    className="px-6 py-3 crypto-gradient text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Get Early Access"}
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>

              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="flex items-center">
                  <div className="text-3xl font-mono font-bold bg-clip-text text-transparent crypto-gradient">250+</div>
                  <div className="ml-2 text-sm text-muted-foreground">Projects<br/>Already Waiting</div>
                </div>
                <div className="h-8 w-px bg-border hidden md:block"></div>
                <div className="flex items-center">
                  <div className="text-3xl font-mono font-bold bg-clip-text text-transparent crypto-gradient">$2M+</div>
                  <div className="ml-2 text-sm text-muted-foreground">Funding<br/>Ready to Deploy</div>
                </div>
                <div className="h-8 w-px bg-border hidden md:block"></div>
                <div className="flex items-center">
                  <div className="text-3xl font-mono font-bold bg-clip-text text-transparent crypto-gradient">5K+</div>
                  <div className="ml-2 text-sm text-muted-foreground">Early<br/>Supporters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
