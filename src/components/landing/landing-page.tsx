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
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased overflow-x-hidden selection:bg-limeGreen selection:text-forestGreen">
      {/* Top Navigation */}
      <LandingNav />

      {/* Main Sections */}
      <main>
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
