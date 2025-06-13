import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeaturedItem {
  title: string;
  subtitle?: string;
  description: string;
  type: "work" | "project" | "experiment" | "photography";
  link: string;
  isExternal?: boolean;
  year?: string;
}

interface FeaturedSectionProps {
  items: FeaturedItem[];
}

/**
 * FeaturedSection component - Showcases latest and most relevant work
 * Displays a curated selection of work, projects, experiments, and photography
 * Uses visual identity consistent with WorkCompanyDetail component
 * 
 * @param items - Array of featured items to display
 */
export const FeaturedSection = ({ items }: FeaturedSectionProps) => {
  const capitalizeType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <section className="w-full space-y-2">
      {/* Section header */}
      <div>
        <h2 className="text-xl font-medium tracking-tight mb-2">Featured</h2>
        <p className="text-muted-foreground">
          A selection of recent work and explorations
        </p>
      </div>

      {/* Featured items single column */}
      <div className="space-y-0">
        {items.map((item, index) => (
          <div
            key={index}
            className="py-4 border-b border-border last:border-b-0"
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-semibold">
                {item.isExternal ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link
                    to={item.link}
                    className="hover:underline"
                  >
                    {item.title}
                  </Link>
                )}
              </h3>
              {/* <div className="flex items-center gap-x-2 text-sm">
                <span className="text-muted-foreground">
                  {capitalizeType(item.type)}
                </span>
                {item.year && (
                  <span className="text-muted-foreground">
                    {item.year}
                  </span>
                )}
              </div> */}
            </div>
            
            {item.subtitle && (
              <p className="text-sm text-muted-foreground mb-2">
                {item.subtitle}
              </p>
            )}
            
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* View all link */}
      <div className="pt-4">
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-lg font-medium underline decoration-1 underline-offset-4 hover:text-foreground hover:no-underline transition-colors"
        >
          View all work
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}; 