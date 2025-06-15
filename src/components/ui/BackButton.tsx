import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

// Props interface for the BackButton component
interface BackButtonProps {
  // Custom text to display (if not provided, will auto-generate based on location)
  text?: string;
  // Style variant: "button" (with border), "text" (no border), or "link" (matches footer link styling)
  variant?: "button" | "text" | "link";
}

/**
 * BackButton component - A reusable navigation element to go back to the previous page
 * Automatically determines appropriate text based on current location or uses custom text
 * 
 * @param text - Custom text to display (optional - will auto-generate if not provided)
 * @param variant - "button" (bordered), "text" (just text and icon), or "link" (footer link style)
 */
export const BackButton = ({ 
  text, 
  variant = "link" 
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auto-generate back text based on current location and state
  const getAutoBackText = (): string => {
    // Check if we came from search
    const cameFromSearch = location.state?.from === "search";
    if (cameFromSearch) {
      return "back to search";
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
      return `back to ${companyName.toLowerCase()}`;
    }
    
    if (path.startsWith("/work/") && path.split("/").length === 3) {
      // Company detail page (e.g., /work/tesla)
      return "back to work";
    }
    
    if (path.startsWith("/projects/") && path.split("/").length === 3) {
      // Individual project detail page (e.g., /projects/project-name)
      return "back to projects";
    }
    
    // Default fallback
    return "back";
  };
  
  // Use provided text or auto-generate
  const displayText = text || getAutoBackText();
  
  // Handle click - navigate back in history
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  // For the link variant (matches footer link styling)
  if (variant === "link") {
    return (
      <button
        onClick={handleBackClick}
        className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors w-fit text-base text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {displayText}
      </button>
    );
  }

  // For the text-only variant
  if (variant === "text") {
    return (
      <div className="w-full">
        <button 
          onClick={handleBackClick}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {displayText}
        </button>
      </div>
    );
  }
  
  // For the button variant (bordered)
  return (
    <button onClick={handleBackClick} className="inline-flex">
      <Button variant="outline" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {displayText}
      </Button>
    </button>
  );
}; 