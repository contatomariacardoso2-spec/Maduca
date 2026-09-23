-- Maduca UGC OS — production schema for a hosted Supabase project.
-- Postgres 17 / Supabase 2026: explicit Data API grants + RLS.

create schema if not exists private;
revoke all on schema private from public;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'Meu UGC',
  monthly_goal numeric(12,2) not null default 5000,
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  category text,
  stage text not null default 'quero_contatar',
  contact_name text,
  contact_email text,
  contact_handle text,
  estimated_value numeric(12,2) not null default 0,
  next_action text,
  next_action_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete set null,
  title text not null,
  status text not null default 'briefing',
  fee numeric(12,2) not null default 0,
  deadline timestamptz,
  deliverables jsonb not null default '[]'::jsonb,
  usage_rights jsonb not null default '{}'::jsonb,
  exclusivity jsonb not null default '{}'::jsonb,
  raw_files_included boolean not null default false,
  included_revisions int not null default 1,
  payment_status text not null default 'pending',
  payment_due_at timestamptz,
  brief text,
  hours_spent numeric(8,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_ideas (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  product_id uuid,
  title text not null,
  category text,
  format text,
  hook text,
  angle text,
  status text not null default 'idea',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  category text,
  owned boolean not null default true,
  acquisition_cost numeric(12,2) not null default 0,
  creative_potential int not null default 0,
  priority text not null default 'medium',
  notes text,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'content_ideas_product_id_fkey'
  ) then
    alter table public.content_ideas
      add constraint content_ideas_product_id_fkey
      foreign key (product_id) references public.products(id) on delete set null;
  end if;
end $$;

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  title text not null,
  category text,
  skill_tag text,
  media_url text,
  thumbnail_url text,
  duration_seconds int,
  is_public boolean not null default false,
  permission_status text not null default 'unknown'
    check (permission_status in ('unknown','requested','granted','denied')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  type text not null check (type in ('income','expense','barter')),
  amount numeric(12,2) not null default 0,
  description text,
  due_at timestamptz,
  paid_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete cascade,
  title text not null,
  due_at timestamptz,
  priority text not null default 'normal',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  week_start date not null,
  wins text,
  worked text,
  blockers text,
  experiments text,
  production_score int,
  commercial_score int,
  portfolio_score int,
  created_at timestamptz not null default now(),
  unique(workspace_id, week_start)
);

create index if not exists brands_workspace_idx on public.brands(workspace_id);
create index if not exists campaigns_workspace_idx on public.campaigns(workspace_id);
create index if not exists campaigns_deadline_idx on public.campaigns(deadline);
create index if not exists ideas_workspace_idx on public.content_ideas(workspace_id);
create index if not exists products_workspace_idx on public.products(workspace_id);
create index if not exists portfolio_workspace_idx on public.portfolio_items(workspace_id);
create index if not exists transactions_workspace_idx on public.transactions(workspace_id);
create index if not exists tasks_workspace_idx on public.tasks(workspace_id);
create index if not exists tasks_due_idx on public.tasks(due_at);
create index if not exists reviews_workspace_idx on public.weekly_reviews(workspace_id);
create index if not exists workspaces_owner_idx on public.workspaces(owner_id);
create index if not exists campaigns_brand_idx on public.campaigns(brand_id);
create index if not exists ideas_product_idx on public.content_ideas(product_id);
create index if not exists portfolio_campaign_idx on public.portfolio_items(campaign_id);
create index if not exists transactions_campaign_idx on public.transactions(campaign_id);
create index if not exists tasks_campaign_idx on public.tasks(campaign_id);
create index if not exists tasks_brand_idx on public.tasks(brand_id);

-- New users automatically receive a profile and a first workspace.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'Creator'))
  on conflict (id) do nothing;

  insert into public.workspaces (owner_id, name)
  values (new.id, 'Meu UGC');

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public;
revoke all on function private.handle_new_user() from anon;
revoke all on function private.handle_new_user() from authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Data API exposure is explicit for authenticated users.
revoke all on table
  public.profiles,
  public.workspaces,
  public.brands,
  public.campaigns,
  public.content_ideas,
  public.products,
  public.portfolio_items,
  public.transactions,
  public.tasks,
  public.weekly_reviews
from anon, authenticated;

grant usage on schema public to authenticated;
grant select, insert, update, delete on table
  public.profiles,
  public.workspaces,
  public.brands,
  public.campaigns,
  public.content_ideas,
  public.products,
  public.portfolio_items,
  public.transactions,
  public.tasks,
  public.weekly_reviews
to authenticated;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.brands enable row level security;
alter table public.campaigns enable row level security;
alter table public.content_ideas enable row level security;
alter table public.products enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.transactions enable row level security;
alter table public.tasks enable row level security;
alter table public.weekly_reviews enable row level security;

-- Profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Workspaces
drop policy if exists "workspaces_select_own" on public.workspaces;
create policy "workspaces_select_own" on public.workspaces for select to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "workspaces_insert_own" on public.workspaces;
create policy "workspaces_insert_own" on public.workspaces for insert to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "workspaces_update_own" on public.workspaces;
create policy "workspaces_update_own" on public.workspaces for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "workspaces_delete_own" on public.workspaces;
create policy "workspaces_delete_own" on public.workspaces for delete to authenticated
using ((select auth.uid()) = owner_id);

-- Workspace-owned table policies.
drop policy if exists "brands_select_own" on public.brands;
create policy "brands_select_own" on public.brands for select to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "brands_insert_own" on public.brands;
create policy "brands_insert_own" on public.brands for insert to authenticated
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "brands_update_own" on public.brands;
create policy "brands_update_own" on public.brands for update to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())))
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "brands_delete_own" on public.brands;
create policy "brands_delete_own" on public.brands for delete to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));

drop policy if exists "campaigns_select_own" on public.campaigns;
create policy "campaigns_select_own" on public.campaigns for select to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "campaigns_insert_own" on public.campaigns;
create policy "campaigns_insert_own" on public.campaigns for insert to authenticated
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "campaigns_update_own" on public.campaigns;
create policy "campaigns_update_own" on public.campaigns for update to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())))
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "campaigns_delete_own" on public.campaigns;
create policy "campaigns_delete_own" on public.campaigns for delete to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));

drop policy if exists "ideas_select_own" on public.content_ideas;
create policy "ideas_select_own" on public.content_ideas for select to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "ideas_insert_own" on public.content_ideas;
create policy "ideas_insert_own" on public.content_ideas for insert to authenticated
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "ideas_update_own" on public.content_ideas;
create policy "ideas_update_own" on public.content_ideas for update to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())))
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "ideas_delete_own" on public.content_ideas;
create policy "ideas_delete_own" on public.content_ideas for delete to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));

drop policy if exists "products_select_own" on public.products;
create policy "products_select_own" on public.products for select to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "products_insert_own" on public.products;
create policy "products_insert_own" on public.products for insert to authenticated
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "products_update_own" on public.products;
create policy "products_update_own" on public.products for update to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())))
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "products_delete_own" on public.products;
create policy "products_delete_own" on public.products for delete to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));

drop policy if exists "portfolio_select_own" on public.portfolio_items;
create policy "portfolio_select_own" on public.portfolio_items for select to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "portfolio_insert_own" on public.portfolio_items;
create policy "portfolio_insert_own" on public.portfolio_items for insert to authenticated
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "portfolio_update_own" on public.portfolio_items;
create policy "portfolio_update_own" on public.portfolio_items for update to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())))
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "portfolio_delete_own" on public.portfolio_items;
create policy "portfolio_delete_own" on public.portfolio_items for delete to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions for select to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own" on public.transactions for insert to authenticated
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own" on public.transactions for update to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())))
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own" on public.transactions for delete to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));

drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own" on public.tasks for select to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own" on public.tasks for insert to authenticated
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own" on public.tasks for update to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())))
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own" on public.tasks for delete to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));

drop policy if exists "reviews_select_own" on public.weekly_reviews;
create policy "reviews_select_own" on public.weekly_reviews for select to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "reviews_insert_own" on public.weekly_reviews;
create policy "reviews_insert_own" on public.weekly_reviews for insert to authenticated
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "reviews_update_own" on public.weekly_reviews;
create policy "reviews_update_own" on public.weekly_reviews for update to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())))
with check (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));
drop policy if exists "reviews_delete_own" on public.weekly_reviews;
create policy "reviews_delete_own" on public.weekly_reviews for delete to authenticated
using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = (select auth.uid())));

-- Private media bucket. Object path must begin with the authenticated user's UUID.
insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'ugc-assets',
  'ugc-assets',
  false,
  104857600,
  array['video/mp4','video/quicktime','image/jpeg','image/png','image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "ugc_assets_select_own" on storage.objects;
create policy "ugc_assets_select_own"
on storage.objects for select to authenticated
using (
  bucket_id = 'ugc-assets'
  and owner_id = (select auth.uid()::text)
);

drop policy if exists "ugc_assets_insert_own" on storage.objects;
create policy "ugc_assets_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'ugc-assets'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "ugc_assets_update_own" on storage.objects;
create policy "ugc_assets_update_own"
on storage.objects for update to authenticated
using (
  bucket_id = 'ugc-assets'
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'ugc-assets'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "ugc_assets_delete_own" on storage.objects;
create policy "ugc_assets_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'ugc-assets'
  and owner_id = (select auth.uid()::text)
);
