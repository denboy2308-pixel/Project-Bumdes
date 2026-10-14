export type AdminRole = 
  | 'superadmin' 
  | 'direktur' 
  | 'bendahara' 
  | 'karyawan' 
  | 'pelanggan' 
  | 'operator' 
  | 'manajer_fasilitas' 
  | 'editor' 
  | 'auditor' 
  | 'pic_wilayah';

export type UserAccountStatus = 'active' | 'frozen' | 'inactive';

export interface AdminUser {
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean; // Menjaga kompatibilitas mundur
  status?: UserAccountStatus; // 'active' | 'frozen' | 'inactive'
  frozenReason?: string;
  frozenAt?: string;
  userCategory?: 'staff' | 'pelanggan';
  phone?: string;
  address?: string;
  notes?: string;
  avatarUrl?: string;
  assignedZone?: string; // Khusus PIC Wilayah (misal: "Dusun 1 & Dusun 2")
  customPermissions?: string[];
  createdAt: string;
  lastLogin?: string;
  currentPassword?: string; // Kata sandi tersimpan untuk inspeksi Super Admin
  passwordUpdatedAt?: string;
}

// AI Brain Autonomous Diagnostic & Self-Healing Types
export type BugSeverity = 'critical' | 'high' | 'medium' | 'low';
export type BugStatus = 'detected' | 'analyzing' | 'patching' | 'resolved' | 'monitoring';

export interface AiBugIncident {
  id: string;
  title: string;
  description: string;
  severity: BugSeverity;
  componentAffected: string;
  detectedAt: string;
  status: BugStatus;
  autoFixAction: string;
  rootCause: string;
  confidenceScore: number; // 0 - 100%
  resolvedAt?: string;
  patchLogs: string[];
}

export interface AiBrainMetric {
  overallHealth: number; // 0 - 100%
  selfHealingRate: number; // e.g. 98.4%
  activeWatchers: number;
  uptimeScore: number;
  incidentsDetected: number;
  incidentsAutoFixed: number;
  averageFixTimeSec: number;
  lastScanTimestamp: string;
  autonomousMode: boolean; // Auto-healing turned on/off
}

export interface AiSelfHealingAction {
  id: string;
  actionName: string;
  category: 'cache_repair' | 'sync_orchestration' | 'route_guard' | 'auth_refresh' | 'dom_sanitize';
  target: string;
  executedAt: string;
  status: 'success' | 'running' | 'failed';
  impactSummary: string;
}

export interface AiDirectiveTemplate {
  id: string;
  title: string;
  category: 'superadmin' | 'customer_service' | 'field_ops' | 'emergency';
  directivePrompt: string;
  speedMode: 'ultra_fast' | 'balanced' | 'deep_analytic';
  verbosity: 'concise' | 'standard' | 'elaborate';
}

export interface MetaSEOSettings {
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  robotsIndexing: 'index, follow' | 'noindex, nofollow' | 'noindex, follow';
  googleSearchConsoleId?: string;
  googleAnalyticsId?: string;
  author: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface PublicSiteConfig {
  siteName: string;
  contactWhatsApp: string;
  runningAnnouncement: string;
  isAnnouncementActive?: boolean;
  announcementType?: 'info' | 'warning' | 'promo';
  onlineBookingActive: boolean;
  maintenanceMode?: boolean;
  maintenanceNotice: string;
  themeColor?: 'emerald' | 'blue' | 'amber' | 'indigo';
  updatedAt: string;
}

export interface CmsArticle {
  id: string;
  title: string;
  category: 'Berita BUMDes' | 'PADes & Keuangan' | 'Pengumuman Desa' | 'Kegiatan Warga';
  summary: string;
  content: string;
  author: string;
  publishedDate: string;
  coverImage?: string;
  status: 'published' | 'draft';
}

export interface SiteMenuConfig {
  id: string;
  label: string;
  pageKey: string;
  visible: boolean;
  order: number;
}

export interface AdminAuditLog {
  id: string;
  actorName: string;
  actorEmail: string;
  actorRole: AdminRole;
  action: string;
  target: string;
  timestamp: string;
}
