import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  MapPin,
  IndianRupee,
  ArrowUpDown,
  Download,
  Upload,
  User,
  Building2,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { leads, teamMembers } from '@/data/mockData';
import { useLocalEntityStore } from '@/lib/localStore';
import { cn, formatCurrency } from '@/lib/utils';
import type { Lead, LeadStatus, LeadSource, PropertyType } from '@/types';
import { LeadDetailDrawer } from './LeadDetailDrawer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-indigo-100 text-indigo-700',
  qualified: 'bg-purple-100 text-purple-700',
  site_visit_scheduled: 'bg-pink-100 text-pink-700',
  site_visit_done: 'bg-orange-100 text-orange-700',
  negotiation: 'bg-yellow-100 text-yellow-700',
  booking_pending: 'bg-cyan-100 text-cyan-700',
  booked: 'bg-emerald-100 text-emerald-700',
  closed_won: 'bg-green-100 text-green-700',
  closed_lost: 'bg-red-100 text-red-700',
  dropped: 'bg-gray-100 text-gray-700'
};

const priorityColors = {
  hot: 'bg-red-500',
  warm: 'bg-orange-500',
  cold: 'bg-blue-500'
};

const leadSources: LeadSource[] = [
  'website', 'facebook', 'instagram', 'google_ads', 'referral', 'walk_in',
  'just_dial', '99acres', 'magic_bricks', 'housing', 'commonfloor', 'other'
];

const propertyTypes: PropertyType[] = [
  '1bhk', '2bhk', '3bhk', '4bhk', '5bhk_plus', 'villa', 'penthouse', 'studio', 'commercial', 'plot'
];

export function LeadManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'hot' | 'warm' | 'cold' | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { items: leadItems, addItem: addLead, removeItem: removeLead } = useLocalEntityStore('leads', leads);

  const handleExport = () => {
    const headers = ['Lead#', 'Name', 'Email', 'Phone', 'Status', 'Priority', 'Budget', 'Source', 'Assigned To'];
    const rows = filteredLeads.map(l => [
      l.leadNumber, l.name, l.email, l.phone,
      l.status, l.priority, l.budget,
      l.source, l.assignedToName || 'Unassigned'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads_export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLeads = leadItems.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.leadNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesSource && matchesPriority;
  });

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header Actions */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-3 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | 'all')}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.keys(statusColors).map(status => (
                        <SelectItem key={status} value={status}>
                          {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Source</label>
                  <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as LeadSource | 'all')}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {leadSources.map(source => (
                        <SelectItem key={source} value={source}>
                          {source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
                  <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as typeof priorityFilter)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="cold">Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]">
                <Plus className="w-4 h-4" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <AddLeadForm
                onClose={() => setShowAddDialog(false)}
                onAdd={(lead) => addLead(lead)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: leadItems.length, change: '+12%', color: 'bg-blue-500' },
          { label: 'Hot Leads', value: leadItems.filter(l => l.priority === 'hot').length, change: '+5%', color: 'bg-red-500' },
          { label: 'Today\'s Follow-ups', value: 15, change: '+3%', color: 'bg-orange-500' },
          { label: 'Conversion Rate', value: '7.1%', change: '+1.2%', color: 'bg-green-500' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color.replace('bg-', 'bg-opacity-10 '))}>
                  <div className={cn("w-3 h-3 rounded-full", stat.color)} />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Leads Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <Checkbox 
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onCheckedChange={toggleAllSelection}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Follow-up</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Checkbox 
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => toggleLeadSelection(lead.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-[#0082f3]/10 text-[#0082f3] text-sm">
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-500">{lead.leadNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[150px]">{lead.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn("text-xs capitalize", statusColors[lead.status])}>
                          {lead.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2.5 h-2.5 rounded-full", priorityColors[lead.priority])} />
                          <span className="text-sm text-gray-700 capitalize">{lead.priority}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(lead.budget)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {lead.assignedToName ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                {lead.assignedToName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-700">{lead.assignedToName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {lead.nextFollowUp ? (
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(lead.nextFollowUp).toLocaleDateString('en-IN')}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="w-4 h-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageSquare className="w-4 h-4 text-gray-500" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedLead(lead)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Visit</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={() => removeLead(lead.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredLeads.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function AddLeadForm({ onClose, onAdd }: { onClose: () => void; onAdd: (lead: Lead) => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<LeadSource>('website');
  const [priority, setPriority] = useState<'hot' | 'warm' | 'cold'>('warm');
  const [budget, setBudget] = useState<number>(0);
  const [assignedTo, setAssignedTo] = useState<string>('');

  const handleAdd = () => {
    const template = leads[0];
    const assignedMember = teamMembers.find(member => member.id === assignedTo);
    const newLead: Lead = {
      ...template,
      id: `lead-${Date.now()}`,
      leadNumber: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${firstName || 'New'} ${lastName || 'Lead'}`.trim(),
      email,
      phone,
      source,
      priority,
      budget: Number.isFinite(budget) ? budget : 0,
      assignedTo: assignedMember?.id,
      assignedToName: assignedMember?.name,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: [],
      activities: []
    };
    onAdd(newLead);
    onClose();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <Input placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <Input placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <Input placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Source</label>
          <Select value={source} onValueChange={(v) => setSource(v as LeadSource)}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {leadSources.map(sourceOption => (
                <SelectItem key={sourceOption} value={sourceOption}>
                  {sourceOption.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select value={priority} onValueChange={(v) => setPriority(v as 'hot' | 'warm' | 'cold')}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Budget</label>
        <Input
          type="number"
          placeholder="Enter budget amount"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Assigned To</label>
        <Select value={assignedTo} onValueChange={setAssignedTo}>
          <SelectTrigger>
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map(member => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={handleAdd}>Add Lead</Button>
      </div>
    </div>
  );
}

export function LeadManagementWithDrawer() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  return (
    <>
      <LeadManagement />
      <LeadDetailDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </>
  );
}
