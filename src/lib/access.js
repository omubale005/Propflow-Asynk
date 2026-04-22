export const routeAccess = {
  '/': ['admin', 'manager', 'sales_executive'],
  '/leads': ['admin', 'manager', 'sales_executive'],
  '/projects': ['admin', 'manager'],
  '/inventory': ['admin', 'manager'],
  '/site-visits': ['admin', 'manager', 'sales_executive'],
  '/communications': ['admin', 'manager', 'sales_executive'],
  '/team': ['admin', 'manager'],
  '/documents': ['admin', 'manager'],
  '/reports': ['admin', 'manager'],
  '/settings': ['admin'],
  '/follow-ups': ['admin', 'manager', 'sales_executive'],
  '/notifications': ['admin', 'manager', 'sales_executive'],
};

export function canAccessRoute(role, path) {
  const allowed = routeAccess[path];
  if (!allowed) return true;
  return allowed.includes(role);
}
