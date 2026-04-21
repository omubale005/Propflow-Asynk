import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Users,
  Target,
  IndianRupee,
  Star,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { teamMembers, leads, bookings } from '@/data/mockData';
import { useLocalEntityStore } from '@/lib/localStore';
import { cn, formatCurrency } from '@/lib/utils';
import type { User, UserRole } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

const roleColors: Record<UserRole, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  manager: 'bg-indigo-100 text-indigo-700',
  team_lead: 'bg-cyan-100 text-cyan-700',
  sales_executive: 'bg-green-100 text-green-700',
  telecaller: 'bg-orange-100 text-orange-700',
  accountant: 'bg-pink-100 text-pink-700',
  viewer: 'bg-gray-100 text-gray-700'
};

export function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const { items: memberItems, addItem: addMember, removeItem: removeMember } = useLocalEntityStore('team_members', teamMembers);

  const filteredMembers = memberItems.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getMemberStats = (memberId: string) => {
    const memberLeads = leads.filter(l => l.assignedTo === memberId);
    const memberBookings = bookings.filter(b => b.salesManagerId === memberId);
    const totalRevenue = memberBookings.reduce((acc, b) => acc + b.agreementValue, 0);
    
    return {
      leads: memberLeads.length,
      bookings: memberBookings.length,
      revenue: totalRevenue,
      conversionRate: memberLeads.length > 0 ? ((memberBookings.length / memberLeads.length) * 100).toFixed(1) : '0'
    };
  };

  const openMemberDetails = (member: User) => {
    setSelectedMember(member);
    setShowDetailsDialog(true);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]">
                <Plus className="w-4 h-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <AddMemberForm onClose={() => setShowAddDialog(false)} onAdd={(member) => addMember(member)} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: memberItems.length, icon: Users, color: 'bg-blue-500' },
          { label: 'Active', value: memberItems.filter(m => m.status === 'active').length, icon: Unlock, color: 'bg-green-500' },
          { label: 'Sales Team', value: memberItems.filter(m => m.role === 'sales_executive').length, icon: Target, color: 'bg-orange-500' },
          { label: 'Avg Conversion', value: '7.1%', icon: TrendingUp, color: 'bg-purple-500' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color.replace('bg-', 'bg-opacity-10 '))}>
                  <stat.icon className={cn("w-5 h-5", stat.color.replace('bg-', 'text-'))} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Team Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const stats = getMemberStats(member.id);
          
          return (
            <Card key={member.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-[#0082f3]/10 text-[#0082f3] text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#0082f3] transition-colors">
                        {member.name}
                      </h3>
                      <Badge className={cn("text-xs capitalize mt-1", roleColors[member.role])}>
                        {member.role.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openMemberDetails(member)}>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Member</DropdownMenuItem>
                      <DropdownMenuItem>View Performance</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onSelect={() => removeMember(member.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {member.phone}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{stats.leads}</p>
                    <p className="text-xs text-gray-500">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{stats.bookings}</p>
                    <p className="text-xs text-gray-500">Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#0082f3]">{stats.conversionRate}%</p>
                    <p className="text-xs text-gray-500">Conversion</p>
                  </div>
                </div>

                {stats.revenue > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Revenue Generated</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(stats.revenue)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Member Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Team Member Profile</DialogTitle>
          </DialogHeader>
          {selectedMember && <MemberDetails member={selectedMember} />}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function MemberDetails({ member }: { member: User }) {
  const stats = {
    leads: leads.filter(l => l.assignedTo === member.id).length,
    bookings: bookings.filter(b => b.salesManagerId === member.id).length,
    revenue: bookings.filter(b => b.salesManagerId === member.id).reduce((acc, b) => acc + b.agreementValue, 0),
    siteVisits: 45,
    callsMade: 320
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={member.avatar} />
          <AvatarFallback className="bg-[#0082f3]/10 text-[#0082f3] text-2xl">
            {member.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
          <Badge className={cn("text-sm capitalize mt-1", roleColors[member.role])}>
            {member.role.replace(/_/g, ' ')}
          </Badge>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {member.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {member.phone}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Leads', value: stats.leads },
          { label: 'Bookings', value: stats.bookings },
          { label: 'Site Visits', value: stats.siteVisits },
          { label: 'Calls Made', value: stats.callsMade },
        ].map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Performance</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Revenue Generated</span>
            <span className="text-xl font-bold text-[#0082f3]">{formatCurrency(stats.revenue)}</span>
          </div>
          <Progress value={65} className="h-2" />
          <p className="text-sm text-gray-500 mt-2">65% of monthly target achieved</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Permissions</h3>
        <div className="flex flex-wrap gap-2">
          {member.permissions.map((permission) => (
            <Badge key={permission} variant="outline" className="text-xs capitalize">
              {permission.replace(/_/g, ' ')}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 bg-[#0082f3] hover:bg-[#2895f7]">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
        <Button variant="outline" className="flex-1">
          <Lock className="w-4 h-4 mr-2" />
          Reset Password
        </Button>
      </div>
    </div>
  );
}

function AddMemberForm({ onClose, onAdd }: { onClose: () => void; onAdd: (member: User) => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('sales_executive');

  const handleAdd = () => {
    const template = teamMembers[0];
    const name = `${firstName || 'New'} ${lastName || 'Member'}`.trim();
    const newMember: User = {
      ...template,
      id: `member-${Date.now()}`,
      name,
      email: email || `user${Math.floor(Math.random() * 1000)}@propflow.com`,
      phone: phone || template.phone,
      role,
      status: 'active',
      createdAt: new Date(),
      lastLogin: undefined,
      permissions: template.permissions,
      avatar: template.avatar,
    };
    onAdd(newMember);
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Role</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
          <option value="sales_executive">Sales Executive</option>
          <option value="telecaller">Telecaller</option>
          <option value="manager">Manager</option>
          <option value="accountant">Accountant</option>
          <option value="team_lead">Team Lead</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={handleAdd}>Add Member</Button>
      </div>
    </div>
  );
}
