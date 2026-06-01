# Zen website (Next.js)

Small landing + legal/support site for the Zen mobile app.

## Local dev

```bash
cd site
npm i
npm run dev
```

## Environment variables

Configure on Vercel (Project → Settings → Environment Variables):

- `NEXT_PUBLIC_APP_STORE_URL` — link to the iOS App Store listing
- `NEXT_PUBLIC_PLAY_STORE_URL` — link to the Google Play listing
- `SUPABASE_URL` — Supabase project URL used by the feedback form API route
- `SUPABASE_PUBLISHABLE_KEY` — Supabase publishable/anon key with insert access to `zen_feedback`

## Canonical domain

This site is configured to use `https://zen-101.vercel.app` as the canonical base URL for metadata.
