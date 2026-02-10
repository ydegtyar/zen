import Constants from 'expo-constants';

type ExpoExtraLinks = {
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  supportUrl?: string;
};

function readExtraLinks(): ExpoExtraLinks {
  const links = (Constants.expoConfig?.extra as any)?.links;
  if (!links || typeof links !== 'object') {
    return {};
  }
  return links as ExpoExtraLinks;
}

export function getAppLinks() {
  const links = readExtraLinks();

  const privacyPolicyUrl =
    typeof links.privacyPolicyUrl === 'string' ? links.privacyPolicyUrl.trim() : '';
  const termsOfServiceUrl =
    typeof links.termsOfServiceUrl === 'string' ? links.termsOfServiceUrl.trim() : '';
  const supportUrl = typeof links.supportUrl === 'string' ? links.supportUrl.trim() : '';

  return { privacyPolicyUrl, termsOfServiceUrl, supportUrl };
}

