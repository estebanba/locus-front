import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Github, ExternalLink } from 'lucide-react';

interface ListCardProps {
  title: string | null | undefined;
  dateFrom?: string | null;
  dateUntil?: string | null;
  company?: string | null;
  summary?: string | null;
  detailLink: string;
  github?: string | null;
  url?: string | null;
  className?: string;
}

/**
 * ListCard component - Reusable card for work and project lists
 * Consistent styling across Work and Project pages
 * Features title, date, summary, and navigation to detail page
 */
export const ListCard: React.FC<ListCardProps> = ({
  title,
  dateFrom,
  dateUntil,
  company,
  summary,
  detailLink,
  github,
  url,
  className = ""
}) => {
  const displayTitle = title || 'Untitled';
  
  return (
    <div className={`py-4 border-b border-border last:border-b-0 ${className}`}>
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-lg font-semibold">
          <Link 
            to={detailLink}
            className="hover:underline"
          >
            {displayTitle}
          </Link>
        </h3>
        <div className="flex items-center gap-x-2 text-sm">
          {github && (
            <a 
              href={github} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`${displayTitle} GitHub Repository`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {url && (
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`${displayTitle} Live Website`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <Link 
            to={detailLink}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
            aria-label={`View ${displayTitle} details`}
          >
            <Plus className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        {dateFrom || ''} {dateUntil ? `- ${dateUntil}` : ''}
        {company && ` • ${company}`}
      </p>
      {summary && (
        <p className="text-sm text-muted-foreground">
          {summary}
        </p>
      )}
    </div>
  );
}; 