# Google Play submission notes

Use this as the working checklist for publishing Zen 101 to Google Play.

## Project state

- Package name: `com.ydegtyar.zen`
- Version name: `1.0.0`
- Version code: `1` locally; EAS production builds use `autoIncrement`.
- Release artifact: Android App Bundle (`.aab`) through the EAS `production` profile.
- Privacy policy: https://zen-101.vercel.app/privacy
- Terms: https://zen-101.vercel.app/terms
- Support: https://zen-101.vercel.app/support
- Store listing copy: `store/STORE_LISTING_TEMPLATES.md`
- Feature graphic: `store/google-play-feature-graphic.png`

## Local validation

Run before building:

```sh
npm run release:check
npm run lint
```

## Build

```sh
npm run build:android
```

This runs `eas build --platform android --profile production`. The production profile is configured for Google Play's Android App Bundle format.

## Submit

Create the app in Play Console with package `com.ydegtyar.zen`, then submit either from Play Console by uploading the `.aab`, or with:

```sh
npm run submit:android
```

For unattended EAS Submit, add a Google Play service account JSON locally and point EAS to it. Keep credentials out of git; `credentials/` and `*.service-account.json` are ignored.

## Play Console declarations

- App access: No login required.
- Ads: No ads.
- Content rating: Books/reference or lifestyle reading app; no user-generated content, purchases, gambling, social features, explicit content, or location sharing.
- Target audience: General audience unless you intentionally opt into a child-directed category.
- News app: No.
- Government app: No.
- Financial features: No.
- Health features: No.

## Data safety draft

Confirm this against the final app bundle before submitting.

- Data collected: No user data collected by the app for Play Data safety purposes.
- Data shared: No.
- Account creation: No.
- Advertising ID: Not used.
- Location, contacts, photos/videos, audio, camera, files, calendar, call logs, SMS, health data: Not collected.
- App activity: Reading progress, favorites, language, and theme are stored locally on device only and are not transmitted off device by the app.
- Security practices: No data is transmitted by the app for core reading functionality. Support requests are user-initiated through the website/email flow described in the privacy policy.
- Deletion: Users can remove local app data by resetting app data/uninstalling. Support-message deletion requests go through the Support page.

If analytics, crash reporting, push notifications, accounts, payments, or third-party SDK data collection are added later, update this file, the privacy policy, and the Play Data safety form before release.

## Official references

- Android App Bundle requirement: https://developer.android.com/guide/app-bundle
- Target API requirement: https://developer.android.com/google/play/requirements/target-sdk
- Prepare and roll out a release: https://support.google.com/googleplay/android-developer/answer/9859348
- Data safety form: https://support.google.com/googleplay/android-developer/answer/10787469
- User Data and Privacy Policy policy: https://support.google.com/googleplay/android-developer/answer/10144311
