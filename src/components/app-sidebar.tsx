"use client";

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  LayoutDashboard,
  FileJson,
  Key,
  FileDiff,
  FileText,
  FileArchive,
  Image,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "JSON Formatter",
    url: "/json-formatter",
    icon: FileJson,
  },
  {
    title: "JWT Debugger",
    url: "/jwt-debugger",
    icon: Key,
  },
  {
    title: "Diff Checker",
    url: "/diff-checker",
    icon: FileDiff,
  },
  {
    title: "Text to PDF",
    url: "/text-to-pdf",
    icon: FileText,
  },
  {
    title: "PDF Compressor",
    url: "/pdf-compressor",
    icon: FileArchive,
  },
  {
    title: "Image Compressor",
    url: "/image-compressor",
    icon: Image,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b flex items-center justify-center p-0">
        <Link
          href="/"
          className="flex items-center justify-center w-full h-full transition-all duration-300"
        >
          {isCollapsed ? (
            <span
              className="text-xl font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-darker-grotesque)",
              }}
            >
              Q<span style={{ color: "#FF6B5B" }}>.</span>
            </span>
          ) : (
            <div
              className="text-xl tracking-tight"
              style={{
                fontFamily: "var(--font-darker-grotesque)",
                fontWeight: 800,
              }}
            >
              <span className="text-foreground">Quickdevtools</span>
              <span style={{ color: "#FF6B5B" }}>.</span>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-start px-2",
          )}
        >
          <ThemeToggle
            className={cn(
              "w-full",
              isCollapsed ? "justify-center px-0" : "justify-start",
            )}
            showLabel={!isCollapsed}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
