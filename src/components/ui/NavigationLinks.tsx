import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface NavigationLink {
  text: string;
  url: string;
}

interface NavigationLinksProps {
  links: NavigationLink[];
  className?: string;
}

/**
 * NavigationLinks component - Reusable navigation links with arrow icons
 * Takes an array of link objects with text and url properties
 * Used in HeroSection and About page for consistent navigation styling
 */
export const NavigationLinks: React.FC<NavigationLinksProps> = ({ 
  links, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 text-base text-muted-foreground ${className}`}>
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.url}
          className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit"
        >
          {link.text}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ))}
    </div>
  );
}; 