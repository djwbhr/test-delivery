import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

import { HeroBannersSection } from './ui/HeroBannersSection';
import { useVendorsQuery } from '../../entities/vendor/api/useVendorsQuery';
import { RestaurantCard } from './ui/RestaurantCard';
import { Vendor } from '../../entities/vendor/model/types';

import { wp, hp } from '../../shared/lib/adaptive-sizes';
import { ShadowOverlay } from '../../shared/ui/ShadowOverlay';

export function HomeScreen() {
  const vendorsQuery = useVendorsQuery();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedIndex = useSharedValue(-1);
  const snapPoints = useMemo(() => ['45%', '100%'], []);
  const [isReady, setIsReady] = useState(false);

  const BORDER_RADIUS_32 = wp(32);
  const MARGIN_12 = wp(12);

  const heroAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const value = animatedIndex.value;
    const scale = interpolate(value, [0, 1], [1, 0.92], Extrapolate.CLAMP);
    const opacity = interpolate(value, [0, 1], [1, 0.75], Extrapolate.CLAMP);

    return {
      transform: [{ scale }],
      opacity,
    };
  }, []);

  const heroContainerStyle = useAnimatedStyle(() => {
    'worklet';
    const value = animatedIndex.value;
    const borderRadius = interpolate(
      value,
      [0, 0.5, 1],
      [0, BORDER_RADIUS_32, BORDER_RADIUS_32],
      Extrapolate.CLAMP,
    );
    const horizontalMargin = interpolate(
      value,
      [0, 0.5, 1],
      [0, MARGIN_12, MARGIN_12],
      Extrapolate.CLAMP,
    );

    return {
      borderRadius,
      marginHorizontal: horizontalMargin,
      overflow: 'hidden',
    };
  }, [BORDER_RADIUS_32, MARGIN_12]);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    'worklet';
    const value = animatedIndex.value;
    const borderRadius = interpolate(
      value,
      [0.9, 1],
      [BORDER_RADIUS_32, 0],
      Extrapolate.CLAMP,
    );

    return {
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
    };
  }, [BORDER_RADIUS_32]);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const vendors = vendorsQuery.data?.data ?? [];

  const renderBackground = useCallback(
    (props: any) => (
      <View style={[props.style, styles.renderBackgroundContainer]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.sheetBackground,
            animatedBackgroundStyle,
          ]}
        />
      </View>
    ),
    [animatedBackgroundStyle],
  );

  if (!isReady) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backgroundContainer,
          heroContainerStyle,
          heroAnimatedStyle,
        ]}
      >
        <HeroBannersSection />
        <ShadowOverlay animatedIndex={animatedIndex} />
      </Animated.View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={false}
        enableOverDrag={false}
        enableDynamicSizing={false}
        style={styles.bottomSheet}
        handleIndicatorStyle={styles.handleIndicator}
        animatedIndex={animatedIndex}
        backgroundComponent={renderBackground}
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Недалеко от вас</Text>
        </View>
        <View style={styles.listContainer}>
          <BottomSheetFlatList
            data={vendors}
            keyExtractor={(item: Vendor) => String(item.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }: { item: Vendor }) => (
              <RestaurantCard vendor={item} />
            )}
            ListEmptyComponent={
              vendorsQuery.isLoading ? (
                <View style={styles.empty}>
                  <Text>Загрузка ресторанов...</Text>
                </View>
              ) : vendorsQuery.isError ? (
                <View style={styles.empty}>
                  <Text>Ошибка загрузки ресторанов</Text>
                </View>
              ) : (
                <View style={styles.empty}>
                  <Text>Рестораны не найдены</Text>
                </View>
              )
            }
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: hp(520),
    backgroundColor: '#000',
    zIndex: 0,
  },
  bottomSheet: {
    zIndex: 10,
    elevation: 20,
  },
  bottomSheetBackground: {
    borderTopLeftRadius: wp(32),
    borderTopRightRadius: wp(32),
  },
  sheetBackground: {
    backgroundColor: '#FFFFFF',
  },
  renderBackgroundContainer: {
    overflow: 'visible',
  },
  listContainer: {
    flex: 1,
  },
  shadowOverlay: {
    position: 'absolute',
    top: -120,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 999,
  },
  handleIndicator: {
    backgroundColor: '#EAECF0',
    width: wp(40),
    height: hp(4),
    marginTop: hp(8),
  },
  sheetHeader: {
    paddingHorizontal: wp(16),
    paddingTop: hp(16),
    paddingBottom: hp(12),
  },
  sheetTitle: {
    fontSize: wp(20),
    fontWeight: '800',
    color: '#101828',
  },
  listContent: {
    paddingHorizontal: wp(16),
    paddingBottom: hp(40),
  },
  empty: {
    marginTop: hp(40),
    alignItems: 'center',
  },
});
