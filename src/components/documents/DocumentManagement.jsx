import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Upload,
  Filter,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  MoreHorizontal,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Folder,
  Grid3X3,
  List,
  FilePlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn, formatFileSize } from "@/lib/utils";
import { useLocalEntityStore } from "@/lib/localStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const mockDocuments = [
  {
    id: "1",
    name: "Aadhaar_Card_Rajesh_Khanna.pdf",
    type: "pdf",
    size: 2457600,
    uploadedBy: "Amit Kumar",
    uploadedAt: new Date("2024-03-01"),
    entityType: "lead",
    entityName: "Rajesh Khanna",
    status: "verified",
    tags: ["KYC", "Identity"],
  },
  {
    id: "2",
    name: "PAN_Card_Suresh_Iyer.pdf",
    type: "pdf",
    size: 1843200,
    uploadedBy: "Amit Kumar",
    uploadedAt: new Date("2024-02-20"),
    entityType: "lead",
    entityName: "Suresh Iyer",
    status: "verified",
    tags: ["KYC", "Identity"],
  },
  {
    id: "3",
    name: "Lodha_Park_Brochure.pdf",
    type: "pdf",
    size: 5242880,
    uploadedBy: "Admin",
    uploadedAt: new Date("2024-01-15"),
    entityType: "project",
    entityName: "Lodha Park",
    status: "verified",
    tags: ["Brochure", "Marketing"],
  },
  {
    id: "4",
    name: "Booking_Form_BK20240001.pdf",
    type: "pdf",
    size: 3145728,
    uploadedBy: "Vikram Singh",
    uploadedAt: new Date("2024-02-20"),
    entityType: "booking",
    entityName: "BK-2024-0001",
    status: "verified",
    tags: ["Booking", "Agreement"],
  },
  {
    id: "5",
    name: "Payment_Receipt_Token.jpg",
    type: "image",
    size: 1048576,
    uploadedBy: "Vikram Singh",
    uploadedAt: new Date("2024-03-08"),
    entityType: "payment",
    entityName: "PAY-2024-0003",
    status: "pending",
    tags: ["Receipt", "Payment"],
  },
  {
    id: "6",
    name: "Salary_Slip_March.pdf",
    type: "pdf",
    size: 2097152,
    uploadedBy: "Amit Kumar",
    uploadedAt: new Date("2024-03-05"),
    entityType: "lead",
    entityName: "Karthik Menon",
    status: "pending",
    tags: ["Income Proof", "Loan"],
  },
];

const fileIcons = {
  pdf: FileText,
  image: Image,
  jpg: Image,
  png: Image,
  xlsx: FileSpreadsheet,
  docx: File,
  default: File,
};

const statusColors = {
  verified: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

export function DocumentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const {
    items: documentItems,
    addItem: addDocument,
    removeItem: removeDocument,
  } = useLocalEntityStore("documents", mockDocuments);

  const filteredDocuments = documentItems.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  };

  const getFileIcon = (type) => {
    return fileIcons[type] || fileIcons.default;
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
              placeholder="Search documents..."
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
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500",
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500",
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]">
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <UploadForm
                onClose={() => setShowUploadDialog(false)}
                onAdd={(doc) => addDocument(doc)}
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
            label: "Total Documents",
            value: documentItems.length,
            icon: FileText,
            color: "bg-blue-500",
          },
          {
            label: "Verified",
            value: documentItems.filter((d) => d.status === "verified").length,
            icon: CheckCircle2,
            color: "bg-green-500",
          },
          {
            label: "Pending",
            value: documentItems.filter((d) => d.status === "pending").length,
            icon: Clock,
            color: "bg-yellow-500",
          },
          {
            label: "Storage Used",
            value: "45 MB",
            icon: Folder,
            color: "bg-purple-500",
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

      {/* Documents View */}
      <motion.div variants={itemVariants}>
        {viewMode === "list" ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <Checkbox />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Document
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Entity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tags
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Uploaded
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDocuments.map((doc) => {
                      const FileIcon = getFileIcon(doc.type);
                      return (
                        <tr
                          key={doc.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <Checkbox
                              checked={selectedDocuments.includes(doc.id)}
                              onCheckedChange={() =>
                                toggleDocumentSelection(doc.id)
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <FileIcon className="w-5 h-5 text-gray-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(doc.size)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm text-gray-700">
                                {doc.entityName}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {doc.entityType}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {doc.tags.map((tag, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={cn(
                                "text-xs capitalize",
                                statusColors[doc.status],
                              )}
                            >
                              {doc.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-600">
                              <p>{doc.uploadedBy}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(doc.uploadedAt).toLocaleDateString(
                                  "en-IN",
                                )}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Eye className="w-4 h-4 text-gray-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Download className="w-4 h-4 text-gray-500" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View</DropdownMenuItem>
                                  <DropdownMenuItem>Download</DropdownMenuItem>
                                  <DropdownMenuItem>Verify</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onSelect={() => removeDocument(doc.id)}
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
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredDocuments.map((doc) => {
              const FileIcon = getFileIcon(doc.type);
              return (
                <div
                  key={doc.id}
                  className="group relative bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-[#0082f3]/10 transition-colors">
                      <FileIcon className="w-8 h-8 text-gray-500 group-hover:text-[#0082f3] transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(doc.size)}
                    </p>
                    <Badge
                      className={cn(
                        "mt-2 text-xs capitalize",
                        statusColors[doc.status],
                      )}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function UploadForm({ onClose, onAdd }) {
  const [docType, setDocType] = useState("identity_proof");
  const [entityType, setEntityType] = useState("lead");
  const [tags, setTags] = useState("");
  const [name, setName] = useState("");

  const handleAdd = () => {
    const template = mockDocuments[0];
    const newDoc = {
      ...template,
      id: `doc-${Date.now()}`,
      name: name || "New Document",
      type: docType,
      uploadedBy: "You",
      uploadedAt: new Date(),
      entityType,
      entityName:
        entityType === "project"
          ? "Project"
          : entityType === "booking"
            ? "Booking"
            : "Lead",
      status: "pending",
      tags: tags
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };
    onAdd(newDoc);
    onClose();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0082f3] transition-colors cursor-pointer">
        <FilePlus className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Drag & drop files here
        </p>
        <p className="text-sm text-gray-500 mt-1">or click to browse</p>
        <p className="text-xs text-gray-400 mt-2">
          Supports PDF, JPG, PNG up to 10MB
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Document Name</label>
        <Input
          placeholder="Enter document name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Document Type</label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
        >
          <option value="identity_proof">Identity Proof</option>
          <option value="address_proof">Address Proof</option>
          <option value="income_proof">Income Proof</option>
          <option value="booking_form">Booking Form</option>
          <option value="agreement">Agreement</option>
          <option value="payment_receipt">Payment Receipt</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Associated With</label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
        >
          <option value="lead">Lead</option>
          <option value="project">Project</option>
          <option value="booking">Booking</option>
          <option value="payment">Payment</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <Input
          placeholder="Add tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={handleAdd}>
          Upload
        </Button>
      </div>
    </div>
  );
}

