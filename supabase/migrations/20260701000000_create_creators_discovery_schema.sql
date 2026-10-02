-- ============================================================================
-- UGCFY CREATOR DISCOVERY PRODUCTION SCHEMA MIGRATION
-- Migration: 20260701000000_create_creators_discovery_schema.sql
-- Purpose: Canonical PostgreSQL schema, constraints, GIN indexes, and RLS
--          for high-performance Instagram Creator Discovery
-- ============================================================================

-- 1. Enable required extensions if not already present
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- 2. Create Canonical Creators Table
create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  instagram_username text not null,
  instagram_username_normalized text not null,
  instagram_profile_url text not null,
  display_name text,
  profile_image_url text,
  bio text,
  followers_count bigint check (followers_count >= 0),
  following_count bigint check (following_count >= 0),
  creator_gender text not null default 'unspecified' check (creator_gender in ('male', 'female', 'other', 'unspecified')),
  country text default 'India',
  state text,
  city text,
  country_normalized text default 'india',
  state_normalized text,
  city_normalized text,
  location_source text not null default 'unknown' check (location_source in ('creator_provided', 'provider', 'inferred', 'unknown')),
  location_confidence numeric(3, 2) check (location_confidence is null or (location_confidence >= 0.00 and location_confidence <= 1.00)),
  primary_niche text,
  niches text[] not null default '{}',
  engagement_rate numeric(5, 2) check (engagement_rate is null or engagement_rate >= 0.00),
  avg_likes bigint check (avg_likes is null or avg_likes >= 0),
  avg_comments bigint check (avg_comments is null or avg_comments >= 0),
  avg_reel_views bigint check (avg_reel_views is null or avg_reel_views >= 0),
  verified boolean not null default false,
  data_source text not null default 'ugcfy_index',
  source_creator_id text,
  raw_metadata jsonb default '{}'::jsonb,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint uq_creators_instagram_username_normalized unique (instagram_username_normalized),
  constraint chk_instagram_username_normalized_format check (instagram_username_normalized ~ '^[a-z0-9._]{1,30}$')
);

-- 3. Create Saved Creators (Shortlist) Table for Brand Relationships
create table if not exists public.saved_creators (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brand_profiles(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),

  constraint uq_saved_creators_user_creator unique (user_id, creator_id)
);

-- 4. High-Performance B-Tree & GIN Indexes
-- Username lookup & uniqueness
create index if not exists idx_creators_username_norm on public.creators (instagram_username_normalized);

-- Single-column filter indexes
create index if not exists idx_creators_followers on public.creators (followers_count);
create index if not exists idx_creators_gender on public.creators (creator_gender);
create index if not exists idx_creators_country_norm on public.creators (country_normalized);
create index if not exists idx_creators_state_norm on public.creators (state_normalized);
create index if not exists idx_creators_city_norm on public.creators (city_normalized);
create index if not exists idx_creators_engagement on public.creators (engagement_rate);
create index if not exists idx_creators_primary_niche on public.creators (primary_niche);
create index if not exists idx_creators_last_synced on public.creators (last_synced_at desc);

-- GIN index for multi-select niche filtering (array containment/overlap)
create index if not exists idx_creators_niches_gin on public.creators using gin (niches);

-- Trigram / Text search index for fuzzy display name & username queries
create index if not exists idx_creators_name_trgm on public.creators using gin (display_name gin_trgm_ops);

-- Composite index optimized for the primary discovery search pattern:
-- WHERE creator_gender = ? AND city_normalized = ? AND followers_count BETWEEN ? AND ? AND engagement_rate >= ?
create index if not exists idx_creators_discovery_composite on public.creators (
  country_normalized,
  creator_gender,
  city_normalized,
  followers_count,
  engagement_rate
);

-- Saved creators lookup index
create index if not exists idx_saved_creators_user on public.saved_creators (user_id, created_at desc);
create index if not exists idx_saved_creators_brand on public.saved_creators (brand_id, created_at desc);

-- 5. Row Level Security (RLS) Policies
alter table public.creators enable row level security;
alter table public.saved_creators enable row level security;

-- Creators: Read-only for authenticated & public requests (Discovery Search)
drop policy if exists "Public creators read access" on public.creators;
create policy "Public creators read access"
  on public.creators
  for select
  using (true);

-- Creators: Mutations strictly forbidden for anon/authenticated clients.
-- Service role key (Server Ingestion Pipeline) bypasses RLS automatically.

-- Saved Creators: Authenticated users can manage their own saved creators
drop policy if exists "Users can view own saved creators" on public.saved_creators;
create policy "Users can view own saved creators"
  on public.saved_creators
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own saved creators" on public.saved_creators;
create policy "Users can insert own saved creators"
  on public.saved_creators
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own saved creators" on public.saved_creators;
create policy "Users can delete own saved creators"
  on public.saved_creators
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- 6. Trigger for automated updated_at timestamp
create or replace function public.set_creators_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_creators_updated_at on public.creators;
create trigger trg_creators_updated_at
  before update on public.creators
  for each row
  execute function public.set_creators_updated_at();
