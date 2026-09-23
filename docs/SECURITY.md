# Security & Privacy

- Do not commit `.env*` secrets.
- Enable RLS on every user-owned Supabase table.
- Store service-role keys only in server environment variables.
- Validate uploaded file types and size server-side.
- Use signed URLs for private campaign assets.
- Do not make portfolio media public until permission is explicitly recorded.
- Treat brand contacts, proposals, contracts and payment notes as private workspace data.
- Do not send raw private campaign information to an AI provider unless the user explicitly triggers the AI feature.
