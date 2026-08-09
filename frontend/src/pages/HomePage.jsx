import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { SoftwareSection } from '../components/SoftwareSection';
import { EcommerceSection } from '../components/EcommerceSection';
import { FreelancerSection } from '../components/FreelancerSection';
import { BlogSection } from '../components/BlogSection';

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <SoftwareSection />
      <EcommerceSection />
      <FreelancerSection />
      <BlogSection />
    </>
  );
};
