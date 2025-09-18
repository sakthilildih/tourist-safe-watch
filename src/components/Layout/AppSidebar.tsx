import { useState } from "react";
import { Map, Database, AlertTriangle, FileText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Tourist Clusters", url: "/", icon: Map },
  { title: "Digital ID Records", url: "/digital-ids", icon: Database },
  { title: "Alerts & Locations", url: "/alerts", icon: AlertTriangle },
  { title: "E-FIR Cases", url: "/efir", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavClasses = (path: string) => {
    const baseClasses = "flex items-center w-full transition-colors";
    if (isActive(path)) {
      return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary-dark`;
    }
    return `${baseClasses} text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground`;
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}