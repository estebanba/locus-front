import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getWorkData } from '@/services/api';
import type { WorkItem } from '@/services/api';
// Removed: import { companyInfo as localCompanyDataSource, type CompanyInfo as LocalCompanyInfoType } from '@/data/companyInfo';
import { BackButton } from "@/components/ui/BackButton";
import { ListCard } from "@/components/ui/ListCard";
import { Footer } from "@/components/Footer";
import { ArrowUpAZIcon, ArrowDownAZIcon } from "lucide-react";
// Removed shadcn Button import: import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Removed: import { WorkCard } from "@/components/WorkCard";

// Import actual SVG icon components
import { TeslaIcon } from "@/components/icons/TeslaIcon";
import { HyphenLogo } from "@/components/icons/HyphenLogo";
// Removed unused import for IrArquitecturaLogo
// import { IrArquitecturaLogo } from "@/components/icons/IrArquitecturaLogo";

// Local company data source using imported icons
const localCompanyDataSource = [
  {
    companyName: "Tesla",
    companyUrl: "https://www.tesla.com/",
    companyIcon: <TeslaIcon />,
    text: "I joined Tesla to help advance and automate the design and construction workflows of their factory near Berlin. Over time, my role expanded into the automobile sector, where I contributed to projects related to manufacturing and quality control. During my time here, I focused on developing internal tools and applications that supported Tesla's engineering and manufacturing teams. Below is a summary of key projects and contributions from my time at Tesla.",
    period: "2022-2024",
  },
  {
    companyName: "Hyphen",
    companyUrl: "https://hyphen.archi/",
    companyIcon: <HyphenLogo className="h-8 w-auto" />,
    text: "At Hyphen, a company that specializes in retail, logistics and data centers, I led the digitalization effort and execution planning of large-scale logistic projects, focusing on speed to market and precision detailing, fulfilling both their international client's standards and german regulations.",
    period: "2018-2021",
  },
  {
    companyName: "IR arquitectura",
    companyUrl: "https://irarquitectura.com/",
    companyIcon: <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2rem', fontWeight: 'inherit', margin: 0, lineHeight: 'inherit' }}>IR arquitectura</h2>,
    text: "IR arquitectura is a multidisciplinary collective that brings together architects, designers, and professionals from diverse backgrounds. The studio operates as an open and adaptable system, challenging social, environmental, and economic conventions to develop innovative urban, architectural, and object-based solutions with a strong emphasis on energy efficiency. Our work has been featured in major architectural publications, exhibited at leading institutions, and presented at prominent conferences and biennials. These are some of my favorite projects from my time at IR arquitectura.",
    period: "2015-2018",
  },
];

// Type based on the structure of localCompanyDataSource elements
interface LocalCompanyInfoType {
  companyName: string;
  companyUrl: string;
  companyIcon: React.ReactNode;
  text: string;
  period: string;
}

export const WorkCompanyDetail = () => {
  const { companyName } = useParams<{ companyName: string }>();
  const [company, setCompany] = useState<LocalCompanyInfoType | null>(null);
  const [projects, setProjects] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState(false);
  const location = useLocation();
  
  const cameFromSearch = location.state?.from === "search";
  const backText = cameFromSearch ? "Back to Search" : "Back to Work";

  useEffect(() => {
    const fetchWorkAndCompanyData = async () => {
      if (!companyName) {
        setLoading(false);
        setError("Company name not provided in URL.");
        return;
      }
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const workItems = await getWorkData();

        const companySlugFromUrl = companyName.toLowerCase();
        const foundCompanyFromLocalData = localCompanyDataSource.find(ci => 
          ci.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === companySlugFromUrl
        );

        if (foundCompanyFromLocalData) {
          setCompany(foundCompanyFromLocalData);
          const companyProjects = workItems.filter(item => 
            item.company && item.company.toLowerCase() === foundCompanyFromLocalData.companyName.toLowerCase()
          );
          setProjects(companyProjects);
        } else {
          setError(`Company details not found for: ${companyName}`);
        }
      } catch (e) {
        console.error("Failed to fetch work data:", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkAndCompanyData();
  }, [companyName]);

  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = a.dateFrom ? new Date(a.dateFrom).getTime() : 0;
    const dateB = b.dateFrom ? new Date(b.dateFrom).getTime() : 0;
    return sortAscending ? dateA - dateB : dateB - dateA;
  });

  if (loading) return <div className="p-4 pt-8 text-center">Loading company details...</div>;
  if (error) return <div className="p-4 pt-8 text-center text-red-500">Error: {error}</div>;
  if (!company) return <div className="p-4 pt-8 text-center">Company not found.</div>;

  return (
    <div className="p-4 pt-8 flex flex-col min-h-screen">
      <div className="flex-1 space-y-8">
        <div className="w-full flex justify-start">
          <BackButton text={backText} variant="text" />
        </div>
        
        <div className="flex items-center space-x-4">
          {company.companyIcon && 
            <div className="flex items-center justify-center min-h-[40px] text-black dark:text-white">
              {company.companyIcon}
            </div>}
        </div>
        
        {company.period && <p className="text-muted-foreground -mt-4 mb-4">{company.period}</p>}
        
        {company.text && 
          <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {company.text}
              </ReactMarkdown>
          </div>}

        <div className="flex justify-between items-center">
          <h2 className="text-2xl tracking-tight">Projects</h2>
          <button 
            onClick={() => setSortAscending(!sortAscending)} 
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
          >
            {sortAscending ? <ArrowUpAZIcon size={16}/> : <ArrowDownAZIcon size={16}/>} 
            <span>date</span>
          </button>
        </div>
        
        {projects.length > 0 ? (
          <div className="space-y-0">
            {sortedProjects.map((project, index) => {
              const projectSlug = project.name || project.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              const companySlug = company?.companyName?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              
              return (
                <ListCard
                  key={index}
                  title={project.title}
                  dateFrom={project.dateFrom}
                  dateUntil={project.dateUntil}
                  summary={project.summary}
                  detailLink={companySlug && projectSlug ? `/work/${companySlug}/${projectSlug}` : '#'}
                  github={project.github}
                  url={project.url}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No projects for this company found in the general work data.</p>
        )}
      </div>
      
      <Footer />
    </div>
  );
}; 