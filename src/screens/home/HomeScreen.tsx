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
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { HeroBannersSection } from './ui/HeroBannersSection';
import { useVendorsQuery } from '../../entities/vendor/api/useVendorsQuery';
import { RestaurantCard } from './ui/RestaurantCard';
import { Vendor } from '../../entities/vendor/model/types';

export function HomeScreen() {
  const vendorsQuery = useVendorsQuery();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedIndex = useSharedValue(-1);
  const snapPoints = useMemo(() => ['45%', '100%'], []);
  const [isReady, setIsReady] = useState(false);

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
      [0, 32, 32],
      Extrapolate.CLAMP,
    );
    const horizontalMargin = interpolate(
      value,
      [0, 0.5, 1],
      [0, 12, 12],
      Extrapolate.CLAMP,
    );

    return {
      borderRadius,
      marginHorizontal: horizontalMargin,
      overflow: 'hidden',
    };
  }, []);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    'worklet';
    const value = animatedIndex.value;
    const borderRadius = interpolate(
      value,
      [0.9, 1],
      [32, 0],
      Extrapolate.CLAMP,
    );

    return {
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
    };
  }, []);

  const shadowAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const value = animatedIndex.value;
    const opacity = interpolate(value, [0, 0.2], [1, 0], Extrapolate.CLAMP);

    return {
      opacity,
    };
  }, []);

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
        <Animated.View
          pointerEvents="none"
          style={[styles.shadowOverlay, shadowAnimatedStyle]}
        >
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="shadow" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0" stopColor="#000" stopOpacity="0.70" />
                <Stop offset="1" stopColor="#000" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#shadow)" />
          </Svg>
        </Animated.View>
      </View>
    ),
    [animatedBackgroundStyle, shadowAnimatedStyle],
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
    height: 475,
    backgroundColor: '#000',
    zIndex: 0,
  },
  bottomSheet: {
    zIndex: 10,
    elevation: 20,
  },
  bottomSheetBackground: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  sheetBackground: {
    backgroundColor: '#FFFFFF',
  },
  renderBackgroundContainer: {
    overflow: 'visible',
  },
  shadowOverlay: {
    position: 'absolute',
    top: -70,
    left: 0,
    right: 0,
    height: 100,
    zIndex: -1,
  },
  handleIndicator: {
    backgroundColor: '#EAECF0',
    width: 40,
    height: 4,
    marginTop: 8,
  },
  sheetHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#101828',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  empty: {
    marginTop: 40,
    alignItems: 'center',
  },
});
