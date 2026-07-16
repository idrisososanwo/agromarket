-- Create payments table
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  transaction_hash text unique not null,
  stellar_account text not null,
  amount_xlm numeric(20, 7) not null,
  network text default 'testnet' not null,
  payment_status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for payments
alter table public.payments enable row level security;

-- Policies for payments
create policy "Buyers can view their own payments" on public.payments
  for select using (auth.uid() = buyer_id);

create policy "Buyers can insert their own payments" on public.payments
  for insert with check (auth.uid() = buyer_id);

-- Update orders table columns
alter table public.orders add column if not exists payment_reference text;
alter table public.orders add column if not exists paid_at timestamp with time zone;
