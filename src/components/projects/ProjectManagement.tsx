import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  MoreHorizontal,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Image,
  IndianRupee,
  Home,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  Filter,
  Grid3X3,
  List
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
import { builders, projects } from '@/data/mockData';
import { useLocalEntityStore } from '@/lib/localStore';
import { cn, formatCurrency } from '@/lib/utils';
import type { Project, Builder } from '@/types';

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

const projectStatusColors = {
  upcoming: 'bg-purple-100 text-purple-700',
  pre_launch: 'bg-pink-100 text-pink-700',
  under_construction: 'bg-yellow-100 text-yellow-700',
  ready_to_move: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700'
};

export function ProjectManagement() {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { items: projectItems, addItem: addProject, removeItem: removeProject } = useLocalEntityStore('projects', projects);

  const filteredProjects = projectItems.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.builderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBuilders = builders.filter(builder =>
    builder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    builder.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              placeholder="Search projects, builders..."
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
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white shadow-sm" : "text-gray-500"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'list' ? "bg-white shadow-sm" : "text-gray-500"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]">
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <AddProjectForm
                onClose={() => setShowAddDialog(false)}
                onAdd={(project) => addProject(project)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: projects.length, icon: Building2, color: 'bg-blue-500' },
          { label: 'Active Builders', value: builders.length, icon: Home, color: 'bg-green-500' },
          { label: 'Total Units', value: projects.reduce((acc, p) => acc + p.totalUnits, 0), icon: CheckCircle2, color: 'bg-purple-500' },
          { label: 'Available Units', value: projects.reduce((acc, p) => acc + p.availableUnits, 0), icon: Clock, color: 'bg-orange-500' },
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

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="builders">Builders</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-0">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Builder</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price Range</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredProjects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#0082f3]/10 flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-[#0082f3]" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{project.name}</p>
                                  <p className="text-xs text-gray-500">{project.reraNumber}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{project.builderName}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <MapPin className="w-3.5 h-3.5" />
                                {project.city}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={cn("text-xs capitalize", projectStatusColors[project.status])}>
                                {project.status.replace(/_/g, ' ')}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">{project.availableUnits} available</span>
                                  <span className="text-gray-500">of {project.totalUnits}</span>
                                </div>
                                <Progress value={(project.soldUnits / project.totalUnits) * 100} className="h-1.5" />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(project.priceRange.min)} - {formatCurrency(project.priceRange.max)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Project</DropdownMenuItem>
                                  <DropdownMenuItem>View Inventory</DropdownMenuItem>
                                  <DropdownMenuItem>Download Brochure</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onSelect={() => removeProject(project.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="builders" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuilders.map((builder) => (
                <BuilderCard key={builder.id} builder={builder} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0082f3] to-[#44a9fa] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#0082f3] transition-colors">{project.name}</h3>
              <p className="text-sm text-gray-500">{project.builderName}</p>
            </div>
          </div>
          <Badge className={cn("text-xs capitalize", projectStatusColors[project.status])}>
            {project.status.replace(/_/g, ' ')}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            {project.city}, {project.state}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4 text-gray-400" />
            {project.configurations.map(c => c.type.toUpperCase()).join(', ')}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            Possession: {new Date(project.possessionDate!).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Inventory</span>
            <span className="font-medium">{project.availableUnits} / {project.totalUnits} units</span>
          </div>
          <Progress value={(project.soldUnits / project.totalUnits) * 100} className="h-2" />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(project.priceRange.min)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="w-4 h-4" />
              Brochure
            </Button>
            <Button size="sm" className="bg-[#0082f3] hover:bg-[#2895f7]">
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BuilderCard({ builder }: { builder: Builder }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
            {builder.logo ? (
              <img src={builder.logo} alt={builder.name} className="w-full h-full object-contain p-2" />
            ) : (
              <Building2 className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-[#0082f3] transition-colors">{builder.name}</h3>
            <p className="text-sm text-gray-500">{builder.city}, {builder.state}</p>
            <Badge variant={builder.status === 'active' ? 'default' : 'secondary'} className="mt-2 text-xs">
              {builder.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            {builder.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate">{builder.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-gray-400" />
            RERA: {builder.reraNumber}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Active Projects</p>
            <p className="text-xl font-bold text-gray-900">{builder.projects.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Commission</p>
            <p className="text-lg font-bold text-gray-900">{builder.commissionStructure.value}%</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <ExternalLink className="w-4 h-4" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AddProjectForm({ onClose, onAdd }: { onClose: () => void; onAdd: (project: Project) => void }) {
  const [name, setName] = useState('');
  const [builderId, setBuilderId] = useState(builders[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [projectType, setProjectType] = useState<Project['projectType']>('residential');
  const [status, setStatus] = useState<Project['status']>('upcoming');
  const [launchDate, setLaunchDate] = useState('');
  const [possessionDate, setPossessionDate] = useState('');
  const [totalUnits, setTotalUnits] = useState(0);
  const [commission, setCommission] = useState(2);

  const handleAdd = () => {
    const template = projects[0];
    const builder = builders.find(b => b.id === builderId) ?? builders[0];
    const parsedTotal = Number.isFinite(totalUnits) ? totalUnits : template.totalUnits;
    const newProject: Project = {
      ...template,
      id: `project-${Date.now()}`,
      name: name || 'New Project',
      builderId: builder?.id ?? template.builderId,
      builderName: builder?.name ?? template.builderName,
      description: description || template.description,
      city: city || template.city,
      state: state || template.state,
      reraNumber: reraNumber || template.reraNumber,
      projectType,
      status,
      launchDate: launchDate ? new Date(launchDate) : template.launchDate,
      possessionDate: possessionDate ? new Date(possessionDate) : template.possessionDate,
      totalUnits: parsedTotal,
      availableUnits: parsedTotal,
      soldUnits: 0,
      blockedUnits: 0,
      commissionStructure: { ...template.commissionStructure, value: commission },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onAdd(newProject);
    onClose();
  };

  return (
    <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Name</label>
          <Input placeholder="Enter project name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Builder</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={builderId} onChange={(e) => setBuilderId(e.target.value)}>
            {builders.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
          placeholder="Enter project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Input placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <Input placeholder="Enter state" value={state} onChange={(e) => setState(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">RERA Number</label>
        <Input placeholder="Enter RERA registration number" value={reraNumber} onChange={(e) => setReraNumber(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Type</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={projectType} onChange={(e) => setProjectType(e.target.value as Project['projectType'])}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed_use">Mixed Use</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={status} onChange={(e) => setStatus(e.target.value as Project['status'])}>
            <option value="upcoming">Upcoming</option>
            <option value="pre_launch">Pre Launch</option>
            <option value="under_construction">Under Construction</option>
            <option value="ready_to_move">Ready to Move</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Launch Date</label>
          <Input type="date" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Possession Date</label>
          <Input type="date" value={possessionDate} onChange={(e) => setPossessionDate(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Total Units</label>
          <Input type="number" placeholder="Enter total units" value={totalUnits} onChange={(e) => setTotalUnits(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Commission (%)</label>
          <Input type="number" step="0.1" placeholder="Enter commission percentage" value={commission} onChange={(e) => setCommission(Number(e.target.value))} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={handleAdd}>Add Project</Button>
      </div>
    </div>
  );
}
