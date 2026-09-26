import React from 'react';
import { useWindowDimensions } from 'react-native';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';

import { Category } from '../../types';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../theme/tokens';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  width?: number;
}

const normalize = (value: string = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getCategoryIcon = (category: Category) => {
  const value = `${normalize(category.slug)} ${normalize(category.name)}`;

  if (
    value.includes('panneau') ||
    value.includes('panel')
  ) {
    return 'sunny-outline';
  }

  if (
    value.includes('batterie') ||
    value.includes('stockage')
  ) {
    return 'battery-charging-outline';
  }

  if (
    value.includes('onduleur') ||
    value.includes('regulateur')
  ) {
    return 'flash-outline';
  }

  if (value.includes('kit')) {
    return 'apps-outline';
  }

  if (
    value.includes('pompage') ||
    value.includes('forage')
  ) {
    return 'water-outline';
  }

  if (
    value.includes('climatisation') ||
    value.includes('electromenager')
  ) {
    return 'snow-outline';
  }

  if (value.includes('eclairage')) {
    return 'bulb-outline';
  }

  if (value.includes('accessoire')) {
    return 'construct-outline';
  }

  if (value.includes('television')) {
    return 'tv-outline';
  }

  if (value.includes('congelateur')) {
    return 'snow-outline';
  }

  if (
    value.includes('equipement') ||
    value.includes('electrique')
  ) {
    return 'hardware-chip-outline';
  }

  return 'grid-outline';
};

export default function CategoryCard({
  category,
  onPress,
  width,
}: CategoryCardProps) {
  const { width: screenWidth } = useWindowDimensions();

  const cardWidth =
    width ??
    Math.floor(
      (screenWidth - Spacing.lg * 2 - Spacing.md) / 2
    );
  const icon = getCategoryIcon(category);

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.84}
      accessibilityRole="button"
      accessibilityLabel={`Voir ${category.name}`}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon as any}
          size={27}
          color={Colors.primary}
        />
      </View>

      <Text
        style={styles.name}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {category.name}
      </Text>

      <View style={styles.arrow}>
        <Ionicons
          name="arrow-forward"
          size={17}
          color={Colors.secondary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 104,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: 6,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9EDF2',
    ...Shadow.card,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },

  name: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    paddingRight: 24,
  },

  arrow: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
