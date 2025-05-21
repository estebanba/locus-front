import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider } from "@/components/ui/sidebar" 
import { SideBar } from './SideBar' 
import { Header } from './Header' 

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
        {/* Header visible only on mobile */}
        <Header />
        {/* Main content grid (md+) */}
        <div className="flex-grow md:grid md:grid-cols-4">
          {/* Left Spacer (md+) */}
          <div className="hidden md:block md:col-span-1" />
          
          {/* Main Content Area (md+) */}
          {/* Added h-full, overflow-y-auto for scrolling, and stable scrollbar gutter */}
          <div className="main-content-area md:col-span-2 h-full overflow-y-auto" style={{ scrollbarGutter: 'stable' }}> 
            {/* Keyed div for page transitions */}
            <div key={location.pathname} className="page-transition p-4">
              <Outlet />
            </div>
          </div>

          {/* Right Sidebar (md+) */}
          {/* On mobile, SideBar functions as offcanvas via SidebarProvider */}
          <div className="md:col-span-1">
            <SideBar side="right" /> {/* Updated component name */}
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
} 