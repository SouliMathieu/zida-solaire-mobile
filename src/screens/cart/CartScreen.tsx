// src/screens/cart/CartScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import CartItemCard from '../../components/product/CartItemCard';
import Button from '../../components/common/Button';
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
        <Ionicons name="cart-outline" size={80} color={Colors.light} />
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
          <View>
            <Text style={styles.totalLabel}>Total ({totalItems} articles)</Text>
            <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>

        <Button
          title="Passer la commande"
          onPress={() => {
            navigation.navigate('Checkout' as never);
          }}
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
    paddingBottom: 160,
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
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  checkoutButton: {
    width: '100%',
  },
});
