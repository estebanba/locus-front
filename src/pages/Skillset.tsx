import { BackButton } from "@/components/ui/BackButton";
import { WordCloud } from "@/components/WordCloud";
import { useState, useEffect } from "react";
import { getWorkData, getProjectsData, type WorkItem, type ProjectItem } from "@/services/api";

/**
 * Skillset page - Minimal overview of technical skills using a word cloud
 * Pulls skills data from real work and project data via API
 * Single word cloud visualization with recency weighting
 */
export const Skillset = () => {
  const [skills, setSkills] = useState<Array<{ text: string; value: number; recency?: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataAndGenerateSkills = async () => {
      try {
        const [workData, projectData] = await Promise.all([
          getWorkData(),
          getProjectsData()
        ]);

        // Collect all skills/technologies from work and project data with recency
        const skillMap = new Map<string, { value: number; recency: number }>();
        const currentYear = new Date().getFullYear();

        // Calculate recency score (0-100) based on how recent the work is
        const calculateRecency = (dateFrom: string | undefined) => {
          if (!dateFrom) return 0;
          const workYear = new Date(dateFrom).getFullYear();
          const yearsAgo = currentYear - workYear;
          // More recent work gets higher score (max 100 for current year, decreases over time)
          return Math.max(0, 100 - (yearsAgo * 15));
        };

        // Extract from work data
        workData.forEach((item: WorkItem) => {
          const recency = calculateRecency(item.dateFrom);
          
          // Add tech stack items
          if (item.techStack) {
            item.techStack.forEach(tech => {
              const current = skillMap.get(tech) || { value: 0, recency: 0 };
              skillMap.set(tech, { 
                value: current.value + 3, // Higher weight for work items
                recency: Math.max(current.recency, recency) // Use highest recency
              });
            });
          }
          
          // Add labels as skills
          if (item.labels) {
            item.labels.forEach(label => {
              const current = skillMap.get(label) || { value: 0, recency: 0 };
              skillMap.set(label, { 
                value: current.value + 2,
                recency: Math.max(current.recency, recency)
              });
            });
          }

          // Company names removed from word cloud
        });

        // Extract from project data
        projectData.forEach((item: ProjectItem) => {
          const recency = calculateRecency(item.dateFrom);
          
          // Add technologies
          if (item.technologies) {
            item.technologies.forEach(tech => {
              const current = skillMap.get(tech) || { value: 0, recency: 0 };
              skillMap.set(tech, { 
                value: current.value + 2, // Lower weight for project items
                recency: Math.max(current.recency, recency)
              });
            });
          }
          
          // Add labels
          if (item.labels) {
            item.labels.forEach(label => {
              const current = skillMap.get(label) || { value: 0, recency: 0 };
              skillMap.set(label, { 
                value: current.value + 1,
                recency: Math.max(current.recency, recency)
              });
            });
          }
        });

        // Convert to array and sort by weighted value (value * recency factor)
        const skillsArray = Array.from(skillMap.entries())
          .map(([text, data]) => ({ 
            text, 
            value: data.value, 
            recency: data.recency 
          }))
          .sort((a, b) => {
            const aWeighted = a.value * (1 + a.recency / 100);
            const bWeighted = b.value * (1 + b.recency / 100);
            return bWeighted - aWeighted;
          })
          .slice(0, 50); // Limit to top 50 skills

        setSkills(skillsArray);
      } catch (error) {
        console.error("Failed to fetch skills data:", error);
        setError("Failed to fetch skills data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndGenerateSkills();
  }, []);

  return (
    <div className="p-4 pt-8 flex flex-col space-y-8">
      <div className="w-full flex justify-start">
        <BackButton variant="text" />
      </div>
      
      <div className="w-full">
        <h1 className="text-3xl font-light mb-4">Skillset</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading skills...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <WordCloud words={skills} />
        )}
      </div>
    </div>
  );
}; 