"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Briefcase,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Link } from "@/components/shared/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "/admin/profile", icon: User },
  { name: "Projects", path: "/admin/projects", icon: FolderOpen },
  { name: "Blog", path: "/admin/blog", icon: FileText },
  { name: "Certifications", path: "/admin/certifications", icon: Award },
  { name: "Skills", path: "/admin/skills", icon: Briefcase },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  { name: "Media", path: "/admin/media", icon: ImageIcon },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Unable to log out. Please try again.");
      return;
    }
    toast.success("Logged out successfully");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-40">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-lg hidden sm:inline-block">Admin Panel</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">View site</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-background border-r border-border z-30 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="pt-16 lg:pl-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;

