-- Maduca RLS smoke test
-- Run only in a safe development/staging context. Everything is rolled back.

begin;

insert into auth.users (
  id, aud, role, email, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, is_sso_user, is_anonymous
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'authenticated','authenticated','rls-a@maduca.test',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"RLS User A"}'::jsonb,
    now(),now(),false,false
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'authenticated','authenticated','rls-b@maduca.test',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"RLS User B"}'::jsonb,
    now(),now(),false,false
  );

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';

insert into public.tasks (workspace_id,title)
select id, 'RLS allowed insert'
from public.workspaces
limit 1;

select
  (select count(*) from public.profiles) as visible_profiles,
  (select count(*) from public.workspaces) as visible_workspaces,
  (select count(*) from public.tasks where title='RLS allowed insert') as visible_inserted_tasks;

rollback;
