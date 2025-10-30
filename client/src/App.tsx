
import { QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '@/contexts/WalletContext';
import { Toaster } from '@/components/ui/toaster';
import { Route, Switch } from 'wouter';
import Home from '@/pages/Home';
import Campaign from '@/pages/Campaign';
import Explore from '@/pages/Explore';
import CreateCampaign from '@/pages/CreateCampaign';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/not-found';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { queryClient } from '@/lib/queryClient';
import TaxInfo from '@/pages/tax-info';
import NGOReport from '@/pages/NGOReport';
import HowItWorks from '@/pages/HowItWorks';
import Profile from '@/pages/Profile';

function Router() {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/campaign/:id" component={Campaign} />
        <Route path="/explore" component={Explore} />
        <Route path="/create" component={CreateCampaign} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/tax-info" component={TaxInfo} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/ngo-report/:id" component={NGOReport} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Router />
        <Toaster />
      </WalletProvider>
    </QueryClientProvider>
  );
}
