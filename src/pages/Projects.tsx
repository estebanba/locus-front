import { useState, useEffect } from 'react';
import { getProjectsData } from '@/services/api';
import type { ProjectItem } from '@/services/api';
import { BackButton } from "@/components/ui/BackButton";
import { ListCard } from "@/components/ui/ListCard";
import { Footer } from "@/components/Footer";

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
      <div className="p-4 pt-8 flex flex-col min-h-screen">
        <div className="flex-1">
          <BackButton variant="text" />
          <h2 className="text-3xl tracking-tight mb-4 mt-8">Projects</h2>
          <p className="text-muted-foreground mb-8">
            A collection of projects I've worked on to learn new technologies and concepts.
          </p>
          <div className="text-center py-10">Loading projects...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-8 flex flex-col min-h-screen">
        <div className="flex-1">
          <BackButton variant="text" />
          <h2 className="text-3xl tracking-tight mb-4 mt-8">Projects</h2>
          <p className="text-muted-foreground mb-8">
            A collection of projects I've worked on to learn new technologies and concepts.
          </p>
          <div className="text-center py-10 text-red-500">Error loading projects: {error}</div>
        </div>
        <Footer />
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
          <h1 className="text-3xl tracking-tight mb-4">Projects</h1>
          <p className="text-muted-foreground mb-8">
            A collection of projects I've worked on to learn new technologies and concepts.
          </p>
        </div>

        <div className="w-full">
          {projects.length > 0 ? (
            <div className="space-y-0">
              {projects.map((project, index) => (
                <ListCard
                  key={index}
                  title={project.title}
                  dateFrom={project.dateFrom}
                  dateUntil={project.dateUntil}
                  company={project.company}
                  summary={project.summary}
                  detailLink={`/projects/${project.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled-project'}`}
                  github={project.github}
                  url={project.url}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No projects to display.</p>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}; 