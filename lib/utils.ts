/**
 * Utility Functions
 * Shared utility functions to prevent code duplication
 */

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format uptime in seconds to human readable format
 */
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format percentage with 1 decimal place
 */
export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}

/**
 * Format duration in seconds to human readable format (shorter version)
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}

/**
 * Format timestamp to "time ago" format
 */
export function formatTimeAgo(timestamp: string): string {
  if (!timestamp) return '-';
  
  try {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    
    return formatDate(timestamp);
  } catch {
    return timestamp;
  }
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate string to specified length with ellipsis
 */
export function truncate(str: string, length: number = 50): string {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + '...';
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Check if string is valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize HTML string to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  return authHeader?.replace('Bearer ', '') || null;
}

/**
 * Extract token from Authorization header with Bearer prefix check
 */
export function extractAuthToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
}

/**
 * Standard API error responses to prevent duplication
 */
export const ApiErrors = {
  UNAUTHORIZED: { error: 'Token diperlukan' },
  INVALID_TOKEN: { error: 'Token tidak valid' },
  ACCESS_DENIED: { error: 'Akses ditolak' },
  ADMIN_REQUIRED: { error: 'Akses admin diperlukan' },
  INVALID_INPUT: { error: 'Input tidak valid' },
  INVALID_EMAIL: { error: 'Format email tidak valid' },
  INVALID_PASSWORD: { error: 'Password minimal 8 karakter' },
  INVALID_CREDENTIALS: { error: 'Email atau password salah' },
  INTERNAL_ERROR: { error: 'Internal server error' },
  RATE_LIMIT: { error: 'Rate limit exceeded. Coba lagi sebentar.' },
  MISSING_DATA: { error: 'Data diperlukan' },
  NOT_FOUND: { error: 'Data tidak ditemukan' },
  ALREADY_EXISTS: { error: 'Data sudah ada' }
} as const;

/**
 * API utilities for common operations
 */
export const ApiUtils = {
  /**
   * Fetch content by section from admin content API
   */
  async fetchContentBySection(section: string): Promise<any> {
    const response = await fetch(`/api/admin/content?section=${section}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${section} content`);
    }
    return response.json();
  },

  /**
   * Handle API response with standard error format
   */
  async handleApiResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'API request failed');
    }
    return response.json();
  }
};

/**
 * Common CSS classes to prevent duplication
 */
export const CommonStyles = {
  // Gradient styles - most commonly duplicated
  gradient: {
    primary: 'bg-gradient-to-r from-primary-orange to-primary-blue',
    text: 'text-transparent bg-gradient-to-r from-primary-orange to-primary-blue bg-clip-text',
    divider: 'w-24 h-1 bg-gradient-to-r from-primary-orange to-primary-blue mx-auto rounded-full',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4',
    gray: 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4'
  },
  
  // Icon containers with gradient
  icon: {
    small: 'w-8 h-8 bg-gradient-to-r from-primary-orange to-primary-blue rounded-lg flex items-center justify-center',
    medium: 'w-10 h-10 bg-gradient-to-r from-primary-orange to-primary-blue rounded-lg flex items-center justify-center',
    large: 'w-12 h-12 bg-gradient-to-r from-primary-orange to-primary-blue rounded-xl flex items-center justify-center',
    xlarge: 'w-20 h-20 bg-gradient-to-r from-primary-orange to-primary-blue rounded-2xl flex items-center justify-center'
  },
  
  button: {
    primary: 'bg-gradient-to-r from-primary-orange to-primary-blue text-white rounded-lg hover:shadow-lg transition-all duration-200',
    primaryLarge: 'bg-gradient-to-r from-primary-orange to-primary-blue text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105',
    primarySmall: 'bg-gradient-to-r from-primary-orange to-primary-blue text-white py-2 px-4 rounded-lg hover:shadow-md transition-all duration-200 font-medium',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors',
    danger: 'bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors',
    success: 'bg-green-100 hover:bg-green-200 text-green-600 rounded transition-colors'
  },
  
  input: {
    base: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent',
    large: 'w-full border border-gray-200 rounded-xl p-3 bg-white focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange transition-colors',
    textarea: 'w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange transition-colors',
    error: 'border-red-500 focus:ring-red-500'
  },
  
  card: {
    base: 'bg-white rounded-xl shadow-sm border border-gray-200',
    hover: 'hover:shadow-md transition-shadow',
    large: 'bg-white border border-gray-200 rounded-2xl p-6 shadow-sm',
    bordered: 'bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow',
    highlight: 'bg-white border-2 border-primary-orange/20 rounded-2xl p-6 hover:shadow-md transition-shadow'
  },
  
  // Common UI elements
  dropzone: 'relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300',
  spinner: 'animate-spin rounded-full h-12 w-12 border-4 border-primary-orange border-t-transparent'
};