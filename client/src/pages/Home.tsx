import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCampaigns from '@/components/home/FeaturedCampaigns';
import HowItWorks from '@/components/home/HowItWorks';
import WaitlistSection from '@/components/home/WaitlistSection';
import FAQ from '@/components/home/FAQ';

const Home: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedCampaigns />
      <HowItWorks />
      <WaitlistSection />
      <FAQ />
    </div>
  );
};

export default Home;
