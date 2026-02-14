// src/components/product/ProductCardSkeleton.tsx

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonLoader from '../common/SkeletonLoader';
import { Colors } from '../../constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      {/* Image skeleton */}
      <SkeletonLoader 
        width={CARD_WIDTH - 16} 
        height={CARD_WIDTH - 16} 
        borderRadius={8}
        style={styles.image}
      />
      
      {/* Title skeleton */}
      <SkeletonLoader 
        width="90%" 
        height={16} 
        borderRadius={4}
        style={styles.title}
      />
      
      {/* Subtitle skeleton */}
      <SkeletonLoader 
        width="70%" 
        height={14} 
        borderRadius={4}
        style={styles.subtitle}
      />
      
      {/* Price skeleton */}
      <SkeletonLoader 
        width="50%" 
        height={18} 
        borderRadius={4}
        style={styles.price}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    marginBottom: 8,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 8,
  },
  price: {
    marginBottom: 4,
  },
});