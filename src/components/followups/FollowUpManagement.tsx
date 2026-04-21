import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Phone,
  MessageSquare,
  Mail,
  Users,
  MapPin,
  Filter,
  ChevronDown,
  Trash2,
  Edit3,
  Bell,
  TrendingUp,
  ListTodo,
  CalendarCheck,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { leads, teamMembers } from '@/data/mockData';

interface FollowUpTask {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'site_visit' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue' | 'snoozed';
  dueDate: Date;
  dueTime?: string;
  notes: string;
  assignedTo: string;
  assignedToName: string;
  createdAt: Date;
  completedAt?: Date;
  reminderSet: boolean;
}

const typeIcons: Record<FollowUpTask['type'], React.ElementType> = {
  call: Phone,
  whatsapp: MessageSquare,
  email: Mail,
  meeting: Users,
  site_visit: MapPin,
  other: ListTodo,
};

const typeColors: Record<FollowUpTask['type'], string> = {
  call: 'bg-blue-100 text-blue-700',
  whatsapp: 'bg-green-100 text-green-700',
  email: 'bg-purple-100 text-purple-700',
  meeting: 'bg-orange-100 text-orange-700',
  site_visit: 'bg-teal-100 text-teal-700',
  other: 'bg-gray-100 text-gray-700',
};

const priorityColors: Record<FollowUpTask['priority'], string> = {
  high: 'text-red-600',
  medium: 'text-orange-500',
  low: 'text-blue-500',
};

const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 2);

const mockTasks: FollowUpTask[] = [
  { id: 't1', leadId: leads[0]?.id || 'l1', leadName: leads[0]?.name || 'Rajesh Khanna', leadPhone: leads[0]?.phone || '+91 98765 43210', type: 'call', priority: 'high', status: 'pending', dueDate: today, dueTime: '10:30 AM', notes: 'Discuss 3BHK options at Lodha Park. He seemed very interested last call.', assignedTo: '1', assignedToName: 'Rahul Sharma', createdAt: new Date(), reminderSet: true },
  { id: 't2', leadId: leads[1]?.id || 'l2', leadName: leads[1]?.name || 'Priya Nair', leadPhone: leads[1]?.phone || '+91 98765 43211', type: 'whatsapp', priority: 'high', status: 'pending', dueDate: today, dueTime: '11:00 AM', notes: 'Send project brochure and pricing sheet for Godrej Emerald.', assignedTo: '3', assignedToName: 'Amit Kumar', createdAt: new Date(), reminderSet: true },
  { id: 't3', leadId: leads[2]?.id || 'l3', leadName: leads[2]?.name || 'Suresh Iyer', leadPhone: leads[2]?.phone || '+91 98765 43212', type: 'meeting', priority: 'medium', status: 'pending', dueDate: today, dueTime: '2:00 PM', notes: 'Office meeting to discuss loan options and payment plans.', assignedTo: '1', assignedToName: 'Rahul Sharma', createdAt: new Date(), reminderSet: false },
  { id: 't4', leadId: leads[3]?.id || 'l4', leadName: leads[3]?.name || 'Kiran Desai', leadPhone: leads[3]?.phone || '+91 98765 43213', type: 'call', priority: 'high', status: 'overdue', dueDate: yesterday, dueTime: '4:00 PM', notes: 'Follow up on negotiation. Client was asking for 2% discount.', assignedTo: '3', assignedToName: 'Amit Kumar', createdAt: new Date(), reminderSet: true },
  { id: 't5', leadId: leads[4]?.id || 'l5', leadName: leads[4]?.name || 'Meera Reddy', leadPhone: leads[4]?.phone || '+91 98765 43214', type: 'site_visit', priority: 'medium', status: 'overdue', dueDate: yesterday, dueTime: '11:30 AM', notes: 'Confirm site visit arrangement for Prestige Jindal City.', assignedTo: '1', assignedToName: 'Rahul Sharma', createdAt: new Date(), reminderSet: false },
  { id: 't6', leadId: leads[0]?.id || 'l1', leadName: 'Vikram Shah', leadPhone: '+91 98800 11223', type: 'email', priority: 'low', status: 'pending', dueDate: tomorrow, dueTime: '9:00 AM', notes: 'Send updated floor plan PDFs and amenity details.', assignedTo: '2', assignedToName: 'Priya Patel', createdAt: new Date(), reminderSet: true },
  { id: 't7', leadId: leads[1]?.id || 'l2', leadName: 'Anita Joshi', leadPhone: '+91 98900 44556', type: 'call', priority: 'medium', status: 'pending', dueDate: tomorrow, dueTime: '3:30 PM', notes: 'Check in post site visit. Gauge interest level.', assignedTo: '3', assignedToName: 'Amit Kumar', createdAt: new Date(), reminderSet: false },
  { id: 't8', leadId: leads[2]?.id || 'l3', leadName: 'Deepak Verma', leadPhone: '+91 99100 77889', type: 'whatsapp', priority: 'low', status: 'pending', dueDate: dayAfter, dueTime: '10:00 AM', notes: 'Share virtual tour link for Shapoorji Pallonji project.', assignedTo: '1', assignedToName: 'Rahul Sharma', createdAt: new Date(), reminderSet: true },
  { id: 't9', leadId: leads[3]?.id || 'l4', leadName: 'Sonal Mehta', leadPhone: '+91 98765 11234', type: 'meeting', priority: 'high', status: 'completed', dueDate: yesterday, dueTime: '11:00 AM', notes: 'Budget discussion and final negotiation.', assignedTo: '1', assignedToName: 'Rahul Sharma', createdAt: new Date(), completedAt: yesterday, reminderSet: false },
  { id: 't10', leadId: leads[4]?.id || 'l5', leadName: 'Rohan Kapoor', leadPhone: '+91 98765 55678', type: 'call', priority: 'medium', status: 'completed', dueDate: yesterday, dueTime: '4:00 PM', notes: 'Confirm booking appointment date.', assignedTo: '3', assignedToName: 'Amit Kumar', createdAt: new Date(), completedAt: yesterday, reminderSet: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

export function FollowUpManagement() {
  const [tasks, setTasks] = useState<FollowUpTask[]>(mockTasks);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FollowUpTask['type'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<FollowUpTask['priority'] | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editTask, setEditTask] = useState<FollowUpTask | null>(null);

  const todayTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === today.toDateString() && t.status !== 'completed');
  const overdueTasks = tasks.filter(t => t.status === 'overdue');
  const upcomingTasks = tasks.filter(t => {
    const d = new Date(t.dueDate);
    return d > today && t.status === 'pending';
  });
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const filtered = (list: FollowUpTask[]) =>
    list.filter(t => {
      const s = search.toLowerCase();
      return (
        (!s || t.leadName.toLowerCase().includes(s) || t.notes.toLowerCase().includes(s)) &&
        (typeFilter === 'all' || t.type === typeFilter) &&
        (priorityFilter === 'all' || t.priority === priorityFilter) &&
        (assigneeFilter === 'all' || t.assignedTo === assigneeFilter)
      );
    });

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', completedAt: new Date() } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = (task: FollowUpTask) => {
    setTasks(prev => [task, ...prev]);
    setShowAddDialog(false);
  };

  const statsCards = [
    { label: "Today's Tasks", value: todayTasks.length, icon: CalendarCheck, color: 'bg-blue-500', light: 'bg-blue-50' },
    { label: 'Overdue', value: overdueTasks.length, icon: AlertCircle, color: 'bg-red-500', light: 'bg-red-50' },
    { label: 'Upcoming', value: upcomingTasks.length, icon: Clock, color: 'bg-amber-500', light: 'bg-amber-50' },
    { label: 'Completed Today', value: completedTasks.filter(t => new Date(t.completedAt || 0).toDateString() === today.toDateString()).length, icon: CheckCircle2, color: 'bg-emerald-500', light: 'bg-emerald-50' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn('p-2.5 rounded-xl', s.light)}>
                <s.icon className={cn('w-5 h-5', s.color.replace('bg-', 'text-'))} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters + Add */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 w-60" />
          </div>
          <Select value={typeFilter} onValueChange={v => setTypeFilter(v as any)}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {(['call','whatsapp','email','meeting','site_visit','other'] as const).map(t => (
                <SelectItem key={t} value={t}>{t.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={v => setPriorityFilter(v as any)}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Assignee" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              {teamMembers.filter(m => ['admin','manager','sales_executive'].includes(m.role)).map(m => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]">
              <Plus className="w-4 h-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Add Follow-Up Task</DialogTitle></DialogHeader>
            <AddTaskForm onAdd={addTask} onClose={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="today">
          <TabsList className="mb-4">
            <TabsTrigger value="today">
              Today <span className="ml-1.5 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">{filtered(todayTasks).length}</span>
            </TabsTrigger>
            <TabsTrigger value="overdue">
              Overdue <span className="ml-1.5 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full">{filtered(overdueTasks).length}</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {(['today', 'overdue', 'upcoming', 'completed'] as const).map(tab => {
            const listMap = { today: todayTasks, overdue: overdueTasks, upcoming: upcomingTasks, completed: completedTasks };
            return (
              <TabsContent key={tab} value={tab} className="space-y-3 mt-0">
                {filtered(listMap[tab]).length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No tasks here</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {tab === 'today' ? "Great job! All tasks for today are done." : "Nothing to show in this category."}
                    </p>
                  </div>
                ) : (
                  filtered(listMap[tab]).map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={completeTask}
                      onDelete={deleteTask}
                      onEdit={setEditTask}
                    />
                  ))
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </motion.div>

      {/* Edit Dialog */}
      {editTask && (
        <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
            <AddTaskForm
              initialTask={editTask}
              onAdd={(t) => {
                setTasks(prev => prev.map(x => x.id === t.id ? t : x));
                setEditTask(null);
              }}
              onClose={() => setEditTask(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}

function TaskCard({ task, onComplete, onDelete, onEdit }: {
  task: FollowUpTask;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (t: FollowUpTask) => void;
}) {
  const TypeIcon = typeIcons[task.type];
  const isOverdue = task.status === 'overdue';
  const isCompleted = task.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
    >
      <Card className={cn(
        'hover:shadow-md transition-all',
        isOverdue && 'border-red-200 bg-red-50/30',
        isCompleted && 'opacity-60'
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Complete toggle */}
            <button
              onClick={() => !isCompleted && onComplete(task.id)}
              className={cn('mt-0.5 flex-shrink-0 transition-colors', isCompleted ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-500')}
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('text-sm font-semibold text-gray-900', isCompleted && 'line-through text-gray-500')}>
                  {task.leadName}
                </span>
                <Badge className={cn('text-xs', typeColors[task.type])}>
                  <TypeIcon className="w-3 h-3 mr-1" />
                  {task.type.replace('_', ' ')}
                </Badge>
                <span className={cn('flex items-center gap-1 text-xs font-medium', priorityColors[task.priority])}>
                  {task.priority === 'high' && <Flame className="w-3 h-3" />}
                  {task.priority}
                </span>
                {isOverdue && <Badge className="text-xs bg-red-100 text-red-700">Overdue</Badge>}
                {task.reminderSet && <Bell className="w-3.5 h-3.5 text-amber-500" />}
              </div>

              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{task.notes}</p>

              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  {task.dueTime && ` · ${task.dueTime}`}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {task.leadPhone}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {task.assignedToName}
                </span>
                {isCompleted && task.completedAt && (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Done {new Date(task.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {!isCompleted && (
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => onComplete(task.id)}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => onDelete(task.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AddTaskForm({ onAdd, onClose, initialTask }: {
  onAdd: (t: FollowUpTask) => void;
  onClose: () => void;
  initialTask?: FollowUpTask;
}) {
  const [leadName, setLeadName] = useState(initialTask?.leadName || leads[0]?.name || '');
  const [leadPhone, setLeadPhone] = useState(initialTask?.leadPhone || leads[0]?.phone || '');
  const [type, setType] = useState<FollowUpTask['type']>(initialTask?.type || 'call');
  const [priority, setPriority] = useState<FollowUpTask['priority']>(initialTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialTask ? new Date(initialTask.dueDate).toISOString().slice(0,10) : new Date().toISOString().slice(0,10));
  const [dueTime, setDueTime] = useState(initialTask?.dueTime || '10:00 AM');
  const [notes, setNotes] = useState(initialTask?.notes || '');
  const [assignedTo, setAssignedTo] = useState(initialTask?.assignedTo || '1');
  const [reminderSet, setReminderSet] = useState(initialTask?.reminderSet ?? false);

  const member = teamMembers.find(m => m.id === assignedTo);

  const handleSubmit = () => {
    onAdd({
      id: initialTask?.id || `t-${Date.now()}`,
      leadId: initialTask?.leadId || leads[0]?.id || 'l1',
      leadName,
      leadPhone,
      type,
      priority,
      status: initialTask?.status || 'pending',
      dueDate: new Date(dueDate),
      dueTime,
      notes,
      assignedTo,
      assignedToName: member?.name || 'Rahul Sharma',
      createdAt: initialTask?.createdAt || new Date(),
      reminderSet,
    });
  };

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Lead Name</label>
          <Input value={leadName} onChange={e => setLeadName(e.target.value)} placeholder="Lead name" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Phone</label>
          <Input value={leadPhone} onChange={e => setLeadPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Task Type</label>
          <Select value={type} onValueChange={v => setType(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(['call','whatsapp','email','meeting','site_visit','other'] as const).map(t => (
                <SelectItem key={t} value={t}>{t.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Priority</label>
          <Select value={priority} onValueChange={v => setPriority(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Due Date</label>
          <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Time</label>
          <Input value={dueTime} onChange={e => setDueTime(e.target.value)} placeholder="10:30 AM" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Assigned To</label>
        <Select value={assignedTo} onValueChange={setAssignedTo}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {teamMembers.filter(m => ['admin','manager','sales_executive'].includes(m.role)).map(m => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add task notes or instructions..."
          className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#0082f3]/30 resize-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="reminder" checked={reminderSet} onChange={e => setReminderSet(e.target.checked)} className="w-4 h-4 rounded" />
        <label htmlFor="reminder" className="text-sm text-gray-700 cursor-pointer">Set reminder notification</label>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={handleSubmit}>
          {initialTask ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </div>
  );
}
