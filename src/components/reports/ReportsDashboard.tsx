import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  IndianRupee,
  Download,
  Calendar,
  Filter,
  FileText,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Building2,
  MapPin,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { dashboardStats, leads, bookings, projects } from '@/data/mockData';
import { cn, formatCurrency } from '@/lib/utils';

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

const COLORS = ['#0082f3', '#44a9fa', '#ff8f35', '#00c853', '#ff5252', '#9c27b0'];

export function ReportsDashboard() {
  const [dateRange, setDateRange] = useState('month');

  // Sample data for charts
  const leadSourceData = [
    { name: 'Website', value: 350 },
    { name: 'Facebook', value: 180 },
    { name: 'Google Ads', value: 220 },
    { name: 'Referral', value: 150 },
    { name: '99acres', value: 120 },
    { name: 'Other', value: 230 }
  ];

  const monthlyPerformanceData = [
    { month: 'Jan', leads: 85, bookings: 5, revenue: 4.5 },
    { month: 'Feb', leads: 92, bookings: 8, revenue: 7.2 },
    { month: 'Mar', leads: 108, bookings: 12, revenue: 10.8 },
    { month: 'Apr', leads: 95, bookings: 10, revenue: 9.5 },
    { month: 'May', leads: 120, bookings: 15, revenue: 14.2 },
    { month: 'Jun', leads: 135, bookings: 18, revenue: 17.1 },
  ];

  const conversionFunnelData = [
    { stage: 'Leads', count: 1250 },
    { stage: 'Contacted', count: 980 },
    { stage: 'Qualified', count: 650 },
    { stage: 'Site Visits', count: 420 },
    { stage: 'Negotiation', count: 180 },
    { stage: 'Bookings', count: 89 }
  ];

  const teamPerformanceData = [
    { name: 'Amit Kumar', leads: 45, bookings: 8, revenue: 8.5 },
    { name: 'Sneha Gupta', leads: 38, bookings: 6, revenue: 6.2 },
    { name: 'Priya Patel', leads: 52, bookings: 10, revenue: 12.1 },
    { name: 'Rahul Sharma', leads: 30, bookings: 5, revenue: 5.8 }
  ];

  const projectPerformanceData = projects.map(p => ({
    name: p.name,
    bookings: bookings.filter(b => b.projectId === p.id).length,
    revenue: bookings.filter(b => b.projectId === p.id).reduce((acc, b) => acc + b.agreementValue, 0) / 10000000
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Comprehensive insights into your business performance</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            className="px-3 py-2 border rounded-lg"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Custom Range
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Leads', 
            value: dashboardStats.totalLeads, 
            change: '+12.5%', 
            icon: Users, 
            color: 'bg-blue-500',
            trend: 'up'
          },
          { 
            label: 'Conversion Rate', 
            value: `${dashboardStats.conversionRate}%`, 
            change: '+1.2%', 
            icon: TrendingUp, 
            color: 'bg-green-500',
            trend: 'up'
          },
          { 
            label: 'Total Revenue', 
            value: formatCurrency(dashboardStats.totalRevenue), 
            change: '+18.9%', 
            icon: IndianRupee, 
            color: 'bg-purple-500',
            trend: 'up'
          },
          { 
            label: 'Avg Deal Value', 
            value: formatCurrency(dashboardStats.averageDealValue), 
            change: '+5.3%', 
            icon: Target, 
            color: 'bg-orange-500',
            trend: 'up'
          },
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
              <div className="flex items-center gap-1 mt-2">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-500" />
                )}
                <span className={cn("text-xs", stat.trend === 'up' ? "text-green-600" : "text-red-600")}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-400">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyPerformanceData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0082f3" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0082f3" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Area 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="revenue" 
                        name="Revenue (Cr)" 
                        stroke="#ff8f35" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        strokeWidth={2}
                      />
                      <Bar yAxisId="left" dataKey="leads" name="Leads" fill="#0082f3" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="bookings" name="Bookings" fill="#00c853" radius={[4, 4, 0, 0]} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Lead Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={leadSourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {leadSourceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnelData.map((stage, index) => {
                    const prevCount = index > 0 ? conversionFunnelData[index - 1].count : stage.count;
                    const conversionRate = index > 0 ? ((stage.count / prevCount) * 100).toFixed(1) : '100';
                    
                    return (
                      <div key={stage.stage} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-gray-700">{stage.stage}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#0082f3] to-[#44a9fa] rounded-full flex items-center justify-end pr-2"
                                style={{ width: `${(stage.count / conversionFunnelData[0].count) * 100}%` }}
                              >
                                <span className="text-white text-sm font-medium">{stage.count}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index > 0 && (
                          <div className="w-20 text-right">
                            <Badge variant="outline" className="text-xs">
                              {conversionRate}% conv.
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lead Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { status: 'New', count: 180 },
                      { status: 'Contacted', count: 220 },
                      { status: 'Qualified', count: 150 },
                      { status: 'Site Visit', count: 145 },
                      { status: 'Negotiation', count: 80 },
                      { status: 'Booking', count: 45 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0082f3" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lead Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ReLineChart data={monthlyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="leads" stroke="#0082f3" strokeWidth={2} dot={{ fill: '#0082f3' }} />
                    </ReLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyPerformanceData}>
                      <defs>
                        <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00c853" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00c853" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => `₹${value} Cr`} />
                      <Area type="monotone" dataKey="revenue" stroke="#00c853" fillOpacity={1} fill="url(#colorRevenue2)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bookings vs Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { month: 'Jan', actual: 5, target: 8 },
                      { month: 'Feb', actual: 8, target: 10 },
                      { month: 'Mar', actual: 12, target: 12 },
                      { month: 'Apr', actual: 10, target: 12 },
                      { month: 'May', actual: 15, target: 15 },
                      { month: 'Jun', actual: 18, target: 18 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="actual" name="Actual Bookings" fill="#0082f3" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" name="Target" fill="#e0e0e0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={teamPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="leads" name="Leads" fill="#0082f3" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="bookings" name="Bookings" fill="#00c853" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="revenue" name="Revenue (Cr)" fill="#ff8f35" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={projectPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="bookings" name="Bookings" fill="#0082f3" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="revenue" name="Revenue (Cr)" fill="#00c853" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
