/**
 * Centralized Type Definitions
 * Shared types across the application to prevent duplication
 */

// Auth & User Types
export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  role: 'ADMIN' | 'USER' | 'PREMIUM';
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt?: string;
  lastLoginAt?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Content Management Types
export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: any;
  type: 'TEXT' | 'HTML' | 'URL' | 'IMAGE' | 'JSON';
  description?: string;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

// Settings Types
export interface AppSettings {
  siteName: string;
  adminPassword: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    googleAnalytics: string;
    googleSearchConsole: string;
    facebookPixel: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  media: {
    maxFileSize: number;
    allowedTypes: string[];
    compressionQuality: number;
  };
  security: {
    enableTwoFactor: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
  };
}

// Media & Upload Types
export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalUsers: number;
  totalContent: number;
  totalUploads: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  lastBackup?: string;
  storageUsed?: number;
}

// Health Check Types
export interface Health {
  ok: boolean;
  status: string;
  ready: boolean;
  timestamp: string;
  uptime?: {
    seconds: number;
    human: string;
  };
}

// Toast Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Form Data Types
export interface UserFormData {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'PREMIUM';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

// Component Props Types
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface InputProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}