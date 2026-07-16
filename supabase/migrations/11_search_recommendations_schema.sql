-- ============================================================
-- Migration 11: Search, Recommendations, and Discovery Schema
-- ============================================================

-- ============================================================
-- Search History Table
-- ============================================================
create table if not exists public.search_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  search_term text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for per-user searches ordered by recency
create index if not exists idx_search_history_user_id on public.search_history(user_id);
create index if not exists idx_search_history_created_at on public.search_history(created_at desc);

-- Enable RLS
alter table public.search_history enable row level security;

-- Policies for Search History (Private to each user)
create policy "Users can view their own search history"
  on public.search_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own search history"
  on public.search_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own search history"
  on public.search_history for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Recently Viewed Table
-- ============================================================
create table if not exists public.recently_viewed (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- One entry per user-product to avoid duplicates, we can update viewed_at
  unique(user_id, product_id)
);

-- Index
create index if not exists idx_recently_viewed_user_id on public.recently_viewed(user_id);
create index if not exists idx_recently_viewed_viewed_at on public.recently_viewed(viewed_at desc);

-- Enable RLS
alter table public.recently_viewed enable row level security;

-- Policies for Recently Viewed
create policy "Users can view their own recently viewed products"
  on public.recently_viewed for select
  using (auth.uid() = user_id);

create policy "Users can insert their own recently viewed"
  on public.recently_viewed for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own recently viewed"
  on public.recently_viewed for update
  using (auth.uid() = user_id);

create policy "Users can delete their own recently viewed"
  on public.recently_viewed for delete
  using (auth.uid() = user_id);
