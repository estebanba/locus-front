import { BackButton } from "@/components/ui/BackButton";
import { Footer } from "@/components/Footer";
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
    <div className="p-4 pt-8 flex flex-col min-h-screen">
      <div className="flex-1 space-y-8">
        <div className="w-full flex justify-start">
          <BackButton variant="text" />
        </div>
        
        <div className="w-full">
          <h1 className="text-3xl font-light mb-4">Skillset</h1>
          
          {/* Explanatory summary section */}
          <div className="mb-8 space-y-4 text-muted-foreground">
            <p className="text-base leading-relaxed">
              My technical expertise spans across <span className="text-foreground">full-stack development</span>, <span className="text-foreground">data analytics</span>, and <span className="text-foreground">architectural design</span>. 
              From frontend frameworks like React and TypeScript to backend technologies including Python and databases, 
              I've worked with diverse tools across web development, machine learning, and design automation.
            </p>
            
           
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-muted-foreground">Loading skills...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <WordCloud words={skills} />
          )}

<div className="mb-8 space-y-4 text-muted-foreground">
            
            
            <p className="text-base leading-relaxed">
              The wordcloud visualizes my technical skills based on real project data. 
              Each word represents a technology, framework, or tool I've used professionally.{' '}
              <span className="text-foreground">Larger words</span> indicate technologies I've used more frequently, 
              while <span className="text-foreground">brighter words</span> represent more recent experience.
            </p>
            
            <p className="text-base leading-relaxed">
              This interactive visualization is built with <span className="text-foreground">React</span> and <span className="text-foreground">TypeScript</span>, 
              using custom algorithms to weight skills by frequency and recency. 
              The data is dynamically pulled from my work and project history via API calls.
              <span className="text-foreground"> Click any word</span> to search for related projects and see how I've applied that technology in practice.
            </p>
          </div>


        </div>
      </div>
      
      <Footer />
    </div>
  );
}; 