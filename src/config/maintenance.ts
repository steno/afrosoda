export const MAINTENANCE_MODE = true;

const ALLOWED_DURING_MAINTENANCE = new Set([
  '/contact',
  '/imprint',
  '/privacy',
  '/admin',
]);

export function isMaintenanceView(pathname: string): boolean {
  if (pathname === '/maintenance') return true;
  if (!MAINTENANCE_MODE) return false;
  return !ALLOWED_DURING_MAINTENANCE.has(pathname);
}
