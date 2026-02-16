// src/components/product/ProductCard.tsx

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
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
const cardWidth = (width - 48) / 2;

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Gérer l'image du produit
  const productImage = product.images?.[0] || product.image || 'https://via.placeholder.com/200';

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Image */}
        <Image
          source={{ uri: productImage }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        
        {/* Badge stock */}
        <View style={[
          styles.stockBadgeTop,
          { backgroundColor: product.stock > 0 ? Colors.success : Colors.error }
        ]}>
          <Text style={styles.stockBadgeTopText}>
            {product.stock > 0 ? 'Disponible' : 'Rupture'}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          
          <View style={styles.footer}>
            <View style={[
              styles.stockBadge,
              { backgroundColor: product.stock > 0 ? '#DCFCE7' : '#FEE2E2' }
            ]}>
              <Ionicons 
                name={product.stock > 0 ? 'checkmark-circle' : 'close-circle'} 
                size={14} 
                color={product.stock > 0 ? Colors.success : Colors.error} 
              />
              <Text style={[
                styles.stockText,
                { color: product.stock > 0 ? Colors.success : Colors.error }
              ]}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Épuisé'}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
              disabled={product.stock === 0}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={product.stock > 0 ? [Colors.primary, Colors.accent] : ['#D1D5DB', '#9CA3AF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addButtonGradient}
              >
                <Ionicons name="cart" size={20} color={Colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: cardWidth,
    backgroundColor: Colors.light,
  },
  stockBadgeTop: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  stockBadgeTopText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.white,
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
    lineHeight: 18,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});