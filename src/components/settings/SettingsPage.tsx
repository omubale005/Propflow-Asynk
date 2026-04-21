import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  ChevronRight,
  Camera,
  Save,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  Globe,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { currentUser } from '@/data/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

function SavedToast({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium"
    >
      <Check className="w-4 h-4" /> Settings saved successfully
    </motion.div>
  );
}

export function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-5xl">
      <SavedToast show={saved} />

      <Tabs defaultValue="company" orientation="vertical" className="flex gap-6">
        {/* Side nav */}
        <motion.div variants={itemVariants} className="w-56 flex-shrink-0">
          <Card className="p-2">
            <nav className="space-y-1">
              {[
                { value: 'company', label: 'Company', icon: Building2 },
                { value: 'profile', label: 'My Profile', icon: User },
                { value: 'notifications', label: 'Notifications', icon: Bell },
                { value: 'security', label: 'Security', icon: Shield },
                { value: 'roles', label: 'Roles & Access', icon: Users },
                { value: 'appearance', label: 'Appearance', icon: Palette },
                { value: 'data', label: 'Data & Backup', icon: Database },
              ].map(item => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="w-full justify-start gap-2.5 px-3 py-2.5 text-sm data-[state=active]:bg-[#0082f3]/10 data-[state=active]:text-[#0082f3] rounded-xl"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </TabsTrigger>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Company Info */}
          <TabsContent value="company" className="mt-0 space-y-4">
            <CompanySettings onSave={showSaved} />
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="mt-0 space-y-4">
            <ProfileSettings onSave={showSaved} />
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-0 space-y-4">
            <NotificationSettings onSave={showSaved} />
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-0 space-y-4">
            <SecuritySettings onSave={showSaved} />
          </TabsContent>

          {/* Roles */}
          <TabsContent value="roles" className="mt-0 space-y-4">
            <RolesSettings />
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="mt-0 space-y-4">
            <AppearanceSettings onSave={showSaved} />
          </TabsContent>

          {/* Data */}
          <TabsContent value="data" className="mt-0 space-y-4">
            <DataSettings />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
    </div>
  );
}

function CompanySettings({ onSave }: { onSave: () => void }) {
  const [name, setName] = useState('Next One Realty');
  const [email, setEmail] = useState('info@nextonerealty.com');
  const [phone, setPhone] = useState('+91 22 4501 2345');
  const [address, setAddress] = useState('123, Business Hub, Bandra Kurla Complex');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [gst, setGst] = useState('27AABCN1234E1Z5');
  const [rera, setRera] = useState('A51800000123');
  const [website, setWebsite] = useState('www.nextonerealty.com');

  return (
    <div>
      <SectionHeader title="Company Information" desc="Manage your company details and legal information." />
      <Card>
        <CardContent className="p-6 space-y-5">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0082f3] to-[#44a9fa] flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Company Logo</p>
              <p className="text-xs text-gray-500 mt-0.5">PNG, JPG up to 2MB. Recommended 256×256</p>
              <Button variant="outline" size="sm" className="mt-2 gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Upload Logo
              </Button>
            </div>
          </div>
          <div className="border-t pt-5 grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium">Company Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email Address</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium">Address</label>
              <Input value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">City</label>
              <Input value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">State</label>
              <Input value={state} onChange={e => setState(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Website</label>
              <Input value={website} onChange={e => setWebsite(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">GST Number</label>
              <Input value={gst} onChange={e => setGst(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">RERA Number</label>
              <Input value={rera} onChange={e => setRera(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]" onClick={onSave}>
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card className="mt-4">
        <CardHeader><CardTitle className="text-sm font-semibold">Bank Details</CardTitle></CardHeader>
        <CardContent className="px-6 pb-6 grid grid-cols-2 gap-4">
          {[
            { label: 'Account Name', placeholder: 'Next One Realty Pvt Ltd', defaultVal: 'Next One Realty Pvt Ltd' },
            { label: 'Account Number', placeholder: 'XXXXXXXXXX', defaultVal: '1234567890123' },
            { label: 'Bank Name', placeholder: 'Bank name', defaultVal: 'HDFC Bank' },
            { label: 'IFSC Code', placeholder: 'HDFC0001234', defaultVal: 'HDFC0001234' },
            { label: 'Branch', placeholder: 'Branch name', defaultVal: 'BKC, Mumbai' },
          ].map(f => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-sm font-medium">{f.label}</label>
              <Input placeholder={f.placeholder} defaultValue={f.defaultVal} />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Account Type</label>
            <Select defaultValue="current">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 flex justify-end pt-2">
            <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]" onClick={onSave}>
              <Save className="w-4 h-4" /> Save Bank Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileSettings({ onSave }: { onSave: () => void }) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);

  return (
    <div>
      <SectionHeader title="My Profile" desc="Update your personal information and avatar." />
      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-20 h-20 rounded-full border-2 border-white shadow" />
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#0082f3] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2895f7] transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{currentUser.name}</p>
              <Badge className="mt-1 bg-blue-100 text-blue-700 text-xs capitalize">{currentUser.role.replace('_', ' ')}</Badge>
            </div>
          </div>
          <div className="border-t pt-5 grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium">Email Address</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]" onClick={onSave}>
              <Save className="w-4 h-4" /> Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationSettings({ onSave }: { onSave: () => void }) {
  const notifs = [
    { id: 'lead_assigned', label: 'Lead Assigned', desc: 'When a new lead is assigned to you', defaultOn: true },
    { id: 'lead_status', label: 'Lead Status Change', desc: 'When a lead status is updated', defaultOn: true },
    { id: 'followup_reminder', label: 'Follow-up Reminders', desc: 'Reminders for scheduled follow-up tasks', defaultOn: true },
    { id: 'site_visit', label: 'Site Visit Alerts', desc: 'Upcoming and completed site visit notifications', defaultOn: true },
    { id: 'booking', label: 'New Booking', desc: 'When a booking is confirmed', defaultOn: true },
    { id: 'payment', label: 'Payment Updates', desc: 'Payment received or overdue alerts', defaultOn: false },
    { id: 'commission', label: 'Commission Credited', desc: 'When commission is paid to your account', defaultOn: true },
    { id: 'team_activity', label: 'Team Activity', desc: 'Updates from team members', defaultOn: false },
  ];

  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(notifs.map(n => [n.id, n.defaultOn]))
  );

  return (
    <div>
      <SectionHeader title="Notification Preferences" desc="Choose which notifications you want to receive." />
      <Card>
        <CardContent className="p-6 space-y-1">
          {notifs.map((n, i) => (
            <div key={n.id} className={cn('flex items-center justify-between py-3.5', i < notifs.length - 1 && 'border-b border-gray-100')}>
              <div>
                <p className="text-sm font-medium text-gray-900">{n.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
              </div>
              <Switch checked={states[n.id]} onCheckedChange={v => setStates(prev => ({ ...prev, [n.id]: v }))} />
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]" onClick={onSave}>
              <Save className="w-4 h-4" /> Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle className="text-sm font-semibold">Notification Channels</CardTitle></CardHeader>
        <CardContent className="px-6 pb-6 space-y-3">
          {[
            { icon: Monitor, label: 'In-App Notifications', desc: 'Show notifications inside the CRM', on: true },
            { icon: Smartphone, label: 'Push Notifications', desc: 'Mobile push notifications (requires mobile app)', on: false },
            { icon: Mail, label: 'Email Digest', desc: 'Daily summary email at 8:00 AM', on: true },
          ].map((ch, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-9 h-9 rounded-lg bg-white border flex items-center justify-center">
                <ch.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{ch.label}</p>
                <p className="text-xs text-gray-500">{ch.desc}</p>
              </div>
              <Switch defaultChecked={ch.on} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SecuritySettings({ onSave }: { onSave: () => void }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <div>
      <SectionHeader title="Security" desc="Manage your password and account security settings." />
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Change Password</CardTitle></CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Current Password</label>
            <div className="relative">
              <Input type={showCurrent ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} placeholder="Enter current password" className="pr-10" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <Input type={showNew ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Enter new password" className="pr-10" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm new password" />
          </div>
          {/* Password strength */}
          {newPw && (
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                {[1,2,3,4].map(i => (
                  <div key={i} className={cn('h-1.5 flex-1 rounded-full', newPw.length > i * 3 ? 'bg-emerald-500' : 'bg-gray-200')} />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {newPw.length < 6 ? 'Too short' : newPw.length < 9 ? 'Fair' : newPw.length < 12 ? 'Good' : 'Strong'}
              </p>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]" onClick={onSave}>
              <Lock className="w-4 h-4" /> Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle className="text-sm font-semibold">Active Sessions</CardTitle></CardHeader>
        <CardContent className="px-6 pb-6 space-y-3">
          {[
            { device: 'Chrome on MacBook Pro', location: 'Mumbai, Maharashtra', time: 'Current session', current: true },
            { device: 'Chrome on iPhone 15', location: 'Mumbai, Maharashtra', time: '2 hours ago', current: false },
            { device: 'Safari on iPad', location: 'Pune, Maharashtra', time: '1 day ago', current: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <Monitor className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{s.device}</p>
                <p className="text-xs text-gray-500">{s.location} · {s.time}</p>
              </div>
              {s.current ? (
                <Badge className="bg-emerald-100 text-emerald-700 text-xs">Active</Badge>
              ) : (
                <Button variant="ghost" size="sm" className="text-xs text-red-600 hover:bg-red-50">Revoke</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function RolesSettings() {
  const rolePermissions: Record<string, { label: string; perms: string[] }> = {
    admin: {
      label: 'Admin',
      perms: ['Full access', 'Manage team', 'View all data', 'Settings', 'Reports'],
    },
    manager: {
      label: 'Manager',
      perms: ['Team oversight', 'All leads', 'Projects', 'Reports', 'Site visits'],
    },
    sales_executive: {
      label: 'Sales Executive',
      perms: ['Assigned leads', 'Site visits', 'Follow-ups', 'Communications'],
    },
    telecaller: {
      label: 'Telecaller',
      perms: ['Assigned leads', 'Call log', 'Basic follow-ups'],
    },
    accountant: {
      label: 'Accountant',
      perms: ['Payments', 'Commissions', 'Reports (financial)'],
    },
    viewer: {
      label: 'Viewer',
      perms: ['Read-only access', 'No edit permissions'],
    },
  };

  return (
    <div>
      <SectionHeader title="Roles & Access Control" desc="Manage what each role can access within the CRM." />
      <div className="space-y-3">
        {Object.entries(rolePermissions).map(([role, { label, perms }]) => (
          <Card key={role}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0082f3]/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-[#0082f3]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <Badge className="text-xs bg-gray-100 text-gray-600 capitalize">{role.replace('_', ' ')}</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {perms.map(p => (
                    <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> {p}
                    </span>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs flex-shrink-0">Edit Role</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AppearanceSettings({ onSave }: { onSave: () => void }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [accent, setAccent] = useState('#0082f3');

  const accents = ['#0082f3', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];

  return (
    <div>
      <SectionHeader title="Appearance" desc="Personalise the look and feel of your CRM." />
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Theme */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Theme</p>
            <div className="flex gap-3">
              {[
                { val: 'light', label: 'Light', icon: Sun },
                { val: 'dark', label: 'Dark', icon: Moon },
                { val: 'system', label: 'System', icon: Monitor },
              ].map(t => (
                <button
                  key={t.val}
                  onClick={() => setTheme(t.val as any)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                    theme === t.val ? 'border-[#0082f3] bg-[#0082f3]/5' : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <t.icon className={cn('w-5 h-5', theme === t.val ? 'text-[#0082f3]' : 'text-gray-500')} />
                  <span className={cn('text-sm font-medium', theme === t.val ? 'text-[#0082f3]' : 'text-gray-700')}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accent */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Accent Color</p>
            <div className="flex gap-2 flex-wrap">
              {accents.map(c => (
                <button
                  key={c}
                  onClick={() => setAccent(c)}
                  className={cn('w-9 h-9 rounded-full transition-all border-2', accent === c ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105')}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Density */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Layout Density</p>
            <div className="flex gap-3">
              {[
                { val: 'comfortable', label: 'Comfortable', desc: 'More spacing, easier to read' },
                { val: 'compact', label: 'Compact', desc: 'Tighter spacing, see more data' },
              ].map(d => (
                <button
                  key={d.val}
                  onClick={() => setDensity(d.val as any)}
                  className={cn(
                    'flex-1 text-left p-4 rounded-xl border-2 transition-all',
                    density === d.val ? 'border-[#0082f3] bg-[#0082f3]/5' : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <p className={cn('text-sm font-medium', density === d.val ? 'text-[#0082f3]' : 'text-gray-900')}>{d.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button className="gap-2 bg-[#0082f3] hover:bg-[#2895f7]" onClick={onSave}>
              <Save className="w-4 h-4" /> Apply Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DataSettings() {
  return (
    <div>
      <SectionHeader title="Data & Backup" desc="Export your data and manage system backups." />
      <Card>
        <CardContent className="p-6 space-y-4">
          {[
            { title: 'Export Leads Data', desc: 'Download all leads as CSV or Excel', action: 'Export CSV', color: 'bg-blue-500' },
            { title: 'Export Bookings', desc: 'Download all bookings and transaction records', action: 'Export CSV', color: 'bg-purple-500' },
            { title: 'Export Commission Report', desc: 'Download commission statements', action: 'Export PDF', color: 'bg-emerald-500' },
            { title: 'Full Data Backup', desc: 'Download complete CRM data backup (JSON)', action: 'Download Backup', color: 'bg-amber-500' },
          ].map((item, i) => (
            <div key={i} className={cn('flex items-center gap-4 p-4 rounded-xl bg-gray-50', i < 3 && 'border-b border-gray-100')}>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.color)}>
                <Database className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs">{item.action}</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-4 border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <CardTitle className="text-sm font-semibold text-red-600">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-red-100 bg-red-50/50">
            <div>
              <p className="text-sm font-medium text-gray-900">Clear All Demo Data</p>
              <p className="text-xs text-gray-500 mt-0.5">Remove all mock data and start fresh</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs text-red-600 border-red-200 hover:bg-red-50">Clear Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
