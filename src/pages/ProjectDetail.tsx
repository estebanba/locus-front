import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import projectsData from '../data/projects.json';
import { Globe, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { ExpandableTags } from "@/components/ui/ExpandableTags";

// Interface matching the data structure in projects.json
interface Project {
  title: string;
  summary: string;
  details: string[];
  technologies: string[];
  type: string;
  labels: string[];
  company: string | null;
  dateFrom: string;
  dateUntil: string;
  url: string;
  images: string[];
  media: string[];
  github?: string;
}

export const ProjectDetail = () => {
  // Get URL parameters from the dynamic route
  const { projectName } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the matching project from the projects data
    if (projectName) {
      // Find project with matching title (more flexible matching)
      const foundProject = projectsData.find(item => {
        // Create a slug from the item title for comparison - handle special characters
        const itemSlug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric chars with dash
          .replace(/^-|-$/g, '');       // Remove leading/trailing dashes
          
        // Compare with the URL slug
        return itemSlug === projectName.toLowerCase();
      });
      
      if (foundProject) {
        setProject(foundProject);
      }
      setLoading(false);
    }
  }, [projectName]);

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
        <BackButton text="Back to Projects" variant="text" />
      </div>
    );
  }

  return (
    <div className="p-4 pt-8 flex flex-col space-y-8">
      {/* Back button */}
      <BackButton text="Back to Projects" variant="text" />

      {/* Project header */}
      <div className="w-full">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl tracking-tight">{project.title}</h1>
          <div className="text-muted-foreground">
            {project.dateFrom} {project.dateUntil ? `- ${project.dateUntil}` : ''}
          </div>
        </div>
        {project.company && (
          <h2 className="text-xl text-muted-foreground mb-4">{project.company}</h2>
        )}
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

      {/* Technologies used */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Technologies</h3>
          <ExpandableTags tags={project.technologies} />
        </div>
      )}

      {/* Labels */}
      {project.labels && project.labels.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Categories</h3>
          <ExpandableTags tags={project.labels} />
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