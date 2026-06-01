import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '../seo';

export const metadata: Metadata = pageMetadata({
  title: 'App Preview',
  description: 'Run the Zen 101 React Native web build inside an iPhone-style preview.',
  path: '/app',
});

export default function AppPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'App', path: '/app' },
        ])}
      />
      <section className="appPage" aria-labelledby="app-title">
        <div className="appPageHeader">
          <h1 id="app-title">Zen 101 App</h1>
        </div>

        <div className="appDeviceWrap">
          <div className="livePhoneFrame" aria-label="Zen 101 app running in a phone frame">
            <span className="livePhoneButton livePhoneButtonMute" aria-hidden="true" />
            <span className="livePhoneButton livePhoneButtonVolume" aria-hidden="true" />
            <span className="livePhoneButton livePhoneButtonPower" aria-hidden="true" />
            <div className="livePhoneScreen">
              <iframe
                className="liveAppIframe"
                src="/app-build/"
                title="Zen 101 app"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
