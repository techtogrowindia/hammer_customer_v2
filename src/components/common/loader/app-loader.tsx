import { AppColors } from '@/core/theme/app-colors';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View, ViewStyle } from 'react-native';

type AppLoaderProps = {
  visible: boolean;
  transparent?: boolean;
  size?: 'small' | 'large';
  color?: string;
  containerStyle?: ViewStyle;
};

const AppLoader = ({
  visible,
  transparent = true,
  size = 'large',
  color = AppColors.primary,
  containerStyle,
}: AppLoaderProps) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} transparent={transparent} animationType='fade' statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.loaderContainer, containerStyle]}>
          <ActivityIndicator size={size} color={color} />
        </View>
      </View>
    </Modal>
  );
};

export default AppLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
