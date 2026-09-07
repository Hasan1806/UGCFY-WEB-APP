create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null,
  creator_id uuid,
  campaign_id uuid,
  title text,
  status text not null default 'active',
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  brand_id uuid not null,
  creator_id uuid,
  campaign_id uuid,
  sender_type text not null check (sender_type in ('brand', 'creator', 'admin')),
  sender_id uuid not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists conversations_brand_id_idx
on public.conversations(brand_id);

create index if not exists conversations_last_message_at_idx
on public.conversations(last_message_at desc);

create index if not exists conversation_messages_conversation_id_created_at_idx
on public.conversation_messages(conversation_id, created_at);

create index if not exists conversation_messages_brand_id_idx
on public.conversation_messages(brand_id);

alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'conversation_messages'
  ) then
    alter publication supabase_realtime add table public.conversation_messages;
  end if;
end $$;

-- Policies for conversations
drop policy if exists "Brand can select own conversations" on public.conversations;
create policy "Brand can select own conversations"
on public.conversations for select
using (brand_id in (select id from public.brand_profiles where user_id = auth.uid()));

drop policy if exists "Brand can insert own conversations" on public.conversations;
create policy "Brand can insert own conversations"
on public.conversations for insert
with check (brand_id in (select id from public.brand_profiles where user_id = auth.uid()));

-- Policies for conversation_messages
drop policy if exists "Brand can select messages from own conversations" on public.conversation_messages;
create policy "Brand can select messages from own conversations"
on public.conversation_messages for select
using (brand_id in (select id from public.brand_profiles where user_id = auth.uid()));

drop policy if exists "Brand can insert messages into own conversations" on public.conversation_messages;
create policy "Brand can insert messages into own conversations"
on public.conversation_messages for insert
with check (brand_id in (select id from public.brand_profiles where user_id = auth.uid()));
