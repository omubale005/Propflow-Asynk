import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
  IndianRupee,
  Tag,
  User,
  Building2,
  Clock,
  Plus,
  CheckCircle2,
  ArrowRight,
  Flame,
  Thermometer,
  Snowflake,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";
import { teamMembers } from "@/data/mockData";

const statusColors = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-indigo-100 text-indigo-700",
  qualified: "bg-purple-100 text-purple-700",
  site_visit_scheduled: "bg-pink-100 text-pink-700",
  site_visit_done: "bg-orange-100 text-orange-700",
  negotiation: "bg-yellow-100 text-yellow-700",
  booking_pending: "bg-cyan-100 text-cyan-700",
  booked: "bg-emerald-100 text-emerald-700",
  closed_won: "bg-green-100 text-green-700",
  closed_lost: "bg-red-100 text-red-700",
  dropped: "bg-gray-100 text-gray-700",
};

const statusSteps = [
  "new",
  "contacted",
  "qualified",
  "site_visit_scheduled",
  "site_visit_done",
  "negotiation",
  "booking_pending",
  "booked",
];

const mockActivities = [
  {
    id: "a1",
    type: "call_made",
    description:
      "Call made — discussed 3BHK options. Client interested in Lodha Park.",
    createdByName: "Rahul Sharma",
    createdAt: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: "a2",
    type: "whatsapp_sent",
    description: "WhatsApp sent — project brochure and floor plans shared.",
    createdByName: "Amit Kumar",
    createdAt: new Date(Date.now() - 5 * 3600000),
  },
  {
    id: "a3",
    type: "status_changed",
    description: "Status changed from Contacted → Qualified.",
    createdByName: "Rahul Sharma",
    createdAt: new Date(Date.now() - 24 * 3600000),
  },
  {
    id: "a4",
    type: "note_added",
    description:
      "Client prefers East-facing units. Budget flexible up to ₹1.5 Cr.",
    createdByName: "Rahul Sharma",
    createdAt: new Date(Date.now() - 48 * 3600000),
  },
  {
    id: "a5",
    type: "assigned",
    description: "Lead assigned to Amit Kumar for follow-up.",
    createdByName: "Priya Patel",
    createdAt: new Date(Date.now() - 72 * 3600000),
  },
];

const activityColors = {
  call_made: "bg-blue-500",
  call_received: "bg-blue-400",
  whatsapp_sent: "bg-green-500",
  whatsapp_received: "bg-green-400",
  email_sent: "bg-purple-500",
  status_changed: "bg-orange-500",
  note_added: "bg-gray-500",
  assigned: "bg-teal-500",
  site_visit: "bg-pink-500",
  meeting: "bg-indigo-500",
};

export function LeadDetailDrawer({ lead, onClose, onStatusChange }) {
  const [newNote, setNewNote] = useState("");
  const [localStatus, setLocalStatus] = useState(lead?.status || "new");
  const [notes, setNotes] = useState(lead?.notes || []);
  const [activities, setActivities] = useState(mockActivities);

  const addNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: `n-${Date.now()}`,
      content: newNote,
      createdBy: "1",
      createdByName: "Rahul Sharma",
      createdAt: new Date(),
    };
    setNotes((prev) => [note, ...prev]);
    const activity = {
      id: `a-${Date.now()}`,
      type: "note_added",
      description: `Note added: ${newNote}`,
      createdByName: "Rahul Sharma",
      createdAt: new Date(),
    };
    setActivities((prev) => [activity, ...prev]);
    setNewNote("");
  };

  const handleStatusChange = (status) => {
    setLocalStatus(status);
    const activity = {
      id: `a-${Date.now()}`,
      type: "status_changed",
      description: `Status changed to ${status.replace(/_/g, " ")}.`,
      createdByName: "Rahul Sharma",
      createdAt: new Date(),
    };
    setActivities((prev) => [activity, ...prev]);
    onStatusChange?.(lead?.id || "", status);
  };

  if (!lead) return null;

  const currentStepIdx = statusSteps.indexOf(localStatus);
  const PriorityIcon =
    lead.priority === "hot"
      ? Flame
      : lead.priority === "warm"
        ? Thermometer
        : Snowflake;
  const priorityColor =
    lead.priority === "hot"
      ? "text-red-500"
      : lead.priority === "warm"
        ? "text-orange-500"
        : "text-blue-500";

  return (
    <AnimatePresence>
      {lead && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <Avatar className="w-11 h-11">
                  <AvatarFallback className="bg-[#0082f3]/10 text-[#0082f3] font-semibold">
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">{lead.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {lead.leadNumber}
                    </span>
                    <Badge className={cn("text-xs", statusColors[localStatus])}>
                      {localStatus.replace(/_/g, " ")}
                    </Badge>
                    <PriorityIcon
                      className={cn("w-3.5 h-3.5", priorityColor)}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Quick Contact Actions */}
            <div className="flex gap-2 px-6 py-3 border-b bg-gray-50">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Call
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-green-600" />{" "}
                WhatsApp
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs"
              >
                <Mail className="w-3.5 h-3.5 text-purple-600" /> Email
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs"
              >
                <Calendar className="w-3.5 h-3.5 text-orange-600" /> Visit
              </Button>
            </div>

            {/* Status Stepper */}
            <div className="px-6 py-3 border-b">
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {statusSteps.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={cn(
                      "flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap transition-all flex-shrink-0",
                      i <= currentStepIdx
                        ? "bg-[#0082f3] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                    )}
                  >
                    {i < currentStepIdx && <CheckCircle2 className="w-3 h-3" />}
                    {s
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    {i < statusSteps.length - 1 && i === currentStepIdx && (
                      <ArrowRight className="w-3 h-3 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="details" className="h-full">
                <TabsList className="px-6 pt-3 bg-transparent border-b rounded-none w-full justify-start gap-1 h-auto pb-0">
                  <TabsTrigger
                    value="details"
                    className="text-xs pb-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#0082f3] data-[state=active]:bg-transparent"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="text-xs pb-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#0082f3] data-[state=active]:bg-transparent"
                  >
                    Activity
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="text-xs pb-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#0082f3] data-[state=active]:bg-transparent"
                  >
                    Notes ({notes.length})
                  </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="p-6 space-y-5 mt-0">
                  <Section title="Contact Information">
                    <Row icon={Phone} label="Phone" value={lead.phone} />
                    {lead.alternatePhone && (
                      <Row
                        icon={Phone}
                        label="Alt Phone"
                        value={lead.alternatePhone}
                      />
                    )}
                    <Row icon={Mail} label="Email" value={lead.email} />
                  </Section>
                  <Section title="Lead Information">
                    <Row
                      icon={Tag}
                      label="Source"
                      value={lead.source
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    />
                    <Row
                      icon={IndianRupee}
                      label="Budget"
                      value={formatCurrency(lead.budget)}
                    />
                    <Row
                      icon={MapPin}
                      label="Preferred Locations"
                      value={lead.preferredLocation.join(", ") || "—"}
                    />
                    <Row
                      icon={Building2}
                      label="Property Types"
                      value={lead.propertyType.join(", ").toUpperCase() || "—"}
                    />
                    {lead.nextFollowUp && (
                      <Row
                        icon={Clock}
                        label="Next Follow-up"
                        value={new Date(lead.nextFollowUp).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      />
                    )}
                  </Section>
                  <Section title="Assignment">
                    <Row
                      icon={User}
                      label="Assigned To"
                      value={lead.assignedToName || "Unassigned"}
                    />
                    <div className="mt-2">
                      <label className="text-xs text-gray-500 mb-1 block">
                        Reassign Lead
                      </label>
                      <Select defaultValue={lead.assignedTo || ""}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers
                            .filter((m) =>
                              ["admin", "manager", "sales_executive"].includes(
                                m.role,
                              ),
                            )
                            .map((m) => (
                              <SelectItem
                                key={m.id}
                                value={m.id}
                                className="text-xs"
                              >
                                {m.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </Section>
                  <Section title="Status Management">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Change Status
                      </label>
                      <Select
                        value={localStatus}
                        onValueChange={(v) => handleStatusChange(v)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(statusColors).map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {s
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </Section>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent
                  value="activity"
                  className="px-6 pt-4 mt-0 space-y-0"
                >
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                    <div className="space-y-4 pb-6">
                      {activities.map((a) => (
                        <div key={a.id} className="relative flex gap-3 pl-10">
                          <div
                            className={cn(
                              "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10",
                              activityColors[a.type] || "bg-gray-400",
                            )}
                          >
                            <Activity className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="flex-1 pb-1">
                            <p className="text-sm text-gray-800">
                              {a.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {a.createdByName} ·{" "}
                              {new Date(a.createdAt).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="px-6 pt-4 mt-0 space-y-3">
                  {/* Add note */}
                  <div className="flex gap-2">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note about this lead..."
                      className="flex-1 px-3 py-2 text-sm border rounded-xl resize-none min-h-[72px] focus:outline-none focus:ring-2 focus:ring-[#0082f3]/30"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5 bg-[#0082f3] hover:bg-[#2895f7] text-xs"
                    onClick={addNote}
                    disabled={!newNote.trim()}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Note
                  </Button>

                  {/* Notes list */}
                  <div className="space-y-3 pt-2">
                    {notes.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-8">
                        No notes yet. Add your first note above.
                      </p>
                    )}
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-amber-50 border border-amber-100"
                      >
                        <p className="text-sm text-gray-800">{note.content}</p>
                        <p className="text-xs text-gray-400 mt-1.5">
                          {note.createdByName} ·{" "}
                          {new Date(note.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="bg-gray-50 rounded-xl p-3 space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900 font-medium truncate">
        {value}
      </span>
    </div>
  );
}

