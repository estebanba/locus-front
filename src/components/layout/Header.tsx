import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Header component displays the top navigation bar for mobile screens.
 * It includes a search button that navigates to /search,
 * or navigates back if already on the /search page.
 * It also includes a button to toggle the sidebar.
 */
export function Header() {
  const { openMobile, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles the click event for the search button.
   * If the current path is "/search", it navigates to the previous page.
   * Otherwise, it navigates to "/search".
   */
  const handleSearchClick = () => {
    if (location.pathname === "/search") {
      navigate(-1);
    } else {
      navigate("/search");
    }
  };

  return (
    <>
      {/* Header for mobile screens (hidden on md and up) */}
      {/* Increased height to h-16 */}
      <header className="flex h-16 shrink-0 items-center gap-2 md:hidden">
        {/* Right-aligned controls section */}
        <div className="ml-auto flex items-center gap-2 px-4">
          {/* Search button: Navigates to /search or back if on /search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchClick}
            className="h-8 w-8"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Sidebar toggle button using Menu/X icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:text-primary transition-colors"
          >
            {/* Conditionally render Menu or X based on openMobile state */}
            {openMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </header>
    </>
  );
}