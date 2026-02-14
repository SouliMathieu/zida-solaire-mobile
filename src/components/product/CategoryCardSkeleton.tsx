// src/components/product/CategoryCardSkeleton.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from '../common/SkeletonLoader';
import { Colors } from '../../constants/colors';

export default function CategoryCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonLoader 
        width={120} 
        height={120} 
        borderRadius={12}
      />
      <SkeletonLoader 
        width={100} 
        height={14} 
        borderRadius={4}
        style={styles.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginRight: 12,
  },
  text: {
    marginTop: 8,
  },
});