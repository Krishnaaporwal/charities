import { QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '@/contexts/WalletContext';
import { Toaster } from '@/components/ui/toaster';
import { Route, Switch } from 'wouter';
import Home from '@/pages/Home';
import Campaign from '@/pages/Campaign';
import Explore from '@/pages/Explore';
import NotFound from '@/pages/not-found';
import Navbar from '@/components/layout/Navbar';
import { queryClient } from '@/lib/react-query';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <div>
          <Navbar />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/explore" component={Explore} />
            <Route path="/campaign/:id" component={Campaign} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </WalletProvider>
    </QueryClientProvider>
  );
}