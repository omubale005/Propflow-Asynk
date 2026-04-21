// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  lastLogin?: Date;
  permissions: Permission[];
}

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'manager' 
  | 'team_lead' 
  | 'sales_executive' 
  | 'telecaller' 
  | 'accountant' 
  | 'viewer';

export type Permission = 
  | 'view_all_leads' 
  | 'create_leads' 
  | 'edit_leads' 
  | 'delete_leads'
  | 'view_all_projects'
  | 'manage_projects'
  | 'view_inventory'
  | 'manage_inventory'
  | 'view_commissions'
  | 'manage_commissions'
  | 'view_reports'
  | 'manage_team'
  | 'manage_settings'
  | 'view_documents'
  | 'manage_documents'
  | 'view_payments'
  | 'manage_payments';

// Lead Management Types
export interface Lead {
  id: string;
  leadNumber: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: 'hot' | 'warm' | 'cold';
  budget: number;
  preferredLocation: string[];
  propertyType: PropertyType[];
  assignedTo?: string;
  assignedToName?: string;
  notes: Note[];
  activities: Activity[];
  createdAt: Date;
  updatedAt: Date;
  nextFollowUp?: Date;
  isReraRegistered: boolean;
}

export type LeadSource = 
  | 'website' 
  | 'facebook' 
  | 'instagram' 
  | 'google_ads' 
  | 'referral' 
  | 'walk_in' 
  | 'just_dial' 
  | '99acres' 
  | 'magic_bricks' 
  | 'housing' 
  | 'commonfloor'
  | 'other';

export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'qualified' 
  | 'site_visit_scheduled' 
  | 'site_visit_done' 
  | 'negotiation' 
  | 'booking_pending' 
  | 'booked' 
  | 'closed_won' 
  | 'closed_lost' 
  | 'dropped';

export type PropertyType = 
  | '1bhk' 
  | '2bhk' 
  | '3bhk' 
  | '4bhk' 
  | '5bhk_plus' 
  | 'villa' 
  | 'penthouse' 
  | 'studio' 
  | 'commercial' 
  | 'plot';

export interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
}

export type ActivityType = 
  | 'call_made' 
  | 'call_received' 
  | 'email_sent' 
  | 'email_received' 
  | 'whatsapp_sent' 
  | 'whatsapp_received' 
  | 'sms_sent' 
  | 'meeting' 
  | 'site_visit' 
  | 'note_added' 
  | 'status_changed' 
  | 'assigned';

// Builder and Project Types
export interface Builder {
  id: string;
  name: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  reraNumber?: string;
  gstNumber?: string;
  contactPerson: string;
  contactPersonPhone: string;
  projects: string[];
  commissionStructure: CommissionStructure;
  status: 'active' | 'inactive' | 'blacklisted';
  createdAt: Date;
  documents: Document[];
}

export interface Project {
  id: string;
  name: string;
  builderId: string;
  builderName: string;
  description: string;
  address: string;
  city: string;
  state: string;
  reraNumber: string;
  projectType: 'residential' | 'commercial' | 'mixed_use';
  status: 'upcoming' | 'pre_launch' | 'under_construction' | 'ready_to_move' | 'completed';
  launchDate?: Date;
  possessionDate?: Date;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  blockedUnits: number;
  configurations: UnitConfiguration[];
  amenities: string[];
  images: string[];
  brochure?: string;
  priceRange: {
    min: number;
    max: number;
  };
  commissionStructure: CommissionStructure;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnitConfiguration {
  id: string;
  type: PropertyType;
  carpetArea: number;
  builtUpArea: number;
  superBuiltUpArea: number;
  pricePerSqFt: number;
  totalPrice: number;
  count: number;
  available: number;
}

export interface CommissionStructure {
  type: 'percentage' | 'fixed' | 'slab';
  value: number;
  slabs?: CommissionSlab[];
  tdsPercentage: number;
  gstPercentage: number;
}

export interface CommissionSlab {
  minUnits: number;
  maxUnits: number;
  commission: number;
}

// Inventory Types
export interface InventoryUnit {
  id: string;
  unitNumber: string;
  projectId: string;
  projectName: string;
  builderId: string;
  builderName: string;
  configuration: PropertyType;
  carpetArea: number;
  builtUpArea: number;
  superBuiltUpArea: number;
  pricePerSqFt: number;
  totalPrice: number;
  floor: number;
  facing: 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west';
  status: 'available' | 'blocked' | 'booked' | 'sold';
  blockedBy?: string;
  blockedAt?: Date;
  blockExpiry?: Date;
  bookingAmount: number;
  tokenAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Site Visit Types
export interface SiteVisit {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  projectId: string;
  projectName: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: SiteVisitStatus;
  assignedTo: string;
  assignedToName: string;
  pickupLocation?: string;
  dropLocation?: string;
  cabRequired: boolean;
  cabDetails?: CabDetails;
  feedback?: SiteVisitFeedback;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type SiteVisitStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show' 
  | 'rescheduled';

export interface CabDetails {
  provider: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  pickupTime?: Date;
}

export interface SiteVisitFeedback {
  rating: number;
  interested: boolean;
  budgetMatch: boolean;
  locationSatisfied: boolean;
  configurationSatisfied: boolean;
  remarks: string;
  nextAction: string;
  expectedClosureDate?: Date;
}

// Booking and Closure Types
export interface Booking {
  id: string;
  bookingNumber: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  leadEmail: string;
  unitId: string;
  unitNumber: string;
  projectId: string;
  projectName: string;
  builderId: string;
  builderName: string;
  bookingDate: Date;
  agreementValue: number;
  tokenAmount: number;
  tokenPaymentDate: Date;
  tokenPaymentMode: 'cash' | 'cheque' | 'neft' | 'rtgs' | 'upi';
  tokenReference?: string;
  status: BookingStatus;
  paymentPlan: PaymentPlan;
  milestones: PaymentMilestone[];
  documents: Document[];
  salesManagerId: string;
  salesManagerName: string;
  commission: Commission;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 
  | 'token_received' 
  | 'booking_form_signed' 
  | 'agreement_signed' 
  | 'registration_done' 
  | 'loan_approved' 
  | 'loan_disbursed' 
  | 'possession_given' 
  | 'cancelled';

export type PaymentPlan = 'construction_linked' | 'time_linked' | 'down_payment' | 'flexi_payment' | 'custom';

export interface PaymentMilestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: Date;
  paidAmount?: number;
}

export interface Commission {
  id: string;
  bookingId: string;
  totalCommission: number;
  tdsAmount: number;
  gstAmount: number;
  netCommission: number;
  status: CommissionStatus;
  payouts: CommissionPayout[];
  createdAt: Date;
  updatedAt: Date;
}

export type CommissionStatus = 'pending' | 'partially_paid' | 'paid' | 'hold' | 'cancelled';

export interface CommissionPayout {
  id: string;
  amount: number;
  percentage: number;
  milestone: string;
  status: 'pending' | 'approved' | 'paid';
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  utrNumber?: string;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
  entityType: 'lead' | 'project' | 'booking' | 'builder' | 'commission' | 'general';
  entityId: string;
  tags: string[];
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export type DocumentType = 
  | 'identity_proof' 
  | 'address_proof' 
  | 'income_proof' 
  | 'pan_card' 
  | 'aadhaar_card' 
  | 'passport' 
  | 'driving_license'
  | 'rera_certificate'
  | 'gst_certificate'
  | 'project_brochure'
  | 'floor_plan'
  | 'price_list'
  | 'booking_form'
  | 'agreement_copy'
  | 'payment_receipt'
  | 'bank_statement'
  | 'salary_slip'
  | 'form_16'
  | 'itr'
  | 'loan_sanction_letter'
  | 'other';

// Payment Types
export interface Payment {
  id: string;
  paymentNumber: string;
  bookingId?: string;
  bookingNumber?: string;
  leadId: string;
  leadName: string;
  amount: number;
  paymentType: PaymentType;
  paymentMode: 'cash' | 'cheque' | 'neft' | 'rtgs' | 'upi' | 'demand_draft';
  referenceNumber?: string;
  bankName?: string;
  chequeDate?: Date;
  status: PaymentStatus;
  receivedBy: string;
  receivedByName: string;
  receivedAt: Date;
  remarks?: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentType = 
  | 'token' 
  | 'booking_amount' 
  | 'agreement' 
  | 'milestone' 
  | 'registration' 
  | 'stamp_duty' 
  | 'gst' 
  | 'other';

export type PaymentStatus = 'pending' | 'received' | 'cleared' | 'bounced' | 'refunded';

// Communication Types
export interface Communication {
  id: string;
  type: 'whatsapp' | 'email' | 'call' | 'sms';
  direction: 'inbound' | 'outbound';
  leadId: string;
  leadName: string;
  leadPhone?: string;
  leadEmail?: string;
  content: string;
  subject?: string;
  attachments?: string[];
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
  sentBy?: string;
  sentByName?: string;
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  duration?: number;
  recordingUrl?: string;
  templateId?: string;
  templateName?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  category: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Telecalling Types
export interface TelecallingCampaign {
  id: string;
  name: string;
  description: string;
  leadSource?: LeadSource;
  leadStatus?: LeadStatus;
  assignedTo: string[];
  totalLeads: number;
  calledLeads: number;
  connectedLeads: number;
  interestedLeads: number;
  notInterestedLeads: number;
  notReachableLeads: number;
  status: 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TelecallingCall {
  id: string;
  campaignId?: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  calledBy: string;
  calledByName: string;
  calledAt: Date;
  duration: number;
  status: 'connected' | 'not_connected' | 'busy' | 'no_answer' | 'invalid_number';
  outcome?: 'interested' | 'not_interested' | 'callback_requested' | 'wrong_number' | 'dnd' | 'appointment_fixed';
  notes: string;
  callbackDate?: Date;
  recordingUrl?: string;
}

// Dashboard and Report Types
export interface DashboardStats {
  totalLeads: number;
  newLeadsToday: number;
  activeLeads: number;
  siteVisitsToday: number;
  siteVisitsThisMonth: number;
  bookingsThisMonth: number;
  totalBookings: number;
  revenueThisMonth: number;
  totalRevenue: number;
  pendingCommission: number;
  receivedCommission: number;
  conversionRate: number;
  averageDealValue: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

// Settings Types
export interface CompanySettings {
  name: string;
  logo?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  gstNumber?: string;
  panNumber?: string;
  reraNumber?: string;
  bankDetails: BankDetails;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}
