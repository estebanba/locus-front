import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/ui/BackButton";
import { getWorkData, getProjectsData } from '@/services/api';
import type { WorkItem, ProjectItem as ProjectItemType } from '@/services/api';

// Unified interface for search results
interface SearchItem {
  title: string;
  summary?: string;
  details?: string[];
  skills: string[];
  type?: string;
  labels?: string[];
  company?: string | null;
  dateFrom?: string;
  dateUntil?: string;
  url?: string;
  images?: string[];
  media?: { name: string; url: string }[];
  github?: string;
  source: 'work' | 'projects';
  [key: string]: unknown;
}

export const SearchTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allData, setAllData] = useState<SearchItem[]>([]);
  const [filteredData, setFilteredData] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [rawWorkData, rawProjectsData] = await Promise.all([
          getWorkData(),
          getProjectsData()
        ]);

        const mappedWorkData: SearchItem[] = rawWorkData.map((item: WorkItem) => ({
          ...item,
          skills: item.techStack || [],
          source: 'work'
        }));

        const mappedProjectsData: SearchItem[] = rawProjectsData.map((item: ProjectItemType) => ({
          ...item,
          skills: item.technologies || [],
          source: 'projects'
        }));
        
        const combinedData = [...mappedWorkData, ...mappedProjectsData];
        setAllData(combinedData);
        setFilteredData(combinedData);
      } catch (e) {
        console.error("Failed to fetch data for search table:", e);
        setError(e instanceof Error ? e.message : "An unknown error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(allData);
      return;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = allData.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || typeof value === 'undefined') return false;
        if (Array.isArray(value)) {
          return value.some(el => typeof el === 'string' && el.toLowerCase().includes(lowerSearchTerm));
        } else if (typeof value === 'object' && item.media && value === item.media) {
          return (value as {name: string; url: string}[]).some(m => 
            m.name.toLowerCase().includes(lowerSearchTerm) || 
            m.url.toLowerCase().includes(lowerSearchTerm)
          );
        }
        return String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });
    setFilteredData(filtered);
  }, [searchTerm, allData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleRowClick = (item: SearchItem): void => {
    const projectSlug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (item.source === 'work' && item.company) {
      const companySlug = item.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      navigate(`/work/${companySlug}/${projectSlug}`, { state: { from: 'search' } });
    } else if (item.source === 'projects') {
      navigate(`/projects/${projectSlug}`, { state: { from: 'search' } });
    }
  };

  const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const rowVariants: Variants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  if (loading) {
    return <div className="p-4 pt-8 text-center">Loading search data...</div>;
  }

  if (error) {
    return <div className="p-4 pt-8 text-center text-red-500">Error loading search data: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full pt-8 px-4">
      <div className="mb-4">
        <BackButton text="Back" variant="text" />
      </div>
      <div className="shrink-0 space-y-4">
        <div className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full px-4 py-2 pl-10 text-foreground bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-ring font-light"
            type="text"
            placeholder="Search work, projects, skills..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="grow overflow-y-auto mt-8">
        {filteredData.length === 0 && !loading && searchTerm && (
          <div className="text-center text-muted-foreground py-10">No results found for "{searchTerm}".</div>
        )}
        <motion.table variants={containerVariants} initial="hidden" animate="visible" className="w-full">
          <tbody>
            {filteredData
              .sort((a, b) => {
                const dateA = a.dateFrom || '';
                const dateB = b.dateFrom || '';
                if (dateB && !dateA) return -1;
                if (!dateB && dateA) return 1;
                if (dateB && dateA) {
                  const comparison = dateB.localeCompare(dateA);
                  if (comparison !== 0) return comparison;
                }
                return a.title.localeCompare(b.title);
              })
              .map((item, index) => (
                <motion.tr
                  key={`${item.title}-${item.company || 'project'}-${index}`}
                  variants={rowVariants}
                  className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(item)}
                >
                  <td className="py-3 pr-2">
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium truncate" title={item.title}>{item.title}</span>
                      {item.company && <span className="text-xs text-muted-foreground truncate" title={item.company}>{item.company}</span>}
                      {!item.company && item.type && <span className="text-xs text-muted-foreground truncate" title={item.type}>{item.type}</span>}
                    </div>
                  </td>
                  <td className="py-3 pl-2 text-right text-sm text-muted-foreground whitespace-nowrap">
                    {item.dateFrom}
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};
