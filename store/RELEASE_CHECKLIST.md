# Release checklist (iOS + Android)

This project is an Expo app. Recommended path: **EAS Build + EAS Submit**.

## One-time setup

- Install EAS CLI
  - `npm i -g eas-cli` (or use the official installer method you prefer)
- App identifiers
  - Set `expo.ios.bundleIdentifier` and `expo.android.package` in `app.json`.
  - Create the app in App Store Connect + Google Play Console using those identifiers.
- Legal links (required by most reviews)
  - Host a Privacy Policy URL and Terms URL.
  - Set `expo.extra.links.privacyPolicyUrl`, `termsOfServiceUrl`, `supportUrl` in `app.json`.
- Accounts
  - Apple Developer Program (App Store Connect access)
  - Google Play Console account + payments profile (if paid / IAP later)

## Before every store submission

- Versioning
  - `expo.version` (marketing version) updated when you want a new version name.
  - iOS: `expo.ios.buildNumber` incremented (or let EAS auto-increment).
  - Android: `expo.android.versionCode` incremented (or let EAS auto-increment).
- Assets
  - App icon, adaptive icon, splash present and look correct on devices.
- Permissions
  - Verify you only request what you use.
  - If you add anything requiring iOS usage strings or Android permissions, update config accordingly.
- QA
  - Fresh install test (no cached state) + basic regression on real devices.
  - Crash-free launch, navigation, search, favorites, settings.

## Build + submit

- Validate config locally: `npm run release:check`
- Build:
  - Android: `npm run build:android`
  - iOS: `npm run build:ios`
- Submit:
  - Android: `npm run submit:android`
  - iOS: `npm run submit:ios`
