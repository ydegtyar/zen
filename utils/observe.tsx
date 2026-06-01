import { requireOptionalNativeModule } from 'expo';
import type { ComponentType } from 'react';
import { Platform } from 'react-native';

import type { ObserveConfig } from 'expo-observe';

type ExpoObserve = typeof import('expo-observe');
type MetricAttributes = {
  routeName?: string | null;
  params?: Record<string, unknown>;
};

declare const require: (moduleName: string) => unknown;

const noopMarkInteractive = (_attributes?: MetricAttributes) => {};
const noopObserve = { markInteractive: noopMarkInteractive };
let expoObserve: ExpoObserve | null | undefined;
let didWarnMissingNativeModule = false;

function hasObserveNativeModules() {
  if (Platform.OS === 'web') {
    return false;
  }

  return (
    requireOptionalNativeModule('ExpoAppMetrics') != null &&
    requireOptionalNativeModule('ExpoObserve') != null
  );
}

function warnMissingNativeModule(error?: unknown) {
  if (!__DEV__ || didWarnMissingNativeModule) {
    return;
  }

  didWarnMissingNativeModule = true;
  const message = error instanceof Error ? ` ${error.message}` : '';
  console.warn(
    `[observe] EAS Observe is disabled because its native modules are not available in this runtime.${message}`
  );
}

function getExpoObserve() {
  if (expoObserve !== undefined) {
    return expoObserve;
  }

  if (!hasObserveNativeModules()) {
    warnMissingNativeModule();
    expoObserve = null;
    return expoObserve;
  }

  try {
    expoObserve = require('expo-observe') as ExpoObserve;
  } catch (error) {
    warnMissingNativeModule(error);
    expoObserve = null;
  }

  return expoObserve;
}

export function configureObserve(config: ObserveConfig) {
  getExpoObserve()?.Observe.configure(config);
}

export function withObserveRoot<P extends Record<string, unknown>>(Component: ComponentType<P>) {
  return getExpoObserve()?.ObserveRoot.wrap(Component) ?? Component;
}

export function useAppObserve() {
  return getExpoObserve()?.useObserve() ?? noopObserve;
}
