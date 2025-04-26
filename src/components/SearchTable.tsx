import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import workData from "../data/work.json";
import projectsData from "../data/projects.json"; // Import projects data
import { Search } from "lucide-react";

// Rename interface to SearchItem and adjust for combined data
interface SearchItem {
  title: string;
  summary: string;
  details: string[];
  technologies: string[];
  type: string;
  labels: string[];
  company: string | null; // Allow company to be null (for projects)
  dateFrom: string; // Date is a string like "2024"
  dateUntil: string;
  url: string;
  images: string[]; // Assuming images can be an array of strings
  media: string[]; // Assuming media can be an array of strings
  github?: string; // Added optional github property
}

// Combine work and project data
const combinedData: SearchItem[] = [...workData, ...projectsData];

// Rename component function
export const SearchTable = (): React.ReactElement => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value.toLowerCase());
  };

 
  // const handleFilter = (filter: string): void => {
  //   setSearchTerm(filter.toLowerCase());
  // };

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

  const handleRowClick = (url: string): void => {
    window.open(url, "_blank");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
      {/* Search and filters - fixed at top */}
      <div className="shrink-0 space-y-4">
        <div className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full px-4 py-2 pl-10 text-foreground bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-ring font-light"
            type="text"
            placeholder=""
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilter("project")}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => handleFilter("experiment")}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Experiments
          </button>
          <button
            onClick={() => handleFilter("blog")}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Texts
          </button>
          <button
            onClick={() => handleFilter("photography")}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Photographies
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilter("software")}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Software
          </button>
          <button
            onClick={() => handleFilter("architecture")}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Architecture
          </button>
          <button
            onClick={() => handleFilter("")}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            All
          </button>
        </div> */}
      </div>

      {/* Table content - scrollable */}
      <div className="grow overflow-y-auto mt-8">
        <motion.table 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <tbody>
            {filteredData
              // Sort based on dateFrom as string (descending)
              .sort((a: SearchItem, b: SearchItem) => b.dateFrom.localeCompare(a.dateFrom))
              .map((item: SearchItem, index: number) => (
                <motion.tr
                  key={`${item.title}-${index}`}
                  variants={rowVariants}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(item.url)}
                >
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">
                        {item.title}
                      </span>
                      
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

// Update default export if present (assuming it might be, though not strictly necessary with named export)
// export default SearchTable; // Add or modify if a default export is needed/used