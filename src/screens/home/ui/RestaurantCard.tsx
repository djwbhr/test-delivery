import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Vendor } from '../../../entities/vendor/model/types';
import { useFavoritesStore } from '../../../shared/model/useFavoritesStore';
import { wp, hp } from '../../../shared/lib/adaptive-sizes';
import { UnionIcon } from '../../../shared/assets/icons/UnionIcon';

type Props = {
  vendor: Vendor;
};

export function RestaurantCard({ vendor }: Props) {
  const isFavorite = useFavoritesStore(
    state => state.favorites[vendor.id] ?? false,
  );
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);

  const logoUri = vendor.logo?.url_lg ?? vendor.logo?.url ?? null;
  const mainImageUri = vendor.image?.url_lg ?? vendor.image?.url ?? null;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {mainImageUri ? (
          <Image source={{ uri: mainImageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(vendor.id)}
          activeOpacity={0.7}
        >
          <UnionIcon fill={isFavorite ? '#FF3B30' : 'none'} />
        </TouchableOpacity>

        <View style={styles.badge}>
          {logoUri ? (
            <Image source={{ uri: logoUri }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, styles.placeholder]} />
          )}
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.name}>
            {vendor.general_info.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {vendor.rating}</Text>
          </View>
        </View>
        <Text style={styles.details}>Европейская кухня • 10-20 мин</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: hp(24),
    backgroundColor: '#fff',
    borderRadius: wp(16),
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: hp(160),
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F4F7',
  },
  placeholder: {
    backgroundColor: '#EAECF0',
  },
  favoriteButton: {
    position: 'absolute',
    top: hp(12),
    right: wp(12),
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  badge: {
    position: 'absolute',
    bottom: hp(12),
    left: wp(12),
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  info: {
    paddingVertical: hp(12),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(4),
  },
  name: {
    fontSize: wp(16),
    fontWeight: '700',
    color: '#101828',
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
    paddingHorizontal: wp(8),
    paddingVertical: hp(2),
    borderRadius: wp(12),
  },
  rating: {
    fontSize: wp(12),
    fontWeight: '600',
    color: '#101828',
    marginLeft: wp(4),
  },
  details: {
    fontSize: wp(14),
    color: '#667085',
  },
});
