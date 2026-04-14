import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useCRM } from '../store/CRMContext';
import {
  LayoutDashboard, Users, UserCheck, CreditCard,
  FileText, BarChart3, Bell, Menu, X, Settings, HelpCircle,
  CircleDot, MapPin
} from 'lucide-react';

const workspaceItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/enquiries', icon: Users, label: 'Enquiry' },
  { to: '/follow-ups', icon: Bell, label: 'Follow-ups' },
  { to: '/clients', icon: UserCheck, label: 'Clients' },
  { to: '/destinations', icon: MapPin, label: 'Destinations' },
];

const reportItems = [
  { to: '/payments', icon: CreditCard, label: 'Payments Report' },
  { to: '/reports', icon: FileText, label: 'Enquiry Report' },
  { to: '/budget', icon: BarChart3, label: 'Budget Report' },
];


export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { notifications } = useCRM();
  const unreadCount = notifications.filter(n => !n.read).length;


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatHeaderDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const renderNavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/'}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
          isActive
            ? 'bg-white text-[#8B1A1A]'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {label}
    </NavLink>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Dark Maroon */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-[#8B1A1A] transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white font-bold text-[15px] leading-tight tracking-wide">DESTINATION WEDDING</h1>
              <p className="text-white/60 text-[10px] tracking-widest uppercase mt-0.5">Management Portal</p>
            </div>
            <button className="lg:hidden text-white/70" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 space-y-6">
          {/* Workspace Section */}
          <div>
            <p className="text-white/40 text-[10px] font-semibold tracking-[0.15em] uppercase px-4 mb-2">Workspace</p>
            <nav className="space-y-1">
              {workspaceItems.map(renderNavItem)}
            </nav>
          </div>

          {/* Reports Section */}
          <div>
            <p className="text-white/40 text-[10px] font-semibold tracking-[0.15em] uppercase px-4 mb-2">Reports</p>
            <nav className="space-y-1">
              {reportItems.map(renderNavItem)}
            </nav>
          </div>

        </div>

        {/* Bottom */}
        <div className="px-3 pb-4">
          <div className="flex items-center gap-2 px-4 py-2 text-white/60 text-[12px]">
            <CircleDot className="w-3 h-3 text-green-400" />
            <span>Online</span>
            <span className="ml-auto">{currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 shrink-0 shadow-sm">
          <button className="lg:hidden mr-3" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#8B1A1A] rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">DW</span>
            </div>
            <span className="text-[#8B1A1A] font-bold text-sm hidden md:block">DESTINATION WEDDING</span>
          </div>

          {/* Date/Time - Center */}
          <div className="hidden md:flex items-center gap-2 mx-auto">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full text-xs text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {formatHeaderDate(currentTime)}
            </div>
          </div>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <HelpCircle className="w-[18px] h-[18px]" />
            </button>
            <NavLink to="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </NavLink>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Settings className="w-[18px] h-[18px]" />
            </button>
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-[#8B1A1A] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">SA</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-800 leading-none">Admin</p>
                <p className="text-[10px] text-gray-400">Superadmin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
