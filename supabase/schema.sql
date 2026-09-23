-- Maduca UGC OS — Supabase/Postgres schema (planned production backend)
create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists workspaces (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null default 'Meu UGC',
  monthly_goal numeric(12,2) default 0,
  created_at timestamptz default now()
);

create table if not exists brands (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  category text,
  stage text not null default 'quero_contatar',
  contact_name text,
  contact_email text,
  contact_handle text,
  estimated_value numeric(12,2) default 0,
  next_action text,
  next_action_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  brand_id uuid references brands(id) on delete set null,
  title text not null,
  status text not null default 'briefing',
  fee numeric(12,2) default 0,
  deadline timestamptz,
  deliverables jsonb default '[]'::jsonb,
  usage_rights jsonb default '{}'::jsonb,
  exclusivity jsonb default '{}'::jsonb,
  raw_files_included boolean default false,
  included_revisions int default 1,
  payment_status text default 'pending',
  payment_due_at timestamptz,
  brief text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists content_ideas (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  title text not null,
  category text,
  format text,
  hook text,
  angle text,
  status text default 'idea',
  notes text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  category text,
  owned boolean default true,
  acquisition_cost numeric(12,2) default 0,
  creative_potential int default 0,
  priority text default 'medium',
  notes text,
  created_at timestamptz default now()
);

create table if not exists portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  title text not null,
  category text,
  skill_tag text,
  media_url text,
  thumbnail_url text,
  duration_seconds int,
  is_public boolean default false,
  permission_status text default 'unknown',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists transactions (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  type text not null check (type in ('income','expense','barter')),
  amount numeric(12,2) default 0,
  description text,
  due_at timestamptz,
  paid_at timestamptz,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete cascade,
  brand_id uuid references brands(id) on delete cascade,
  title text not null,
  due_at timestamptz,
  priority text default 'normal',
  completed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists weekly_reviews (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  week_start date not null,
  wins text,
  worked text,
  blockers text,
  experiments text,
  production_score int,
  commercial_score int,
  portfolio_score int,
  created_at timestamptz default now(),
  unique(workspace_id, week_start)
);

alter table profiles enable row level security;
alter table workspaces enable row level security;
alter table brands enable row level security;
alter table campaigns enable row level security;
alter table content_ideas enable row level security;
alter table products enable row level security;
alter table portfolio_items enable row level security;
alter table transactions enable row level security;
alter table tasks enable row level security;
alter table weekly_reviews enable row level security;

create policy "profiles_self" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "workspaces_owner" on workspaces for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "brands_workspace_owner" on brands for all using (exists(select 1 from workspaces w where w.id=brands.workspace_id and w.owner_id=auth.uid())) with check (exists(select 1 from workspaces w where w.id=brands.workspace_id and w.owner_id=auth.uid()));
create policy "campaigns_workspace_owner" on campaigns for all using (exists(select 1 from workspaces w where w.id=campaigns.workspace_id and w.owner_id=auth.uid())) with check (exists(select 1 from workspaces w where w.id=campaigns.workspace_id and w.owner_id=auth.uid()));
create policy "ideas_workspace_owner" on content_ideas for all using (exists(select 1 from workspaces w where w.id=content_ideas.workspace_id and w.owner_id=auth.uid())) with check (exists(select 1 from workspaces w where w.id=content_ideas.workspace_id and w.owner_id=auth.uid()));
create policy "products_workspace_owner" on products for all using (exists(select 1 from workspaces w where w.id=products.workspace_id and w.owner_id=auth.uid())) with check (exists(select 1 from workspaces w where w.id=products.workspace_id and w.owner_id=auth.uid()));
create policy "portfolio_workspace_owner" on portfolio_items for all using (exists(select 1 from workspaces w where w.id=portfolio_items.workspace_id and w.owner_id=auth.uid())) with check (exists(select 1 from workspaces w where w.id=portfolio_items.workspace_id and w.owner_id=auth.uid()));
create policy "transactions_workspace_owner" on transactions for all using (exists(select 1 from workspaces w where w.id=transactions.workspace_id and w.owner_id=auth.uid())) with check (exists(select 1 from workspaces w where w.id=transactions.workspace_id and w.owner_id=auth.uid()));
create policy "tasks_workspace_owner" on tasks for all using (exists(select 1 from workspaces w where w.id=tasks.workspace_id and w.owner_id=auth.uid())) with check (exists(select 1 from workspaces w where w.id=tasks.workspace_id and w.owner_id=auth.uid()));
create policy "reviews_workspace_owner" on weekly_reviews for all using (exists(select 1 from workspaces w where w.id=weekly_reviews.workspace_id and w.owner_id=auth.uid())) with check (exists(select 1 from workspaces w where w.id=weekly_reviews.workspace_id and w.owner_id=auth.uid()));
