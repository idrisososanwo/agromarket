-- Create cart_items table
create table if not exists public.cart_items (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity numeric(10, 2) default 1 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(buyer_id, product_id)
);

-- Enable RLS
alter table public.cart_items enable row level security;

-- Policies for cart_items
create policy "Users can view their own cart items" on public.cart_items
  for select using (auth.uid() = buyer_id);

create policy "Users can insert their own cart items" on public.cart_items
  for insert with check (auth.uid() = buyer_id);

create policy "Users can update their own cart items" on public.cart_items
  for update using (auth.uid() = buyer_id);

create policy "Users can delete their own cart items" on public.cart_items
  for delete using (auth.uid() = buyer_id);
