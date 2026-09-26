import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import SkeletonLoader from '../common/SkeletonLoader';
import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../theme/tokens';

interface CategoryCardSkeletonProps {
  width?: number;
}

export default function CategoryCardSkeleton({
  width,
}: CategoryCardSkeletonProps) {
  const { width: screenWidth } = useWindowDimensions();

  const cardWidth =
    width ??
    Math.floor(
      (screenWidth - Spacing.lg * 2 - Spacing.md) / 2
    );

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <SkeletonLoader
        width={50}
        height={50}
        borderRadius={25}
      />

      <View style={styles.copy}>
        <SkeletonLoader
          width="85%"
          height={12}
          borderRadius={6}
        />

        <SkeletonLoader
          width="60%"
          height={12}
          borderRadius={6}
          style={styles.secondLine}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 104,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9EDF2',
  },

  copy: {
    flex: 1,
    marginLeft: 12,
  },

  secondLine: {
    marginTop: 8,
  },
});
