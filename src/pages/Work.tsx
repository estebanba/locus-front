import activities from '../data/activities.json';

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

export const Work = () => {
  
  return (
    <div className="container mx-auto p-4 pt-8 flex flex-col items-start space-y-6">
      {/* Title and Summary Block - Left Aligned */}
      <div className="w-full max-w-2xl mb-12"> {/* Removed text-center, increased mb */} 
        <h1 className="text-3xl font-bold tracking-tight mb-4"> {/* Increased mb */} 
          My work at Tesla 
          <span className="text-2xl text-muted-foreground ml-2">(2022-2024)</span> {/* Added date span */} 
        </h1>
        <p className="text-lg text-muted-foreground">
          Here's a summary of some key projects and contributions during my time at Tesla, focusing on developing internal tools and applications for manufacturing and engineering processes.
        </p>
      </div>

      {/* Map over the activities data */}
      {activities.map((activity, index) => (
        // Added relative positioning, custom border, and removed shadow
        <Card key={index} className="flex flex-col w-full max-w-2xl border-none shadow-none relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-px after:bg-border pb-4"> {/* Added pb-4 for space below border */} 
          {/* Wrap CardHeader and CardContent within AccordionItem */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`item-${index}`} className="border-none">
              {/* CardHeader contains title, summary, and a div for date/trigger */} 
              <CardHeader className="px-0 pb-2"> {/* Removed horizontal padding */} 
                {/* Title and Summary */} 
                <div className="mb-2">
                  <CardTitle>{activity.title}</CardTitle>
                  <CardDescription>{activity.summary}</CardDescription>
                </div>
                {/* Flex container for Date and Trigger */} 
                <div className="flex justify-between items-center mt-2">
                  {/* Date */} 
                  {activity.dateFrom ? (
                    <p className="text-sm text-muted-foreground">
                      {activity.dateFrom} {activity.dateUntil ? `- ${activity.dateUntil}` : ''}
                    </p>
                  ) : (
                    <div /> /* Placeholder to maintain space-between alignment */
                  )}
                  {/* Trigger is now inline, aligned with Date */}
                  <AccordionTrigger className="p-1 rounded-md hover:bg-accent hover:no-underline [&[data-state=open]>svg]:rotate-45 mr-0"> {/* Ensured no extra margin */} 
                    <Plus className="h-5 w-5 shrink-0 transition-transform duration-200" />
                  </AccordionTrigger>
                </div>
              </CardHeader>

              {/* CardContent contains the AccordionContent */}
              <CardContent className="px-0 pt-2"> {/* Removed horizontal padding */} 
                <AccordionContent> {/* AccordionContent holds the collapsible details */}
                  {/* Display details list */}
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-3 pl-6">
                    {activity.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                  {/* Display technologies */}
                  <div className="flex flex-wrap gap-1 pl-6">
                    {activity.technologies.map((tech, techIndex) => (
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
      ))}
    </div>
  );
};

// --- Attempt 2: Absolute positioning for the trigger --- 
