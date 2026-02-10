import Link from 'next/link';

function getPublicUrl(name: string) {
  const value = process.env[name] ?? '';
  return value.trim();
}

export default function HomePage() {
  const appStoreUrl = getPublicUrl('NEXT_PUBLIC_APP_STORE_URL');
  const playStoreUrl = getPublicUrl('NEXT_PUBLIC_PLAY_STORE_URL');

  return (
    <>
      <div className="hero">
        <h1 className="title">Zen 101</h1>
        <p className="subtitle">
          A calm, focused reader for 101 Zen stories. Simple, fast, and distraction-free.
        </p>
        <div className="ctaRow">
          {appStoreUrl ? (
            <a className="cta" href={appStoreUrl} target="_blank" rel="noreferrer">
              App Store
            </a>
          ) : (
            <span className="cta" aria-disabled>
              App Store (set env)
            </span>
          )}
          {playStoreUrl ? (
            <a className="cta ctaSecondary" href={playStoreUrl} target="_blank" rel="noreferrer">
              Google Play
            </a>
          ) : (
            <span className="cta ctaSecondary" aria-disabled>
              Google Play (set env)
            </span>
          )}
          <Link className="pill" href="/support">
            Contact support
          </Link>
        </div>
        <p className="small">
          Tip: configure store links via environment variables on Vercel:
          <br />
          <code>NEXT_PUBLIC_APP_STORE_URL</code> and <code>NEXT_PUBLIC_PLAY_STORE_URL</code>
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Privacy</h3>
          <p>How we handle data, what’s stored on-device, and what we collect (if anything).</p>
          <div className="ctaRow">
            <Link className="cta" href="/privacy">
              Read Privacy Policy
            </Link>
          </div>
        </div>
        <div className="card">
          <h3>Terms</h3>
          <p>Basic rules for using the app and content, plus how to contact us.</p>
          <div className="ctaRow">
            <Link className="cta ctaSecondary" href="/terms">
              Read Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
