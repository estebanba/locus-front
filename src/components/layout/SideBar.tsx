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
import { ThemeToggleIcon } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

// Initial navigation data as an array for state management
const initialData = [
  {
    title: "Home",
    url: "/",
    isActive: false,
    isHovered: false,
  },
  {
    title: "About",
    url: "/about",
    isActive: false,
    isHovered: false,
    items: [
      { title: "Timeline", url: "/timeline" },
      { title: "Skillset", url: "/skillset" },
    ],
  },
  {
    title: "Work",
    url: "/work",
    isActive: false,
    isHovered: false,
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
    isHovered: false,
  },
];

/**
 * SideBar component displays the navigation menu on the side.
 * It uses the Sidebar components from shadcn/ui.
 * Features smooth hover expansion and keeps expanded if current route matches submenu.
 */
export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) { 
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpenMobile } = useSidebar(); 
  // Use state for menu activity and hover states
  const [navMain, setNavMain] = React.useState(initialData);
  // Add state for hover timeouts
  const [hoverTimeouts, setHoverTimeouts] = React.useState<{ [key: number]: NodeJS.Timeout }>({});

  // Check if current route matches any submenu item
  const isSubMenuActive = (item: typeof initialData[0]) => {
    if (!item.items) return false;
    return item.items.some(subItem => location.pathname === subItem.url);
  };

  // Automatically set isActive based on current route
  React.useEffect(() => {
    setNavMain((prev) =>
      prev.map((item) => ({
        ...item,
        isActive: location.pathname === item.url || isSubMenuActive(item)
      }))
    );
  }, [location.pathname]);

  // Handle mouse enter for hover expansion
  const handleMouseEnter = (idx: number) => {
    // Clear any existing timeout for this item
    if (hoverTimeouts[idx]) {
      clearTimeout(hoverTimeouts[idx]);
      setHoverTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[idx];
        return newTimeouts;
      });
    }

    setNavMain((prev) =>
      prev.map((item, i) => {
        if (i === idx) {
          return { ...item, isHovered: true };
        } else {
          // Reset hover state for other items (unless they're active or have active submenu)
          const shouldStayExpanded = item.isActive || isSubMenuActive(item);
          return { ...item, isHovered: shouldStayExpanded };
        }
      })
    );
  };

  // Handle mouse leave for hover contraction with delay
  const handleMouseLeave = (idx: number) => {
    // Set a 3-second timeout before hiding the submenu
    const timeoutId = setTimeout(() => {
      setNavMain((prev) =>
        prev.map((item, i) => {
          if (i === idx) {
            // Only hide if the item is not active and doesn't have active submenu
            const shouldStayExpanded = item.isActive || isSubMenuActive(item);
            return { ...item, isHovered: shouldStayExpanded ? true : false };
          }
          return item;
        })
      );
      
      // Clean up the timeout from state
      setHoverTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[idx];
        return newTimeouts;
      });
    }, 3000); // 3 second delay

    // Store the timeout ID
    setHoverTimeouts(prev => ({
      ...prev,
      [idx]: timeoutId
    }));
  };

  // Clean up timeouts on unmount
  React.useEffect(() => {
    return () => {
      Object.values(hoverTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [hoverTimeouts]);

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
                <SidebarMenuItem 
                  className="w-full flex justify-end"
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={() => handleMouseLeave(idx)}
                >
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

                {/* Always render submenu container for smooth animations */}
                {item.items && (
                  <div 
                    className={`w-full pl-4 items-end overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
                      // Always visible on mobile (max-h-none), hover-controlled on desktop
                      'max-h-none opacity-100 md:max-h-0 md:opacity-0'
                    } ${
                      // Desktop hover/active states
                      (item.isHovered || item.isActive || isSubMenuActive(item)) ? 'md:opacity-100' : ''
                    }`}
                    style={{
                      // Dynamic max-height only on desktop for smooth animation
                      maxHeight: (item.isHovered || item.isActive || isSubMenuActive(item)) ? `${item.items.length * 40}px` : undefined,
                    }}
                  >
                    {item.items.map((subItem, subIdx) => (
                      <SidebarMenuItem 
                        key={subItem.title} 
                        className={`w-full flex justify-end transition-opacity duration-300 ease-out ${
                          // Always visible on mobile, staggered animation on desktop
                          'opacity-100 md:opacity-0'
                        } ${
                          (item.isHovered || item.isActive || isSubMenuActive(item)) ? 'md:opacity-100' : ''
                        }`}
                        style={{
                          // Stagger delay only applies on desktop when hovering
                          transitionDelay: (item.isHovered || item.isActive || isSubMenuActive(item)) ? `${subIdx * 50}ms` : '0ms',
                        }}
                      >
                        <SidebarMenuButton
                          asChild
                          className="w-full justify-end text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          <a
                            href={subItem.url}
                            onClick={(e) => {
                              if (subItem.url && !subItem.url.startsWith('http')) {
                                handleNavigate(subItem.url, e);
                              }
                            }}
                          >
                            {subItem.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Search and Theme Toggle Icons Group */}
        <SidebarGroup className="mt-auto mb-6 w-full items-end">
          <div className="flex flex-col items-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchClick}
              className="h-8 w-8"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <ThemeToggleIcon />
          </div>
        </SidebarGroup>

        <SidebarGroup className="mb-10 w-full items-end">
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