import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectsData } from '@/services/api'; // UPDATED: Import from api.ts
import type { ProjectItem as Project } from '@/services/api'; // UPDATED: Import type, alias as Project
import { Globe, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { ExpandableTags } from "@/components/ui/ExpandableTags";

// Interface matching the data structure (assuming ProjectItem from api.ts is compatible)
// If ProjectItem is not detailed enough, you might need to refine it in api.ts
// or use a more specific local type and cast, e.g. const projectsData = await getProjectsData() as LocalProject[];

export const ProjectDetail = () => {
  const { projectName } = useParams<{ projectName: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectName) {
        setLoading(false);
        setError("Project name not provided in URL.");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        
        const projectsData = await getProjectsData(); // NEW: Use service function

        const foundProject = projectsData.find(item => {
          const itemTitleSlug = item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';
          return itemTitleSlug === projectName.toLowerCase();
        });

        if (foundProject) {
          setProject(foundProject);
        } else {
          setError("Project not found.");
        }
      } catch (e) {
        console.error("Failed to fetch project details:", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectName]);

  // Show loading state
  if (loading) {
    return <div className="p-4 pt-8">Loading project details...</div>;
  }

  if (error) {
    return <div className="p-4 pt-8 text-red-500">Error: {error}</div>;
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
        <div className="mb-2">
          <h1 className="text-3xl tracking-tight">{project.title}</h1>
          <div className="text-muted-foreground">
            {project.dateFrom} {project.dateUntil ? `- ${project.dateUntil}` : ''}
          </div>
        </div>
        {project.company && (
          <h2 className="text-xl text-muted-foreground mb-4">{project.company}</h2>
        )}
        <p className="text-lg mb-8">{project.summary ? project.summary : 'No summary available.'}</p>
      </div>

      {/* Project details */}
      {project.details && project.details.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Project Details</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-3 mb-8 pl-6">
            {project.details.map((detail, index) => (
              <li className="text-md" key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Project images (if available) */}
      {project.images && Array.isArray(project.images) && project.images.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl mb-4">Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.images.map((image: string, index: number) => (
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