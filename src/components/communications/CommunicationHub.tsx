import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Send,
  Phone,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Clock,
  CheckCheck,
  Check,
  Paperclip,
  Smile,
  Mic,
  Filter,
  Download,
  Plus,
  FileText as TemplateIcon,
  History,
  TrendingUp,
  Users,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { communications, messageTemplates, leads } from '@/data/mockData';
import { useLocalEntityStore } from '@/lib/localStore';
import { cn, formatDate } from '@/lib/utils';
import type { Communication, MessageTemplate } from '@/types';

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

const typeIcons = {
  whatsapp: MessageSquare,
  email: Mail,
  call: Phone,
  sms: MessageCircle
};

const typeColors = {
  whatsapp: 'bg-green-500',
  email: 'bg-blue-500',
  call: 'bg-purple-500',
  sms: 'bg-orange-500'
};

const statusIcons = {
  sent: Check,
  delivered: CheckCheck,
  read: CheckCheck,
  failed: Clock,
  pending: Clock
};

export function CommunicationHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedType, setSelectedType] = useState<Communication['type']>('whatsapp');

  const { items: communicationItems, addItem: addCommunication, removeItem: removeCommunication } = useLocalEntityStore('communications', communications);

  const filteredCommunications = communicationItems.filter(comm => {
    const matchesSearch = 
      comm.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeTab === 'all' || comm.type === activeTab;

    return matchesSearch && matchesType;
  });

  const stats = {
    total: communicationItems.length,
    whatsapp: communicationItems.filter(c => c.type === 'whatsapp').length,
    email: communicationItems.filter(c => c.type === 'email').length,
    calls: communicationItems.filter(c => c.type === 'call').length,
    sms: communicationItems.filter(c => c.type === 'sms').length
  };

  const handleSend = () => {
    if (!selectedLead || !messageText.trim()) return;
    const template = communications[0];
    const lead = leads.find(l => l.id === selectedLead) ?? leads[0];
    const newComm: Communication = {
      ...template,
      id: `comm-${Date.now()}`,
      type: selectedType,
      direction: 'outbound',
      leadId: lead?.id ?? template.leadId,
      leadName: lead?.name ?? template.leadName,
      leadPhone: lead?.phone ?? template.leadPhone,
      leadEmail: lead?.email ?? template.leadEmail,
      content: messageText,
      status: 'sent',
      sentAt: new Date(),
    };
    addCommunication(newComm);
    setMessageText('');
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
              placeholder="Search communications..."
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
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <TemplateIcon className="w-4 h-4" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Message Templates</DialogTitle>
              </DialogHeader>
              <TemplatesList />
            </DialogContent>
          </Dialog>
          <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]">
            <Plus className="w-4 h-4" />
            New Message
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: MessageCircle, color: 'bg-blue-500' },
          { label: 'WhatsApp', value: stats.whatsapp, icon: MessageSquare, color: 'bg-green-500' },
          { label: 'Email', value: stats.email, icon: Mail, color: 'bg-blue-500' },
          { label: 'Calls', value: stats.calls, icon: Phone, color: 'bg-purple-500' },
          { label: 'SMS', value: stats.sms, icon: MessageCircle, color: 'bg-orange-500' },
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

      {/* Communications List */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="call">Calls</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {filteredCommunications.map((comm) => {
                    const TypeIcon = typeIcons[comm.type];
                    const StatusIcon = statusIcons[comm.status];
                    
                    return (
                      <div key={comm.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", typeColors[comm.type].replace('bg-', 'bg-opacity-10 '))}>
                            <TypeIcon className={cn("w-5 h-5", typeColors[comm.type].replace('bg-', 'text-'))} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900">{comm.leadName}</h4>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {comm.type}
                                </Badge>
                                {comm.direction === 'outbound' ? (
                                  <Badge variant="secondary" className="text-xs">Sent</Badge>
                                ) : (
                                  <Badge variant="default" className="text-xs">Received</Badge>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(comm.sentAt)}
                              </span>
                            </div>
                            
                            {comm.subject && (
                              <p className="text-sm font-medium text-gray-700 mt-1">{comm.subject}</p>
                            )}
                            
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{comm.content}</p>
                            
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <StatusIcon className={cn(
                                  "w-4 h-4",
                                  comm.status === 'read' && "text-blue-500"
                                )} />
                                <span className="capitalize">{comm.status}</span>
                              </div>
                              
                              {comm.duration && (
                                <span className="text-sm text-gray-500">
                                  Duration: {Math.floor(comm.duration / 60)}m {comm.duration % 60}s
                                </span>
                              )}
                              
                              {comm.sentByName && (
                                <span className="text-sm text-gray-500">
                                  By: {comm.sentByName}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Reply</DropdownMenuItem>
                              <DropdownMenuItem>Forward</DropdownMenuItem>
                              <DropdownMenuItem>View Lead</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={() => removeCommunication(comm.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Quick Message Composer */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <select 
                  className="px-3 py-2 border rounded-lg"
                  value={selectedLead || ''}
                  onChange={(e) => setSelectedLead(e.target.value)}
                >
                  <option value="">Select Lead</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
                
                <div className="flex gap-2">
                  <Button
                    variant={selectedType === 'whatsapp' ? 'default' : 'outline'}
                    size="sm"
                    className={cn("gap-1", selectedType === 'whatsapp' && "bg-[#0082f3] hover:bg-[#2895f7]")}
                    onClick={() => setSelectedType('whatsapp')}
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant={selectedType === 'email' ? 'default' : 'outline'}
                    size="sm"
                    className={cn("gap-1", selectedType === 'email' && "bg-[#0082f3] hover:bg-[#2895f7]")}
                    onClick={() => setSelectedType('email')}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                  <Button
                    variant={selectedType === 'call' ? 'default' : 'outline'}
                    size="sm"
                    className={cn("gap-1", selectedType === 'call' && "bg-[#0082f3] hover:bg-[#2895f7]")}
                    onClick={() => setSelectedType('call')}
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <textarea 
                  className="w-full px-4 py-3 border rounded-lg min-h-[100px] resize-none"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mic className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    Hello {'{name}'}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    Site visit reminder
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    Follow up
                  </Badge>
                </div>
                <Button className="bg-[#0082f3] hover:bg-[#2895f7] gap-2" onClick={handleSend}>
                  <Send className="w-4 h-4" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function TemplatesList() {
  return (
    <div className="space-y-4 py-4">
      <div className="flex justify-between items-center">
        <Input placeholder="Search templates..." className="w-80" />
        <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]">
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>
      
      <div className="space-y-3">
        {messageTemplates.map((template) => (
          <div key={template.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <Badge variant="outline" className="text-xs capitalize">{template.type}</Badge>
                <Badge variant="secondary" className="text-xs capitalize">{template.category}</Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
              </div>
            </div>
            {template.subject && (
              <p className="text-sm text-gray-600 mb-1">Subject: {template.subject}</p>
            )}
            <p className="text-sm text-gray-700">{template.content}</p>
            <div className="flex gap-2 mt-2">
              {template.variables.map((v, i) => (
                <Badge key={i} variant="outline" className="text-xs">{'{'}{v}{'}'}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
