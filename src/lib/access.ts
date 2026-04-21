import type { UserRole } from '@/types';

export const routeAccess: Record<string, UserRole[]> = {
  '/': ['admin', 'manager', 'sales_executive'],
  '/leads': ['admin', 'manager', 'sales_executive'],
  '/projects': ['admin', 'manager'],
  '/inventory': ['admin', 'manager'],
  '/site-visits': ['admin', 'manager', 'sales_executive'],
  '/bookings': ['admin', 'manager'],
  '/commissions': ['admin', 'manager'],
  '/payments': ['admin', 'manager'],
  '/communications': ['admin', 'manager', 'sales_executive'],
  '/team': ['admin', 'manager'],
  '/documents': ['admin', 'manager'],
  '/reports': ['admin', 'manager'],
  '/settings': ['admin'],
  '/follow-ups': ['admin', 'manager', 'sales_executive'],
  '/notifications': ['admin', 'manager', 'sales_executive'],
};

export function canAccessRoute(role: UserRole, path: string) {
  const allowed = routeAccess[path];
  if (!allowed) return true;
  return allowed.includes(role);
}
