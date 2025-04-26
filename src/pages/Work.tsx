import { TeslaIcon } from "@/components/icons/TeslaIcon"; // Import the new icon

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus } from "lucide-react"; // Using Lucide icon for '+'
import workData from '../data/work.json';
import { Key } from 'react';

// Update the Activity interface to match work.json structure
interface Activity {
  title: string;
  summary: string;
  details: string[];
  technologies: string[];
  type: string; // Added
  labels: string[]; // Added
  company: string; // Added
  dateFrom: string; // Changed to required string
  dateUntil: string; // Changed to required string
  url: string; // Added
  images: string[]; // Added
  media: string[]; // Added
  github?: string; // Added optional github property
}

export const Work = () => {
  
  return (
    <div className="container mx-auto p-4 pt-8 flex flex-col items-end space-y-8">
      
      <div className="w-full max-w-2xl">
        <p className=" text-muted-foreground">
          My work spans across industries and disciplines, from design and development to manufacturing and engineering. The constant has been working with amazing people and creating things that make an impact.
        </p>
      </div>
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl tracking-tight mb-4 flex justify-between items-center gap-2">
          <TeslaIcon className="h-3 w-auto" />
          <span className="text-lg text-muted-foreground">2022-2024</span>
        </h2>
        <p className=" text-muted-foreground">
          Here's a summary of some key projects and contributions during my time at Tesla, focusing on developing internal tools and applications for manufacturing and engineering processes.
        </p>
      </div>

      {/* Map over the activities data */}
      {workData.map((work, index) => (
        <WorkCard key={index} activity={work} index={index} />
      ))}

      {/* <div className="w-full max-w-2xl mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Architectural Work
          <span className="text-2xl text-muted-foreground ml-2">(2015-2021)</span> 
        </h1>
        <p className="text-lg text-muted-foreground">
          This is a list of previous work experiences.
        </p>
      </div>

      {activities.map((activity, index) => (
        <WorkCard key={index} activity={activity} index={index} />
      ))} */}



    </div>
  );
};

// Update WorkCard to use the full Activity interface
const WorkCard = ({ activity, index }: { activity: Activity, index: number }) => {
  return (
    <Card key={index} className="flex flex-col w-full max-w-2xl border-none shadow-none relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-px after:bg-border pb-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`item-${index}`} className="border-none">
              <CardHeader className="px-0 pb-2">
                <div className="mb-2">
                  <CardTitle className=" mb-2">{activity.title}</CardTitle>
                  <CardDescription className="text-md">{activity.summary}</CardDescription>
                </div>
                <div className="flex justify-between items-center mt-2">
                  {/* Display Date - now required string */}
                  <p className="text-sm text-muted-foreground">
                    {activity.dateFrom} {activity.dateUntil ? `- ${activity.dateUntil}` : ''}
                  </p>
                  {/* Removed the conditional check around date display as dateFrom is now required */}
                  {/* {activity.dateFrom ? (...) : (<div />)} */}
                  <AccordionTrigger className="p-1 rounded-md hover:bg-accent hover:no-underline [&[data-state=open]>svg]:rotate-45 mr-0">
                    <Plus className="h-5 w-5 shrink-0 transition-transform duration-200" />
                  </AccordionTrigger>
                </div>
              </CardHeader>

              <CardContent className="px-0 pt-2">
                <AccordionContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-6 pl-6">
                    {activity.details.map((detail: string, detailIndex: Key | null | undefined) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1 pl-6" >
                    {activity.technologies.map((tech: string, techIndex: Key | null | undefined) => (
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

