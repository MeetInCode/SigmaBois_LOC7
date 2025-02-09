import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import LanguageTranslationComponent from "@/components/LanguageTranslationComponent"
import { Sun, Eye, Palette } from "lucide-react"// Assuming these are the correct imports for your icons

export default function Page() {
  const switchTheme = (theme) => {
    // Function to switch theme
    console.log(`Switching theme to: ${theme}`);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          
          {/* Language Translation Component */}
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
