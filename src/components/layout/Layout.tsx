import { Outlet, useLocation } from 'react-router-dom'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar" // Keep this path as ui/sidebar is likely still in components
import { SideBar } from './SideBar' // Updated import name and path
import { Header } from './Header' // Updated import name and path

/**
 * Layout component defines the main structure of the application.
 * Uses a responsive layout: 
 * - Mobile: Single column with offcanvas sidebar.
 * - Desktop (md+): 4-column grid (1/4 empty, 1/2 content, 1/4 sidebar).
 * SidebarProvider wraps the layout to provide context.
 */
export function Layout() { // Renamed component
  const location = useLocation(); // Get location object

  return (
    <div className="[--header-height:calc(theme(spacing.14))] min-h-screen flex flex-col">
      <SidebarProvider className="flex flex-col flex-grow" defaultOpen={true}>
        {/* Header is outside the main grid, visible only on mobile */}
        <Header />
        {/* Main content area: responsive grid for md+ screens - Removed gap */}
        <div className="flex-grow md:grid md:grid-cols-4">
          {/* Column 1: Left Spacer (visible md+) */}
          <div className="hidden md:block md:col-span-1" />
          
          {/* Column 2 & 3: Main Content Area (visible md+) */}
          {/* Added class and overflow styles */}
          <div className="main-content-area md:col-span-2 h-full overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
            {/* On mobile, SidebarInset takes full width */}
            <SidebarInset>
              {/* Wrap Outlet with a div that has a key based on pathname and the transition class */}
              <div key={location.pathname} className="page-transition p-4">
                <Outlet />
              </div>
            </SidebarInset>
          </div>

          {/* Column 4: Right Sidebar (visible md+) */}
          {/* On mobile, SideBar functions as offcanvas */}
          <div className="md:col-span-1">
            <SideBar side="right" /> {/* Updated component name */}
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
} 