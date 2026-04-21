import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Building2,
  MapPin,
  Home,
  IndianRupee,
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  Eye,
  Download,
  Grid3X3,
  List,
  ArrowUpDown,
  Square,
  Maximize2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { inventoryUnits, projects, builders } from '@/data/mockData';
import { useLocalEntityStore } from '@/lib/localStore';
import { cn, formatCurrency } from '@/lib/utils';
import type { InventoryUnit } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const statusColors = {
  available: 'bg-green-100 text-green-700',
  blocked: 'bg-yellow-100 text-yellow-700',
  booked: 'bg-blue-100 text-blue-700',
  sold: 'bg-gray-100 text-gray-700'
};

const facingOptions = {
  north: 'North',
  south: 'South',
  east: 'East',
  west: 'West',
  north_east: 'North-East',
  north_west: 'North-West',
  south_east: 'South-East',
  south_west: 'South-West'
};

export function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'blocked' | 'booked' | 'sold'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [showUnitDialog, setShowUnitDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<InventoryUnit | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { items: inventoryItems, addItem: addUnit, removeItem: removeUnit } = useLocalEntityStore('inventory', inventoryUnits);

  const filteredUnits = inventoryItems.filter(unit => {
    const matchesSearch = 
      unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    const matchesProject = projectFilter === 'all' || unit.projectId === projectFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  const stats = {
    total: inventoryItems.length,
    available: inventoryItems.filter(u => u.status === 'available').length,
    blocked: inventoryItems.filter(u => u.status === 'blocked').length,
    booked: inventoryItems.filter(u => u.status === 'booked').length,
    sold: inventoryItems.filter(u => u.status === 'sold').length,
  };

  const toggleUnitSelection = (unitId: string) => {
    setSelectedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const openUnitDetails = (unit: InventoryUnit) => {
    setSelectedUnit(unit);
    setShowUnitDialog(true);
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
              placeholder="Search units..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'list' ? "bg-white shadow-sm" : "text-gray-500"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white shadow-sm" : "text-gray-500"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]">
                <Plus className="w-4 h-4" />
                Add Unit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Inventory Unit</DialogTitle>
              </DialogHeader>
              <AddUnitForm onClose={() => setShowAddDialog(false)} onAdd={(unit) => addUnit(unit)} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Units', value: stats.total, color: 'bg-blue-500' },
          { label: 'Available', value: stats.available, color: 'bg-green-500' },
          { label: 'Blocked', value: stats.blocked, color: 'bg-yellow-500' },
          { label: 'Booked', value: stats.booked, color: 'bg-blue-500' },
          { label: 'Sold', value: stats.sold, color: 'bg-gray-500' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={cn("w-3 h-3 rounded-full", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Inventory View */}
      <motion.div variants={itemVariants}>
        {viewMode === 'list' ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <Checkbox />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Configuration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facing</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUnits.map((unit) => (
                      <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Checkbox 
                            checked={selectedUnits.includes(unit.id)}
                            onCheckedChange={() => toggleUnitSelection(unit.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0082f3]/10 flex items-center justify-center">
                              <Home className="w-5 h-5 text-[#0082f3]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{unit.unitNumber}</p>
                              <p className="text-xs text-gray-500">Floor {unit.floor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{unit.projectName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs uppercase">
                            {unit.configuration}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-700">
                            <p>{unit.carpetArea} sq.ft</p>
                            <p className="text-xs text-gray-500">SBUA: {unit.superBuiltUpArea} sq.ft</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(unit.totalPrice)}</p>
                            <p className="text-xs text-gray-500">@ {formatCurrency(unit.pricePerSqFt)}/sq.ft</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={cn("text-xs capitalize", statusColors[unit.status])}>
                            {unit.status}
                          </Badge>
                          {unit.status === 'blocked' && unit.blockExpiry && (
                            <p className="text-xs text-orange-500 mt-1">
                              Expires: {new Date(unit.blockExpiry).toLocaleDateString('en-IN')}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{facingOptions[unit.facing]}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => openUnitDetails(unit)}
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </Button>
                            {unit.status === 'available' && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Lock className="w-4 h-4 text-orange-500" />
                              </Button>
                            )}
                            {unit.status === 'blocked' && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Unlock className="w-4 h-4 text-green-500" />
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Unit</DropdownMenuItem>
                                <DropdownMenuItem>View History</DropdownMenuItem>
                                <DropdownMenuItem>Generate Quote</DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onSelect={() => removeUnit(unit.id)}
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <UnitCard key={unit.id} unit={unit} onView={() => openUnitDetails(unit)} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Unit Details Dialog */}
      <Dialog open={showUnitDialog} onOpenChange={setShowUnitDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Unit Details</DialogTitle>
          </DialogHeader>
          {selectedUnit && <UnitDetails unit={selectedUnit} />}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function UnitCard({ unit, onView }: { unit: InventoryUnit; onView: () => void }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0082f3] to-[#44a9fa] flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{unit.unitNumber}</h3>
              <p className="text-sm text-gray-500">{unit.projectName}</p>
            </div>
          </div>
          <Badge className={cn("text-xs capitalize", statusColors[unit.status])}>
            {unit.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Configuration</p>
            <p className="text-sm font-medium text-gray-900 uppercase">{unit.configuration}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Floor</p>
            <p className="text-sm font-medium text-gray-900">{unit.floor}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Carpet Area</p>
            <p className="text-sm font-medium text-gray-900">{unit.carpetArea} sq.ft</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Facing</p>
            <p className="text-sm font-medium text-gray-900">{facingOptions[unit.facing]}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Total Price</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(unit.totalPrice)}</p>
          </div>
          <Button size="sm" className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={onView}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UnitDetails({ unit }: { unit: InventoryUnit }) {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{unit.unitNumber}</h2>
          <p className="text-gray-500">{unit.projectName}</p>
        </div>
        <Badge className={cn("text-sm px-3 py-1 capitalize", statusColors[unit.status])}>
          {unit.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Unit Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Configuration</span>
              <span className="font-medium uppercase">{unit.configuration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Floor</span>
              <span className="font-medium">{unit.floor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Facing</span>
              <span className="font-medium">{facingOptions[unit.facing]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Area Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Carpet Area</span>
              <span className="font-medium">{unit.carpetArea} sq.ft</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Built-up Area</span>
              <span className="font-medium">{unit.builtUpArea} sq.ft</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Super Built-up Area</span>
              <span className="font-medium">{unit.superBuiltUpArea} sq.ft</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Pricing</h3>
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Price per sq.ft</span>
            <span className="font-medium">{formatCurrency(unit.pricePerSqFt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Token Amount</span>
            <span className="font-medium">{formatCurrency(unit.tokenAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Booking Amount</span>
            <span className="font-medium">{formatCurrency(unit.bookingAmount)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="font-semibold">Total Price</span>
            <span className="text-xl font-bold text-[#0082f3]">{formatCurrency(unit.totalPrice)}</span>
          </div>
        </div>
      </div>

      {unit.status === 'blocked' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-800 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Unit Blocked</span>
          </div>
          <p className="text-sm text-yellow-700">
            Block expires on {unit.blockExpiry ? new Date(unit.blockExpiry).toLocaleDateString('en-IN') : 'N/A'}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {unit.status === 'available' && (
          <Button className="flex-1 bg-[#0082f3] hover:bg-[#2895f7]">
            <Lock className="w-4 h-4 mr-2" />
            Block Unit
          </Button>
        )}
        {unit.status === 'blocked' && (
          <Button className="flex-1 bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Proceed to Booking
          </Button>
        )}
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Generate Quote
        </Button>
      </div>
    </div>
  );
}

function AddUnitForm({ onClose, onAdd }: { onClose: () => void; onAdd: (unit: InventoryUnit) => void }) {
  const [unitNumber, setUnitNumber] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [configuration, setConfiguration] = useState<InventoryUnit['configuration']>('2bhk');
  const [status, setStatus] = useState<InventoryUnit['status']>('available');
  const [facing, setFacing] = useState<InventoryUnit['facing']>('north');
  const [floor, setFloor] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleAdd = () => {
    const template = inventoryUnits[0];
    const project = projects.find(p => p.id === projectId) ?? projects[0];
    const builder = builders.find(b => b.id === project?.builderId) ?? builders[0];
    const newUnit: InventoryUnit = {
      ...template,
      id: `unit-${Date.now()}`,
      unitNumber: unitNumber || `U-${Math.floor(100 + Math.random() * 900)}`,
      projectId: project?.id ?? template.projectId,
      projectName: project?.name ?? template.projectName,
      builderId: builder?.id ?? template.builderId,
      builderName: builder?.name ?? template.builderName,
      configuration,
      status,
      facing,
      floor: Number.isFinite(floor) ? floor : template.floor,
      totalPrice: Number.isFinite(totalPrice) ? totalPrice : template.totalPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onAdd(newUnit);
    onClose();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Unit Number</label>
          <Input placeholder="Enter unit number" value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Project</label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Configuration</label>
          <Select value={configuration} onValueChange={(value) => setConfiguration(value as InventoryUnit['configuration'])}>
            <SelectTrigger>
              <SelectValue placeholder="Select configuration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1bhk">1 BHK</SelectItem>
              <SelectItem value="2bhk">2 BHK</SelectItem>
              <SelectItem value="3bhk">3 BHK</SelectItem>
              <SelectItem value="4bhk">4 BHK</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Facing</label>
          <Select value={facing} onValueChange={(value) => setFacing(value as InventoryUnit['facing'])}>
            <SelectTrigger>
              <SelectValue placeholder="Select facing" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(facingOptions).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Floor</label>
          <Input type="number" value={floor} onChange={(e) => setFloor(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={(value) => setStatus(value as InventoryUnit['status'])}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Total Price</label>
        <Input type="number" value={totalPrice} onChange={(e) => setTotalPrice(Number(e.target.value))} />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-[#0082f3] hover:bg-[#2895f7]" onClick={handleAdd}>Add Unit</Button>
      </div>
    </div>
  );
}
