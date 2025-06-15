import React from 'react';
import { useLocation } from 'react-router-dom';
import { BackButton } from './ui/BackButton';

/**
 * Footer component - Contact and social links
 * Reusable footer with contact information and social media links
 * Designed to be used across all pages for consistent contact access
 */
export const Footer: React.FC = () => {
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  return (
    <footer className="mt-auto pt-16">
      <div className="space-y-4 mb-8">
        {/* <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
          I'm always interested in meaningful projects that challenge conventional thinking and create real impact.
        </p> */}
        
        {/* Contact and Social Links with Back Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          {/* Contact and Social Links */}
          <div className="flex flex-col sm:flex-row gap-3 text-base text-muted-foreground">
            <a
              href="mailto:hello@estebanbasili.com"
              className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit"
            >
              Start a conversation
            </a>
            <a
              href="https://github.com/estebanba"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/estebanbasili"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit"
            >
              LinkedIn
            </a>
          </div>
          
          {/* Back Button - Only show if not on home page */}
          {!isHomePage && (
            <div className="sm:ml-auto">
              <BackButton variant="link" />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}; 