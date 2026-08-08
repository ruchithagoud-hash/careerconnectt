# CareerConnect — Migration / Export Prep

Prepared **without changing anything**. Lovable Cloud is still connected and the current backend is untouched.

Target project: `iluyvtucsgjrpbdyqlof` — https://iluyvtucsgjrpbdyqlof.supabase.co

## What exists in the current managed backend

| Item | Details | Migrates via SQL? |
| --- | --- | --- |
| `public.app_users` | 8 columns, PK, unique email/mobile, lower(email) partial unique index, mobile partial unique index, CHECK (email or mobile), `updated_at` trigger. **0 rows** | Yes (schema only, no data) |
| `public.otp_codes` | 7 columns, PK, `(identifier, purpose, created_at DESC)` index, CHECK purpose in ('register','forgot'). **0 rows** | Yes (schema only, no data) |
| Function `public.tg_touch_updated_at()` | plpgsql, sets `updated_at` | Yes |
| Trigger `app_users_touch_updated_at` | BEFORE UPDATE on `app_users` | Yes |
| RLS | Enabled on both tables, **no policies** (server-only access via service role) | Yes |
| Storage buckets | None | n/a |
| Edge functions | None (app uses TanStack server functions) | n/a |
| Auth users | **3 users**, all email/password provider | ❌ No — see below |

### Auth users (cannot be moved with SQL)

| Email | Name | Created | Confirmed |
| --- | --- | --- | --- |
| ruchithaarelli05@gmail.com | Ruchitha Arelli | 2026-07-23 | yes |
| 23311a05ah@cse.sreendihi.edu.in | sreenidhi | 2026-07-24 | no |
| arellibuchaiah206@gmail.com | buchaiah | 2026-07-24 | yes |

Password hashes in `auth.users` are not readable/exportable from here, so these three accounts must be **re-created** in the target project (sign up again, or invite from Auth → Users). Only 3 accounts, all test/owner accounts — low impact.

Also not migrated: profile data (skills, projects, resume, etc.) — that lives in the **browser's localStorage**, not the database. It survives disconnecting entirely, per-device.

## Files produced

- `supabase/exports/careerconnect_schema_migration.sql` — idempotent schema migration to run in the target project.
- `supabase/exports/careerconnect_auth_users_export.csv` — user list for re-creation/invites.

## Order of operations (when you confirm)

1. Run `careerconnect_schema_migration.sql` in project `iluyvtucsgjrpbdyqlof`.
2. Disconnect Lovable Cloud (Cloud → Advanced → Disconnect).
3. Connect `iluyvtucsgjrpbdyqlof` via the Supabase connector.
4. Re-create the 3 auth users; enable LinkedIn OIDC + email provider settings.
5. Verify email sign-up end-to-end and update `SUPABASE_SETUP.md`.

Nothing in steps 2–5 has been started.
