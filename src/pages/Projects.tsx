import { useState, useEffect, Key } from 'react';
import { getProjectsData } from '@/services/api';
import type { ProjectItem } from '@/services/api';
import { BackButton } from "@/components/ui/BackButton";
// Imports for UI components used by the local ProjectCard
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Github, ExternalLink } from "lucide-react";
import { Link } from 'react-router-dom';

export const Projects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjectsData();
        setProjects(data || []);
      } catch (e) {
        console.error("Failed to fetch projects:", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred while fetching projects.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="p-4 pt-8">
        <h2 className="text-3xl tracking-tight mb-4">Projects</h2>
        <p className="text-muted-foreground mb-8">
          A collection of projects I've worked on to learn new technologies and concepts.
        </p>
        <div className="text-center py-10">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-8">
        <h2 className="text-3xl tracking-tight mb-4">Projects</h2>
        <p className="text-muted-foreground mb-8">
          A collection of projects I've worked on to learn new technologies and concepts.
        </p>
        <div className="text-center py-10 text-red-500">Error loading projects: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="w-full">
             <BackButton variant="text" />
        </div>
        
        <h1 className="text-3xl font-bold">Projects</h1>
        
        <p className="text-muted-foreground">
            A collection of projects I've worked on to learn new technologies and concepts.
        </p>
        {projects.length > 0 ? (
            <div className="space-y-8">
            {projects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} />
            ))}
            </div>
        ) : (
            <p className="text-center text-muted-foreground">No projects to display.</p>
        )}
      </div>
    </div>
  );
};

// Restored local ProjectCard component definition
// Ensure ProjectItem type from api.ts has all necessary fields (summary, details, technologies, etc.)
const ProjectCard = ({ project, index }: { project: ProjectItem, index: number }) => {
  return (
    <Card className="w-full border-none shadow-none relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-px after:bg-border pb-2">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`item-${index}`} className="border-none">
          <CardHeader className="px-0 pb-2">
            <div className="mb-2">
              <CardTitle className="mb-2">
                <Link 
                  to={`/projects/${project.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                  className="hover:underline"
                >
                  {project.title}
                </Link>
              </CardTitle>
              {project.summary && <CardDescription className="text-md">{project.summary}</CardDescription>}
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-x-4">
                <p className="text-sm text-muted-foreground">
                  {project.dateFrom} {project.dateUntil ? `- ${project.dateUntil}` : ''}
                  {project.company && ` • ${project.company}`}
                </p>
                <div className="flex items-center gap-x-3">
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`${project.title} GitHub Repository`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`${project.title} Live Website`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              <AccordionTrigger className="p-1 rounded-md hover:bg-accent hover:no-underline [&[data-state=open]>svg]:rotate-45 mr-0">
                <Plus className="h-5 w-5 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
            </div>
          </CardHeader>
          <CardContent className="px-0 pt-2">
            <AccordionContent className="pl-6">
              {project.details && project.details.length > 0 && (
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-6">
                  {project.details.map((detail: string, detailIndex: Key) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.map((tech: string, techIndex: Key) => (
                    <span key={techIndex} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </AccordionContent>
          </CardContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}; 