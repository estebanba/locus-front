import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import workData from '../data/work.json';
import { Globe, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { ExpandableTags } from "@/components/ui/ExpandableTags";

// Interface matching the data structure in work.json
interface Activity {
  title: string;
  summary: string;
  details: string[];
  techStack: string[];
  features: string[];
  type: string;
  labels: string[];
  company: string;
  dateFrom: string;
  dateUntil: string;
  url: string;
  images: string[];
  media: { name: string; url: string; }[];
  github?: string;
}

export const WorkDetail = () => {
  // Get URL parameters from the dynamic route
  const { companyName, projectName } = useParams();
  const [project, setProject] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Format company name for display in back button
  const formattedCompanyName = companyName
    ? companyName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : '';

  useEffect(() => {
    // Find the matching project from the work data
    if (companyName && projectName) {
      // Find project with matching company and title
      const foundProject = workData.find(item => {
        // Create slugs for comparison
        const itemCompanySlug = item.company
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
          
        const itemTitleSlug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
          
        // Compare with URL slugs
        return itemCompanySlug === companyName.toLowerCase() && 
               itemTitleSlug === projectName.toLowerCase();
      });
      
      if (foundProject) {
        setProject(foundProject);
      }
      setLoading(false);
    }
  }, [companyName, projectName]);

  // Show loading state
  if (loading) {
    return <div className="p-4 pt-8">Loading project details...</div>;
  }

  // Show error if project not found
  if (!project) {
    return (
      <div className="p-4 pt-8 flex flex-col space-y-4">
        <h2 className="text-3xl tracking-tight">Project Not Found</h2>
        <p className="text-muted-foreground">
          The project you're looking for doesn't exist or may have been moved.
        </p>
        <BackButton text={`Back to ${formattedCompanyName || 'Work'}`} variant="text" />
      </div>
    );
  }

  return (
    <div className="p-4 pt-8 flex flex-col space-y-8">
      {/* Back button */}
      <BackButton text={`Back to ${formattedCompanyName}`} variant="text" />

      {/* Project header */}
      <div className="w-full">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl tracking-tight">{project.title}</h1>
          <div className="text-muted-foreground">
            {project.dateFrom} {project.dateUntil ? `- ${project.dateUntil}` : ''}
          </div>
        </div>
        <h2 className="text-xl text-muted-foreground mb-4">{project.company}</h2>
        <p className="text-lg mb-8">{project.summary}</p>
      </div>

      {/* Project details */}
      <div className="w-full">
        <h3 className="text-xl mb-4">Project Details</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-3 mb-8 pl-6">
          {project.details.map((detail, index) => (
            <li className="text-md" key={index}>{detail}</li>
          ))}
        </ul>
      </div>

      {/* Project images (if available) */}
      {project.images && project.images.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${project.title} - image ${index + 1}`} 
                className="rounded-md w-full h-auto object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {/* Tech stack (if available) */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Tech Stack</h3>
          <ExpandableTags tags={project.techStack} />
        </div>
      )}

      {/* Features (if available) */}
      {project.features && project.features.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Features</h3>
          <ExpandableTags tags={project.features} />
        </div>
      )}

      {/* Media mentions (if available) */}
      {project.media && project.media.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Featured On</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.media.map((mediaItem, index) => (
              <a
                key={index}
                href={mediaItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-secondary/30 text-muted-foreground px-3 py-1 rounded-md hover:bg-secondary/50"
              >
                <Globe className="h-4 w-4 mr-2" />
                {mediaItem.name}
              </a>
            ))}
          </div>
        </div>
      )}
      
      {/* External links */}
      <div className="w-full flex flex-wrap gap-4">
        {project.url && (
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button className="gap-2">
              <Globe className="h-4 w-4" />
              Visit Project
            </Button>
          </a>
        )}
        
        {project.github && (
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button variant="outline" className="gap-2">
              <Github className="h-4 w-4" />
              View Code
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}; 