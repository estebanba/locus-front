import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar 
} from "@/components/ui/sidebar"
import { Search } from "lucide-react";

// Initial navigation data as an array for state management
const initialData = [
  {
    title: "About",
    url: "/about",
    isActive: false,
  },
  {
    title: "Work",
    url: "/work",
    isActive: false,
    items: [
      { title: "Tesla", url: "/work/tesla" },
      { title: "Hyphen", url: "/work/hyphen" },
      { title: "IR arquitectura", url: "/work/ir-arquitectura" },
    ],
  },
  {
    title: "Projects",
    url: "/projects",
    isActive: false,
  },
];

/**
 * SideBar component displays the navigation menu on the side.
 * It uses the Sidebar components from shadcn/ui.
 */
export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) { 
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpenMobile } = useSidebar(); 
  // Use state for menu activity
  const [navMain, setNavMain] = React.useState(initialData);

  // Automatically set isActive based on current route
  React.useEffect(() => {
    setNavMain((prev) =>
      prev.map((item) => ({
        ...item,
        isActive: location.pathname === item.url
      }))
    );
  }, [location.pathname]);

  // Toggle isActive for parent menu items
  const handleParentClick = (idx: number) => {
    setNavMain((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  // Handler for navigation links
  const handleNavigate = (url: string, event: React.MouseEvent) => {
    event.preventDefault();
    setOpenMobile(false);
    // Split URL into path and hash
    const [path, hash] = url.split('#');
    setTimeout(() => {
      navigate(path);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }, 350);
  };

  // Handler for search icon click
  const handleSearchClick = () => {
    if (location.pathname === "/search") {
      navigate(-1);
    } else {
      navigate("/search");
    }
  };

  return (
    <Sidebar {...props} side="right" className="border-none">
      <SidebarContent className="pt-16 md:pt-8 mr-10 flex flex-col h-full items-end w-full">
        <SidebarGroup className="w-full items-end">
          <SidebarMenu className="w-full items-end">
            {navMain.map((item, idx) => (
              <React.Fragment key={item.title}>
                <SidebarMenuItem className="w-full flex justify-end">
                  <SidebarMenuButton
                    asChild
                    className="w-full justify-end"
                  >
                    <a
                      href={item.url}
                      className="font-medium"
                      onClick={(e) => {
                        handleParentClick(idx);
                        if (item.url && !item.url.startsWith('http')) {
                          handleNavigate(item.url, e);
                        }
                      }}
                    >
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenu
                  className={`w-full items-end overflow-hidden transition-all duration-300 ${
                    item.isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {item.items && item.items.length > 0 && item.items.map((subItem) => (
                    <SidebarMenuItem key={subItem.title} className="w-full flex justify-end">
                      <SidebarMenuButton asChild className="w-full justify-end">
                        <a
                          href={subItem.url}
                          className="text-sm text-muted-foreground hover:text-foreground"
                          onClick={(e) => handleNavigate(subItem.url, e)}
                        >
                          {subItem.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </React.Fragment>
            ))}
          </SidebarMenu>
          
          {/* Search icon - only shown on desktop (hidden on mobile) */}
          <SidebarMenu className="w-full items-end mt-4">
            <SidebarMenuItem className="w-full flex justify-end hidden md:flex">
              <SidebarMenuButton 
                className="w-8 h-8 p-0 flex items-center justify-center rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={handleSearchClick}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto mb-10 w-full items-end">
          <SidebarMenu className="w-full items-end">
            <SidebarMenuItem className="w-full flex justify-end">
              <SidebarMenuButton asChild className="w-full justify-end">
                <a
                  href="mailto:hello@estebanbasili.com"
                  className="font-medium"
                >
                  Email
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="w-full flex justify-end">
              <SidebarMenuButton asChild className="w-full justify-end">
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
            <SidebarMenuItem className="w-full flex justify-end">
              <SidebarMenuButton asChild className="w-full justify-end">
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
    </Sidebar>
  );
} 