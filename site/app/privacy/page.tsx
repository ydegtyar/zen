import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { absoluteUrl, breadcrumbJsonLd, legalLastUpdated, pageMetadata, siteName } from '../seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Zen 101, including data collection, on-device storage, support requests, retention, deletion, and third-party service disclosures.',
  path: '/privacy',
});

const privacyJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy',
  url: absoluteUrl('/privacy'),
  dateModified: legalLastUpdated,
  description:
    'Privacy Policy for Zen 101, including what data is collected, how it is used, retention, deletion, and third-party sharing.',
  isPartOf: {
    '@type': 'WebSite',
    name: siteName,
    url: absoluteUrl('/'),
  },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={privacyJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ])}
      />
      <div className="contentCard">
        <h1>Privacy Policy</h1>
        <p>Last updated: {legalLastUpdated}</p>

        <h2>Overview</h2>
        <p>
          This Privacy Policy explains how Zen 101 handles information in the Zen 101 mobile app
          and on this website. Zen 101 is designed as a focused reader. The app does not require an
          account, does not show advertising, and does not sell personal information.
        </p>

        <h2>Developer and privacy contact</h2>
        <p>
          Zen 101 is the app and service covered by this policy. For privacy questions, data
          deletion requests, or other support requests, contact us through the{' '}
          <Link className="textLink" href="/support">
            Support page
          </Link>
          .
        </p>

        <h2>Information handled by the app</h2>
        <ul>
          <li>
            <strong>Reading preferences and progress:</strong> The app may save preferences such as
            theme, language, display settings, bookmarks, favorites, and reading progress on your
            device so the app can remember your reading experience.
          </li>
          <li>
            <strong>Account data:</strong> Zen 101 currently does not require account registration
            or login.
          </li>
          <li>
            <strong>Payment data:</strong> Zen 101 currently does not process payments on this
            website. If the mobile app later offers purchases through Apple or Google, payment
            processing is handled by the applicable app store, not by this website.
          </li>
          <li>
            <strong>Precise location, contacts, photos, microphone, camera, health data, and similar
            sensitive permissions:</strong> Zen 101 does not intentionally request these permissions
            for its reading experience.
          </li>
        </ul>

        <h2>Information you choose to send us</h2>
        <p>
          If you contact support, the support form or your email app may send us the information
          you include, such as your name, email address, topic, message, device details,
          screenshots, or bug details. We use support messages only to respond, troubleshoot,
          improve Zen 101, and maintain records needed to manage support.
        </p>

        <h2>Website data</h2>
        <p>
          This website does not set cookies by default and does not include advertising trackers by
          default. Hosting providers may process basic technical information, such as IP address,
          browser type, requested URL, timestamps, and error logs, to operate, secure, and maintain
          the website.
        </p>

        <h2>How we use information</h2>
        <ul>
          <li>To provide the reading experience and remember local app preferences.</li>
          <li>To respond to support requests and fix bugs.</li>
          <li>To maintain, secure, and improve the app and website.</li>
          <li>To comply with legal, safety, and platform review requirements.</li>
        </ul>

        <h2>Sharing and sale of data</h2>
        <p>
          We do not sell personal information. We do not share personal information for third-party
          advertising or cross-app tracking. We may share information only with service providers
          that help operate the app, website, or support workflow, or when required for legal,
          security, or abuse-prevention reasons.
        </p>

        <h2>Third-party services</h2>
        <p>
          Zen 101 currently describes itself as not using advertising, analytics, account, or
          payment services by default. If analytics, crash reporting, accounts, notifications,
          purchases, or other third-party SDKs are added, we will update this policy and the Apple
          App Store and Google Play privacy disclosures before or when those features are released.
          Any third-party provider that processes user data must provide protections consistent with
          this policy and applicable platform rules.
        </p>

        <h2>Data retention and deletion</h2>
        <p>
          Reading preferences and progress stored on your device remain there until you delete them,
          reset the app, or uninstall the app. Support messages are kept only as long as reasonably
          needed to respond, troubleshoot, maintain business records, and comply with legal
          obligations. To request deletion of support messages or other information you sent us, use
          the{' '}
          <Link className="textLink" href="/support">
            Support page
          </Link>
          .
        </p>

        <h2>Security</h2>
        <p>
          We use reasonable administrative and technical measures to protect information we process.
          No method of transmission or storage is completely secure, so we cannot guarantee absolute
          security.
        </p>

        <h2>Children</h2>
        <p>
          Zen 101 is not directed to children under 13, and we do not knowingly collect personal
          information from children under 13. If you believe a child has provided personal
          information through support, contact us so we can review and delete it when appropriate.
        </p>

        <h2>International use</h2>
        <p>
          If you use Zen 101 or contact support from outside the country where we or our providers
          operate, your information may be processed in other countries with different privacy laws.
        </p>

        <h2>Your choices</h2>
        <p>
          You can stop using the app at any time, delete locally stored app data by using device or
          app controls where available, and uninstall the app. You can also request deletion of
          support information you sent us by contacting support.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this Privacy Policy when the app, website, third-party services, or legal
          requirements change. The Last updated date above shows when this policy was most recently
          changed.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions or requests, use the{' '}
          <Link className="textLink" href="/support">
            Support page
          </Link>
          .
        </p>
      </div>
    </>
  );
}
