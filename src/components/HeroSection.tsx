import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationLinks } from './ui/NavigationLinks';

interface HeroSectionProps {
  summary: string;
}

/**
 * Hero section component with logo, name, and bio
 * Logo aligned with sidebar's first element, contact section aligned with sidebar bottom
 * Uses clean typography and minimal design with balanced proportions
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ summary }) => {
  // Navigation links for the hero section
  const heroLinks = [
    { text: "more about me", url: "/about" },
    { text: "work", url: "/work" },
    { text: "projects", url: "/projects" },
    { text: "blog", url: "/blog" }
  ];

  return (
    <section className="mb-16">
      {/* Logo container - aligned with sidebar top (Home link) */}
      <div className="mb-6 -ml-[12px]">
        <Link 
          to="/" 
          className="inline-flex items-start justify-start w-18 h-18 hover:opacity-80 transition-opacity duration-200"
          aria-label="Home"
        >
          {/* Actual logo from headLogo.svg */}
          <img 
            src="/headLogo.svg" 
            alt="Esteban Basili Logo" 
            className="w-full h-full object-contain inline-flex items-start justify-start"
          />
        </Link>
      </div>

      {/* Main bio section */}
      <div className="space-y-4">
        {/* Main heading - larger and more prominent like the reference */}
        <h1 className="text-2xl font-light leading-[1.5] text-foreground max-w-2xl">
          <span className="text-foreground font-normal">Esteban Basili</span>. {summary}
        </h1>
        
        {/* Secondary description */}
        {/* <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
          Creating products that bridge data and design to make complex information easier to understand and use.
        </p> */}
      </div>

      {/* Navigation Links - using reusable component */}
      <NavigationLinks links={heroLinks} className="mt-8" />
    </section>
  );
}; 