import { Key } from 'react'; 
import projectsData from '../data/projects.json';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Plus, Github, ExternalLink } from "lucide-react";
import { Link } from 'react-router-dom';

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

export function Projects() {
  return (
    <div className="p-4 pt-8 flex flex-col items-end space-y-8">
      <div className="w-full">
        <h2 className="text-3xl tracking-tight mb-4">Projects</h2>
        <p className="text-muted-foreground">
          Here are some of the personal and conceptual projects I've worked on.
        </p>
      </div>

      {projectsData.map((project, index) => (
        <ProjectCard key={index} project={project} index={index} />
      ))}

    </div>
  );
}

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  return (
    // Apply compact card styling
    <Card key={index} className="flex flex-col w-full border-none shadow-none relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-px after:bg-border pb-2"> 
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`item-${index}`} className="border-none">
          {/* Header with title, summary, and trigger */}
          <CardHeader className="px-0 pb-2"> 
            <div className="mb-2">
              <CardTitle className="mb-2">
                <Link 
                  to={`/projects/${project.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')}`}
                  className="hover:underline"
                >
                  {project.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-md">{project.summary}</CardDescription>
            </div>
            {/* Update flex container to include Date, Company, Links, and Trigger */}
            <div className="flex justify-between items-center mt-2">
              {/* Left side: Date, Company, Links */}
              <div className="flex items-center gap-x-4"> {/* Group left items */}
                {/* Display Date and Company (if available) */}
                <p className="text-sm text-muted-foreground">
                  {project.dateFrom} {project.dateUntil ? `- ${project.dateUntil}` : ''}
                  {project.company && ` • ${project.company}`}
                </p>
                {/* Links Row - Moved here */}
                <div className="flex items-center gap-x-3"> {/* Reduced gap for links */}
                  {/* GitHub Link (conditional) */}
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
                  {/* Live URL Link (conditional) */}
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

              {/* Right side: Accordion Trigger */}
              <AccordionTrigger className="p-1 rounded-md hover:bg-accent hover:no-underline [&[data-state=open]>svg]:rotate-45 mr-0"> 
                <Plus className="h-5 w-5 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
            </div>
          </CardHeader>

          {/* Content with details and technologies */}
          <CardContent className="px-0 pt-2"> 
            <AccordionContent className="pl-6">
              {/* Details list */}
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-6">
                {project.details.map((detail: string, detailIndex: Key | null | undefined) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
              {/* Technologies */}
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.map((tech: string, techIndex: Key | null | undefined) => (
                  <span key={techIndex} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </AccordionContent>
          </CardContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}; 