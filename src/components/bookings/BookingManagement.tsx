import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  FileText,
  IndianRupee,
  Calendar,
  User,
  Home,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  CreditCard,
  Percent
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
import { bookings, leads, inventoryUnits } from '@/data/mockData';
import { useLocalEntityStore } from '@/lib/localStore';
import { cn, formatCurrency } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/types';

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

const statusColors: Record<BookingStatus, string> = {
  token_received: 'bg-blue-100 text-blue-700',
  booking_form_signed: 'bg-indigo-100 text-indigo-700',
  agreement_signed: 'bg-purple-100 text-purple-700',
  registration_done: 'bg-pink-100 text-pink-700',
  loan_approved: 'bg-cyan-100 text-cyan-700',
  loan_disbursed: 'bg-teal-100 text-teal-700',
  possession_given: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

const statusProgress: Record<BookingStatus, number> = {
  token_received: 10,
  booking_form_signed: 25,
  agreement_signed: 40,
  registration_done: 60,
  loan_approved: 75,
  loan_disbursed: 90,
  possession_given: 100,
  cancelled: 0
};

export function BookingManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const { items: bookingItems, addItem: addBooking, removeItem: removeBooking } = useLocalEntityStore('bookings', bookings);

  const filteredBookings = bookingItems.filter(booking => {
    const matchesSearch = 
      booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const thisMonthBookings = filteredBookings.filter(b => {
    const bookingDate = new Date(b.bookingDate);
    const now = new Date();
    return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
  });

  const totalRevenue = filteredBookings.reduce((acc, b) => acc + b.agreementValue, 0);
  const totalCommission = filteredBookings.reduce((acc, b) => acc + (b.commission?.totalCommission || 0), 0);

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
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
              placeholder="Search bookings..."
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
          <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]">
                <Plus className="w-4 h-4" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
              </DialogHeader>
              <NewBookingForm onClose={() => setShowBookingDialog(false)} onAdd={(booking) => addBooking(booking)} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: filteredBookings.length, icon: FileText, color: 'bg-blue-500' },
          { label: 'This Month', value: thisMonthBookings.length, icon: Calendar, color: 'bg-green-500' },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: IndianRupee, color: 'bg-purple-500' },
          { label: 'Commission', value: formatCurrency(totalCommission), icon: Percent, color: 'bg-orange-500' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color.replace('bg-', 'bg-opacity-10 '))}>
                  <stat.icon className={cn("w-5 h-5", stat.color.replace('bg-', 'text-'))} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Bookings List */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agreement Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#0082f3]/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-[#0082f3]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.bookingNumber}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(booking.bookingDate).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.leadName}</p>
                          <p className="text-xs text-gray-500">{booking.leadPhone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.unitNumber}</p>
                          <p className="text-xs text-gray-500">{booking.projectName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn("text-xs capitalize", statusColors[booking.status])}>
                          {booking.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32">
                          <Progress value={statusProgress[booking.status]} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{statusProgress[booking.status]}%</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(booking.agreementValue)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(booking.commission?.netCommission || 0)}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs ml-2",
                              booking.commission?.status === 'paid' && "border-green-500 text-green-600",
                              booking.commission?.status === 'pending' && "border-orange-500 text-orange-600",
                              booking.commission?.status === 'partially_paid' && "border-blue-500 text-blue-600"
                            )}
                          >
                            {booking.commission?.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => openBookingDetails(booking)}
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
                              <DropdownMenuItem>Update Status</DropdownMenuItem>
                              <DropdownMenuItem>View Documents</DropdownMenuItem>
                              <DropdownMenuItem>Payment Schedule</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Cancel Booking</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={() => removeBooking(booking.id)}
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

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && <BookingDetails booking={selectedBooking} />}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function BookingDetails({ booking }: { booking: typeof bookings[0] }) {
  return (
    <div className="space-y-6 py-4">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        <div>
          <p className="text-sm text-gray-500">Booking Number</p>
          <p className="text-xl font-bold text-gray-900">{booking.bookingNumber}</p>
        </div>
        <Badge className={cn("text-sm px-4 py-1 capitalize", statusColors[booking.status])}>
          {booking.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Customer & Unit Info */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4" />
            Customer Details
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="font-medium text-gray-900">{booking.leadName}</p>
            <p className="text-sm text-gray-600">{booking.leadPhone}</p>
            <p className="text-sm text-gray-600">{booking.leadEmail}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Unit Details
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="font-medium text-gray-900">{booking.unitNumber}</p>
            <p className="text-sm text-gray-600">{booking.projectName}</p>
            <p className="text-sm text-gray-600">{booking.builderName}</p>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <IndianRupee className="w-4 h-4" />
          Financial Details
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Agreement Value</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(booking.agreementValue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Token Amount</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(booking.tokenAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Mode</p>
              <p className="text-lg font-bold text-gray-900 uppercase">{booking.tokenPaymentMode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Milestones */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payment Schedule
        </h3>
        <div className="space-y-2">
          {booking.milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  milestone.status === 'paid' ? "bg-green-100" : "bg-gray-200"
                )}>
                  {milestone.status === 'paid' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{milestone.name}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(milestone.dueDate).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(milestone.amount)}</p>
                <Badge variant={milestone.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                  {milestone.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Details */}
      {booking.commission && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Commission Details
          </h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Commission</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(booking.commission.totalCommission)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">TDS (5%)</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(booking.commission.tdsAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GST (18%)</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(booking.commission.gstAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Net Commission</p>
                <p className="text-lg font-bold text-[#0082f3]">{formatCurrency(booking.commission.netCommission)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button className="flex-1 bg-[#0082f3] hover:bg-[#2895f7]">
          <Edit className="w-4 h-4 mr-2" />
          Update Status
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download Agreement
        </Button>
      </div>
    </div>
  );
}

function NewBookingForm({ onClose, onAdd }: { onClose: () => void; onAdd: (booking: Booking) => void }) {
  const [leadId, setLeadId] = useState(leads[0]?.id ?? '');
  const [unitId, setUnitId] = useState(inventoryUnits[0]?.id ?? '');
  const [tokenAmount, setTokenAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'cheque' | 'neft' | 'rtgs' | 'upi'>('upi');
  const [reference, setReference] = useState('');
  const [paymentPlan, setPaymentPlan] = useState<'construction_linked' | 'time_linked' | 'down_payment' | 'flexi_payment'>('construction_linked');

  const handleAdd = () => {
    const template = bookings[0];
    const lead = leads.find(l => l.id === leadId) ?? leads[0];
    const unit = inventoryUnits.find(u => u.id === unitId) ?? inventoryUnits[0];
    const newBooking: Booking = {
      ...template,
      id: `booking-${Date.now()}`,
      bookingNumber: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      leadId: lead?.id ?? template.leadId,
      leadName: lead?.name ?? template.leadName,
      leadPhone: lead?.phone ?? template.leadPhone,
      leadEmail: lead?.email ?? template.leadEmail,
      unitId: unit?.id ?? template.unitId,
      unitNumber: unit?.unitNumber ?? template.unitNumber,
      projectId: unit?.projectId ?? template.projectId,
      projectName: unit?.projectName ?? template.projectName,
      builderId: unit?.builderId ?? template.builderId,
      builderName: unit?.builderName ?? template.builderName,
      bookingDate: new Date(),
      agreementValue: unit?.totalPrice ?? template.agreementValue,
      tokenAmount: Number.isFinite(tokenAmount) ? tokenAmount : template.tokenAmount,
      tokenPaymentDate: new Date(),
      tokenPaymentMode: paymentMode,
      tokenReference: reference || undefined,
      status: 'token_received',
      paymentPlan,
      milestones: template.milestones,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onAdd(newBooking);
    onClose();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Lead</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={leadId} onChange={(e) => setLeadId(e.target.value)}>
          {leads.filter(l => l.status === 'booking_pending' || l.status === 'negotiation').map(l => (
            <option key={l.id} value={l.id}>{l.name} - {l.phone}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Select Unit</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={unitId} onChange={(e) => setUnitId(e.target.value)}>
          {inventoryUnits.filter(u => u.status === 'available' || u.status === 'blocked').map(u => (
            <option key={u.id} value={u.id}>{u.unitNumber} - {u.projectName}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Token Amount</label>
          <Input type="number" placeholder="Enter token amount" value={tokenAmount} onChange={(e) => setTokenAmount(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Mode</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as typeof paymentMode)}>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="neft">NEFT</option>
            <option value="rtgs">RTGS</option>
            <option value="upi">UPI</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Reference Number</label>
        <Input placeholder="Enter reference/UTR number" value={reference} onChange={(e) => setReference(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Payment Plan</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={paymentPlan} onChange={(e) => setPaymentPlan(e.target.value as typeof paymentPlan)}>
          <option value="construction_linked">Construction Linked</option>
          <option value="time_linked">Time Linked</option>
          <option value="down_payment">Down Payment</option>
          <option value="flexi_payment">Flexi Payment</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={handleAdd}>Create Booking</Button>
      </div>
    </div>
  );
}
