import { TeslaIcon } from "@/components/icons/TeslaIcon"; // Import the new icon
import { BackButton } from "@/components/ui/BackButton";
import { Footer } from "@/components/Footer";

/* Import accordion and card components in a comment to preserve them for when they're needed again
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
import { Plus, Globe, ArrowUp, ArrowDown } from "lucide-react"; // Using Lucide icon for '+' and 'sort'
*/

// Keep necessary imports
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { useState } from 'react';
// import { IrArquitecturaIcon } from "@/components/icons/IrArquitecturaIcon"; // Removed unused import
import { HyphenLogo } from "@/components/icons/HyphenLogo";
import { IrArquitecturaLogo } from "@/components/icons/IrArquitecturaLogo";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CardWrapper } from "@/components/ui/CardWrapper";

// Update the Activity interface to match work.json structure
interface Activity {
  title: string;
  summary: string;
  details: string[];
  techStack: string[]; // Replaced technologies with techStack
  features: string[]; // Added features
  type: string; 
  labels: string[]; 
  company: string;
  dateFrom: string; // Changed to required string
  dateUntil: string; // Changed to required string
  url: string; // Added
  images: string[]; // Added
  media: { name: string; url: string; }[]; // Updated to reflect object structure
  github?: string; // Added optional github property
}

const workSections = [
  {
    companyName: "Tesla",
    companyUrl: "https://www.tesla.com/",
    companyIcon: <TeslaIcon className="h-3 w-auto" />,
    text: "I joined Tesla to help advance and automate the design and construction workflows of their factory near Berlin. Over time, my role expanded into the automobile sector, where I contributed to projects related to manufacturing and quality control. During my time here, I focused on developing internal tools and applications that supported Tesla's engineering and manufacturing teams.",
    period: "2022-2024",
  },
  {
    companyName: "Hyphen",
    companyUrl: "https://hyphen.archi/",
    companyIcon: <HyphenLogo className="h-6 w-auto" color="#000000" />, // Adjusted size and added color
    text: "At Hyphen, a company that specializes in retail, logistics and data centers, I led the digitalization effort and execution planning of large-scale logistic projects, focusing on speed to market and precision detailing, fulfilling both their international client's standards and german regulations.",
    period: "2018-2021",
  },
  {
    companyName: "IR arquitectura",
    companyUrl: "https://irarquitectura.com/",
    companyIcon: <IrArquitecturaLogo />,
    text: "IR arquitectura is a multidisciplinary collective that brings together architects, designers, and professionals from diverse backgrounds. The studio operates as an open and adaptable system, challenging social, environmental, and economic conventions to develop innovative urban, architectural, and object-based solutions with a strong emphasis on energy efficiency. Our work has been featured in major architectural publications, exhibited at leading institutions, and presented at prominent conferences and biennials.",
    period: "2015-2018",
  },
];

// Define the type for WorkSection props, including companyUrl
interface WorkSectionProps {
  companyIcon: React.ReactNode;
  companyName: string;
  companyUrl: string;
  text: string;
  period: string;
  sortedWorkData: Activity[];
}

export const Work = () => {
  // Add state for sorting
  const [sortAscending, setSortAscending] = useState(false);

  // Sort work sections based on current sort settings
  const sortedWorkSections = [...workSections].sort((a, b) => {
    // Sort by date (period)
    const aYear = parseInt(a.period.split('-')[0]);
    const bYear = parseInt(b.period.split('-')[0]);
    return sortAscending ? aYear - bYear : bYear - aYear;
  });
  
  return (
    <div className="p-4 pt-8 flex flex-col min-h-screen">
      <div className="flex-1 space-y-8">
        <div className="w-full flex justify-start">
          <BackButton variant="text" />
        </div>
        
        <div className="w-full">
          <h2 className="text-3xl tracking-tight mb-4">Work</h2>
          <p className="text-muted-foreground mb-8">
            My work spans across industries and disciplines, from design and development to manufacturing and engineering. The constant has been working with amazing people on things that fill me with joy.
          </p>
          
          {/* Sorting controls */}
          <div className="flex items-center justify-end gap-4 mb-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortAscending(!sortAscending)}
              className="text-xs px-2 h-6 flex items-center gap-2"
            >
              <span className="text-muted-foreground">date</span>
              {sortAscending ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={sortAscending ? 'ascending' : 'descending'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.75,
                ease: [1, 0.66, 0.33, 0, 0.33, 0.66, 1]
              }}
              className="w-full"
            >
              {sortedWorkSections.map((section, index) => (
                <div key={section.companyName}>
                  <CompanySection 
                    companyIcon={section.companyIcon} 
                    companyName={section.companyName} 
                    text={section.text} 
                    period={section.period}
                    isLast={index === sortedWorkSections.length - 1}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Updated component that shows only company info
const CompanySection = ({ companyIcon, companyName, text, period, isLast = false }: Omit<WorkSectionProps, 'sortedWorkData' | 'companyUrl'> & { isLast?: boolean }) => {
  // Create URL-friendly company slug
  const companySlug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
    
  return (
    <CardWrapper to={`/work/${companySlug}`} className="py-5" isLast={isLast}>
      <h2 id={companyName.toLowerCase().replace(/\s+/g, '-')} className="text-2xl tracking-tight flex justify-between items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          {companyIcon}
        </div>
        <span className="text-sm text-muted-foreground">{period}</span>
      </h2>
      <div className="flex flex-col">
        <p className="text-muted-foreground">
          {text}{' '}
          <span className="inline-flex items-center gap-1 text-white hover:text-foreground transition-colors">
            more
            <ArrowRight className="h-4 w-4" />
          </span>
        </p>
      </div>
    </CardWrapper>
  );
};

