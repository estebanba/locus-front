import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Props interface for the BackButton component
interface BackButtonProps {
  // Custom text to display (defaults to "Back")
  text?: string;
  // Style variant: "button" (with border) or "text" (no border, just text and icon)
  variant?: "button" | "text";
}

/**
 * BackButton component - A reusable navigation element to go back to the previous page
 * 
 * @param text - Custom text to display (defaults to "Back")
 * @param variant - "button" (bordered) or "text" (just text and icon)
 */
export const BackButton = ({ 
  text = "Back", 
  variant = "button" 
}: BackButtonProps) => {
  const navigate = useNavigate();
  
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
          {text}
        </button>
      </div>
    );
  }
  
  // For the button variant (default)
  return (
    <button onClick={handleBackClick} className="inline-flex">
      <Button variant="outline" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {text}
      </Button>
    </button>
  );
}; 