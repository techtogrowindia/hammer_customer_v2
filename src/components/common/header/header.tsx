import React, { JSX } from 'react';

import { AppColors } from '@/core/theme/app-colors';
import { useHeaderNavigation } from '@/hooks/useHeaderNavigation';
import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderWithTitle } from './header-with-title';
import { HomeHeader } from './home-header';
import { OrderHeader } from './order-header';
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
    booking: <HeaderWithTitle title='Bathroom deep cleaning' onBack={handleRouterBack} />,
    'confirm-booking': <View />,
    'select-address': <HeaderWithTitle title='Select Address' onBack={handleRouterBack} />,
    'add-address': <HeaderWithTitle title='Add New Address' onBack={handleRouterBack} />,
    'select-location': <HeaderWithTitle title='Select Location' onBack={handleRouterBack} />,
  };

  const tabHeaders: Record<string, JSX.Element> = {
    '(home)': <HomeHeader />,
    '(profile)': <ProfileHeader />,
    '(services)': <ServiceHeader />,
    '(orders)': <OrderHeader />,
  };

  console.log('currentSegmentName', currentSegmentName);
  console.log('currentTab', currentTab);
  console.log('pathname', pathname);

  const header: JSX.Element = segmentHeaders[currentSegmentName] ??
    (currentTab ? tabHeaders[currentTab] : undefined) ?? <View />;

  return (
    <SafeAreaView
      style={{ backgroundColor: AppColors.background }}
      edges={[]}
      testID={`header-${currentTab}-container`}
    >
      {header}
    </SafeAreaView>
  );
};

export default Header;
