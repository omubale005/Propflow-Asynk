import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Car,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Star,
  MessageSquare,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteVisits, leads, projects, teamMembers } from "@/data/mockData";
import { useLocalEntityStore } from "@/lib/localStore";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-700",
  rescheduled: "bg-orange-100 text-orange-700",
};

export function SiteVisitManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const {
    items: visitItems,
    addItem: addVisit,
    removeItem: removeVisit,
  } = useLocalEntityStore("site_visits", siteVisits);

  const filteredVisits = visitItems.filter((visit) => {
    const matchesSearch =
      visit.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || visit.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const todayVisits = filteredVisits.filter(
    (v) =>
      new Date(v.scheduledDate).toDateString() === new Date().toDateString(),
  );
  const upcomingVisits = filteredVisits.filter(
    (v) =>
      new Date(v.scheduledDate) > new Date() &&
      v.status !== "completed" &&
      v.status !== "cancelled",
  );

  const completedVisits = filteredVisits.filter(
    (v) => v.status === "completed",
  );

  const openFeedback = (visit) => {
    setSelectedVisit(visit);
    setShowFeedbackDialog(true);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search site visits..."
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
          <Dialog
            open={showScheduleDialog}
            onOpenChange={setShowScheduleDialog}
          >
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]">
                <Plus className="w-4 h-4" />
                Schedule Visit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Schedule Site Visit</DialogTitle>
              </DialogHeader>
              <ScheduleVisitForm
                onClose={() => setShowScheduleDialog(false)}
                onAdd={(visit) => addVisit(visit)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Today's Visits",
            value: todayVisits.length,
            icon: Calendar,
            color: "bg-blue-500",
          },
          {
            label: "Upcoming",
            value: upcomingVisits.length,
            icon: Clock,
            color: "bg-green-500",
          },
          {
            label: "Completed",
            value: completedVisits.length,
            icon: CheckCircle2,
            color: "bg-emerald-500",
          },
          {
            label: "Cancelled/No Show",
            value: filteredVisits.filter(
              (v) => v.status === "cancelled" || v.status === "no_show",
            ).length,
            icon: XCircle,
            color: "bg-red-500",
          },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    stat.color.replace("bg-", "bg-opacity-10 "),
                  )}
                >
                  <stat.icon
                    className={cn(
                      "w-5 h-5",
                      stat.color.replace("bg-", "text-"),
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="today">
          <TabsList className="mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Visits</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-0">
            <VisitsList
              visits={todayVisits}
              onFeedback={openFeedback}
              onDelete={removeVisit}
              emptyMessage="No site visits scheduled for today"
            />
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            <VisitsList
              visits={upcomingVisits}
              onFeedback={openFeedback}
              onDelete={removeVisit}
              emptyMessage="No upcoming site visits"
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <VisitsList
              visits={completedVisits}
              onFeedback={openFeedback}
              onDelete={removeVisit}
              emptyMessage="No completed site visits"
            />
          </TabsContent>

          <TabsContent value="all" className="mt-0">
            <VisitsList
              visits={filteredVisits}
              onFeedback={openFeedback}
              onDelete={removeVisit}
              emptyMessage="No site visits found"
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Site Visit Feedback</DialogTitle>
          </DialogHeader>
          {selectedVisit && (
            <FeedbackForm
              visit={selectedVisit}
              onClose={() => setShowFeedbackDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function VisitsList({ visits, onFeedback, onDelete, emptyMessage }) {
  if (visits.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">{emptyMessage}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Schedule a new site visit to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <Card key={visit.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0082f3]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#0082f3]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {visit.leadName}
                    </h3>
                    <Badge
                      className={cn(
                        "text-xs capitalize",
                        statusColors[visit.status],
                      )}
                    >
                      {visit.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {visit.projectName}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(visit.scheduledDate).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        },
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {visit.scheduledTime}
                    </div>
                    {visit.cabRequired && (
                      <div className="flex items-center gap-1.5 text-orange-600">
                        <Car className="w-4 h-4" />
                        Cab Required
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                      {visit.assignedToName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {visit.assignedToName}
                    </p>
                    <p className="text-xs text-gray-500">Sales Executive</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {visit.status === "scheduled" && (
                    <>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Phone className="w-4 h-4" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm
                      </Button>
                    </>
                  )}
                  {visit.status === "completed" && !visit.feedback && (
                    <Button
                      size="sm"
                      className="bg-[#0082f3] hover:bg-[#2895f7] gap-1"
                      onClick={() => onFeedback(visit)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Add Feedback
                    </Button>
                  )}
                  {visit.feedback && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">
                        {visit.feedback.rating}/5
                      </span>
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem>Cancel Visit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onSelect={() => onDelete(visit.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                      {visit.status === "completed" && (
                        <DropdownMenuItem>View Feedback</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ScheduleVisitForm({ onClose, onAdd }) {
  const [leadId, setLeadId] = useState(leads[0]?.id ?? "");
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [cabRequired, setCabRequired] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    const template = siteVisits[0];
    const lead = leads.find((l) => l.id === leadId) ?? leads[0];
    const project = projects.find((p) => p.id === projectId) ?? projects[0];
    const assignee =
      teamMembers.find((m) => m.id === assignedTo) ?? teamMembers[0];
    const newVisit = {
      ...template,
      id: `visit-${Date.now()}`,
      leadId: lead?.id ?? template.leadId,
      leadName: lead?.name ?? template.leadName,
      leadPhone: lead?.phone ?? template.leadPhone,
      projectId: project?.id ?? template.projectId,
      projectName: project?.name ?? template.projectName,
      scheduledDate: date ? new Date(date) : new Date(),
      scheduledTime: time || "10:00",
      status: "scheduled",
      assignedTo: assignee?.id ?? template.assignedTo,
      assignedToName: assignee?.name ?? template.assignedToName,
      cabRequired,
      pickupLocation: pickupLocation || undefined,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onAdd(newVisit);
    onClose();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Lead</label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={leadId}
          onChange={(e) => setLeadId(e.target.value)}
        >
          {leads
            .filter(
              (l) => l.status !== "closed_won" && l.status !== "closed_lost",
            )
            .map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} - {l.phone}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Select Project</label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Time</label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Assign To</label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          {teamMembers
            .filter((m) => m.role === "sales_executive" || m.role === "manager")
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="cab"
          className="rounded"
          checked={cabRequired}
          onChange={(e) => setCabRequired(e.target.checked)}
        />
        <label htmlFor="cab" className="text-sm">
          Cab required for pickup
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Pickup Location</label>
        <Input
          placeholder="Enter pickup location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
          placeholder="Add any notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={handleAdd}>
          Schedule Visit
        </Button>
      </div>
    </div>
  );
}

function FeedbackForm({ visit, onClose }) {
  return (
    <div className="space-y-4 py-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0082f3]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#0082f3]" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{visit.leadName}</p>
            <p className="text-sm text-gray-500">{visit.projectName}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <Star className="w-8 h-8" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="interested" className="rounded" />
          <label htmlFor="interested" className="text-sm">
            Client Interested
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="budget" className="rounded" />
          <label htmlFor="budget" className="text-sm">
            Budget Match
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="location" className="rounded" />
          <label htmlFor="location" className="text-sm">
            Location Satisfied
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="config" className="rounded" />
          <label htmlFor="config" className="text-sm">
            Configuration OK
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Remarks</label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
          placeholder="Enter feedback remarks..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Next Action</label>
        <select className="w-full px-3 py-2 border rounded-lg">
          <option>Follow up call</option>
          <option>Send quotation</option>
          <option>Schedule second visit</option>
          <option>Proceed to booking</option>
          <option>Drop lead</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Expected Closure Date</label>
        <Input type="date" />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={onClose}>
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}

