'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { ValidationError } from 'yup';
import {
  defaultFeedbackValues,
  feedbackSchema,
  supportTopics,
  type FeedbackFormValues,
  type FeedbackPayload,
} from '@/lib/feedbackSchema';

type FeedbackResponse = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof FeedbackPayload, string>>;
};

function getValidationMessage(error: unknown) {
  if (error instanceof ValidationError) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'This field is invalid.';
}

function validateField(name: keyof FeedbackFormValues) {
  return ({ value, fieldApi }: { value: unknown; fieldApi: { form: { state: { values: FeedbackFormValues } } } }) => {
    try {
      feedbackSchema.validateSyncAt(name, {
        ...fieldApi.form.state.values,
        [name]: value,
      });
      return undefined;
    } catch (error) {
      return getValidationMessage(error);
    }
  };
}

export function SupportForm() {
  const [serverFieldErrors, setServerFieldErrors] = useState<
    Partial<Record<keyof FeedbackPayload, string>>
  >({});
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const form = useForm({
    defaultValues: defaultFeedbackValues,
    onSubmit: async ({ value }) => {
      setServerFieldErrors({});
      setIsSubmitSuccessful(false);
      setStatusMessage('');

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...value,
          pageUrl: window.location.href,
        }),
      });

      const body = (await response.json().catch(() => null)) as FeedbackResponse | null;

      if (!response.ok) {
        setServerFieldErrors(body?.fieldErrors ?? {});
        throw new Error(body?.error ?? 'Unable to send feedback.');
      }

      setIsSubmitSuccessful(true);
      setStatusMessage('Message sent. Thank you for the feedback.');
      form.reset(defaultFeedbackValues);
    },
    onSubmitInvalid: () => {
      setIsSubmitSuccessful(false);
      setStatusMessage('Check the highlighted fields.');
    },
  });

  return (
    <form
      className="formGrid"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit().catch((error) => {
          setIsSubmitSuccessful(false);
          setStatusMessage(error instanceof Error ? error.message : 'Unable to send feedback.');
        });
      }}
    >
      <form.Field name="topic" validators={{ onChange: validateField('topic') }}>
        {(field) => {
          const error = serverFieldErrors.topic ?? field.state.meta.errors[0];

          return (
            <label className="formField formFieldFull">
              <span className="fieldLabel">Topic</span>
              <select
                className="input"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  setServerFieldErrors((errors) => ({ ...errors, topic: undefined }));
                  field.handleChange(event.target.value as FeedbackFormValues['topic']);
                }}
              >
                {supportTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              {error ? <span className="fieldError">{getValidationMessage(error)}</span> : null}
            </label>
          );
        }}
      </form.Field>

      <form.Field name="name" validators={{ onChange: validateField('name') }}>
        {(field) => {
          const error = serverFieldErrors.name ?? field.state.meta.errors[0];

          return (
            <label className="formField">
              <span className="fieldLabel">Name</span>
              <input
                className="input"
                name={field.name}
                autoComplete="name"
                maxLength={120}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  setServerFieldErrors((errors) => ({ ...errors, name: undefined }));
                  field.handleChange(event.target.value);
                }}
              />
              {error ? <span className="fieldError">{getValidationMessage(error)}</span> : null}
            </label>
          );
        }}
      </form.Field>

      <form.Field name="email" validators={{ onChange: validateField('email') }}>
        {(field) => {
          const error = serverFieldErrors.email ?? field.state.meta.errors[0];

          return (
            <label className="formField">
              <span className="fieldLabel">Email</span>
              <input
                className="input"
                name={field.name}
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={320}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  setServerFieldErrors((errors) => ({ ...errors, email: undefined }));
                  field.handleChange(event.target.value);
                }}
              />
              {error ? <span className="fieldError">{getValidationMessage(error)}</span> : null}
            </label>
          );
        }}
      </form.Field>

      <form.Field name="message" validators={{ onChange: validateField('message') }}>
        {(field) => {
          const error = serverFieldErrors.message ?? field.state.meta.errors[0];

          return (
            <label className="formField formFieldFull">
              <span className="fieldLabel">Message</span>
              <textarea
                className="textarea"
                name={field.name}
                required
                maxLength={5000}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  setServerFieldErrors((errors) => ({ ...errors, message: undefined }));
                  field.handleChange(event.target.value);
                }}
                placeholder="Tell us what you liked, what's confusing, or what broke..."
              />
              {error ? <span className="fieldError">{getValidationMessage(error)}</span> : null}
            </label>
          );
        }}
      </form.Field>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <div className="buttonRow">
            {statusMessage ? (
              <p className={`formStatus ${isSubmitSuccessful ? '' : 'formStatusError'}`}>
                {statusMessage}
              </p>
            ) : null}
            <button className="button" type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send message'}
            </button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
