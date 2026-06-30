import { Stack } from 'expo-router';
import { View } from 'react-native';

const HomeLayout = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      ></Stack>
    </View>
  );
};

export default HomeLayout;
