import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import workData from '../data/work.json';
import { TeslaIcon } from "@/components/icons/TeslaIcon";
import { HyphenLogo } from "@/components/icons/HyphenLogo";
import { IrArquitecturaLogo } from "@/components/icons/IrArquitecturaLogo";
import { WorkCard } from "@/components/WorkCard";
import { BackButton } from "@/components/ui/BackButton";

// Company information from Work.tsx
const companyInfo = [
  {
    companyName: "Tesla",
    companyUrl: "https://www.tesla.com/",
    companyIcon: <TeslaIcon className="h-6 w-auto" />,
    text: "I joined Tesla to help advance and automate the design and construction workflows of their factory near Berlin. Over time, my role expanded into the automobile sector, where I contributed to projects related to manufacturing and quality control. During my time here, I focused on developing internal tools and applications that supported Tesla's engineering and manufacturing teams. Below is a summary of key projects and contributions from my time at Tesla.",
    period: "2022-2024",
  },
  {
    companyName: "Hyphen",
    companyUrl: "https://hyphen.archi/",
    companyIcon: <HyphenLogo className="h-8 w-auto" color="#000000" />,
    text: "At Hyphen, a company that specializes in retail, logistics and data centers, I led the digitalization effort and execution planning of large-scale logistic projects, focusing on speed to market and precision detailing, fulfilling both their international client's standards and german regulations.",
    period: "2018-2021",
  },
  {
    companyName: "IR arquitectura",
    companyUrl: "https://irarquitectura.com/",
    companyIcon: <IrArquitecturaLogo className="h-12 w-auto" />,
    text: "IR arquitectura is a multidisciplinary collective that brings together architects, designers, and professionals from diverse backgrounds. The studio operates as an open and adaptable system, challenging social, environmental, and economic conventions to develop innovative urban, architectural, and object-based solutions with a strong emphasis on energy efficiency. Our work has been featured in major architectural publications, exhibited at leading institutions, and presented at prominent conferences and biennials. These are some of my favorite projects from my time at IR arquitectura.",
    period: "2015-2018",
  },
];

// Interface for activities/projects
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

// Interface for company info
interface CompanyInfo {
  companyName: string;
  companyUrl: string;
  companyIcon: React.ReactNode;
  text: string;
  period: string;
}

export const WorkCompanyDetail = () => {
  // Get company name from URL
  const { companyName } = useParams();
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [projects, setProjects] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortAscending, setSortAscending] = useState(false);
  const location = useLocation();
  
  // Determine if user came from search page or work page
  const cameFromSearch = location.state?.from === "search";
  const backText = cameFromSearch ? "Back to Search" : "Back to Work";

  useEffect(() => {
    if (companyName) {
      // Find company info by matching slug with company name
      const foundCompany = companyInfo.find(item => {
        const companySlug = item.companyName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        return companySlug === companyName.toLowerCase();
      });

      // Find all projects for this company
      const companyProjects = workData.filter(item => {
        if (!foundCompany) return false;
        
        return item.company.toLowerCase() === foundCompany.companyName.toLowerCase();
      });
      
      setCompany(foundCompany || null);
      setProjects(companyProjects);
      setLoading(false);
    }
  }, [companyName]);

  // Sort projects based on current sort settings
  const sortedProjects = [...projects].sort((a, b) => {
    const aYear = parseInt(a.dateFrom.split('-')[0]);
    const bYear = parseInt(b.dateFrom.split('-')[0]);
    return sortAscending ? aYear - bYear : bYear - aYear;
  });

  if (loading) {
    return <div className="p-4 pt-8">Loading company details...</div>;
  }

  if (!company) {
    return (
      <div className="p-4 pt-8 flex flex-col space-y-4">
        <h2 className="text-3xl tracking-tight">Company Not Found</h2>
        <p className="text-muted-foreground">
          The company you're looking for doesn't exist or may have been moved.
        </p>
        <BackButton text={backText} />
      </div>
    );
  }

  // Function to replace first occurrence of company name with link
  const formatCompanyText = (text: string, name: string, url: string) => {
    const index = text.indexOf(name);
    if (index === -1) return text;

    const beforeText = text.substring(0, index);
    const afterText = text.substring(index + name.length);

    return (
      <>
        {beforeText}
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-medium underline hover:text-foreground transition-colors"
        >
          {name}
        </a>
        {afterText}
      </>
    );
  };

  return (
    <div className="p-4 pt-8 flex flex-col space-y-8">
      {/* Back link (text only, no border) */}
      <BackButton text={backText} variant="text" />

      {/* Company header - changed to regular stacked layout */}
      <div className="w-full mb-8">
        {/* Company logo */}
        <div className="text-3xl tracking-tight mb-3">
          {company.companyIcon}
        </div>
        
        {/* Company name as h2
        <h2 className="text-3xl font-semibold tracking-tight mb-2">
          {company.companyName}
        </h2> */}
        
        {/* Period */}
        <p className="text-muted-foreground mb-4">
          {company.period}
        </p>
        
        {/* Company description with linked name */}
        <p className="text-muted-foreground">
          {formatCompanyText(company.text, company.companyName, company.companyUrl)}
        </p>
      </div>

      {/* Projects for this company */}
      <div className="w-full">
        {/* Projects header with sorting */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold tracking-tight">Projects</h3>
          
          {/* Sorting controls */}
          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Date:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSortAscending(true)}
                  className={`text-xs px-2 py-1 rounded ${sortAscending ? 'bg-secondary/50 text-foreground' : 'text-muted-foreground'}`}
                >
                  Oldest first
                </button>
                <button
                  onClick={() => setSortAscending(false)}
                  className={`text-xs px-2 py-1 rounded ${!sortAscending ? 'bg-secondary/50 text-foreground' : 'text-muted-foreground'}`}
                >
                  Newest first
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          {sortedProjects.map((project, index) => (
            <WorkCard key={index} activity={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}; 