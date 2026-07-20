import { genId } from '@/core/utils/order-helpers';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

export type MediaItem = { id: string; uri: string; type: 'image' | 'video' };

export function useMediaPicker() {
  const [media, setMedia] = useState<MediaItem[]>([]);

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to attach images or videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const picked: MediaItem[] = result.assets.map((asset) => ({
        id: genId(),
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
      }));
      setMedia((prev) => [...prev, ...picked]);
    }
  };

  const onCameraCapture = (result: { uri: string; type: 'image' | 'video' }) => {
    setMedia((prev) => [...prev, { id: genId(), uri: result.uri, type: result.type }]);
  };

  const removeMedia = (id: string) => setMedia((prev) => prev.filter((m) => m.id !== id));

  return { media, pickFromLibrary, onCameraCapture, removeMedia };
}
