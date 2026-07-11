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

  console.log('hasOnBoardCoisLoggedInmpleted:', isLoggedIn);
  console.log('hasOnBoardCompleted:', hasOnBoardCompleted);

  const redirectTo = isLoggedIn ? '/coming-soon' : hasOnBoardCompleted ? '/otp/generate-otp' : '/onboard';

  return <Redirect href={redirectTo} />;
}
