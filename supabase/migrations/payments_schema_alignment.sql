alter table public.payments
add column
if not exists funds_state text not null default 'held_for_campaign';

alter table public.payments
add column
if not exists purpose text not null default 'campaign_funding';

alter table public.payments
add column
if not exists provider text;

alter table public.payments
add column
if not exists provider_order_id text;

alter table public.payments
add column
if not exists provider_payment_id text;

alter table public.payments
add column
if not exists provider_signature text;

alter table public.payments
add column
if not exists paid_at timestamptz;
