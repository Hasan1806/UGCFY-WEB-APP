-- Fix missing schema elements for brand verification

-- 1. Add missing onboarding_completed_at to brand_profiles
alter table public.brand_profiles
add column if not exists onboarding_completed_at timestamptz;

-- 2. Create brand_kyc_documents table if it doesn't exist
create table if not exists public.brand_kyc_documents (
    id uuid primary key default gen_random_uuid(),
    brand_id uuid not null,
    submission_id uuid,
    document_type text not null,
    file_name text,
    file_url text,
    storage_path text,
    mime_type text,
    file_size bigint,
    status text not null default 'uploaded',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 3. Add indexes to brand_kyc_documents
create index if not exists idx_brand_kyc_documents_brand_id on public.brand_kyc_documents(brand_id);
create index if not exists idx_brand_kyc_documents_submission_id on public.brand_kyc_documents(submission_id);
create index if not exists idx_brand_kyc_documents_document_type on public.brand_kyc_documents(document_type);
create index if not exists idx_brand_kyc_documents_created_at on public.brand_kyc_documents(created_at);

-- 4. Enable RLS on brand_kyc_documents
alter table public.brand_kyc_documents enable row level security;

-- 5. Add RLS Policies for brand_kyc_documents
drop policy if exists "Brands can manage own KYC documents" on public.brand_kyc_documents;

create policy "Brands can manage own KYC documents"
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
