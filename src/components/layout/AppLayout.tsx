import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Menu,
  X,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Navigation items — extend this array as features are added.
 */
const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

/**
 * AppLayout — main application shell.
 *
 * Provides:
 * - Collapsible sidebar with navigation
 * - Top header bar
 * - Content area via <Outlet />
 *
 * No business logic — purely structural.
 */
export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ===== Desktop Sidebar ===== */}
      <aside
        className={cn(
          'hidden flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:flex',
          sidebarOpen ? 'w-64' : 'w-16',
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          {sidebarOpen && (
            <span className="text-lg font-bold text-sidebar-foreground">
              {import.meta.env.VITE_APP_NAME || 'App'}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft
              className={cn('size-5 transition-transform', !sidebarOpen && 'rotate-180')}
            />
          </Button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  !sidebarOpen && 'justify-center px-0',
                )}
              >
                <item.icon className="size-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent',
              !sidebarOpen && 'justify-center px-0',
            )}
          >
            <LogOut className="size-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* ===== Mobile Sidebar Overlay ===== */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 md:hidden',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <span className="text-lg font-bold text-sidebar-foreground">
            {import.meta.env.VITE_APP_NAME || 'App'}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSidebarOpen(false)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="size-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <item.icon className="size-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="size-5 shrink-0" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex-1" />
          {/* Header actions slot — add user avatar, notifications, etc. */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
