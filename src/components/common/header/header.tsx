import React, { JSX } from 'react';

import { useHeaderNavigation } from '@/hooks/useHeaderNavigation';
import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderWithTitle } from './header-with-title';
import { HomeHeader } from './home-header';
import { ProfileHeader } from './profile-header';
import { ServiceHeader } from './service-header';

const Header = () => {
  const { currentSegmentName, pathname, rootTabPath, currentTab } = useHeaderNavigation();

  const handleRouterBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(rootTabPath ?? '/(tabs)/(home)');
    }
  };

  const segmentHeaders: Record<string, JSX.Element> = {
    service: <View />,
    booking: <HeaderWithTitle title='Bathroom deep cleaning' />,
    'confirm-booking': <View />,
  };

  const tabHeaders: Record<string, JSX.Element> = {
    '(home)': <HomeHeader />,
    '(profile)': <ProfileHeader />,
    '(services)': <ServiceHeader />,
  };

  console.log('currentSegmentName', currentSegmentName);
  console.log('currentTab', currentTab);
  console.log('pathname', pathname);

  const header: JSX.Element = segmentHeaders[currentSegmentName] ??
    (currentTab ? tabHeaders[currentTab] : undefined) ?? <View />;

  return (
    <SafeAreaView edges={[]} testID={`header-${currentTab}-container`}>
      {header}
    </SafeAreaView>
  );
};

export default Header;
