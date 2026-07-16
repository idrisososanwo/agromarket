-- Extend profiles table in public schema
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists role text default 'buyer';
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists state text;
alter table public.profiles add column if not exists country text;
alter table public.profiles add column if not exists postal_code text;
alter table public.profiles add column if not exists preferred_language text default 'en';
alter table public.profiles add column if not exists preferred_currency text default 'USD';
alter table public.profiles add column if not exists notification_email boolean default true;
alter table public.profiles add column if not exists notification_push boolean default true;
alter table public.profiles add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Add check constraint to role
alter table public.profiles drop constraint if exists check_profile_role;
alter table public.profiles add constraint check_profile_role check (role in ('buyer', 'seller'));

-- Create seller_profiles table
create table if not exists public.seller_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  business_name text,
  business_description text,
  farm_name text,
  years_of_experience integer default 0,
  verification_status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add check constraint to verification status
alter table public.seller_profiles drop constraint if exists check_verification_status;
alter table public.seller_profiles add constraint check_verification_status check (
  verification_status in ('pending', 'verified', 'rejected')
);

-- Enable RLS on seller_profiles
alter table public.seller_profiles enable row level security;

-- Policies for seller_profiles
create policy "Seller profiles are viewable by everyone" on public.seller_profiles
  for select using (true);

create policy "Sellers can insert their own seller profile" on public.seller_profiles
  for insert with check (auth.uid() = user_id);

create policy "Sellers can update their own seller profile" on public.seller_profiles
  for update using (auth.uid() = user_id);

-- Create avatars storage bucket in Supabase (run safely)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Enable public select access on storage.objects for avatars
create policy "Avatar images are publicly accessible" on storage.objects
  for select using (bucket_id = 'avatars');

-- Allow users to manage objects inside their own folder in avatars bucket
create policy "Users can upload their own avatar" on storage.objects
  for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their own avatar" on storage.objects
  for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own avatar" on storage.objects
  for delete using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
