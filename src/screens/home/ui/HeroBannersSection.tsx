import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';

import { useHeroBannersQuery } from '../../../entities/ads/api/useHeroBannersQuery';

const { width: screenWidth } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 475;

const LOCAL_IMAGES = [
  require('../../../shared/assets/images/img1.png'),
  require('../../../shared/assets/images/img2.png'),
  require('../../../shared/assets/images/img3.png'),
];

export function HeroBannersSection() {
  const query = useHeroBannersQuery();

  const items = useMemo(() => query.data ?? [], [query.data]);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / screenWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const renderItem = ({ index }: { index: number }) => {
    const imageSource = LOCAL_IMAGES[index % LOCAL_IMAGES.length];

    return (
      <View style={styles.slide}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      </View>
    );
  };

  const displayData =
    items.length > 0 ? items : ([{ id: -1 }, { id: -2 }, { id: -3 }] as any[]);

  return (
    <View style={styles.container}>
      <FlatList
        data={displayData}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={screenWidth}
        decelerationRate="fast"
        style={styles.carousel}
      />
      {displayData.length > 1 && (
        <View style={styles.pagination}>
          {displayData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === activeIndex && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CAROUSEL_HEIGHT,
    backgroundColor: '#000',
  },
  carousel: {
    flex: 1,
  },
  pagination: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width: screenWidth,
    height: CAROUSEL_HEIGHT,
  },
  image: {
    flex: 1,
    width: screenWidth,
    height: CAROUSEL_HEIGHT,
  },
});
