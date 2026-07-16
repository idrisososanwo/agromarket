-- ============================================================
-- Migration 09: Notifications & Communication Schema
-- ============================================================

-- Notification type enum
CREATE TYPE notification_type AS ENUM (
  'new_order',
  'order_accepted',
  'order_rejected',
  'order_shipped',
  'order_delivered',
  'payment_successful',
  'payment_failed',
  'product_approved',
  'product_removed',
  'seller_verification_approved',
  'seller_verification_rejected',
  'account_update',
  'security_alert',
  'system_announcement'
);

-- Notification category enum
CREATE TYPE notification_category AS ENUM (
  'order',
  'payment',
  'product',
  'account',
  'system'
);

-- ============================================================
-- Notifications Table
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  message         TEXT NOT NULL,
  type            notification_type NOT NULL,
  category        notification_category NOT NULL,
  read            BOOLEAN NOT NULL DEFAULT false,
  archived        BOOLEAN NOT NULL DEFAULT false,
  action_url      TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for per-user queries sorted by recency
CREATE INDEX idx_notifications_user_id       ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread   ON notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_user_archived ON notifications(user_id, archived);
CREATE INDEX idx_notifications_created_at    ON notifications(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_notifications_updated_at();

-- ============================================================
-- Notification Preferences Table
-- ============================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Channel toggles
  email_enabled     BOOLEAN NOT NULL DEFAULT true,
  push_enabled      BOOLEAN NOT NULL DEFAULT false,
  in_app_enabled    BOOLEAN NOT NULL DEFAULT true,
  marketing_enabled BOOLEAN NOT NULL DEFAULT false,
  -- Category toggles
  order_updates     BOOLEAN NOT NULL DEFAULT true,
  payment_updates   BOOLEAN NOT NULL DEFAULT true,
  security_updates  BOOLEAN NOT NULL DEFAULT true,
  product_updates   BOOLEAN NOT NULL DEFAULT true,
  system_updates    BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_notification_preferences_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

-- notifications RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users read/manage only their own notifications
CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can insert notifications (for broadcasts)
CREATE POLICY "notifications_insert_admin_or_system"
  ON notifications FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- notification_preferences RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prefs_select_own"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "prefs_insert_own"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "prefs_update_own"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- Enable Supabase Realtime
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
