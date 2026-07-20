import React, { JSX } from 'react';

import { AppColors } from '@/core/theme/app-colors';
import { useHeaderNavigation } from '@/hooks/useHeaderNavigation';
import { router, useGlobalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderWithTitle } from './header-with-title';
import { HomeHeader } from './home-header';
import { OrderHeader } from './order-header';
import { ProfileHeader } from './profile-header';
import { SearchHeader } from './search-header';
import { ServiceHeader } from './service-header';

const Header = () => {
  const { currentSegmentName, pathname, rootTabPath, currentTab } = useHeaderNavigation();

  const params = useGlobalSearchParams<{
    title?: string;
  }>();

  const title = params?.title;

  const handleRouterBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(rootTabPath ?? '/(tabs)/(home)');
    }
  };

  const segmentHeaders: Record<string, JSX.Element> = {
    'service-details': <View />,
    'service-item': <HeaderWithTitle title={title ?? 'Service Item'} onBack={handleRouterBack} />,
    booking: <HeaderWithTitle title={title ?? 'Booking'} onBack={handleRouterBack} />,
    notification: <HeaderWithTitle title='Notifications' onBack={handleRouterBack} />,
    'confirm-booking': <View />,
    'edit-profile': <HeaderWithTitle title='Edit Profile' onBack={handleRouterBack} />,
    'select-address': <HeaderWithTitle title='Select Address' onBack={handleRouterBack} />,
    'add-address': <HeaderWithTitle title='Add New Address' onBack={handleRouterBack} />,
    'select-location': <HeaderWithTitle title='Select Location' onBack={handleRouterBack} />,
    'order-details': <HeaderWithTitle title='Order Details' onBack={handleRouterBack} />,
    search: <SearchHeader placeholder='Search for products' />,
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
