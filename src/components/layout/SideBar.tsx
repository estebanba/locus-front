import * as React from "react"
import { useNavigate } from "react-router-dom"; // Import useNavigate
// Import useSidebar to control mobile state
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar // Import the hook
} from "@/components/ui/sidebar" // Keep this path

// This is sample data.
const data = {
  navMain: [
    {
      title: "About",
      url: "/about",
      isActive: true,
      items: [
        // {
        //   title: "About",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Work",
      url: "/work",
      isActive: true,
    },
    {
      title: "Projects",
      url: "/projects",
      isActive: false,
    },
    // {
    //   title: "Photography",
    //   url: "/photography",
    //   isActive: false,
    // },
    // {
    //   title: "Search",
    //   url: "/search",
    //   isActive: false,
    // },
    // {
    //   title: "Building Your Application",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Routing",
    //       url: "#",
    //     },
    //     {
    //       title: "Data Fetching",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
}

/**
 * SideBar component displays the navigation menu on the side.
 * It uses the Sidebar components from shadcn/ui.
 * @param props - Props passed to the underlying Sidebar component.
 */
export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) { 
  const navigate = useNavigate(); // Hook for navigation
  // Get setOpenMobile to control the mobile sheet state
  const { setOpenMobile } = useSidebar(); 

  // Handler for navigation links
  const handleNavigate = (url: string, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default link navigation
    setOpenMobile(false);   // Trigger the sidebar close animation
    // Navigate after a delay slightly longer than animation duration (300ms)
    setTimeout(() => {
      navigate(url); 
    }, 350); 
  };

  return (
    <Sidebar {...props} side="right" className=" border-none">
      {/* <SidebarHeader className="pt-6">
        <div className="px-0 py-2 text-base font-semibold text-foreground text-right">
          Esteban Basili
        </div>
      </SidebarHeader> */}
      
      {/* Main content area of the sidebar */}
      <SidebarContent className="pt-8 mr-10 flex flex-col h-full">
        {/* Grouping navigation items */}
        <SidebarGroup className="">
          {/* Menu containing the navigation links */}
          <SidebarMenu>
            {/* Iterate over main navigation data to create menu items */}
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                {/* Menu button acting as a link */}
                <SidebarMenuButton asChild>
                  <a 
                    href={item.url} 
                    className="font-medium"
                    onClick={(e) => handleNavigate(item.url, e)} 
                  >
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {/* Submenu logic (commented out) */}
                {/* {item.items?.length ? ( ... ) : null} */}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Group for external links at the bottom */}
        <SidebarGroup className="mt-auto mb-10">
          <SidebarMenu>
            {/* GitHub Link */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a 
                  href="https://github.com/estebanba"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="font-medium"
                >
                  GitHub
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* LinkedIn Link */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a 
                  href="https://linkedin.com/in/estebanbasili" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium"
                >
                  LinkedIn
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      {/* SidebarRail might be used for a collapsed state or icons */}
      {/* <SidebarRail /> // Temporarily commented out to test alignment */}
    </Sidebar>
  )
} 