"use client";

import React from "react";
import { LandingNav } from "./landing-nav";
import { HeroSection } from "./hero-section";
import { ProblemSection } from "./problem-section";
import { HowItWorksSection } from "./how-it-works-section";
import { MapPreviewSection } from "./map-preview-section";
import { TargetAudienceSection } from "./target-audience-section";
import { SocialProofSection } from "./social-proof-section";
import { InstitutionalSection } from "./institutional-section";
import { LandingFooter } from "./landing-footer";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mintGreen via-grey50 to-white dark:from-forestGreen dark:via-grey900 dark:to-black text-foreground dark:text-grey50 font-sans antialiased overflow-x-hidden selection:bg-limeGreen selection:text-forestGreen relative transition-colors duration-500">
      {/* Ambient Background Glows — mesmo efeito da página de Login */}
      <div className="fixed top-[15%] right-[5%] w-[40vw] max-w-[500px] aspect-square rounded-full bg-limeGreen/15 dark:bg-limeGreen/10 filter blur-3xl pointer-events-none z-0 animate-pulse" />
      <div className="fixed bottom-[20%] left-[5%] w-[40vw] max-w-[500px] aspect-square rounded-full bg-forestGreen/10 dark:bg-forestGreen/35 filter blur-3xl pointer-events-none z-0" />

      {/* Top Navigation */}
      <LandingNav />

      {/* Main Sections */}
      <main className="relative z-10">
        {/* 1. Hero Presentational Area */}
        <HeroSection />

        {/* 2. Scientific Problem Data */}
        <ProblemSection />

        {/* 3. Steps of reporting flow */}
        <HowItWorksSection />

        {/* 4. Live interactive preview mapping */}
        <MapPreviewSection />

        {/* 5. exposed social targets */}
        <TargetAudienceSection />

        {/* 6. Acceptance statistical proofs */}
        <SocialProofSection />

        {/* 7. Institutional alignment & SDGs */}
        <InstitutionalSection />
      </main>

      {/* Footer & download */}
      <LandingFooter />
    </div>
  );
};
