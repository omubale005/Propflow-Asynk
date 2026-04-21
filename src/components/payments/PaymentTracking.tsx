import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  IndianRupee,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Eye,
  MoreHorizontal,
  TrendingUp,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar
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
import { payments, bookings } from '@/data/mockData';
import { useLocalEntityStore } from '@/lib/localStore';
import { cn, formatCurrency } from '@/lib/utils';
import type { Payment, PaymentStatus, PaymentType } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
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

const statusColors: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  received: 'bg-blue-100 text-blue-700',
  cleared: 'bg-green-100 text-green-700',
  bounced: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700'
};

const paymentTypeColors: Record<PaymentType, string> = {
  token: 'bg-purple-100 text-purple-700',
  booking_amount: 'bg-blue-100 text-blue-700',
  agreement: 'bg-indigo-100 text-indigo-700',
  milestone: 'bg-cyan-100 text-cyan-700',
  registration: 'bg-pink-100 text-pink-700',
  stamp_duty: 'bg-orange-100 text-orange-700',
  gst: 'bg-teal-100 text-teal-700',
  other: 'bg-gray-100 text-gray-700'
};

export function PaymentTracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const { items: paymentItems, addItem: addPayment, removeItem: removePayment } = useLocalEntityStore('payments', payments);

  const filteredPayments = paymentItems.filter(payment => {
    const matchesSearch = 
      payment.paymentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalReceived = payments.filter(p => p.status === 'cleared').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0);

  const monthlyData = [
    { month: 'Jan', received: 2500000, pending: 800000 },
    { month: 'Feb', received: 3200000, pending: 600000 },
    { month: 'Mar', received: 4500000, pending: 1200000 },
    { month: 'Apr', received: 3800000, pending: 900000 },
    { month: 'May', received: 5200000, pending: 1500000 },
    { month: 'Jun', received: 6100000, pending: 1100000 },
  ];

  const openPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
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
              placeholder="Search payments..."
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
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
              </DialogHeader>
              <AddPaymentForm onClose={() => setShowAddDialog(false)} onAdd={(payment) => addPayment(payment)} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Received', value: totalReceived, icon: CheckCircle2, color: 'bg-green-500', change: '+22%' },
          { label: 'Pending', value: totalPending, icon: Clock, color: 'bg-orange-500', change: '+8%' },
          { label: 'This Month', value: payments.filter(p => new Date(p.receivedAt).getMonth() === new Date().getMonth()).reduce((acc, p) => acc + p.amount, 0), icon: Calendar, color: 'bg-blue-500', change: '+15%' },
          { label: 'YTD Collections', value: totalReceived, icon: Wallet, color: 'bg-purple-500', change: '+28%' },
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
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c853" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00c853" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="received" 
                  name="Received" 
                  stroke="#00c853" 
                  fillOpacity={1} 
                  fill="url(#colorReceived)" 
                  strokeWidth={2}
                />
                <Bar dataKey="pending" name="Pending" fill="#ff8f35" radius={[4, 4, 0, 0]} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payments List */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#0082f3]/10 flex items-center justify-center">
                            <IndianRupee className="w-5 h-5 text-[#0082f3]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{payment.paymentNumber}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{payment.referenceNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{payment.leadName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn("text-xs capitalize", paymentTypeColors[payment.paymentType])}>
                          {payment.paymentType.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700 uppercase">{payment.paymentMode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn("text-xs capitalize", statusColors[payment.status])}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {new Date(payment.receivedAt).toLocaleDateString('en-IN')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => openPaymentDetails(payment)}
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
                              <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Cleared</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Reverse Payment</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={() => removePayment(payment.id)}
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && <PaymentDetails payment={selectedPayment} />}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function PaymentDetails({ payment }: { payment: Payment }) {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        <div>
          <p className="text-sm text-gray-500">Payment Number</p>
          <p className="text-xl font-bold text-gray-900">{payment.paymentNumber}</p>
        </div>
        <Badge className={cn("text-sm px-4 py-1 capitalize", statusColors[payment.status])}>
          {payment.status}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Customer</span>
          <span className="font-medium">{payment.leadName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Type</span>
          <Badge className={cn("text-xs capitalize", paymentTypeColors[payment.paymentType])}>
            {payment.paymentType.replace(/_/g, ' ')}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Mode</span>
          <span className="font-medium uppercase">{payment.paymentMode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Reference Number</span>
          <span className="font-medium">{payment.referenceNumber || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Bank Name</span>
          <span className="font-medium">{payment.bankName || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Received By</span>
          <span className="font-medium">{payment.receivedByName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Received Date</span>
          <span className="font-medium">{new Date(payment.receivedAt).toLocaleDateString('en-IN')}</span>
        </div>
      </div>

      <div className="bg-[#0082f3]/5 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount</span>
          <span className="text-2xl font-bold text-[#0082f3]">{formatCurrency(payment.amount)}</span>
        </div>
      </div>

      {payment.remarks && (
        <div className="space-y-2">
          <span className="text-gray-600">Remarks</span>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{payment.remarks}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button className="flex-1 bg-[#0082f3] hover:bg-[#2895f7]">
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>
        <Button variant="outline" className="flex-1">
          <FileText className="w-4 h-4 mr-2" />
          View Booking
        </Button>
      </div>
    </div>
  );
}

function AddPaymentForm({ onClose, onAdd }: { onClose: () => void; onAdd: (payment: Payment) => void }) {
  const [bookingId, setBookingId] = useState(bookings[0]?.id ?? '');
  const [paymentType, setPaymentType] = useState<PaymentType>('token');
  const [amount, setAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'cheque' | 'neft' | 'rtgs' | 'upi' | 'demand_draft'>('upi');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleAdd = () => {
    const template = payments[0];
    const booking = bookings.find(b => b.id === bookingId) ?? bookings[0];
    const newPayment: Payment = {
      ...template,
      id: `payment-${Date.now()}`,
      paymentNumber: `PMT-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: booking?.id,
      bookingNumber: booking?.bookingNumber,
      leadId: booking?.leadId ?? template.leadId,
      leadName: booking?.leadName ?? template.leadName,
      amount: Number.isFinite(amount) ? amount : template.amount,
      paymentType,
      paymentMode,
      referenceNumber: referenceNumber || undefined,
      bankName: bankName || undefined,
      status: 'received',
      receivedAt: new Date(),
      remarks: remarks || undefined,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onAdd(newPayment);
    onClose();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Booking</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={bookingId} onChange={(e) => setBookingId(e.target.value)}>
          {bookings.map(b => (
            <option key={b.id} value={b.id}>{b.bookingNumber} - {b.leadName}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Payment Type</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={paymentType} onChange={(e) => setPaymentType(e.target.value as PaymentType)}>
          <option value="token">Token</option>
          <option value="booking_amount">Booking Amount</option>
          <option value="agreement">Agreement</option>
          <option value="milestone">Milestone</option>
          <option value="registration">Registration</option>
          <option value="stamp_duty">Stamp Duty</option>
          <option value="gst">GST</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Mode</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as typeof paymentMode)}>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="neft">NEFT</option>
            <option value="rtgs">RTGS</option>
            <option value="upi">UPI</option>
            <option value="demand_draft">Demand Draft</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Reference Number</label>
        <Input placeholder="Enter reference/UTR number" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bank Name</label>
        <Input placeholder="Enter bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Remarks</label>
        <textarea className="w-full px-3 py-2 border rounded-lg min-h-[80px]" placeholder="Add any remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={handleAdd}>Record Payment</Button>
      </div>
    </div>
  );
}
