import fs from 'node:fs';
import path from 'node:path';

function fail(message) {
  console.error(`✖ ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`✔ ${message}`);
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function resolveRelativePath(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}

function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`${label} must be a non-empty string.`);
    return false;
  }
  return true;
}

function assertFileExists(relativePath, label) {
  const resolved = resolveRelativePath(relativePath);
  if (!fs.existsSync(resolved)) {
    fail(`${label} missing at ${relativePath}`);
    return false;
  }
  ok(`${label} exists (${relativePath})`);
  return true;
}

function getPluginOptions(plugins, pluginName) {
  if (!Array.isArray(plugins)) {
    return undefined;
  }

  for (const plugin of plugins) {
    if (plugin === pluginName) {
      return {};
    }

    if (Array.isArray(plugin) && plugin[0] === pluginName) {
      return plugin[1] ?? {};
    }
  }

  return undefined;
}

function assertFlatStringMap(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${label} must be an object.`);
    return;
  }

  for (const [key, item] of Object.entries(value)) {
    if (typeof item !== 'string') {
      fail(`${label}.${key} must be a string. Nested objects are not valid native locale metadata.`);
    }
  }
}

function assertLocaleFile(relativePath, lang) {
  const resolved = resolveRelativePath(relativePath);
  if (!fs.existsSync(resolved)) {
    fail(`expo.locales.${lang} missing at ${relativePath}`);
    return;
  }

  let locale;
  try {
    locale = readJson(resolved);
  } catch {
    fail(`expo.locales.${lang} must point to valid JSON.`);
    return;
  }

  if (!locale || typeof locale !== 'object' || Array.isArray(locale)) {
    fail(`expo.locales.${lang} must be a JSON object.`);
    return;
  }

  const { android = {}, ios = {}, ...rest } = locale;
  assertFlatStringMap(android, `expo.locales.${lang}.android`);
  assertFlatStringMap(ios, `expo.locales.${lang}.ios`);
  assertFlatStringMap(rest, `expo.locales.${lang}`);
  ok(`expo.locales.${lang} native metadata is valid (${relativePath})`);
}

const appJsonPath = path.resolve(process.cwd(), 'app.json');
if (!fs.existsSync(appJsonPath)) {
  fail('app.json not found at project root.');
  process.exit(1);
}

const appJson = readJson(appJsonPath);
const expo = appJson?.expo;

if (!expo) {
  fail('app.json is missing the "expo" key.');
  process.exit(1);
}

assertNonEmptyString(expo.name, 'expo.name');
assertNonEmptyString(expo.slug, 'expo.slug');
assertNonEmptyString(expo.version, 'expo.version');
assertNonEmptyString(expo.scheme, 'expo.scheme');

if (!Array.isArray(expo.platforms) || expo.platforms.length === 0) {
  fail('expo.platforms must be a non-empty array.');
} else {
  ok(`expo.platforms: ${expo.platforms.join(', ')}`);
}

if (typeof expo.icon === 'string') {
  assertFileExists(expo.icon, 'App icon');
} else {
  fail('expo.icon must be set to a local asset path.');
}

const splashPluginOptions = getPluginOptions(expo.plugins, 'expo-splash-screen');
const splashImage = typeof expo.splash?.image === 'string' ? expo.splash.image : splashPluginOptions?.image;

if (typeof splashImage === 'string' && splashImage.trim().length > 0) {
  assertFileExists(splashImage, 'Splash image');
} else {
  fail('Splash image must be set in expo.splash.image or the expo-splash-screen plugin.');
}

const ios = expo.ios ?? {};
assertNonEmptyString(ios.bundleIdentifier, 'expo.ios.bundleIdentifier');
assertNonEmptyString(ios.buildNumber, 'expo.ios.buildNumber');

const android = expo.android ?? {};
assertNonEmptyString(android.package, 'expo.android.package');
if (typeof android.versionCode !== 'number' || !Number.isInteger(android.versionCode) || android.versionCode < 1) {
  fail('expo.android.versionCode must be an integer >= 1.');
} else {
  ok(`expo.android.versionCode: ${android.versionCode}`);
}

if (android.adaptiveIcon?.foregroundImage) {
  assertFileExists(android.adaptiveIcon.foregroundImage, 'Android adaptive icon (foreground)');
}

if (Array.isArray(android.permissions)) {
  ok(`expo.android.permissions: ${android.permissions.length === 0 ? 'none' : android.permissions.join(', ')}`);
} else {
  console.warn('⚠ expo.android.permissions is not set; Expo/native plugins may add default permissions.');
}

const links = expo.extra?.links ?? {};
['privacyPolicyUrl', 'termsOfServiceUrl', 'supportUrl'].forEach((key) => {
  const value = links[key];
  if (typeof value !== 'string') {
    fail(`expo.extra.links.${key} must be a string (can be empty).`);
  } else if (value.trim().length === 0) {
    console.warn(`⚠ expo.extra.links.${key} is empty (store reviews often expect a working URL).`);
  } else {
    ok(`expo.extra.links.${key} set`);
  }
});

const locales = expo.locales ?? {};
if (locales && typeof locales === 'object' && !Array.isArray(locales)) {
  Object.entries(locales).forEach(([lang, relativePath]) => {
    if (typeof relativePath !== 'string') {
      fail(`expo.locales.${lang} must point to a locale JSON file.`);
    } else {
      assertLocaleFile(relativePath, lang);
    }
  });
} else {
  fail('expo.locales must be an object when set.');
}

if (process.exitCode === 1) {
  console.error('\nRelease check failed. Fix items above and re-run: npm run release:check');
} else {
  console.log('\nRelease check passed.');
}
