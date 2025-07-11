import React from 'react';
import { Plus
  // , ExternalLink, Github as GitHubIcon 
} from 'lucide-react';
import { CardWrapper } from './CardWrapper';

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
  isLast?: boolean;
  /**
   * Image configuration for tooltip
   */
  imageConfig?: {
    /**
     * Direct image URL (for items with direct image URLs)
     */
    directImageUrl?: string;
    /**
     * Cloudinary configuration (for work/projects)
     */
    cloudinary?: {
      imagesPath: string;
      name: string;
    };
    /**
     * Alt text for the image
     */
    alt: string;
  };
}

/**
 * ListCard component - Reusable card for work and project lists
 * Consistent styling across Work and Project pages
 * Features title, date, summary, navigation to detail page, and optional image tooltips
 */
export const ListCard: React.FC<ListCardProps> = ({
  title,
  dateFrom,
  dateUntil,
  company,
  summary,
  detailLink,
  // github,
  // url,
  className = "",
  isLast = false,
  imageConfig
}) => {
  const displayTitle = title || 'Untitled';
  
  return (
    <CardWrapper 
      to={detailLink}
      imageConfig={imageConfig}
      className={className}
      isLast={isLast}
    >
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold hover:underline">
            {displayTitle}
          </h3>
          <div className="flex items-center gap-x-2 text-sm">
            {/* {github && (
              <a 
                href={github} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`${displayTitle} GitHub Repository`}
                className="text-muted-foreground hover:text-foreground transition-colors z-10 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
            )}
            {url && (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`${displayTitle} Live Website`}
                className="text-muted-foreground hover:text-foreground transition-colors z-10 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )} */}
            <Plus className="h-4 w-4 text-muted-foreground" />
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
      </CardWrapper>
  );
}; 