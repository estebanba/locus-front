import { useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb" // Keep this path
import { Separator } from "@/components/ui/separator" // Keep this path
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar" // Keep this path
import { AnimatedMenuLogo } from '@/components/ui/animated-menu-logo' // Updated path assuming it's in ui
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button" // Keep this path
import { SearchModal } from "../SearchModal" // Path updated from ../components/SearchModal

/**
 * Header component displays the top navigation bar.
 * It includes breadcrumbs, a search button that triggers a modal, 
 * and a button to toggle the sidebar.
 */
export function Header() { // Renamed component
  // Use the sidebar context to get the current state and toggle function
  const { state, toggleSidebar } = useSidebar()
  // State to manage the visibility of the search modal
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      {/* Apply md:hidden to hide on medium screens and up */}
      {/* Removed h-10 and border-b */}
      <header className="flex shrink-0 items-center gap-2 md:hidden">
        {/* Breadcrumb navigation section */}
        <div className="flex items-center gap-2 px-3">
          <Separator orientation="vertical" className="mr-0 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {/* Static breadcrumb items, hidden on medium screens and below */}
              {/* <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Esteban Basili
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" /> */}
              {/* Current page breadcrumb */}
              <BreadcrumbItem>
                <BreadcrumbPage>About</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        {/* Right-aligned controls section */}
        <div className="ml-auto flex items-center gap-2 px-3">
          {/* Search button: Opens the search modal */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="h-8 w-8"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          
          {/* Animated menu logo: Toggles the sidebar */}
          <AnimatedMenuLogo 
            isOpen={state === "expanded"} 
            onClick={toggleSidebar}
            className="hover:text-primary transition-colors"
          />
          {/* Hidden sidebar trigger (might be used for accessibility or specific layouts) */}
          <SidebarTrigger className="hidden" />
        </div>
      </header>

      {/* Render the search modal, controlled by isSearchOpen state */}
      <SearchModal isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
} 