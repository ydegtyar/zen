export default function TermsPage() {
  return (
    <div className="contentCard">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>

      <h2>Use of the app</h2>
      <p>The app is provided “as is”. You are responsible for how you use the content.</p>

      <h2>Changes</h2>
      <p>We may update these terms occasionally. The “Last updated” date will reflect changes.</p>

      <h2>Contact</h2>
      <p>If you need help, use the Support page.</p>
    </div>
  );
}

