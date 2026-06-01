function envOrDefault(name, fallback) {
  const value = process.env[name];
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return typeof fallback === 'string' ? fallback.trim() : '';
}

function normalizeBaseUrl(value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return '';
  }

  return `/${value.trim().replace(/^\/+|\/+$/g, '')}`;
}

module.exports = ({ config }) => {
  const defaultLinks = config.extra?.links ?? {};
  const webBaseUrl = normalizeBaseUrl(process.env.EXPO_WEB_BASE_URL);

  return {
    ...config,
    experiments: {
      ...config.experiments,
      ...(webBaseUrl ? { baseUrl: webBaseUrl } : {}),
    },
    extra: {
      ...config.extra,
      links: {
        ...defaultLinks,
        privacyPolicyUrl: envOrDefault('EXPO_PUBLIC_PRIVACY_POLICY_URL', defaultLinks.privacyPolicyUrl),
        termsOfServiceUrl: envOrDefault('EXPO_PUBLIC_TERMS_OF_SERVICE_URL', defaultLinks.termsOfServiceUrl),
        supportUrl: envOrDefault('EXPO_PUBLIC_SUPPORT_URL', defaultLinks.supportUrl),
      },
    },
  };
};
