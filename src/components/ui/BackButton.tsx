import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

// Props interface for the BackButton component
interface BackButtonProps {
  // Custom text to display (if not provided, will auto-generate based on location)
  text?: string;
  // Style variant: "button" (with border) or "text" (no border, just text and icon)
  variant?: "button" | "text";
}

/**
 * BackButton component - A reusable navigation element to go back to the previous page
 * Automatically determines appropriate text based on current location or uses custom text
 * 
 * @param text - Custom text to display (optional - will auto-generate if not provided)
 * @param variant - "button" (bordered) or "text" (just text and icon)
 */
export const BackButton = ({ 
  text, 
  variant = "button" 
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auto-generate back text based on current location and state
  const getAutoBackText = (): string => {
    // Check if we came from search
    const cameFromSearch = location.state?.from === "search";
    if (cameFromSearch) {
      return "Back to Search";
    }
    
    // Generate text based on current path
    const path = location.pathname;
    
    if (path.startsWith("/work/") && path.split("/").length === 4) {
      // Individual work project detail page (e.g., /work/tesla/project-name)
      const companySlug = path.split("/")[2];
      const companyName = companySlug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return `Back to ${companyName}`;
    }
    
    if (path.startsWith("/work/") && path.split("/").length === 3) {
      // Company detail page (e.g., /work/tesla)
      return "Back to Work";
    }
    
    if (path.startsWith("/projects/") && path.split("/").length === 3) {
      // Individual project detail page (e.g., /projects/project-name)
      return "Back to Projects";
    }
    
    // Default fallback
    return "Back";
  };
  
  // Use provided text or auto-generate
  const displayText = text || getAutoBackText();
  
  // Handle click - navigate back in history
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  // For the text-only variant
  if (variant === "text") {
    return (
      <div className="w-full">
        <button 
          onClick={handleBackClick}
          className="text-sm text-foreground hover:underline inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {displayText}
        </button>
      </div>
    );
  }
  
  // For the button variant (default)
  return (
    <button onClick={handleBackClick} className="inline-flex">
      <Button variant="outline" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {displayText}
      </Button>
    </button>
  );
}; 