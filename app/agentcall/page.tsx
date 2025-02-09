import { Conversation } from '../../components/conversation';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
  import { AppSidebar } from "@/components/app-sidebar"

export default function Home() {
  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>

    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Tourists Conversational AI
        </h1>
        <Conversation />
      </div>
    </main>

</SidebarInset>
    </SidebarProvider>
  );
}
