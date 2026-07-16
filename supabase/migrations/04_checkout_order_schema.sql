-- Drop old simple orders table
drop table if exists public.orders cascade;

-- Create new orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  subtotal numeric(10, 2) not null,
  delivery_fee numeric(10, 2) not null,
  total_amount numeric(10, 2) not null,
  payment_status text default 'pending' not null,
  order_status text default 'awaiting_payment' not null,
  delivery_name text not null,
  delivery_phone text not null,
  delivery_address text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_items table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  quantity numeric(10, 2) not null,
  unit_price numeric(10, 2) not null,
  total_price numeric(10, 2) not null,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for orders
create policy "Buyers can view their own orders" on public.orders
  for select using (auth.uid() = buyer_id);

create policy "Buyers can insert their own orders" on public.orders
  for insert with check (auth.uid() = buyer_id);

-- Policies for order_items
create policy "Buyers can view their own order items" on public.order_items
  for select using (exists (
    select 1 from public.orders where id = order_items.order_id and buyer_id = auth.uid()
  ));

create policy "Sellers can view their own order items" on public.order_items
  for select using (auth.uid() = seller_id);

create policy "Buyers can insert order items" on public.order_items
  for insert with check (exists (
    select 1 from public.orders where id = order_items.order_id and buyer_id = auth.uid()
  ));

create policy "Sellers can update their own order items status" on public.order_items
  for update using (auth.uid() = seller_id);
