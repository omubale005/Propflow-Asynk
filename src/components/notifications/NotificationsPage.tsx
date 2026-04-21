import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  Check,
  Trash2,
  Archive,
  Filter,
  Clock,
  Info,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: Date;
  isRead: boolean;
  category: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Lead Assigned',
    message: 'A new lead "Rajesh Khanna" has been assigned to you. Budget: ₹1.5 Cr, interested in 3BHK at Lodha Park.',
    type: 'info',
    createdAt: new Date(Date.now() - 5 * 60000),
    isRead: false,
    category: 'Lead',
  },
  {
    id: '2',
    title: 'Site Visit Confirmed',
    message: 'Site visit scheduled for Priya Nair at Godrej Emerald on Mar 15, 2:00 PM. Pickup arranged.',
    type: 'success',
    createdAt: new Date(Date.now() - 25 * 60000),
    isRead: false,
    category: 'Site Visit',
  },
  {
    id: '3',
    title: 'Follow-up Reminder',
    message: 'You have 5 follow-up tasks due today. Don\'t miss any leads!',
    type: 'warning',
    createdAt: new Date(Date.now() - 1.5 * 3600000),
    isRead: false,
    category: 'Task',
  },
  {
    id: '4',
    title: 'Payment Overdue',
    message: 'Milestone payment for Booking BK-2024-0005 is 5 days overdue. Amount: ₹25,00,000.',
    type: 'error',
    createdAt: new Date(Date.now() - 3 * 3600000),
    isRead: false,
    category: 'Payment',
  },
  {
    id: '5',
    title: 'Commission Credited',
    message: 'Commission of ₹92,400 (after TDS) has been credited to your bank account for Booking BK-2024-0001.',
    type: 'success',
    createdAt: new Date(Date.now() - 5 * 3600000),
    isRead: true,
    category: 'Commission',
  },
  {
    id: '6',
    title: 'Booking Confirmed',
    message: 'Karthik Menon has confirmed booking for Unit T-301 at Prestige Jindal City. Token: ₹10,00,000.',
    type: 'success',
    createdAt: new Date(Date.now() - 8 * 3600000),
    isRead: true,
    category: 'Booking',
  },
  {
    id: '7',
    title: 'Lead Status Updated',
    message: 'Lead status for Suresh Iyer changed to "Site Visit Done" by Amit Kumar.',
    type: 'info',
    createdAt: new Date(Date.now() - 24 * 3600000),
    isRead: true,
    category: 'Lead',
  },
  {
    id: '8',
    title: 'System Maintenance',
    message: 'Scheduled maintenance window: Mar 20, 2:00 AM - 4:00 AM IST. System will be temporarily unavailable.',
    type: 'warning',
    createdAt: new Date(Date.now() - 48 * 3600000),
    isRead: true,
    category: 'System',
  },
  {
    id: '9',
    title: 'New Project Listed',
    message: 'Godrej Properties launched a new project: Godrej Aristocrat (Mumbai). 450 units, pre-launch phase.',
    type: 'info',
    createdAt: new Date(Date.now() - 72 * 3600000),
    isRead: true,
    category: 'Project',
  },
];

const typeIcons: Record<Notification['type'], React.ElementType> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const typeColors: Record<Notification['type'], string> = {
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  error: 'bg-red-100 text-red-700 border-red-200',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<Notification['type'] | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const categories = Array.from(new Set(notifications.map(n => n.category)));

  const filtered = notifications.filter(n => {
    const matchesSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'unread' ? !n.isRead : n.isRead);
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: notifications.length, color: 'bg-gray-500' },
          { label: 'Unread', value: unreadCount, color: 'bg-blue-500', highlight: true },
          { label: 'Today', value: notifications.filter(n => new Date(n.createdAt).toDateString() === new Date().toDateString()).length, color: 'bg-orange-500' },
          { label: 'This Week', value: notifications.filter(n => {
            const d = new Date(n.createdAt);
            const now = new Date();
            return (now.getTime() - d.getTime()) < 7 * 24 * 3600000;
          }).length, color: 'bg-purple-500' },
        ].map(s => (
          <Card key={s.label} className={s.highlight ? 'ring-2 ring-blue-400' : ''}>
            <CardContent className="p-4 flex items-center gap-2">
              <div className={cn('w-2 h-2 rounded-full', s.color)} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 w-64" />
          </div>
          <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread ({unreadCount})</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={v => setTypeFilter(v as any)}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={markAllAsRead}>
              <Check className="w-3.5 h-3.5" /> Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button size="sm" variant="outline" className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={deleteAll}>
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </Button>
          )}
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div variants={itemVariants} className="space-y-2">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
              <p className="text-sm text-gray-500 mt-1">
                {notifications.length === 0 ? 'You\'re all caught up!' : 'Try adjusting your filters'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map(notif => {
            const Icon = typeIcons[notif.type];
            return (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className={cn(
                  'transition-all cursor-pointer hover:shadow-md',
                  !notif.isRead && 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50/20'
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={cn('p-2.5 rounded-xl flex-shrink-0', typeColors[notif.type])}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={cn('font-semibold text-gray-900', !notif.isRead && 'text-blue-700')}>
                            {notif.title}
                          </h3>
                          <Badge className="text-xs bg-gray-100 text-gray-600">{notif.category}</Badge>
                          {!notif.isRead && <Badge className="text-xs bg-blue-100 text-blue-700">New</Badge>}
                        </div>
                        <p className="text-sm text-gray-700 mt-1 leading-relaxed">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(notif.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notif.isRead && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
