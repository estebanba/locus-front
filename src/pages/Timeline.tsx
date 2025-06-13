import { BackButton } from "@/components/ui/BackButton";
import { useState, useEffect } from "react";
import { getWorkData, getProjectsData, type WorkItem, type ProjectItem } from "@/services/api";

interface TimelineItem {
  title: string;
  organization: string;
  description: string;
  type: "work" | "project";
  dateFrom: Date;
  dateUntil?: Date;
  duration: string;
}

/**
 * Timeline page - Chronological overview of career and key milestones
 * Uses real data from work and projects APIs to create a comprehensive timeline
 * Single continuous line with connected dots for all professional milestones
 */
export const Timeline = () => {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAndCreateTimeline = async () => {
      try {
        const [workData, projectData] = await Promise.all([
          getWorkData(),
          getProjectsData()
        ]);

        const timelineItems: TimelineItem[] = [];

        // Add work items
        workData.forEach((item: WorkItem) => {
          const startDate = item.dateFrom ? new Date(item.dateFrom) : new Date();
          const endDate = item.dateUntil ? new Date(item.dateUntil) : undefined;
          
          timelineItems.push({
            title: item.title,
            organization: item.company || "Unknown Company",
            description: item.summary || item.details?.join(". ") || "Work experience",
            type: "work",
            dateFrom: startDate,
            dateUntil: endDate,
            duration: endDate ? 
              `${endDate.getFullYear()}` : 
              `${startDate.getFullYear()}`
          });
        });

        // Add project items
        projectData.forEach((item: ProjectItem) => {
          const startDate = item.dateFrom ? new Date(item.dateFrom) : new Date();
          const endDate = item.dateUntil ? new Date(item.dateUntil) : undefined;
          
          timelineItems.push({
            title: item.title,
            organization: "Personal Project",
            description: item.summary || "Personal project exploration",
            type: "project",
            dateFrom: startDate,
            dateUntil: endDate,
            duration: endDate ? 
              `${endDate.getFullYear()}` : 
              `${startDate.getFullYear()}`
          });
        });

        // Sort by date (most recent first)
        const sortedTimeline = timelineItems.sort((a, b) => 
          b.dateFrom.getTime() - a.dateFrom.getTime()
        );

        setTimelineData(sortedTimeline);
      } catch (error) {
        console.error("Failed to fetch timeline data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndCreateTimeline();
  }, []);

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
    <div className="p-4 pt-8 flex flex-col space-y-8">
      <div className="w-full flex justify-start">
        <BackButton variant="text" />
      </div>
      
      <div className="w-full">
        <h1 className="text-3xl font-light mb-4">Timeline</h1>

        {/* Timeline */}
        <div className="relative">
          {/* Continuous vertical line - positioned to align with dots */}
          <div className="absolute left-20 top-0 bottom-0 w-px bg-border" />
          
          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <div key={index} className="relative flex items-start gap-4">
                {/* Date on the left */}
                <div className="w-16 text-right text-sm text-muted-foreground flex-shrink-0 pt-1">
                  <div>{item.duration}</div>
                </div>

                {/* Timeline dot - exactly on the line */}
                <div className="relative z-10 flex-shrink-0 pt-2">
                  <div className="w-3 h-3 rounded-full bg-foreground border-2 border-background absolute -left-1.5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2 ml-2">
                  <div className="mb-2">
                    <h3 className="text-xl font-medium">{item.title}</h3>
                    <p className="text-muted-foreground">{item.organization}</p>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        {/* <div className="pt-16 border-t border-border mt-16">
          <p className="text-sm text-muted-foreground">
            This timeline represents key milestones in my journey bridging design, technology, and data.
          </p>
        </div> */}
      </div>
    </div>
  );
}; 