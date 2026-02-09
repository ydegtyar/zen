module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@tamagui/babel-plugin',
      // Required for Reanimated
      'react-native-reanimated/plugin',
    ],
  };
}; 