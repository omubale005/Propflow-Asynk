import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Plus,
  MessageSquare,
  Phone,
  Mail,
  X,
  ChevronDown,
  Filter,
  Calendar,
  Users,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  isSidebarCollapsed: boolean;
  pageTitle: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Lead Assigned',
    message: 'A new lead "Rajesh Khanna" has been assigned to you',
    type: 'info',
    time: '5 min ago',
    isRead: false
  },
  {
    id: '2',
    title: 'Site Visit Reminder',
    message: 'Site visit scheduled for Lodha Park at 10:00 AM tomorrow',
    type: 'warning',
    time: '1 hour ago',
    isRead: false
  },
  {
    id: '3',
    title: 'Commission Credited',
    message: 'Commission of ₹92,400 has been credited to your account',
    type: 'success',
    time: '2 hours ago',
    isRead: true
  },
  {
    id: '4',
    title: 'Payment Overdue',
    message: 'Milestone payment for Booking BK-2024-0002 is overdue',
    type: 'error',
    time: '1 day ago',
    isRead: true
  }
];

export function Header({ isSidebarCollapsed, pageTitle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { user, logout } = useAuth();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200",
        "transition-all duration-300",
        isSidebarCollapsed ? "left-20" : "left-64"
      )}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Section - Page Title & Search */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
          
          {/* Global Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search leads, projects, bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-xl text-sm focus:bg-white transition-colors"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs font-medium text-gray-400 bg-gray-100 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <Dialog open={showQuickActions} onOpenChange={setShowQuickActions}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="hidden sm:flex items-center gap-2 bg-[#0082f3] hover:bg-[#2895f7] rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Quick Add</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Quick Actions</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <QuickActionButton icon={Users} label="Add Lead" color="bg-blue-500" />
                <QuickActionButton icon={Calendar} label="Schedule Visit" color="bg-green-500" />
                <QuickActionButton icon={FileText} label="New Booking" color="bg-purple-500" />
                <QuickActionButton icon={Phone} label="Log Call" color="bg-orange-500" />
                <QuickActionButton icon={MessageSquare} label="Send WhatsApp" color="bg-green-600" />
                <QuickActionButton icon={Mail} label="Send Email" color="bg-red-500" />
              </div>
            </DialogContent>
          </Dialog>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#ff8f35] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button className="text-sm text-[#0082f3] hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0",
                          !notification.isRead && "bg-blue-50/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-2 h-2 mt-2 rounded-full flex-shrink-0",
                            notification.type === 'info' && "bg-blue-500",
                            notification.type === 'success' && "bg-green-500",
                            notification.type === 'warning' && "bg-yellow-500",
                            notification.type === 'error' && "bg-red-500"
                          )} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-[#0082f3] rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <button onClick={() => { setShowNotifications(false); navigate('/notifications'); }} className="w-full text-center text-sm text-[#0082f3] font-medium hover:underline">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role ? user.role.replace('_', ' ') : ''}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={(event) => {
                  event.preventDefault();
                  logout();
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function QuickActionButton({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <button className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
