import { UserRole, Permission } from '../types'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  buyer: ['purchase_products', 'manage_cart', 'view_orders'],
  seller: ['create_products', 'edit_products', 'delete_products', 'manage_orders'],
  admin: [
    'purchase_products',
    'manage_cart',
    'view_orders',
    'create_products',
    'edit_products',
    'delete_products',
    'manage_orders',
    'manage_users',
    'manage_products',
    'manage_orders',
    'manage_payments',
    'manage_platform',
  ],
}

export function hasRole(currentRole: UserRole | null, requiredRole: UserRole | UserRole[]): boolean {
  if (!currentRole) return false
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(currentRole)
  }
  return currentRole === requiredRole || currentRole === 'admin'
}

export function hasPermission(currentRole: UserRole | null, permission: Permission): boolean {
  if (!currentRole) return false
  const permissions = ROLE_PERMISSIONS[currentRole] || []
  return permissions.includes(permission)
}

export function canAccessRoute(currentRole: UserRole | null, pathname: string): boolean {
  if (currentRole === 'admin') return true
  if (pathname.startsWith('/admin')) {
    return false
  }
  if (pathname.startsWith('/buyer') || pathname.startsWith('/checkout') || pathname.startsWith('/payment')) {
    return currentRole === 'buyer'
  }
  if (pathname.startsWith('/seller')) {
    return currentRole === 'seller'
  }
  return true
}
