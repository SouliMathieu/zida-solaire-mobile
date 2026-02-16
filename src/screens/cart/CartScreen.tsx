// src/screens/cart/CartScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import CartItemCard from '../../components/product/CartItemCard';
import GradientButton from '../../components/common/GradientButton';
import { useCartStore } from '../../store/cartStore';

export default function CartScreen() {
  const navigation = useNavigation();
  const { items, getTotalPrice, getTotalItems } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={[Colors.primary, Colors.accent]}
          style={styles.emptyIconContainer}
        >
          <Ionicons name="cart-outline" size={64} color={Colors.white} />
        </LinearGradient>
        <Text style={styles.emptyTitle}>Votre panier est vide</Text>
        <Text style={styles.emptyText}>
          Ajoutez des produits pour commencer vos achats
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => <CartItemCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer avec total et bouton */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Ionicons name="receipt-outline" size={24} color={Colors.secondary} />
            <View style={styles.totalInfo}>
              <Text style={styles.totalLabel}>{totalItems} article{totalItems > 1 ? 's' : ''}</Text>
              <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
            </View>
          </View>
        </View>

        <GradientButton
          title="Passer la commande"
          onPress={() => {
            navigation.navigate('Checkout' as never);
          }}
          colors={[Colors.primary, Colors.accent]}
          style={styles.checkoutButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 180,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalContainer: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  checkoutButton: {
    width: '100%',
  },
});