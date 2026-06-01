import * as yup from 'yup';

export const supportTopics = ['Feedback', 'Bug', 'Account', 'Other'] as const;

export type SupportTopic = (typeof supportTopics)[number];

export type FeedbackFormValues = {
  topic: SupportTopic;
  name: string;
  email: string;
  message: string;
};

export type FeedbackPayload = FeedbackFormValues & {
  pageUrl?: string;
};

function isHttpUrl(value: string | undefined) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const feedbackSchema: yup.ObjectSchema<FeedbackPayload> = yup
  .object({
    topic: yup
      .mixed<SupportTopic>()
      .oneOf([...supportTopics], 'Choose a valid topic.')
      .required('Choose a valid topic.'),
    name: yup.string().trim().max(120, 'Name must be 120 characters or fewer.').default(''),
    email: yup
      .string()
      .trim()
      .email('Enter a valid email address.')
      .max(320, 'Email must be 320 characters or fewer.')
      .default(''),
    message: yup
      .string()
      .trim()
      .required('Message is required.')
      .min(1, 'Message is required.')
      .max(5000, 'Message must be 5000 characters or fewer.'),
    pageUrl: yup
      .string()
      .trim()
      .max(2048)
      .test('http-url', 'Page URL must be valid.', isHttpUrl)
      .optional(),
  })
  .required();

export const defaultFeedbackValues: FeedbackFormValues = {
  topic: 'Feedback',
  name: '',
  email: '',
  message: '',
};

export function getYupFieldErrors(error: yup.ValidationError) {
  const errors: Partial<Record<keyof FeedbackPayload, string>> = {};
  const validationErrors = error.inner.length > 0 ? error.inner : [error];

  for (const validationError of validationErrors) {
    const path = validationError.path as keyof FeedbackPayload | undefined;
    if (path && !errors[path]) {
      errors[path] = validationError.message;
    }
  }

  return errors;
}
