"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import LanguageTranslationComponent from "@/components/LanguageTranslationComponent"
import { Sun, Eye, Palette } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    
    {
      title: "Explore",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Search places",
          url: "/maps",  // Add your URL here
        },
        {
          title: "Public Transport",
          url: "/public_transport",  // Add your URL here
        },
        {
          title: "Review Page",
          url: "/survey",  // Add your URL here
        },
      ],
    },
    {
      title: "Travel",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Community",
          url: "/community",  // Add your URL here
        },
        {
          title: "Local Voice based Guide",
          url: "/agentcall",  // Add your URL here
        },
      ],
    },
    {
      title: "Plan",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        
        {
          title: "Booking",
          url: "/bookings",  // Add your URL here
        },
        {
          title: "Itenary Planner",
          url: "/travelplanner",  // Add your URL here
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const switchTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("selected-theme", theme) // Save user preference
  }

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("selected-theme") || "default"
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      
      <LanguageTranslationComponent />

          {/* Theme Switch Buttons */}
          <div className="flex justify-around p-3 border-t border-sidebar-border">
            <button onClick={() => switchTheme("default")} className="p-2 hover:bg-sidebar-accent rounded-lg">
              <Sun className="w-6 h-6 text-sidebar-foreground" />
            </button>
            <button onClick={() => switchTheme("deuteranopia")} className="p-2 hover:bg-sidebar-accent rounded-lg">
              <Eye className="w-6 h-6 text-sidebar-foreground" />
            </button>
            <button onClick={() => switchTheme("tritanopia")} className="p-2 hover:bg-sidebar-accent rounded-lg">
              <Palette className="w-6 h-6 text-sidebar-foreground" />
            </button>
          </div>
          <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
      
    </Sidebar>
  )
}
