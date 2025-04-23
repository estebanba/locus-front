import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarHeader,
  // SidebarRail,
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
    {
      title: "Photography",
      url: "/photography",
      isActive: false,
    },
    {
      title: "Search",
      url: "/search",
      isActive: false,
    },
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
export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) { // Renamed component
  return (
    <Sidebar {...props} side="right" className=" md:relative">
      {/* <SidebarHeader className="pt-6">
        <div className="px-0 py-2 text-base font-semibold text-foreground text-right">
          Esteban Basili
        </div>
      </SidebarHeader> */}
      
      {/* Main content area of the sidebar */}
      <SidebarContent>
        {/* Grouping navigation items */}
        <SidebarGroup>
          {/* Menu containing the navigation links */}
          <SidebarMenu>
            {/* Iterate over main navigation data to create menu items */}
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                {/* Menu button acting as a link */}
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {/* Submenu logic (commented out) */}
                {/* {item.items?.length ? ( ... ) : null} */}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      {/* SidebarRail might be used for a collapsed state or icons */}
      {/* <SidebarRail /> // Temporarily commented out to test alignment */}
    </Sidebar>
  )
} 