export default function PrivacyPage() {
  return (
    <div className="contentCard">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <h2>Summary</h2>
      <p>
        Zen is a reader app. It can store preferences (like language and theme) locally on your
        device. This website does not set cookies by default.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li>
          <strong>On-device only</strong>: app preferences such as language/theme and reading
          progress.
        </li>
      </ul>

      <h2>Third-party services</h2>
      <p>
        If we add analytics, crash reporting, accounts, payments, or notifications, we will update
        this policy and the app store disclosures.
      </p>

      <h2>Contact</h2>
      <p>For privacy questions, use the Support page.</p>
    </div>
  );
}

