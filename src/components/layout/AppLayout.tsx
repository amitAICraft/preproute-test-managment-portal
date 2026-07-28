import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  Menu,
  X,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MESSAGES } from '@/constants/messages';
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { ROUTES } from '@/constants/routes';

/**
 * Navigation items matching the Figma sidebar exactly.
 * Icons are loaded from the official Figma SVG exports.
 */
const navItems = [
  { label: 'Dashboard', href: '/dashboard', iconSrc: '/dash-icon.svg' },
  { label: 'Test Creation', href: '/tests/create', iconSrc: '/create-test-icon.svg' },
  { label: 'Test Tracking', href: '/tests/tracking', iconSrc: '/test-tracking-icon.svg' },
];

/**
 * AppLayout — shared layout for all protected pages.
 *
 * Provides:
 * - Collapsible sidebar with active navigation state
 * - Top header bar with profile section
 * - Content area via <Outlet />
 */
export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      {/* ===== Desktop Sidebar ===== */}
      <aside
        className={cn(
          'hidden flex-col border-r border-slate-200 bg-white transition-all duration-300 md:flex',
          sidebarOpen ? 'w-64' : 'w-16',
        )}
      >
        {/* Sidebar Header - Logo */}
        <div className="flex h-16 items-center justify-between px-6 pt-2">
          {sidebarOpen && (
            <img src="/preproute-logo.svg" alt="PrepRoute" className="h-6 w-auto" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:bg-slate-100"
          >
            <ChevronLeft
              className={cn('size-5 transition-transform', !sidebarOpen && 'rotate-180')}
            />
          </Button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 mt-8 space-y-1">
          {navItems.map((item) => {
            // Determine active state; /tests/create handles builder, publish etc.
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#F4F6FF] text-[#384EC7] border-l-4 border-[#384EC7] pl-[20px]' // Light blue bg, solid blue text
                    : 'text-[#6B7180] hover:bg-slate-50 border-l-4 border-transparent hover:text-slate-900',
                  !sidebarOpen && 'justify-center px-0 pl-0 border-none'
                )}
              >
                <img src={item.iconSrc} alt="" className="size-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200 p-2">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              'w-full justify-start gap-3 text-slate-500 hover:bg-slate-100',
              !sidebarOpen && 'justify-center px-0',
            )}
          >
            <LogOut className="size-5 shrink-0" />
            {sidebarOpen && <span>{MESSAGES.LAYOUT.LOGOUT}</span>}
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
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:hidden',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 pt-2">
          <img src="/preproute-logo.svg" alt="PrepRoute" className="h-6 w-auto" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSidebarOpen(false)}
            className="text-slate-400 hover:bg-slate-100"
          >
            <X className="size-5" />
          </Button>
        </div>
        <nav className="flex-1 mt-8 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#F4F6FF] text-[#384EC7] border-l-4 border-[#384EC7] pl-[20px]'
                    : 'text-[#6B7180] hover:bg-slate-50 border-l-4 border-transparent hover:text-slate-900'
                )}
              >
                <img src={item.iconSrc} alt="" className="size-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-2">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-slate-500 hover:bg-slate-100"
          >
            <LogOut className="size-5 shrink-0" />
            <span>{MESSAGES.LAYOUT.LOGOUT}</span>
          </Button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          
          <div className="flex-1" />
          
          {/* Header actions slot — Bell + Profile */}
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button className="flex items-center justify-center size-10 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
              <img src="/bell-icon.svg" alt="Notifications" className="size-5" />
            </button>

            {/* Profile Dropdown Area */}
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
              <img src="/persona-profile.svg" alt="Profile" className="size-10 rounded-full object-cover" />
              
              <div className="hidden sm:flex flex-col">
                <span className="text-[14px] font-semibold text-slate-900 leading-tight">Alex Wando</span>
                <span className="text-[12px] text-slate-500 mt-0.5">Admin</span>
              </div>
              
              <img src="/down-arrow-icon.svg" alt="" className="size-3 ml-2" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
