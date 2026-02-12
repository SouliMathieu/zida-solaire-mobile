// src/components/product/CartItemCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';

import { CartItem } from '../../types';
import { Colors } from '../../constants/colors';
import { useCartStore } from '../../store/cartStore';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCartStore();

  const handleIncrease = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.product.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = item.product.price * item.quantity;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.product.images[0] || 'https://via.placeholder.com/100' }}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {item.product.name}
          </Text>
          
          <TouchableOpacity onPress={handleRemove} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>{formatPrice(item.product.price)}</Text>

        <View style={styles.footer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={handleDecrease}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={20} color={Colors.primary} />
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={handleIncrease}
              style={styles.quantityButton}
              disabled={item.quantity >= item.product.stock}
            >
              <Ionicons name="add" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.light,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  deleteButton: {
    padding: 4,
  },
  price: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
