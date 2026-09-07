-- Align brand web verification with the mobile app brand KYC contract.

create extension if not exists "pgcrypto";

alter table public.brand_profiles
add column if not exists profile_id uuid,
add column if not exists user_id uuid,
add column if not exists brand_name text,
add column if not exists company_name text,
add column if not exists legal_name text,
add column if not exists platform_handle text,
add column if not exists bio text,
add column if not exists business_address text,
add column if not exists gst_number text,
add column if not exists pan_number text,
add column if not exists cin_number text,
add column if not exists director_name text,
add column if not exists din_number text,
add column if not exists contact_email text,
add column if not exists finance_email text,
add column if not exists kyc_status text default 'not_started',
add column if not exists onboarding_status text default 'in_progress',
add column if not exists onboarding_completed boolean default false,
add column if not exists onboarding_completed_at timestamptz,
add column if not exists is_verified boolean default false,
add column if not exists kyc_submitted_at timestamptz,
add column if not exists verification_submitted_at timestamptz,
add column if not exists updated_at timestamptz default now();

update public.brand_profiles
set profile_id = (
      select id from public.profiles 
      where id = coalesce(brand_profiles.profile_id, brand_profiles.user_id, brand_profiles.id)
    ),
    user_id = coalesce(user_id, profile_id, id)
where profile_id is null or user_id is null;

create index if not exists idx_brand_profiles_profile_id on public.brand_profiles(profile_id);
create index if not exists idx_brand_profiles_user_id on public.brand_profiles(user_id);

create table if not exists public.kyc_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role text not null default 'brand',
  current_step text not null default 'draft',
  form_data jsonb not null default '{}'::jsonb,
  document_urls text[] not null default '{}'::text[],
  status text not null default 'draft',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.kyc_submissions
add column if not exists role text default 'brand',
add column if not exists current_step text default 'draft',
add column if not exists form_data jsonb default '{}'::jsonb,
add column if not exists document_urls text[] default '{}'::text[],
add column if not exists submitted_at timestamptz,
add column if not exists updated_at timestamptz default now();

create unique index if not exists idx_kyc_submissions_user_id_unique
on public.kyc_submissions(user_id);

alter table public.kyc_submissions enable row level security;

drop policy if exists "Users can manage own KYC submissions" on public.kyc_submissions;
create policy "Users can manage own KYC submissions"
on public.kyc_submissions
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('brand-kyc-documents', 'brand-kyc-documents', false)
on conflict (id) do nothing;
