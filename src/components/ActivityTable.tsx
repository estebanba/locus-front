import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { activity } from "../data/activity";

export const ActivityTable = (): React.ReactElement => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFilter = (filter: string): void => {
    setSearchTerm(filter.toLowerCase());
  };

  const filteredData = activity.filter((item) => {
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
    <div className="flex flex-col h-full">
      {/* Search and filters - fixed at top */}
      <div className="shrink-0 space-y-4">
        <div className="w-full">
          <input
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 font-light"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      </div>

      {/* Table content - scrollable */}
      <div className="grow overflow-y-auto mt-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <motion.table 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <tbody>
            {filteredData
              .sort((a, b) => b.dateFrom.getTime() - a.dateFrom.getTime())
              .map((item, index) => (
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
                      <span className="text-gray-500 text-sm">
                        {item.subtitle}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-right text-gray-500">
                    {item.dateFrom && item.dateFrom.getFullYear()}
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default ActivityTable;