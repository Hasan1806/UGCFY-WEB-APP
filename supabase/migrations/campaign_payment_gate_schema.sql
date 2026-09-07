-- LOOP CAMPAIGN PAYMENT GATE SCHEMA

-- 1. Add payment_status enum if not exists
do $$
begin
  if not exists (select 1 from pg_type where typname = 'campaign_payment_status') then
    create type public.campaign_payment_status as enum (
      'not_required',
      'pending',
      'paid',
      'failed',
      'refunded'
    );
  end if;
end $$;

-- 2. Add campaign payment/reference fields
alter table public.campaigns
add column if not exists payment_status public.campaign_payment_status not null default 'pending',
add column if not exists total_payable numeric(12,2),
add column if not exists currency text not null default 'INR',
add column if not exists inspiration_reference text,
add column if not exists inspiration_video_id uuid,
add column if not exists payment_id uuid;

-- 3. Create payments table if missing
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null,
  campaign_id uuid,
  amount numeric(12,2) not null,
  currency text not null default 'INR',
  purpose text not null default 'campaign_funding',
  status text not null default 'pending',
  provider text,
  provider_order_id text,
  provider_payment_id text,
  provider_signature text,
  funds_state text not null default 'held_for_campaign',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Indexes
create index if not exists payments_brand_id_idx on public.payments (brand_id);
create index if not exists payments_campaign_id_idx on public.payments (campaign_id);
create index if not exists payments_status_idx on public.payments (status);
