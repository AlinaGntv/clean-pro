import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, LogOut, Menu, X } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api.me().catch(() => navigate("/admin/login"));
  }, [navigate]);

  const handleLogout = async () => {
    await api.logout();
    navigate("/admin/login");
  };

  const nav = (
    <>
      <Link to="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
        <LayoutDashboard className="h-4 w-4" /> Заявки
      </Link>
      <Link to="/admin/settings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
        <Settings className="h-4 w-4" /> Настройки
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-white flex-col shrink-0">
        <div className="p-6 border-b">
          <Link to="/admin" className="text-lg font-bold text-primary">CleanPro</Link>
          <p className="text-xs text-muted-foreground mt-1">Панель управления</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">{nav}</nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Выйти
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-white border-b flex items-center justify-between px-4 h-14">
        <Link to="/admin" className="font-bold text-primary">CleanPro</Link>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen((v) => !v)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={cn(
        "md:hidden fixed top-14 left-0 z-50 w-64 h-[calc(100vh-3.5rem)] bg-white border-r flex flex-col transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="flex-1 p-4 space-y-1">{nav}</nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Выйти
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-muted/30 md:pt-0 pt-14">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
