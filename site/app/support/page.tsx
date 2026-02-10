'use client';

import { useMemo, useState } from 'react';

function getSupportEmail() {
  return (process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? '').trim();
}

function buildMailto(to: string, subject: string, body: string) {
  const params = new URLSearchParams();
  params.set('subject', subject);
  params.set('body', body);
  return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
}

export default function SupportPage() {
  const supportEmail = getSupportEmail();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState<'Feedback' | 'Bug' | 'Account' | 'Other'>('Feedback');

  const mailto = useMemo(() => {
    const to = supportEmail || 'support@example.com';
    const subject = `[Zen] ${topic}`;
    const body = [
      `Name: ${name || '(not provided)'}`,
      `Email: ${email || '(not provided)'}`,
      '',
      message || '(no message)',
    ].join('\n');
    return buildMailto(to, subject, body);
  }, [supportEmail, topic, name, email, message]);

  return (
    <div className="contentCard">
      <h1>Support</h1>
      <p>
        Send feedback or report an issue. This form opens your email client with the message
        pre-filled.
      </p>

      <div className="formGrid">
        <label>
          <div className="small">Topic</div>
          <select
            className="input"
            value={topic}
            onChange={(e) => setTopic(e.target.value as any)}
          >
            <option value="Feedback">Feedback</option>
            <option value="Bug">Bug</option>
            <option value="Account">Account</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          <div className="small">Name (optional)</div>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          <div className="small">Email (optional)</div>
          <input
            className="input"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          <div className="small">Message</div>
          <textarea
            className="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you liked, what’s confusing, or what broke…"
          />
        </label>

        <div className="buttonRow">
          <a className="button" href={mailto}>
            Send email
          </a>
          {supportEmail ? (
            <span className="small">Sending to {supportEmail}</span>
          ) : (
            <span className="small">
              Set <code>NEXT_PUBLIC_SUPPORT_EMAIL</code> on Vercel to your real support email.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

