# Supabase — Maduca

Project ref: `wpdsbrlmrqvkeklnemrz`  
Region: `sa-east-1`

## Applied

- `maduca_v1_core_schema`
- `add_foreign_key_indexes`

## Security

- 10 public domain tables have RLS enabled.
- Authenticated access is scoped by workspace ownership.
- Anonymous table privileges are revoked.
- `private.handle_new_user()` is not executable by public/anon/authenticated roles.
- New Auth users receive one profile + workspace through an Auth trigger.
- `ugc-assets` is a private Storage bucket.
- Storage paths must begin with the authenticated user's UUID.
- Upload/update/delete/select policies are owner-scoped.
- Supabase Security Advisor returned zero findings after schema application.

## Public browser configuration

`NEXT_PUBLIC_SUPABASE_URL` and the modern `sb_publishable_...` key are intentionally browser-safe. They do not bypass RLS.

Never expose:
- secret/service role keys
- database password
- personal access tokens

## Verification

The schema has 10 core tables, 39 public RLS policies, 4 Storage policies, an active Auth trigger, and a private `ugc-assets` bucket.
