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

function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`${label} must be a non-empty string.`);
    return false;
  }
  return true;
}

function assertFileExists(relativePath, label) {
  const resolved = path.resolve(process.cwd(), relativePath);
  if (!fs.existsSync(resolved)) {
    fail(`${label} missing at ${relativePath}`);
    return false;
  }
  ok(`${label} exists (${relativePath})`);
  return true;
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

if (expo.splash?.image) {
  assertFileExists(expo.splash.image, 'Splash image');
} else {
  fail('expo.splash.image must be set to a local asset path.');
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

if (process.exitCode === 1) {
  console.error('\nRelease check failed. Fix items above and re-run: npm run release:check');
} else {
  console.log('\nRelease check passed.');
}

