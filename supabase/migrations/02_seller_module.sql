-- 1. Add role column to profiles if not exists
alter table public.profiles add column if not exists role text default 'seller' not null;

-- 2. Add status column to products if not exists
alter table public.products add column if not exists status text default 'active' not null;

-- 3. Create orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete set null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  quantity numeric(10, 2) not null,
  total_price numeric(10, 2) not null,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Policies for orders
create policy "Sellers and buyers can view their own orders" on public.orders
  for select using (auth.uid() = seller_id or auth.uid() = buyer_id);

create policy "Authenticated buyers can place orders" on public.orders
  for insert with check (auth.uid() = buyer_id);

create policy "Sellers can update order status" on public.orders
  for update using (auth.uid() = seller_id);

-- 4. Enable storage for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies for product-images
create policy "Product images are publicly accessible" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Authenticated users can upload product images" on storage.objects
  for insert with check (
    bucket_id = 'product-images' 
    and auth.role() = 'authenticated'
  );

create policy "Authenticated users can update/delete their own product images" on storage.objects
  for update or delete using (
    bucket_id = 'product-images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );
