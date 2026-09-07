-- brand_profiles columns
alter table public.brand_profiles
add column if not exists logo_url text;

alter table public.brand_profiles
add column if not exists cover_image_url text;

alter table public.brand_profiles
add column if not exists avatar_url text;

alter table public.brand_profiles
add column if not exists banner_url text;

-- Storage buckets
insert into storage.buckets (id, name, public) 
values ('brand-profile-assets', 'brand-profile-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('brand-kyc-documents', 'brand-kyc-documents', false)
on conflict (id) do nothing;

-- RLS for brand-profile-assets
drop policy if exists "Public Access" on storage.objects; create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'brand-profile-assets' );

drop policy if exists "Brands can upload profile assets" on storage.objects; create policy "Brands can upload profile assets"
on storage.objects for insert
with check (
  bucket_id = 'brand-profile-assets' 
  and auth.uid() is not null
);

drop policy if exists "Brands can update own profile assets" on storage.objects; create policy "Brands can update own profile assets"
on storage.objects for update
using (
  bucket_id = 'brand-profile-assets' 
  and auth.uid() is not null
);

drop policy if exists "Brands can delete own profile assets" on storage.objects; create policy "Brands can delete own profile assets"
on storage.objects for delete
using (
  bucket_id = 'brand-profile-assets' 
  and auth.uid() is not null
);

-- RLS for brand-kyc-documents
drop policy if exists "Brands can upload KYC docs" on storage.objects; create policy "Brands can upload KYC docs"
on storage.objects for insert
with check (
  bucket_id = 'brand-kyc-documents'
  and auth.uid() is not null
);

drop policy if exists "Brands can read own KYC docs" on storage.objects; create policy "Brands can read own KYC docs"
on storage.objects for select
using (
  bucket_id = 'brand-kyc-documents'
  and auth.uid() is not null
);

-- Enable RLS
alter table public.brand_poc enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.brand_kyc_documents enable row level security;
alter table public.brand_shortlists enable row level security;
alter table public.campaigns enable row level security;

-- brand_poc RLS
drop policy if exists "Brands can manage own POC" on public.brand_poc; create policy "Brands can manage own POC"
on public.brand_poc
for all
to authenticated
using (
  exists (
    select 1
    from public.brand_profiles bp
    where bp.id = brand_poc.brand_id
      and bp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.brand_profiles bp
    where bp.id = brand_poc.brand_id
      and bp.user_id = auth.uid()
  )
);

-- chat_threads RLS
drop policy if exists "Brands can manage own chat threads" on public.chat_threads; create policy "Brands can manage own chat threads"
on public.chat_threads
for all
to authenticated
using (
  exists (
    select 1
    from public.brand_profiles bp
    where bp.id = chat_threads.brand_id
      and bp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.brand_profiles bp
    where bp.id = chat_threads.brand_id
      and bp.user_id = auth.uid()
  )
);

-- chat_messages RLS
drop policy if exists "Brands can manage own chat messages" on public.chat_messages; create policy "Brands can manage own chat messages"
on public.chat_messages
for all
to authenticated
using (
  exists (
    select 1
    from public.chat_threads ct
    join public.brand_profiles bp on bp.id = ct.brand_id
    where ct.id = chat_messages.thread_id
      and bp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.chat_threads ct
    join public.brand_profiles bp on bp.id = ct.brand_id
    where ct.id = chat_messages.thread_id
      and bp.user_id = auth.uid()
  )
);

-- brand_kyc_documents RLS
drop policy if exists "Brands can manage own KYC docs" on public.brand_kyc_documents; create policy "Brands can manage own KYC docs"
on public.brand_kyc_documents
for all
to authenticated
using (
  exists (
    select 1
    from public.brand_profiles bp
    where bp.id = brand_kyc_documents.brand_id
      and bp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.brand_profiles bp
    where bp.id = brand_kyc_documents.brand_id
      and bp.user_id = auth.uid()
  )
);

-- brand_shortlists RLS
drop policy if exists "Brands can manage own shortlists" on public.brand_shortlists; create policy "Brands can manage own shortlists"
on public.brand_shortlists
for all
to authenticated
using (
  exists (
    select 1
    from public.brand_profiles bp
    where bp.id = brand_shortlists.brand_id
      and bp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.brand_profiles bp
    where bp.id = brand_shortlists.brand_id
      and bp.user_id = auth.uid()
  )
);

-- campaigns RLS
drop policy if exists "Brands can manage own campaigns" on public.campaigns; create policy "Brands can manage own campaigns"
on public.campaigns
for all
to authenticated
using (
  exists (
    select 1
    from public.brand_profiles bp
    where bp.id = campaigns.brand_id
      and bp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.brand_profiles bp
    where bp.id = campaigns.brand_id
      and bp.user_id = auth.uid()
  )
);
