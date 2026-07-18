import { withAppBuildGradle, withGradleProperties } from '@expo/config-plugins';

import type { ConfigPlugin } from '@expo/config-plugins';

const withAndroidSigning: ConfigPlugin = (config) => {
  config = withGradleProperties(config, (config) => {
    const properties = [
      {
        type: 'property',
        key: 'MYAPP_UPLOAD_STORE_FILE',
        value: process.env.MYAPP_UPLOAD_STORE_FILE!,
      },
      {
        type: 'property',
        key: 'MYAPP_UPLOAD_KEY_ALIAS',
        value: process.env.MYAPP_UPLOAD_KEY_ALIAS!,
      },
      {
        type: 'property',
        key: 'MYAPP_UPLOAD_STORE_PASSWORD',
        value: process.env.MYAPP_UPLOAD_STORE_PASSWORD!,
      },
      {
        type: 'property',
        key: 'MYAPP_UPLOAD_KEY_PASSWORD',
        value: process.env.MYAPP_UPLOAD_KEY_PASSWORD!,
      },
    ];

    properties.forEach((property: any) => {
      const existing: any = config.modResults.find((item) => item.type === 'property' && item.key === property.key);

      if (existing) {
        existing.value = property.value;
      } else {
        config.modResults.push(property);
      }
    });

    return config;
  });

  config = withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes('MYAPP_UPLOAD_STORE_FILE') && contents.includes('signingConfigs {')) {
      contents = contents.replace(
        /signingConfigs\s*{/,
        `signingConfigs {
        release {
            if (project.hasProperty("MYAPP_UPLOAD_STORE_FILE")) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }`,
      );
    }
    contents = contents.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{)([\s\S]*?)(\n\s*\})/,
      (_match, start, body, end) => {
        let nextBody = body;

        if (/signingConfig\s+signingConfigs\.(debug|release)/.test(nextBody)) {
          nextBody = nextBody.replace(
            /signingConfig\s+signingConfigs\.(debug|release)/,
            'signingConfig signingConfigs.release',
          );
        } else {
          nextBody = `\n            signingConfig signingConfigs.release${nextBody}`;
        }

        return `${start}${nextBody}${end}`;
      },
    );
    config.modResults.contents = contents;
    return config;
  });

  return config;
};

export default withAndroidSigning;
