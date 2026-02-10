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
- `NEXT_PUBLIC_SUPPORT_EMAIL` — email used by the Support form

## Canonical domain

This site is configured to use `https://zen-101.vercel.app` as the canonical base URL for metadata.
