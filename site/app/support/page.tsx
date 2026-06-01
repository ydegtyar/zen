import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { SupportForm } from '@/components/SupportForm';
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, siteName } from '../seo';

export const metadata: Metadata = pageMetadata({
  title: 'Support',
  description:
    'Contact Zen 101 support to send feedback, report bugs, ask account questions, or get help with the reader app.',
  path: '/support',
});

const supportJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Zen 101 Support',
  url: absoluteUrl('/support'),
  description: 'Support page for Zen 101 feedback, bug reports, account questions, and app help.',
  isPartOf: {
    '@type': 'WebSite',
    name: siteName,
    url: absoluteUrl('/'),
  },
  about: {
    '@type': 'MobileApplication',
    name: siteName,
  },
};

export default function SupportPage() {
  return (
    <>
      <JsonLd data={supportJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Support', path: '/support' },
        ])}
      />
      <div className="contentCard">
        <h1>Support</h1>
        <p>
          Send feedback, report a bug, ask an account question, or get help with Zen 101. Messages
          submitted here are stored so we can review and respond when needed.
        </p>

        <SupportForm />
      </div>
    </>
  );
}
