import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { absoluteUrl, breadcrumbJsonLd, legalLastUpdated, pageMetadata, siteName } from '../seo';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'Terms of Service for Zen 101, including app use, user responsibilities, content, purchases, privacy, platform terms, and support contact information.',
  path: '/terms',
});

const termsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms of Service',
  url: absoluteUrl('/terms'),
  dateModified: legalLastUpdated,
  description: 'Terms of Service for using the Zen 101 reader app and website.',
  isPartOf: {
    '@type': 'WebSite',
    name: siteName,
    url: absoluteUrl('/'),
  },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd data={termsJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms' },
        ])}
      />
      <div className="contentCard">
        <h1>Terms of Service</h1>
        <p>Last updated: {legalLastUpdated}</p>

        <h2>Agreement</h2>
        <p>
          These Terms of Service apply to your use of the Zen 101 mobile app and this website. By
          using Zen 101, you agree to these terms. If you do not agree, do not use the app or
          website.
        </p>

        <h2>What Zen 101 provides</h2>
        <p>
          Zen 101 provides a focused reading experience for Zen stories and related content. The app
          is intended for personal reading, reflection, and general informational use.
        </p>

        <h2>Responsible use</h2>
        <p>You agree not to misuse Zen 101. For example, you must not:</p>
        <ul>
          <li>Use the app or website for unlawful, harmful, abusive, or deceptive activity.</li>
          <li>Attempt to interfere with, reverse engineer, overload, or compromise the service.</li>
          <li>Copy, redistribute, or commercially exploit app content except where permitted by law.</li>
          <li>Submit support messages that contain malware, spam, harassment, or unlawful content.</li>
        </ul>

        <h2>Content and availability</h2>
        <p>
          We may add, remove, edit, or reorganize stories, features, and supporting content over
          time. We do not guarantee that any feature or content will always be available.
        </p>

        <h2>No professional advice</h2>
        <p>
          Zen 101 content is provided for reading and reflection only. It is not medical,
          psychological, legal, financial, religious, or other professional advice. You are
          responsible for how you interpret and use the content.
        </p>

        <h2>Accounts and purchases</h2>
        <p>
          Zen 101 currently does not require an account for the basic reading experience. If future
          versions add accounts, paid features, subscriptions, or in-app purchases, those features
          may be subject to additional terms shown in the app and to the applicable Apple App Store
          or Google Play purchase rules.
        </p>

        <h2>Privacy</h2>
        <p>
          Your use of Zen 101 is also covered by our{' '}
          <Link className="textLink" href="/privacy">
            Privacy Policy
          </Link>
          , which explains how the app and website handle information.
        </p>

        <h2>Support and feedback</h2>
        <p>
          You can contact us through the{' '}
          <Link className="textLink" href="/support">
            Support page
          </Link>
          . If you send feedback, suggestions, bug reports, or feature ideas, you allow us to use
          them to improve Zen 101 without obligation to compensate you.
        </p>

        <h2>Third-party platforms and services</h2>
        <p>
          Your download or use of the mobile app may also be governed by Apple App Store, Google
          Play, device manufacturer, operating system, and network provider terms. Those third
          parties are not responsible for providing support for Zen 101 unless their own terms say
          otherwise.
        </p>

        <h2>Disclaimer</h2>
        <p>
          Zen 101 is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the maximum extent allowed
          by law, we disclaim warranties of merchantability, fitness for a particular purpose,
          non-infringement, availability, accuracy, and uninterrupted or error-free operation.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent allowed by law, Zen 101 and its developer will not be liable for
          indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost
          profits, lost data, or business interruption arising from your use of or inability to use
          the app or website.
        </p>

        <h2>Termination</h2>
        <p>
          You may stop using Zen 101 at any time. We may suspend or discontinue the app, website, or
          any feature if needed for security, legal, operational, or product reasons.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms when the app, website, features, or legal requirements change.
          The Last updated date above shows when these terms were most recently changed. Continued
          use of Zen 101 after changes means you accept the updated terms.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws applicable where the Zen 101 developer is located,
          unless consumer protection laws in your location require otherwise.
        </p>

        <h2>Contact</h2>
        <p>
          If you need help or have questions about these terms, use the{' '}
          <Link className="textLink" href="/support">
            Support page
          </Link>
          .
        </p>
      </div>
    </>
  );
}
