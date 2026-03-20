import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Vendor } from '../../../entities/vendor/model/types';
import { useFavoritesStore } from '../../../shared/model/useFavoritesStore';
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
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {mainImageUri ? (
          <Image source={{ uri: mainImageUri }} style={styles.mainImage} />
        ) : (
          <View style={[styles.mainImage, styles.placeholder]} />
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(vendor.id)}
          activeOpacity={0.7}
        >
          <UnionIcon fill={isFavorite ? '#FF3B30' : 'none'} />
        </TouchableOpacity>

        <View style={styles.logoBadge}>
          {logoUri ? (
            <Image source={{ uri: logoUri }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, styles.placeholder]} />
          )}
        </View>
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {vendor.general_info.name}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.rating}>⭐ {vendor.rating}</Text>
          <Text style={styles.metaText}> (10) • Европейская кухня</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F2F4F7',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: '#EAECF0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  info: {
    marginTop: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
  },
  metaText: {
    fontSize: 14,
    color: '#667085',
  },
});
