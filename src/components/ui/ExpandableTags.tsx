import { useState } from "react";
import { Button } from "./button";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Props for the ExpandableTags component
 */
interface ExpandableTagsProps {
  tags: string[];  // Array of tags to display
  className?: string;  // Optional additional class name
  limit?: number;  // Optional limit of tags to show initially (default: 4)
}

/**
 * ExpandableTags component displays a list of tags with an option to expand/collapse
 * Shows only the first few tags (default: 4) and adds a "more" button to expand
 */
export const ExpandableTags = ({ 
  tags, 
  className = "", 
  limit = 4 
}: ExpandableTagsProps) => {
  // State to track whether all tags are shown or just limited number
  const [isExpanded, setIsExpanded] = useState(false);
  
  // No need for expand/collapse if we have fewer tags than the limit
  const showExpandButton = tags.length > limit;
  
  // Determine which tags to show based on expanded state
  const visibleTags = isExpanded ? tags : tags.slice(0, limit);
  
  return (
    <div className="flex flex-col space-y-3">
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {/* Visible tags */}
        {visibleTags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-secondary/30 text-muted-foreground px-3 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
        
        {/* Expand/collapse button */}
        {showExpandButton && (
          <Button
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 h-auto flex items-center text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <>
                <Minus className="h-3 w-3 mr-1" />
                Less
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" />
                {tags.length - limit} more
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Hidden tags for height animation */}
      {isExpanded && showExpandButton && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* This div is empty because we're showing all tags in the main list when expanded */}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}; 