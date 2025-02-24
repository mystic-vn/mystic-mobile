module.exports = {
  expo: {
    name: 'Mystic',
    slug: 'mystic-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'mystic',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0A051E'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'vn.mystic.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#0A051E'
      },
      package: 'vn.mystic.app'
    },
    experiments: {
      tsconfigPaths: true
    }
  }
}; 