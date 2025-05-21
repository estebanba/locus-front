import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import workData from "../data/work.json";
import projectsData from "../data/projects.json";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/ui/BackButton";

// Represents an item in the search results, combining work and project data.
interface SearchItem {
  title: string;
  summary: string;
  details: string[];
  technologies: string[];
  type: string;
  labels: string[];
  company: string | null; // Null for projects.
  dateFrom: string; // Year string, e.g., "2024".
  dateUntil: string;
  url: string;
  images: string[]; // URLs or paths to images.
  media: string[]; // URLs or paths to media.
  github?: string; // Optional link to GitHub repository.
}

// Helper function to map raw data items to the SearchItem interface.
// This ensures that all fields, especially 'media', conform to the expected types.
const mapRawDataItemToSearchItem = (item: Record<string, unknown>): SearchItem => {
  let processedMedia: string[];

  // Check if item.media is an array of objects with a 'url' property.
  // If so, extract the 'url' strings.
  if (Array.isArray(item.media) && item.media.length > 0 && typeof item.media[0] === 'object' && item.media[0] !== null && 'url' in item.media[0]) {
    processedMedia = (item.media as Array<{url: string}>).map((mediaObject: { url: string }) => mediaObject.url);
  } else if (Array.isArray(item.media)) {
    // If item.media is an array, ensure all its elements are strings.
    // This handles cases where it might already be string[] or an empty array.
    processedMedia = item.media.filter((m: unknown): m is string => typeof m === 'string');
  } else {
    // If media is not an array or is undefined, default to an empty array.
    processedMedia = [];
  }

  return {
    // Spread the original item properties.
    ...item,
    // Assign the processed media array.
    media: processedMedia,
    // Ensure 'company' is explicitly null if not provided as a string, to match SearchItem's type (string | null).
    company: typeof item.company === 'string' ? item.company : null,
    // Ensure 'github' is undefined if not provided as a string, to match SearchItem's optional type (string | undefined).
    github: typeof item.github === 'string' ? item.github : undefined,
    // Provide default empty values for other required fields to prevent errors if data is missing/malformed.
    title: (item.title as string) || "",
    summary: (item.summary as string) || "",
    details: Array.isArray(item.details) ? item.details.filter((d: unknown): d is string => typeof d === 'string') : [],
    technologies: Array.isArray(item.technologies) ? item.technologies.filter((t: unknown): t is string => typeof t === 'string') : [],
    type: (item.type as string) || "",
    labels: Array.isArray(item.labels) ? item.labels.filter((l: unknown): l is string => typeof l === 'string') : [],
    dateFrom: (item.dateFrom as string) || "",
    dateUntil: (item.dateUntil as string) || "",
    url: (item.url as string) || "",
    images: Array.isArray(item.images) ? item.images.filter((i: unknown): i is string => typeof i === 'string') : [],
  } as SearchItem; // Asserting as SearchItem after ensuring all fields are compliant.
};

// Combined dataset from work and project JSON files.
// Raw data is cast before mapping, as their exact types are inferred from JSON.
// Each item is processed by mapRawDataItemToSearchItem to ensure conformity with SearchItem.
const combinedData: SearchItem[] = [
  ...(workData as Array<Record<string, unknown>>).map(mapRawDataItemToSearchItem),
  ...(projectsData as Array<Record<string, unknown>>).map(mapRawDataItemToSearchItem)
];

export const SearchTable = (): React.ReactElement => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filters the combined data based on the search term across all string/array values.
  const filteredData = combinedData.filter((item: SearchItem) => {
    return Object.values(item).some(
      (value) =>
        value != null &&
        (Array.isArray(value) ? value.join(" ") : value)
          .toString()
          .toLowerCase()
          .includes(searchTerm)
    );
  });

  // Handle row click to navigate to detail page for work items or projects
  const handleRowClick = (item: SearchItem): void => {
    // Check if this item is from work data (from workData.json)
    // We can identify work items by checking if they're from specific companies
    const workCompanies = ["Tesla", "Hyphen", "IR arquitectura"];
    const isWorkItem = item.company && workCompanies.includes(item.company);
    
    // Create slug for project title
    const projectSlug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    if (isWorkItem) {
      // Format company slug for work items
      const companySlug = item.company!
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Navigate to work detail page
      navigate(`/work/${companySlug}/${projectSlug}`);
    } else {
      // For all other items (personal projects or projects from other companies like Ironhack)
      // Navigate to the projects detail page
      navigate(`/projects/${projectSlug}`);
    }
  };

  // Animation variants for the container element.
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for individual table rows.
  const rowVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="flex flex-col h-full pt-8 px-4">
      {/* Back button */}
      <div className="mb-4">
        <BackButton text="Back" variant="text" />
      </div>
      
      {/* Top section: Search input */}
      <div className="shrink-0 space-y-4">
        <div className="w-full relative">
          {/* Restore Search icon to its original state (no button, no onClick for navigation) */}
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <input
            className="w-full px-4 py-2 pl-10 text-foreground bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-ring font-light"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Bottom section: Scrollable table */}
      <div className="grow overflow-y-auto mt-8">
        <motion.table
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <tbody>
            {filteredData
              // Sort items by dateFrom (descending)
              .sort((a: SearchItem, b: SearchItem) => b.dateFrom.localeCompare(a.dateFrom))
              .map((item: SearchItem, index: number) => (
                <motion.tr
                  key={`${item.title}-${index}`}
                  variants={rowVariants}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(item)}
                >
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">
                        {item.title}
                      </span>
                      {item.company && <span className="text-sm text-muted-foreground">{item.company}</span>}
                    </div>
                  </td>
                  <td className="py-4 text-right text-gray-500">
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
