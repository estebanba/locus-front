import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  summary: string;
}

/**
 * Hero section component with logo, name, and bio
 * Logo aligned with sidebar's first element, contact section aligned with sidebar bottom
 * Uses clean typography and minimal design with balanced proportions
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ summary }) => {
  return (
    <section className="mb-16">
      {/* Logo container - aligned with sidebar top (Home link) */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center w-12 h-12 hover:opacity-80 transition-opacity duration-200"
          aria-label="Home"
        >
          {/* Actual logo from headLogo.svg */}
          <img 
            src="/headLogo.svg" 
            alt="Esteban Basili Logo" 
            className="w-full h-full object-contain"
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

      {/* Navigation Links - responsive with tighter spacing */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 text-base text-muted-foreground">
        <Link
          to="/about"
          className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit"
        >
          Know more about me
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit"
        >
          See my work
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit"
        >
          Take a look at my projects
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}; 