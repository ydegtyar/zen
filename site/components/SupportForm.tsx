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

type SupportTopic = 'Feedback' | 'Bug' | 'Account' | 'Other';

export function SupportForm() {
  const supportEmail = getSupportEmail();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState<SupportTopic>('Feedback');

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
    <div className="formGrid">
      <label className="formField formFieldFull">
        <span className="fieldLabel">Topic</span>
        <select
          className="input"
          value={topic}
          onChange={(event) => setTopic(event.target.value as SupportTopic)}
        >
          <option value="Feedback">Feedback</option>
          <option value="Bug">Bug</option>
          <option value="Account">Account</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label className="formField">
        <span className="fieldLabel">Name</span>
        <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
      </label>

      <label className="formField">
        <span className="fieldLabel">Email</span>
        <input
          className="input"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="formField formFieldFull">
        <span className="fieldLabel">Message</span>
        <textarea
          className="textarea"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us what you liked, what's confusing, or what broke..."
        />
      </label>

      <div className="buttonRow">
        <a className="button" href={mailto}>
          Send message
        </a>
      </div>
    </div>
  );
}
