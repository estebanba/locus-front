import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Interface matching work.json projects
interface Activity {
  title: string;
  summary: string;
  dateFrom: string;
  dateUntil: string;
  company: string;
}

interface WorkCardProps {
  activity: Activity;
  index: number;
}

/**
 * WorkCard displays a simplified work project card with title, summary and date.
 * It maintains the styling from the Work page but without the accordion functionality.
 */
export function WorkCard({ activity, index }: WorkCardProps) {
  // Create URL-friendly slugs for company and project
  const companySlug = activity.company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const projectSlug = activity.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return (
    <Card 
      key={index} 
      className="w-full border-none shadow-none relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-px after:bg-border mb-8 pb-0"
    >
      <CardHeader className="px-0 pb-2">
        <CardTitle className="mb-1">
          <Link 
            to={`/work/${companySlug}/${projectSlug}`}
            className="hover:underline"
          >
            {activity.title}
          </Link>
        </CardTitle>
        
        {/* Date */}
        <p className="text-sm text-muted-foreground mb-2">
          {activity.dateFrom} {activity.dateUntil ? `- ${activity.dateUntil}` : ''}
        </p>
        
        {/* Summary */}
        <CardDescription className="text-md block mt-2">
          {activity.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-0"></CardContent>
    </Card>
  );
} 