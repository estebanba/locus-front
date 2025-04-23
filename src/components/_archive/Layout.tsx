import { useState } from 'react'
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { ActivityTable } from './ActivityTable'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Search, X } from "lucide-react"

// Layout component props interface
interface LayoutProps {
  children?: React.ReactNode
  header?: React.ReactNode
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  footer?: React.ReactNode
}

export function Layout({
  children,
  header,
  leftSidebar,
  rightSidebar,
  footer
}: LayoutProps) {
  // State to control the mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  // State to control the search modal visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center">
              {/* Mobile menu button - only visible on small screens */}
              <Button
                variant="ghost"
                className="mr-2 px-2 md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
              {header}
            </div>
            
            {/* Search button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="ml-2"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Left Sidebar - Collapsible on mobile */}
          <aside
            className={cn(
              "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform md:sticky md:translate-x-0",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {leftSidebar}
          </aside>

          {/* Main content area with responsive padding */}
          <main className="flex-1 container py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main content */}
              <div className="flex-1">
                {children}
              </div>

              {/* Right Sidebar - Stacks on mobile and narrow screens */}
              <aside className="w-full lg:w-64 shrink-0">
                {rightSidebar}
              </aside>
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t">
          <div className="container py-6">
            {footer}
          </div>
        </footer>
      </div>

      {/* Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[800px] h-[90vh] md:h-auto">
          <div className="relative">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
            
            {/* Activity Table */}
            <div className="mt-8">
              <ActivityTable />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Simple menu icon component
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
} 