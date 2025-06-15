import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEducationData } from '@/services/api';
import type { EducationItem as Education } from '@/services/api';
import { Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { ExpandableTags } from "@/components/ui/ExpandableTags";
import { Footer } from "@/components/Footer";

/**
 * EducationDetail page - Shows detailed information about specific educational programs
 * Fetches data from education.json via API
 * URL pattern: /education/:course
 * Used for displaying details about bootcamps, degrees, and certifications
 */
export const EducationDetail = () => {
  const { course } = useParams<{ course: string }>();
  const [education, setEducation] = useState<Education | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducationDetails = async () => {
      if (!course) {
        setLoading(false);
        setError("Course name not provided in URL.");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        
        const educationData = await getEducationData();

        const foundEducation = educationData.find(item => {
          const itemTitleSlug = item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';
          return itemTitleSlug === course.toLowerCase();
        });

        if (foundEducation) {
          setEducation(foundEducation);
        } else {
          setError("Education program not found.");
        }
      } catch (e) {
        console.error("Failed to fetch education details:", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEducationDetails();
  }, [course]);

  // Show loading state
  if (loading) {
    return <div className="p-4 pt-8">Loading education details...</div>;
  }

  if (error) {
    return <div className="p-4 pt-8 text-red-500">Error: {error}</div>;
  }

  // Show error if education program not found
  if (!education) {
    return (
      <div className="p-4 pt-8 flex flex-col space-y-4">
        <h2 className="text-3xl tracking-tight">Education Program Not Found</h2>
        <p className="text-muted-foreground">
          The education program you're looking for doesn't exist or may have been moved.
        </p>
        <BackButton text="Back to Timeline" variant="text" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 pt-8 flex flex-col space-y-8">
        {/* Back button */}
        <BackButton text="Back to Timeline" variant="text" />

        {/* Education header */}
        <div className="w-full">
          <div className="mb-2">
            <h1 className="text-3xl tracking-tight">{education.title}</h1>
            <div className="text-muted-foreground">
              {education.dateFrom} {education.dateUntil ? `- ${education.dateUntil}` : ''}
            </div>
          </div>
          {education.company && (
            <h2 className="text-xl text-muted-foreground mb-4">{education.company}</h2>
          )}
          <p className="text-lg mb-8">{education.summary || 'No summary available.'}</p>
        </div>

        {/* Education details */}
        {education.details && education.details.length > 0 && (
          <div className="w-full">
            <h3 className="text-xl mb-4">Curriculum Details</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-3 mb-8 pl-6">
              {education.details.map((detail, index) => (
                <li className="text-md" key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {education.techStack && education.techStack.length > 0 && (
          <div className="w-full">
            <h3 className="text-xl mb-4">Technologies Learned</h3>
            <ExpandableTags tags={education.techStack} />
          </div>
        )}

        {/* Labels */}
        {education.labels && education.labels.length > 0 && (
          <div className="w-full">
            <h3 className="text-xl mb-4">Categories</h3>
            <ExpandableTags tags={education.labels} />
          </div>
        )}

        {/* Media links */}
        {education.media && education.media.length > 0 && (
          <div className="w-full">
            <h3 className="text-xl mb-4">Featured In</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {education.media.map((mediaItem, index) => (
                <a
                  key={index}
                  href={mediaItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50 px-3 py-2 rounded-md transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {mediaItem.name}
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* External links */}
        <div className="w-full flex flex-wrap gap-4">
          {education.url && (
            <a 
              href={education.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button className="gap-2">
                <Globe className="h-4 w-4" />
                Visit Program
              </Button>
            </a>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}; 