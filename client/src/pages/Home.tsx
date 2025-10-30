import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCampaigns from '@/components/home/FeaturedCampaigns';
import HowItWorks from '@/components/home/HowItWorks';
import WaitlistSection from '@/components/home/WaitlistSection';
import FAQ from '@/components/home/FAQ';
import NGOShowcase from '@/components/home/NGOShowcase';

const Home: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedCampaigns />
      <HowItWorks />
      <WaitlistSection />
      <FAQ />
      <NGOShowcase />
    </div>
  );
};

export default Home;
