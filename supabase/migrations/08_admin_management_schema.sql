-- Add is_suspended to profiles
alter table public.profiles add column if not exists is_suspended boolean default false;

-- Add moderation fields to products
alter table public.products add column if not exists is_removed boolean default false;
alter table public.products add column if not exists is_flagged boolean default false;

-- Create reports table for moderation flags
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint check_target_type check (target_type in ('buyer', 'seller', 'product')),
  constraint check_report_status check (status in ('pending', 'resolved', 'dismissed'))
);

-- Enable RLS on reports
alter table public.reports enable row level security;

-- Policies for reports
create policy "Anyone authenticated can create reports" on public.reports
  for insert with check (auth.uid() is not null);

create policy "Admins can view all reports" on public.reports
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update reports" on public.reports
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Helper function to check if caller is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Extend profiles policy to allow admin updates (for suspension/role promotion)
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile or admin can update any" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- Extend products policies to allow admin select/update/delete
drop policy if exists "Sellers can update their own products" on public.products;
create policy "Sellers can update their own products or admin can update any" on public.products
  for update using (auth.uid() = seller_id or public.is_admin());

drop policy if exists "Sellers can delete their own products" on public.products;
create policy "Sellers can delete their own products or admin can delete any" on public.products
  for delete using (auth.uid() = seller_id or public.is_admin());

-- Extend seller_profiles policies to allow admin select/update
drop policy if exists "Sellers can update their own seller profile" on public.seller_profiles;
create policy "Sellers can update their own seller profile or admin can update any" on public.seller_profiles
  for update using (auth.uid() = user_id or public.is_admin());

-- Extend orders policies to allow admin select/update
drop policy if exists "Buyers can view their own orders" on public.orders;
create policy "Buyers can view their own orders or admin can view any" on public.orders
  for select using (auth.uid() = buyer_id or public.is_admin());

create policy "Admins can update any order" on public.orders
  for update using (public.is_admin());

-- Extend order_items policies to allow admin select/update
drop policy if exists "Buyers can view their own order items" on public.order_items;
create policy "Buyers can view their own order items or admin can view any" on public.order_items
  for select using (
    exists (
      select 1 from public.orders where id = order_items.order_id and buyer_id = auth.uid()
    ) or public.is_admin()
  );

drop policy if exists "Sellers can view their own order items" on public.order_items;
create policy "Sellers can view their own order items or admin can view any" on public.order_items
  for select using (auth.uid() = seller_id or public.is_admin());

create policy "Admins can update any order item" on public.order_items
  for update using (public.is_admin());

-- Extend payments policies to allow admin select/update
drop policy if exists "Buyers can view their own payments" on public.payments;
create policy "Buyers can view their own payments or admin can view any" on public.payments
  for select using (auth.uid() = buyer_id or public.is_admin());

create policy "Admins can update any payment" on public.payments
  for update using (public.is_admin());
