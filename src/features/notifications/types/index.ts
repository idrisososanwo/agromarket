// ============================================================
// Notifications Feature — TypeScript Types
// ============================================================

export type NotificationType =
  | 'new_order'
  | 'order_accepted'
  | 'order_rejected'
  | 'order_shipped'
  | 'order_delivered'
  | 'payment_successful'
  | 'payment_failed'
  | 'product_approved'
  | 'product_removed'
  | 'seller_verification_approved'
  | 'seller_verification_rejected'
  | 'account_update'
  | 'security_alert'
  | 'system_announcement'

export type NotificationCategory =
  | 'order'
  | 'payment'
  | 'product'
  | 'account'
  | 'system'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  category: NotificationCategory
  read: boolean
  archived: boolean
  action_url: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface NotificationPreferences {
  id: string
  user_id: string
  // Channel toggles
  email_enabled: boolean
  push_enabled: boolean
  in_app_enabled: boolean
  marketing_enabled: boolean
  // Category toggles
  order_updates: boolean
  payment_updates: boolean
  security_updates: boolean
  product_updates: boolean
  system_updates: boolean
  created_at: string
  updated_at: string
}

export interface CreateNotificationPayload {
  user_id: string
  title: string
  message: string
  type: NotificationType
  category: NotificationCategory
  action_url?: string
  metadata?: Record<string, unknown>
}

export interface NotificationFilters {
  category?: NotificationCategory | 'all'
  read?: boolean | 'all'
  archived?: boolean
  search?: string
}

export interface SendEmailPayload {
  to: string
  subject: string
  template: EmailTemplate
  data: Record<string, unknown>
}

export type EmailTemplate =
  | 'registration'
  | 'password_reset'
  | 'order_confirmation'
  | 'order_status_update'
  | 'payment_confirmation'
  | 'seller_verification'
  | 'security_alert'
