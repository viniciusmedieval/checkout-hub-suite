
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container p-6 mx-auto">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
