import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeroBannersQuery } from '../../../entities/ads/api/useHeroBannersQuery';
import { wp, hp } from '../../../shared/lib/adaptive-sizes';

const LOCAL_IMAGES = [
  require('../../../shared/assets/images/img1.png'),
  require('../../../shared/assets/images/img2.png'),
  require('../../../shared/assets/images/img3.png'),
];

export const HeroBannersSection = () => {
  const query = useHeroBannersQuery();
  const insets = useSafeAreaInsets();

  const items = useMemo(() => query.data ?? [], [query.data]);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / wp(375));
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const imageSource = LOCAL_IMAGES[index % LOCAL_IMAGES.length];

    return (
      <View style={styles.slide}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
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
        snapToInterval={wp(375)}
        decelerationRate="fast"
        style={styles.carousel}
      />
      {displayData.length > 1 && (
        <View style={[styles.pagination, { bottom: hp(72) + insets.bottom }]}>
          {displayData.map((_: any, index: number) => (
            <View
              key={index}
              style={[styles.dot, index === activeIndex && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(520),
    backgroundColor: '#000',
  },
  carousel: {
    flex: 1,
  },
  pagination: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
    zIndex: 10,
  },
  dot: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: wp(4),
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: wp(20),
  },
  slide: {
    width: wp(375),
    height: hp(520),
  },
  image: {
    width: wp(375),
    height: hp(520),
  },
  textContainer: {
    position: 'absolute',
    top: hp(60),
    left: wp(20),
    right: wp(20),
    zIndex: 2,
  },
  title: {
    fontSize: wp(28),
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
