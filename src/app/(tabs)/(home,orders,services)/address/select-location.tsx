import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router } from 'expo-router';
import { Check, Crosshair, MapPin, Search, X } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

const GOOGLE_PLACES_API_KEY = 'AIzaSyATYMNd-yK1NBd5vdV-j3Bp8MuCfntOftg';

const DEFAULT_REGION: Region = {
  latitude: 13.0827,
  longitude: 80.2707,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

type Prediction = {
  place_id: string;
  description: string;
  structured_formatting: { main_text: string; secondary_text?: string };
};

type AddressComponents = {
  street: string;
  city: string;
  pincode: string;
  formattedAddress: string;
};

const genSessionToken = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

// Pulls street/city/pincode out of a Google address_components array. Google
// doesn't have a single "street" field — route + sublocality is the closest
// practical equivalent for Indian addresses.
function parseAddressComponents(components: any[], formattedAddress: string): AddressComponents {
  const find = (type: string) => components.find((c) => c.types.includes(type))?.long_name ?? '';

  const route = find('route');
  const sublocality = find('sublocality_level_1') || find('sublocality');
  const street = [route, sublocality].filter(Boolean).join(', ');
  const city = find('locality') || find('administrative_area_level_2');
  const pincode = find('postal_code');

  return { street, city, pincode, formattedAddress };
}

export default function SelectLocationScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const sessionToken = useRef(genSessionToken());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [pinnedAddress, setPinnedAddress] = useState<AddressComponents | null>(null);
  const [resolvingAddress, setResolvingAddress] = useState(false);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setResolvingAddress(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_PLACES_API_KEY}`,
      );
      const data = await res.json();
      if (data.status !== 'OK') {
        console.warn('Reverse geocode error:', data.status, data.error_message);
      }
      const result = data.results?.[0];
      if (result) {
        setPinnedAddress(parseAddressComponents(result.address_components, result.formatted_address));
      }
    } catch (err) {
      // Keep the previous pinnedAddress rather than clearing it on a transient
      // network failure — the pin position itself is still valid.
      console.warn('Reverse geocode request failed:', err);
    } finally {
      setResolvingAddress(false);
    }
  }, []);

  const onRegionChangeComplete = (nextRegion: Region) => {
    setRegion(nextRegion);
    reverseGeocode(nextRegion.latitude, nextRegion.longitude);
  };

  const fetchPredictions = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim()) {
      setPredictions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            text,
          )}&components=country:in&key=${GOOGLE_PLACES_API_KEY}&sessiontoken=${sessionToken.current}`,
        );
        const data = await res.json();
        // Google returns HTTP 200 even on auth/config errors — the real
        // failure reason is in `status` (e.g. REQUEST_DENIED, OVER_QUERY_LIMIT)
        // and `error_message`, not in the HTTP status code. Logging the raw
        // Response object (as before) never surfaces this.
        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
          console.warn('Places Autocomplete error:', data.status, data.error_message);
        }
        setPredictions(data.predictions ?? []);
      } catch (err) {
        console.warn('Places Autocomplete request failed:', err);
        setPredictions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
  };

  const selectPrediction = async (prediction: Prediction) => {
    setQuery(prediction.description);
    setPredictions([]);
    setResolvingAddress(true);

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=geometry,address_component,formatted_address&key=${GOOGLE_PLACES_API_KEY}&sessiontoken=${sessionToken.current}`,
      );

      const data = await res.json();
      if (data.status !== 'OK') {
        console.warn('Place Details error:', data.status, data.error_message);
      }
      const result = data.result;
      if (result?.geometry?.location) {
        const { lat, lng } = result.geometry.location;
        const nextRegion: Region = { latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 };
        mapRef.current?.animateToRegion(nextRegion, 400);
        setRegion(nextRegion);
        setPinnedAddress(parseAddressComponents(result.address_components, result.formatted_address));
      }
    } catch (err) {
      console.warn('Place Details request failed:', err);
    } finally {
      setResolvingAddress(false);
      // A fresh session token per completed search keeps autocomplete +
      // details billed together as one Places session, per Google's pricing.
      sessionToken.current = genSessionToken();
    }
  };

  const useCurrentLocation = () => {
    // TODO: wire up expo-location (`npx expo install expo-location`) —
    // request foreground permission, getCurrentPositionAsync, then
    // mapRef.current?.animateToRegion({ latitude, longitude, ... }).
  };

  const confirmLocation = () => {
    router.push({
      pathname: '/address/add-address',
      params: {
        lat: String(region.latitude),
        lng: String(region.longitude),
        street: pinnedAddress?.street ?? '',
        city: pinnedAddress?.city ?? '',
        pincode: pinnedAddress?.pincode ?? '',
        formattedAddress: pinnedAddress?.formattedAddress ?? '',
      },
    } as never);
  };

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={DEFAULT_REGION}
        onRegionChangeComplete={onRegionChangeComplete}
      />

      <View style={styles.pinWrap} pointerEvents='none'>
        <MapPin size={36} color={AppColors.primary} strokeWidth={2.25} fill={AppColors.primary} />
        <View style={styles.pinShadow} />
      </View>

      <View style={[styles.topSection, { paddingTop: top + 10 }]}>
        <View style={styles.topRow}>
          <View style={styles.searchBar}>
            <Search size={16} color={AppColors.textTertiary} strokeWidth={2} />
            <TextInput
              value={query}
              onChangeText={fetchPredictions}
              placeholder='Search for area, street, landmark...'
              placeholderTextColor={AppColors.textTertiary}
              style={styles.searchInput}
            />
            {searchLoading && <ActivityIndicator size='small' color={AppColors.primary} />}
            {!searchLoading && query.length > 0 && (
              <Pressable
                accessibilityRole='button'
                hitSlop={8}
                onPress={() => {
                  setQuery('');
                  setPredictions([]);
                }}
              >
                <X size={16} color={AppColors.textTertiary} strokeWidth={2} />
              </Pressable>
            )}
          </View>
        </View>

        {predictions.length > 0 && (
          <View style={styles.predictionsCard}>
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              keyboardShouldPersistTaps='handled'
              ItemSeparatorComponent={() => <View style={styles.predictionDivider} />}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole='button'
                  onPress={() => selectPrediction(item)}
                  style={({ pressed }) => [
                    styles.predictionRow,
                    pressed && { backgroundColor: AppColors.warningLight },
                  ]}
                >
                  <MapPin size={16} color={AppColors.textTertiary} strokeWidth={2} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.predictionMain} numberOfLines={1}>
                      {item.structured_formatting.main_text}
                    </Text>
                    {!!item.structured_formatting.secondary_text && (
                      <Text style={styles.predictionSecondary} numberOfLines={1}>
                        {item.structured_formatting.secondary_text}
                      </Text>
                    )}
                  </View>
                </Pressable>
              )}
            />
          </View>
        )}
      </View>

      <Pressable
        accessibilityRole='button'
        onPress={useCurrentLocation}
        style={({ pressed }) => [styles.locateBtn, pressed && { opacity: 0.85 }]}
      >
        <Crosshair size={18} color={AppColors.primary} strokeWidth={2.25} />
      </Pressable>

      <View style={[styles.bottomCard, { paddingBottom: bottom + 16 }]}>
        <View style={styles.addressPreviewRow}>
          <View style={styles.addressPreviewIconWrap}>
            <MapPin size={16} color={AppColors.primary} strokeWidth={2.25} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addressPreviewLabel}>Selected location</Text>
            {resolvingAddress ? (
              <Text style={styles.addressPreviewValue} numberOfLines={2}>
                Locating address...
              </Text>
            ) : (
              <Text style={styles.addressPreviewValue} numberOfLines={2}>
                {pinnedAddress?.formattedAddress ?? 'Move the map to drop a pin'}
              </Text>
            )}
          </View>
        </View>

        <Pressable
          accessibilityRole='button'
          onPress={confirmLocation}
          disabled={!pinnedAddress || resolvingAddress}
          style={({ pressed }) => [
            styles.confirmBtn,
            (!pinnedAddress || resolvingAddress) && styles.confirmBtnDisabled,
            pressed && styles.confirmBtnPressed,
          ]}
        >
          <Check size={18} color={AppColors.white} strokeWidth={2.5} />
          <Text style={styles.confirmBtnText}>Confirm Location</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },

  pinWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -36,
  },
  pinShadow: {
    width: 10,
    height: 4,
    borderRadius: 5,
    marginTop: 2,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  topSection: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: AppColors.surface,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  searchInput: { flex: 1, fontFamily: font.medium, fontSize: 13, color: AppColors.textPrimary },

  predictionsCard: {
    marginTop: 10,
    maxHeight: 260,
    borderRadius: 14,
    backgroundColor: AppColors.surface,
    overflow: 'hidden',
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  predictionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13 },
  predictionDivider: { height: 1, backgroundColor: AppColors.divider },
  predictionMain: { fontFamily: font.medium, fontSize: 13, color: AppColors.textPrimary },
  predictionSecondary: { marginTop: 2, fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },

  locateBtn: {
    position: 'absolute',
    right: 16,
    bottom: 200,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  bottomCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: AppColors.surface,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  addressPreviewRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  addressPreviewIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  addressPreviewLabel: { fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  addressPreviewValue: { marginTop: 3, fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },

  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
  },
  confirmBtnPressed: { backgroundColor: AppColors.primaryDark },
  confirmBtnDisabled: { backgroundColor: AppColors.textTertiary },
  confirmBtnText: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.white },
});
