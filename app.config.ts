import 'dotenv/config';
import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: process.env.APP_NAME!,
  slug: process.env.APP_SLUG!,
  version: process.env.APP_VERSION!,
  scheme: process.env.APP_SCHEME!,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',

  ios: {
    bundleIdentifier: process.env.IOS_BUNDLE_IDENTIFIER!,
    buildNumber: process.env.IOS_BUILD_NUMBER!,
    icon: './assets/icon.png',
  },

  android: {
    package: process.env.ANDROID_PACKAGE!,
    versionCode: Number(process.env.ANDROID_VERSION_CODE),
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffb502',
    },
    predictiveBackGestureEnabled: false,
  },

  web: {
    output: 'static',
    favicon: './assets/favicon.png',
  },

  plugins: [
    'expo-router',
    '@react-native-community/datetimepicker',

    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera to attach photos or videos of the issue.',
        microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone to record videos with sound.',
        recordAudioAndroid: true,
      },
    ],

    [
      'expo-audio',
      {
        microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone to record voice notes.',
      },
    ],

    'expo-video',

    [
      'expo-image-picker',
      {
        photosPermission: 'Allow $(PRODUCT_NAME) to access your photos to attach images of the issue.',
        videosPermission: 'Allow $(PRODUCT_NAME) to access your videos to attach clips of the issue.',
      },
    ],

    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#ffb502',
        defaultChannel: 'default',
      },
    ],

    [
      'react-native-maps',
      {
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    ],

    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow Hammer to access your location.',
        locationWhenInUsePermission: 'Allow Hammer to access your location while using the app.',
        isAndroidBackgroundLocationEnabled: false,
        isIosBackgroundLocationEnabled: false,
      },
    ],

    './plugins/withAndroidSigning.ts',
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
