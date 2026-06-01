import { NextRequest, NextResponse } from 'next/server';
import { ValidationError } from 'yup';
import { feedbackSchema, getYupFieldErrors } from '@/lib/feedbackSchema';

function trimText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.slice(0, maxLength);
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return {
    key,
    url: url.replace(/\/$/, ''),
  };
}

export async function POST(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      {
        error:
          'Feedback is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY for this site.',
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  let feedback;
  try {
    const payload = body && typeof body === 'object' ? body : {};
    feedback = await feedbackSchema.validate(payload, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Check the highlighted fields.', fieldErrors: getYupFieldErrors(error) },
        { status: 400 },
      );
    }

    throw error;
  }

  const name = trimText(feedback.name, 120);
  const email = trimText(feedback.email, 320);
  const pageUrl = trimText(feedback.pageUrl, 2048) || trimText(request.headers.get('referer'), 2048);
  const userAgent = trimText(request.headers.get('user-agent'), 512);

  const response = await fetch(`${config.url}/rest/v1/zen_feedback`, {
    method: 'POST',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      topic: feedback.topic,
      name: name || null,
      email: email || null,
      message: feedback.message,
      user_agent: userAgent || null,
      page_url: pageUrl || null,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error('Unable to submit feedback to Supabase:', response.status, details);

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        { error: 'Feedback storage is not allowed by the current Supabase key or policy.' },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: 'Feedback storage is temporarily unavailable. Please try again.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
