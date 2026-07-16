-- Alter orders table to add logistics tracking fields
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists shipped_at timestamp with time zone;
alter table public.orders add column if not exists delivered_at timestamp with time zone;
alter table public.orders add column if not exists cancelled_at timestamp with time zone;
alter table public.orders add column if not exists cancelled_reason text;
alter table public.orders add column if not exists updated_by uuid references public.profiles(id);

-- Enforce check constraint on statuses
alter table public.orders drop constraint if exists check_order_status;
alter table public.orders add constraint check_order_status check (
  order_status in ('awaiting_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'failed')
);
