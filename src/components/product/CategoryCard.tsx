// src/components/product/CategoryCard.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Category } from '../../types';
import { Colors } from '../../constants/colors';

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: category.image || 'https://via.placeholder.com/200' }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.overlay}>
        <Text style={styles.name}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.light,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
});
