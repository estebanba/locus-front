import { BackButton } from "@/components/ui/BackButton";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWorkData, getProjectsData, getEducationData, type WorkItem, type ProjectItem, type EducationItem } from "@/services/api";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";

interface TimelineItem {
  title: string;
  organization: string;
  description: string;
  type: "work" | "project" | "education";
  dateFrom: Date;
  dateUntil?: Date;
  duration: string;
  company?: string;
  detailLink: string;
}

/**
 * Timeline page - Chronological overview of career and key milestones
 * Uses real data from work and projects APIs to create a comprehensive timeline
 * Single continuous line with connected dots for all professional milestones
 * Features clickable items with navigation to detail pages and sorting controls
 */
export const Timeline = () => {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortAscending, setSortAscending] = useState(false); // Descendant by default

  useEffect(() => {
    const fetchDataAndCreateTimeline = async () => {
      try {
        const [workData, projectData, educationData] = await Promise.all([
          getWorkData(),
          getProjectsData(),
          getEducationData()
        ]);

        const timelineItems: TimelineItem[] = [];

        // Add work items
        workData.forEach((item: WorkItem) => {
          const startDate = item.dateFrom ? new Date(item.dateFrom) : new Date();
          const endDate = item.dateUntil ? new Date(item.dateUntil) : undefined;
          
          // Generate detail link for work items
          const projectSlug = item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';
          const companySlug = item.company?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unknown';
          
          timelineItems.push({
            title: item.title,
            organization: item.company || "Unknown Company",
            description: item.summary || item.details?.join(". ") || "Work experience",
            type: "work",
            dateFrom: startDate,
            dateUntil: endDate,
            duration: endDate ? `${endDate.getFullYear()}` : `${startDate.getFullYear()}`,
            company: item.company,
            detailLink: `/work/${companySlug}/${projectSlug}`
          });
        });

        // Add project items
        projectData.forEach((item: ProjectItem) => {
          const startDate = item.dateFrom ? new Date(item.dateFrom) : new Date();
          const endDate = item.dateUntil ? new Date(item.dateUntil) : undefined;
          
          // Generate detail link for project items
          const projectSlug = item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled-project';
          
          timelineItems.push({
            title: item.title,
            organization: "Personal Project",
            description: item.summary || "Personal project exploration",
            type: "project",
            dateFrom: startDate,
            dateUntil: endDate,
            duration: endDate ? `${endDate.getFullYear()}` : `${startDate.getFullYear()}`,
            detailLink: `/projects/${projectSlug}`
          });
        });

        // Add education items
        educationData.forEach((item: EducationItem) => {
          const startDate = item.dateFrom ? new Date(item.dateFrom) : new Date();
          const endDate = item.dateUntil ? new Date(item.dateUntil) : undefined;
          
          timelineItems.push({
            title: item.title,
            organization: item.company || "Unknown Institution",
            description: item.summary || "Education program",
            type: "education",
            dateFrom: startDate,
            dateUntil: endDate,
            duration: endDate ? `${endDate.getFullYear()}` : `${startDate.getFullYear()}`,
            detailLink: `/education/${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
          });
        });

        setTimelineData(timelineItems);
      } catch (error) {
        console.error("Failed to fetch timeline data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndCreateTimeline();
  }, []);

  // Sort timeline data based on current sort direction
  const sortedTimelineData = [...timelineData].sort((a, b) => {
    return sortAscending ? 
      a.dateFrom.getTime() - b.dateFrom.getTime() : 
      b.dateFrom.getTime() - a.dateFrom.getTime();
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading timeline...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-8 flex flex-col min-h-screen">
      <div className="flex-1 space-y-8">
        <div className="w-full flex justify-start">
          <BackButton variant="text" />
        </div>
        
        <div className="w-full">
          <h1 className="text-3xl font-light mb-4">Timeline</h1>
          
          {/* Summary section */}
          <div className="mb-8 space-y-4 text-muted-foreground">
            <p className="text-base leading-relaxed">
              A chronological journey through my professional career, educational background, and key projects.{' '}
              <span className="text-foreground">Click any item</span> to explore detailed information about specific roles, education, and projects.
            </p>
          </div>

          {/* Sort control */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Career Milestones</h2>
            <button 
              onClick={() => setSortAscending(!sortAscending)} 
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
            >
              {sortAscending ? <ChevronUp size={16}/> : <ChevronDown size={16}/>} 
              <span>date</span>
            </button>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Continuous vertical line - positioned to align with dots, brighter in dark mode */}
            <div className="absolute left-20 top-0 bottom-0 w-px bg-border dark:bg-muted-foreground/30" />
            
            <div className="space-y-8">
              {sortedTimelineData.map((item, index) => (
                <div key={index} className="relative flex items-start gap-4 group">
                  {/* Date on the left */}
                  <div className="w-16 text-right text-sm text-muted-foreground flex-shrink-0 pt-1">
                    <div>{item.duration}</div>
                  </div>

                  {/* Timeline dot - exactly on the line */}
                  <div className="relative z-10 flex-shrink-0 pt-2">
                    <div className="w-3 h-3 rounded-full bg-foreground border-2 border-background absolute -left-1.5" />
                  </div>

                  {/* Content with navigation */}
                  <div className="flex-1 min-w-0 pb-2 ml-2 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <Link 
                          to={item.detailLink}
                          className="text-xl font-medium hover:underline transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-muted-foreground">{item.organization}</p>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Navigation arrow */}
                    <Link 
                      to={item.detailLink}
                      className="ml-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`View ${item.title} details`}
                    >
                      <Plus className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}; 