import { useBoundStore } from '@/store/boundStore';
import { Redirect } from 'expo-router';
import { useShallow } from 'zustand/shallow';

export default function Index() {
  const { hasOnBoardCompleted, isLoggedIn } = useBoundStore(
    useShallow((state) => ({
      hasOnBoardCompleted: false,
      isLoggedIn: state.isLoggedIn,
    })),
  );

  const redirectTo = hasOnBoardCompleted ? '/(tabs)/(home)/' : hasOnBoardCompleted ? '/otp/generate-otp' : '/onboard';

  return <Redirect href={'/(tabs)/(home)'} />;
}
