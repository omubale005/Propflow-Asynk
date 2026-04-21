import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  MapPin,
  FileText,
  IndianRupee,
  Receipt,
  Phone,
  FolderOpen,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Briefcase,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { canAccessRoute } from '@/lib/access';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Leads', icon: Users, href: '/leads', badge: 15 },
  { label: 'Projects', icon: Building2, href: '/projects' },
  { label: 'Site Visits', icon: MapPin, href: '/site-visits', badge: 8 },
  { label: 'Bookings', icon: FileText, href: '/bookings' },
  { label: 'Commissions', icon: IndianRupee, href: '/commissions' },
  { label: 'Payments', icon: Receipt, href: '/payments' },
  { label: 'Team', icon: Briefcase, href: '/team' },
  { label: 'Reports', icon: BarChart3, href: '/reports' },
  { label: 'Follow-ups', icon: CheckCircle, href: '/follow-ups', badge: 5 },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const visibleMainNav = user
    ? mainNavItems.filter((item) => canAccessRoute(user.role, item.href))
    : [];
  const visibleBottomNav = user
    ? bottomNavItems.filter((item) => canAccessRoute(user.role, item.href))
    : [];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200",
        "flex flex-col shadow-lg"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0082f3] to-[#44a9fa] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">PropFlow</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0082f3] to-[#44a9fa] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={onToggle}
          className={cn(
            "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
            isCollapsed && "hidden"
          )}
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        {isCollapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleMainNav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onMouseEnter={() => setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
              "hover:bg-gray-50 group",
              isActive && "bg-gradient-to-r from-[#0082f3]/10 to-transparent text-[#0082f3]"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 flex-shrink-0 transition-colors",
              "text-gray-500 group-hover:text-[#0082f3]"
            )} />
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className={cn(
                    "text-sm font-medium whitespace-overflow-hidden",
                    "text-gray-700 group-hover:text-gray-900"
                  )}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Badge */}
            {item.badge && !isCollapsed && (
              <span className="ml-auto bg-[#ff8f35] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && hoveredItem === item.href && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50"
              >
                {item.label}
                {item.badge && (
                  <span className="ml-2 bg-[#ff8f35] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            )}

            {/* Active indicator */}
            <div className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#0082f3] transition-opacity",
              "opacity-0 group-[.active]:opacity-100"
            )} />
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-100 py-3 px-3 space-y-1">
        {visibleBottomNav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              "hover:bg-gray-50 group",
              isActive && "bg-gradient-to-r from-[#0082f3]/10 to-transparent text-[#0082f3]"
            )}
          >
            <item.icon className="w-5 h-5 text-gray-500 group-hover:text-[#0082f3]" />
            {!isCollapsed && (
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-gray-50",
          isCollapsed && "justify-center"
        )}>
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role ? user.role.replace('_', ' ') : ''}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
