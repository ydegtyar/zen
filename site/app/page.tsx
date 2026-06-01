import type { Metadata } from 'next';
import Link from 'next/link';
import { AppPreviewCarousel } from '@/components/AppPreviewCarousel';
import { JsonLd } from '@/components/JsonLd';
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, siteDescription, siteName } from './seo';

export const metadata: Metadata = pageMetadata({
  title: 'Calm Reader for 101 Zen Stories',
  description: siteDescription,
  path: '/',
});

function getPublicUrl(name: string) {
  const value = process.env[name] ?? '';
  return value.trim();
}

export default function HomePage() {
  const appStoreUrl = getPublicUrl('NEXT_PUBLIC_APP_STORE_URL');
  const playStoreUrl = getPublicUrl('NEXT_PUBLIC_PLAY_STORE_URL');
  const showStoreButtons = false;
  const storeLinks = [appStoreUrl, playStoreUrl].filter(Boolean);
  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: siteName,
    url: absoluteUrl('/'),
    description: siteDescription,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'iOS, Android',
    ...(storeLinks.length ? { sameAs: storeLinks } : {}),
  };

  return (
    <>
      <JsonLd data={appJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }])} />
      <section className="hero" aria-labelledby="hero-title">
        <div className="heroCopy">
          <p className="eyebrow">101 Zen stories, pared back</p>
          <h1 id="hero-title" className="title">
            Read one clear story at a time.
          </h1>
          <p className="subtitle">
            Zen 101 is a fast, focused reader for short teachings, quiet pauses, and daily
            reflection without visual noise.
          </p>
          <div className="ctaRow">
            {showStoreButtons ? (
              <>
                {appStoreUrl ? (
                  <a className="cta" href={appStoreUrl} target="_blank" rel="noreferrer">
                    App Store
                  </a>
                ) : (
                  <span className="cta isDisabled" aria-disabled>
                    App Store
                  </span>
                )}
                {playStoreUrl ? (
                  <a className="cta ctaSecondary" href={playStoreUrl} target="_blank" rel="noreferrer">
                    Google Play
                  </a>
                ) : (
                  <span className="cta ctaSecondary isDisabled" aria-disabled>
                    Google Play
                  </span>
                )}
              </>
            ) : null}
            <Link className="pill" href="/support">
              Support
            </Link>
          </div>
        </div>

        <div className="previewPanel" aria-label="Zen 101 app preview">
          <AppPreviewCarousel />
        </div>
      </section>

      <section className="featureStrip" aria-label="Zen 101 highlights">
        <div>
          <span className="featureMetric">101</span>
          <p>classic stories in a quiet reading flow</p>
        </div>
        <div>
          <span className="featureMetric">0</span>
          <p>cookies on this website by default</p>
        </div>
        <div>
          <span className="featureMetric">Fast</span>
          <p>local preferences and lightweight pages</p>
        </div>
      </section>

      <div className="grid">
        <Link className="card actionCard" href="/privacy">
          <span className="cardMeta">Policy</span>
          <h3>Privacy</h3>
          <p>How data is handled, what stays on-device, and what this site collects.</p>
        </Link>
        <Link className="card actionCard" href="/terms">
          <span className="cardMeta">Legal</span>
          <h3>Terms</h3>
          <p>The basic rules for using the app and content, plus support details.</p>
        </Link>
        <div className="card wideCard">
          <span className="cardMeta">Support</span>
          <h3>Need a human?</h3>
          <p>Send feedback, report a bug, or ask for help from the support page.</p>
          <Link className="textLink" href="/support">
            Contact support
          </Link>
        </div>
      </div>

      <section className="contentCard seoSection" aria-labelledby="about-title">
        <h2 id="about-title">A quiet app for short Zen reading</h2>
        <p>
          Zen 101 is designed for people who want a simple way to read classic Zen stories without
          feeds, clutter, or complicated controls. The app focuses on short sessions, local reading
          preferences, and clear presentation so each story can stand on its own.
        </p>
      </section>
    </>
  );
}
