// import { useState } from "react"
import { useNavigate } from "react-router-dom"; // Import useNavigate
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbList,
//   BreadcrumbPage,
// } from "@/components/ui/breadcrumb" 
// import { Separator } from "@/components/ui/separator" 
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar" // Keep this path
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button" 

/**
 * Header component displays the top navigation bar.
 * It includes breadcrumbs, a search button that navigates to /search,
 * and a button to toggle the sidebar.
 */
export function Header() { // Renamed component
  // Get openMobile state and toggle function from useSidebar
  const { openMobile, toggleSidebar } = useSidebar() 
  const navigate = useNavigate(); // Initialize navigate

  return (
    <>
      {/* Apply md:hidden to hide on medium screens and up */}
      {/* Added h-16 for increased mobile header height */}
      <header className="flex shrink-0 items-center gap-2 md:hidden h-16">
        {/* Breadcrumb navigation section */}
        {/* <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-0 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              Static breadcrumb items, hidden on medium screens and below
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Esteban Basili
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              Current page breadcrumb
              <BreadcrumbItem>
                <BreadcrumbPage>About</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div> */}
        
        {/* Right-aligned controls section */}
        <div className="ml-auto flex items-center gap-2 px-4">
          {/* Search button: Navigates to /search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/search")}
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
            {openMobile ? (
              <X className="h-5 w-5" /> 
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          
          {/* Hidden sidebar trigger (might be used for accessibility or specific layouts) */}
          <SidebarTrigger className="hidden" />
        </div>
      </header>
    </>
  )
} 