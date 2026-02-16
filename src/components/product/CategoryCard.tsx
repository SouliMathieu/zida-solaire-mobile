// src/components/product/CategoryCard.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types';
import { Colors } from '../../constants/colors';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

// Couleurs variées par catégorie
const CATEGORY_COLORS: { [key: string]: [string, string] } = {
  'panneaux-solaires': [Colors.accent, '#FCD34D'],
  'batteries-stockage': [Colors.secondary, '#3B82F6'],
  'onduleurs-regulateurs': [Colors.purple, '#A78BFA'],
  'climatisation-électroménager': [Colors.teal, '#5EEAD4'],
  'accessoires': [Colors.pink, '#F472B6'],
  'default': [Colors.primary, Colors.accent],
};

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const colors = CATEGORY_COLORS[category.slug] || CATEGORY_COLORS['default'];

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="grid" size={32} color={Colors.white} />
          </View>
          <Text style={styles.name} numberOfLines={2}>
            {category.name}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
});