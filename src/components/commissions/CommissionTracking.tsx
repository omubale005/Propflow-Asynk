import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Eye,
  MoreHorizontal,
  FileText,
  ArrowUpRight,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { bookings } from '@/data/mockData';
import { useLocalEntityStore } from '@/lib/localStore';
import { cn, formatCurrency } from '@/lib/utils';
import type { Commission, CommissionStatus } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

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

const statusColors: Record<CommissionStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  partially_paid: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  hold: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700'
};

const COLORS = ['#0082f3', '#44a9fa', '#ff8f35', '#00c853', '#ff5252'];

export function CommissionTracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'all'>('all');
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const baseCommissions = bookings.map(b => b.commission).filter(Boolean) as Commission[];
  const { items: commissions, addItem: addCommission, removeItem: removeCommission } = useLocalEntityStore('commissions', baseCommissions);

  const filteredCommissions = commissions.filter(commission => {
    const booking = bookings.find(b => b.commission?.id === commission.id);
    const matchesSearch = 
      booking?.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking?.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalEarned = commissions.filter(c => c.status === 'paid').reduce((acc, c) => acc + c.netCommission, 0);
  const totalPending = commissions.filter(c => c.status === 'pending' || c.status === 'partially_paid').reduce((acc, c) => acc + c.netCommission, 0);
  const totalHold = commissions.filter(c => c.status === 'hold').reduce((acc, c) => acc + c.netCommission, 0);

  const monthlyData = [
    { month: 'Jan', earned: 850000, pending: 450000 },
    { month: 'Feb', earned: 1200000, pending: 600000 },
    { month: 'Mar', earned: 1500000, pending: 750000 },
    { month: 'Apr', earned: 1100000, pending: 550000 },
    { month: 'May', earned: 1800000, pending: 900000 },
    { month: 'Jun', earned: 2100000, pending: 1050000 },
  ];

  const statusData = [
    { name: 'Paid', value: commissions.filter(c => c.status === 'paid').length },
    { name: 'Pending', value: commissions.filter(c => c.status === 'pending').length },
    { name: 'Partially Paid', value: commissions.filter(c => c.status === 'partially_paid').length },
    { name: 'On Hold', value: commissions.filter(c => c.status === 'hold').length },
  ];

  const openCommissionDetails = (commission: Commission) => {
    setSelectedCommission(commission);
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
              placeholder="Search commissions..."
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
                <ArrowUpRight className="w-4 h-4" />
                Add Commission
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Commission</DialogTitle>
              </DialogHeader>
              <AddCommissionForm onClose={() => setShowAddDialog(false)} onAdd={(commission) => addCommission(commission)} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Earned', value: totalEarned, icon: CheckCircle2, color: 'bg-green-500', change: '+18%' },
          { label: 'Pending', value: totalPending, icon: Clock, color: 'bg-orange-500', change: '+5%' },
          { label: 'On Hold', value: totalHold, icon: XCircle, color: 'bg-red-500', change: '-2%' },
          { label: 'YTD Commission', value: totalEarned + totalPending, icon: TrendingUp, color: 'bg-blue-500', change: '+25%' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(stat.value)}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color.replace('bg-', 'bg-opacity-10 '))}>
                  <stat.icon className={cn("w-5 h-5", stat.color.replace('bg-', 'text-'))} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">{stat.change}</span>
                <span className="text-xs text-gray-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="earned" name="Earned" fill="#00c853" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#ff8f35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Commission Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Commission List */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Commission Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Commission</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Commission</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout Progress</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCommissions.map((commission) => {
                    const booking = bookings.find(b => b.commission?.id === commission.id);
                    if (!booking) return null;
                    
                    const paidPayouts = commission.payouts.filter(p => p.status === 'paid').length;
                    const totalPayouts = commission.payouts.length;
                    const payoutProgress = totalPayouts > 0 ? (paidPayouts / totalPayouts) * 100 : 0;
                    
                    return (
                      <tr key={commission.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0082f3]/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-[#0082f3]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{booking.bookingNumber}</p>
                              <p className="text-xs text-gray-500">{booking.projectName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{booking.leadName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(commission.totalCommission)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600">
                            <p>TDS: {formatCurrency(commission.tdsAmount)}</p>
                            <p>GST: {formatCurrency(commission.gstAmount)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-bold text-[#0082f3]">
                            {formatCurrency(commission.netCommission)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={cn("text-xs capitalize", statusColors[commission.status])}>
                            {commission.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-24">
                            <Progress value={payoutProgress} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">{paidPayouts}/{totalPayouts}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => openCommissionDetails(commission)}
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>View Payouts</DropdownMenuItem>
                                <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onSelect={() => removeCommission(commission.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Commission Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Commission Details</DialogTitle>
          </DialogHeader>
          {selectedCommission && <CommissionDetails commission={selectedCommission} />}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function CommissionDetails({ commission }: { commission: Commission }) {
  const booking = bookings.find(b => b.commission?.id === commission.id);
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        <div>
          <p className="text-sm text-gray-500">Booking</p>
          <p className="text-xl font-bold text-gray-900">{booking?.bookingNumber}</p>
        </div>
        <Badge className={cn("text-sm px-4 py-1 capitalize", statusColors[commission.status])}>
          {commission.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Commission Breakdown</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Commission</span>
              <span className="font-medium">{formatCurrency(commission.totalCommission)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>TDS (5%)</span>
              <span>-{formatCurrency(commission.tdsAmount)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>GST (18%)</span>
              <span>-{formatCurrency(commission.gstAmount)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-semibold">Net Commission</span>
              <span className="text-xl font-bold text-[#0082f3]">{formatCurrency(commission.netCommission)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Payout Schedule</h3>
          <div className="space-y-2">
            {commission.payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{payout.milestone}</p>
                  <p className="text-sm text-gray-500">{payout.percentage}% of commission</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(payout.amount)}</p>
                  <Badge 
                    variant={payout.status === 'paid' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {payout.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 bg-[#0082f3] hover:bg-[#2895f7]">
          <Download className="w-4 h-4 mr-2" />
          Download Invoice
        </Button>
        <Button variant="outline" className="flex-1">
          <FileText className="w-4 h-4 mr-2" />
          View Statement
        </Button>
      </div>
    </div>
  );
}

function AddCommissionForm({ onClose, onAdd }: { onClose: () => void; onAdd: (commission: Commission) => void }) {
  const [bookingId, setBookingId] = useState(bookings[0]?.id ?? '');
  const [totalCommission, setTotalCommission] = useState(100000);
  const [status, setStatus] = useState<CommissionStatus>('pending');

  const handleAdd = () => {
    const template = (bookings.map(b => b.commission).find(Boolean) as Commission) ?? {
      id: 'commission-template',
      bookingId: '',
      totalCommission: 0,
      tdsAmount: 0,
      gstAmount: 0,
      netCommission: 0,
      status: 'pending' as CommissionStatus,
      payouts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const tdsAmount = Math.round(totalCommission * 0.05);
    const gstAmount = Math.round(totalCommission * 0.18);
    const netCommission = totalCommission - tdsAmount - gstAmount;
    const newCommission: Commission = {
      ...template,
      id: `commission-${Date.now()}`,
      bookingId,
      totalCommission,
      tdsAmount,
      gstAmount,
      netCommission,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onAdd(newCommission);
    onClose();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Booking</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={bookingId} onChange={(e) => setBookingId(e.target.value)}>
          {bookings.map(booking => (
            <option key={booking.id} value={booking.id}>
              {booking.bookingNumber} - {booking.leadName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Total Commission</label>
        <Input type="number" value={totalCommission} onChange={(e) => setTotalCommission(Number(e.target.value))} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={status} onChange={(e) => setStatus(e.target.value as CommissionStatus)}>
          <option value="pending">Pending</option>
          <option value="partially_paid">Partially Paid</option>
          <option value="paid">Paid</option>
          <option value="hold">Hold</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={handleAdd}>Add Commission</Button>
      </div>
    </div>
  );
}
