import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  MapPin,
  FileText,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { dashboardStats, leadSourceChartData } from "@/data/mockData";
import { cn, formatCurrency } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const statsCards = [
  {
    title: "Total Leads",
    value: dashboardStats.totalLeads,
    change: "+12.5%",
    changeType: "positive",
    icon: Users,
    color: "bg-slate-900",
    lightColor: "bg-slate-100",
  },
  {
    title: "Active Leads",
    value: dashboardStats.activeLeads,
    change: "+8.2%",
    changeType: "positive",
    icon: Phone,
    color: "bg-teal-500",
    lightColor: "bg-teal-50",
  },
  {
    title: "Site Visits",
    value: dashboardStats.siteVisitsThisMonth,
    change: "+15.3%",
    changeType: "positive",
    icon: MapPin,
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
  },
  {
    title: "Bookings",
    value: dashboardStats.bookingsThisMonth,
    change: "+5.7%",
    changeType: "positive",
    icon: FileText,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
  },
  {
    title: "Revenue",
    value: formatCurrency(dashboardStats.revenueThisMonth),
    change: "+18.9%",
    changeType: "positive",
    icon: IndianRupee,
    color: "bg-emerald-600",
    lightColor: "bg-emerald-50",
  },
  {
    title: "Commission",
    value: formatCurrency(dashboardStats.pendingCommission),
    change: "-3.2%",
    changeType: "negative",
    icon: TrendingUp,
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
  },
];

const COLORS = [
  "#0ea5e9",
  "#38bdf8",
  "#f97316",
  "#10b981",
  "#f43f5e",
  "#14b8a6",
  "#facc15",
  "#0f172a",
];

export function Dashboard() {
  const [timeRange, setTimeRange] = useState("month");
  const navigate = useNavigate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 relative dashboard-scope"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 -right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,#38bdf8_0%,rgba(56,189,248,0)_70%)] opacity-40 blur-3xl" />
        <div className="absolute top-24 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,#14b8a6_0%,rgba(20,184,166,0)_70%)] opacity-30 blur-3xl" />
      </div>

      {/* Hero */}
      <motion.div variants={itemVariants}>
        <Card className="dashboard-hero border-0 text-white overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                  Performance Pulse
                </p>
                <h2 className="dashboard-title text-2xl sm:text-3xl mt-2">
                  Momentum looks strong this month
                </h2>
                <p className="text-sm text-white/80 mt-2 max-w-xl">
                  Bookings and revenue are trending above target. Focus on
                  nurturing the hottest leads and keeping site visits tightly
                  scheduled.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/15 text-xs">
                    Target: 240 bookings
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/15 text-xs">
                    Pipeline health: 78%
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/15 text-xs">
                    Avg. response: 1h 12m
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="rounded-full bg-white text-slate-900 hover:bg-white/90 shadow-md shadow-black/10"
                  onClick={() => navigate("/leads")}
                >
                  New Lead
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-white/40 text-white bg-white/10 hover:bg-white/20"
                  onClick={() => navigate("/site-visits")}
                >
                  Schedule Visit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Snapshot</h3>
          <p className="text-xs text-slate-500">
            Key metrics for the current cycle
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs"
          onClick={async () => {
            const { toast } = await import("sonner");
            toast.success("Report download started");
          }}
        >
          Download report
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="dashboard-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={cn("p-2.5 rounded-xl", stat.lightColor)}>
                    <stat.icon
                      className={cn(
                        "w-5 h-5",
                        stat.color.replace("bg-", "text-"),
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600",
                    )}
                  >
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Revenue & Bookings
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Monthly performance overview
                </p>
              </div>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs rounded-full"
                >
                  Week
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs rounded-full bg-slate-900 hover:bg-slate-800"
                >
                  Month
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs rounded-full"
                >
                  Year
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={[
                    { month: "Jan", bookings: 5, revenue: 4.5 },
                    { month: "Feb", bookings: 8, revenue: 7.2 },
                    { month: "Mar", bookings: 12, revenue: 10.8 },
                    { month: "Apr", bookings: 10, revenue: 9.5 },
                    { month: "May", bookings: 15, revenue: 14.2 },
                    { month: "Jun", bookings: 18, revenue: 17.1 },
                  ]}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Legend />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue (Cr)"
                    stroke="#f97316"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />

                  <Bar
                    yAxisId="left"
                    dataKey="bookings"
                    name="Bookings"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lead Sources */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card h-[440px] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Lead Sources
              </CardTitle>
              <p className="text-sm text-slate-500">Distribution by source</p>
            </CardHeader>
            <CardContent className="pt-0 overflow-hidden">
              <ResponsiveContainer width="100%" height={340}>
                <PieChart margin={{ bottom: 20 }}>
                  <Pie
                    data={leadSourceChartData.labels.map((label, i) => ({
                      name: label,
                      value: leadSourceChartData.datasets[0].data[i],
                    }))}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {leadSourceChartData.datasets[0].data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={80}
                    wrapperStyle={{ fontSize: 12, paddingTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commission Tracking */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card h-[380px] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Commission Overview
              </CardTitle>
              <p className="text-sm text-slate-500">Earned vs Pending</p>
            </CardHeader>
            <CardContent className="pt-0 overflow-hidden">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[
                    { month: "Jan", earned: 850000, pending: 450000 },
                    { month: "Feb", earned: 1200000, pending: 600000 },
                    { month: "Mar", earned: 1500000, pending: 750000 },
                    { month: "Apr", earned: 1100000, pending: 550000 },
                    { month: "May", earned: 1800000, pending: 900000 },
                    { month: "Jun", earned: 2100000, pending: 1050000 },
                  ]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="earned"
                    name="Earned"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="pending"
                    name="Pending"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lead Pipeline */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card h-[380px] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Lead Pipeline
              </CardTitle>
              <p className="text-sm text-slate-500">
                Current lead distribution
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 pb-2">
                {[
                  {
                    stage: "New",
                    count: 180,
                    color: "bg-blue-500",
                    percentage: 14,
                  },
                  {
                    stage: "Contacted",
                    count: 220,
                    color: "bg-sky-500",
                    percentage: 18,
                  },
                  {
                    stage: "Qualified",
                    count: 150,
                    color: "bg-teal-500",
                    percentage: 12,
                  },
                  {
                    stage: "Site Visit",
                    count: 145,
                    color: "bg-amber-500",
                    percentage: 12,
                  },
                  {
                    stage: "Negotiation",
                    count: 80,
                    color: "bg-orange-500",
                    percentage: 6,
                  },
                  {
                    stage: "Booking",
                    count: 45,
                    color: "bg-yellow-500",
                    percentage: 4,
                  },
                  {
                    stage: "Closed Won",
                    count: 89,
                    color: "bg-emerald-500",
                    percentage: 7,
                  },
                  {
                    stage: "Closed Lost",
                    count: 341,
                    color: "bg-red-500",
                    percentage: 27,
                  },
                ].map((item) => (
                  <div key={item.stage} className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", item.color)} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">
                          {item.stage}
                        </span>
                        <span className="text-sm text-slate-500">
                          {item.count}
                        </span>
                      </div>
                      <Progress value={item.percentage} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card h-[380px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Recent Activity
                </CardTitle>
                <p className="text-sm text-slate-500">Latest updates</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-700"
                onClick={() => navigate("/notifications")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 pb-2">
                {[
                  {
                    type: "lead",
                    action: "New lead assigned",
                    detail: "Rajesh Khanna - Lodha Park",
                    time: "5 min ago",
                    icon: Users,
                    color: "bg-blue-500",
                  },
                  {
                    type: "visit",
                    action: "Site visit completed",
                    detail: "Suresh Iyer - Site visit done",
                    time: "1 hour ago",
                    icon: MapPin,
                    color: "bg-green-500",
                  },
                  {
                    type: "booking",
                    action: "New booking",
                    detail: "Karthik Menon - Unit T-301",
                    time: "2 hours ago",
                    icon: FileText,
                    color: "bg-purple-500",
                  },
                  {
                    type: "payment",
                    action: "Payment received",
                    detail: "₹10,00,000 - Token amount",
                    time: "3 hours ago",
                    icon: IndianRupee,
                    color: "bg-emerald-500",
                  },
                  {
                    type: "commission",
                    action: "Commission credited",
                    detail: "₹92,400 - BK-2024-0001",
                    time: "5 hours ago",
                    icon: TrendingUp,
                    color: "bg-pink-500",
                  },
                  {
                    type: "call",
                    action: "Call completed",
                    detail: "Meera Reddy - 8 minutes",
                    time: "6 hours ago",
                    icon: Phone,
                    color: "bg-orange-500",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl p-2 hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                        activity.color,
                      )}
                    >
                      <activity.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {activity.detail}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Third Row - Quick Actions & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Quick Actions
              </CardTitle>
              <p className="text-sm text-slate-500">Frequently used actions</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <QuickActionCard
                  icon={Users}
                  label="Add Lead"
                  color="bg-blue-500"
                  onClick={() => navigate("/leads")}
                />
                <QuickActionCard
                  icon={MapPin}
                  label="Schedule Visit"
                  color="bg-green-500"
                  onClick={() => navigate("/site-visits")}
                />
                <QuickActionCard
                  icon={FileText}
                  label="New Booking"
                  color="bg-purple-500"
                  onClick={() => navigate("/bookings")}
                />
                <QuickActionCard
                  icon={MessageSquare}
                  label="Send WhatsApp"
                  color="bg-green-600"
                  onClick={() => navigate("/communications")}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Site Visits */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Upcoming Site Visits
                </CardTitle>
                <p className="text-sm text-slate-500">Next 3 days</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-700"
                onClick={() => navigate("/site-visits")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    lead: "Rajesh Khanna",
                    project: "Lodha Park",
                    date: "Today",
                    time: "10:00 AM",
                    status: "confirmed",
                  },
                  {
                    lead: "Priya Nair",
                    project: "Godrej Emerald",
                    date: "Tomorrow",
                    time: "2:00 PM",
                    status: "scheduled",
                  },
                  {
                    lead: "Vikram Shah",
                    project: "Prestige Jindal",
                    date: "Mar 12",
                    time: "11:30 AM",
                    status: "scheduled",
                  },
                ].map((visit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-slate-800" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {visit.lead}
                        </p>
                        <p className="text-xs text-slate-500">
                          {visit.project}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {visit.time}
                      </p>
                      <Badge
                        variant={
                          visit.status === "confirmed" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {visit.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ icon: Icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/80 border border-slate-200/70 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group cursor-pointer"
    >
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110",
          color,
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );
}

