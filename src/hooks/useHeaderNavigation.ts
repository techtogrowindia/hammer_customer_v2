import { useNavigation } from '@react-navigation/native';
import { usePathname, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

const ROOT_TABS = ['(home)', '(profile)', '(orders)', '(services)'];
type RootTab = (typeof ROOT_TABS)[number];

export const useHeaderNavigation = () => {
  const pathname = usePathname();
  const segments: string[] = useSegments();
  const router = useRouter();
  const navigation = useNavigation();

  const prevSegmentRef = useRef<string | null>(null);

  const lastSegment = segments[segments.length - 1] || '';
  const isDynamicRoute = lastSegment.startsWith('[') && lastSegment.endsWith(']');

  const currentSegmentName = isDynamicRoute && segments.length > 2 ? segments[segments.length - 2] : lastSegment;

  const detectedTab = [...(segments ?? [])].reverse().find((segment): segment is RootTab => {
    return ROOT_TABS.includes(segment as RootTab);
  });

  const currentTab: RootTab = detectedTab ?? '(home)';

  // TODO - FOR MODALS
  // const tabsIndex = segments.findIndex((s) => s === '(tabs)');
  // const tab = segments[tabsIndex + 1];

  // const currentTab = tab ?? '(home)';
  const isRootTab = ROOT_TABS.includes(currentSegmentName);
  const showBackButton = !isRootTab && segments.length > 1;
  const [previousSegment, setPreviousSegment] = useState<string | null>(null);
  const rootTabPath = `/(tabs)/${currentTab}`;

  useEffect(() => {
    setPreviousSegment(prevSegmentRef.current);
    prevSegmentRef.current = currentSegmentName;
  }, [currentSegmentName]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {});
    return () => unsubscribe();
  }, [navigation]);

  return {
    pathname,
    segments,
    currentSegmentName,
    currentTab,
    isDynamicRoute,
    previousSegment,
    isRootTab,
    showBackButton,
    canGoBack: router.canGoBack(),
    rootTabPath,
  };
};
