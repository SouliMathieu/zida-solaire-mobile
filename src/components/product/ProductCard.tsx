// src/components/product/ProductCard.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';

import { Product } from '../../types';
import { Colors } from '../../constants/colors';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 colonnes avec padding

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: product.images[0] || 'https://via.placeholder.com/200' }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        
        <View style={styles.footer}>
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>
              {product.stock > 0 ? 'En stock' : 'Rupture'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
            disabled={product.stock === 0}
          >
            <Ionicons name="cart" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: Colors.white,
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
    height: cardWidth,
    backgroundColor: Colors.light,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    minHeight: 36,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.light,
  },
  stockText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
