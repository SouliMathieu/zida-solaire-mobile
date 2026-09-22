// src/components/product/ProductCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../theme/tokens';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(price);

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItem = useCartStore((state) => state.getItem(product.id));
  const productImage = product.images?.[0] || product.image || 'https://via.placeholder.com/300';
  const inStock = product.stock > 0 && product.isAvailable !== false;
  const lowStock = inStock && product.lowStockThreshold !== undefined && product.stock <= product.lowStockThreshold;
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.price;

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, 1);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: productImage }} style={styles.image} contentFit="cover" transition={180} />
        <View style={[styles.statusBadge, !inStock && styles.statusBadgeOut]}>
          <Text style={[styles.statusText, !inStock && styles.statusTextOut]}>
            {!inStock ? 'Rupture' : lowStock ? 'Stock limité' : 'Disponible'}
          </Text>
        </View>
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>PROMO</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {!!product.category?.name && <Text style={styles.category}>{product.category.name}</Text>}
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        {!!product.shortDescription && (
          <Text style={styles.description} numberOfLines={2}>{product.shortDescription}</Text>
        )}

        <View style={styles.priceBlock}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {hasDiscount && <Text style={styles.oldPrice}>{formatPrice(product.compareAtPrice as number)}</Text>}
        </View>

        <View style={styles.footer}>
          <View style={styles.stockInfo}>
            <Ionicons name={inStock ? 'checkmark-circle-outline' : 'close-circle-outline'} size={16} color={inStock ? Colors.success : Colors.error} />
            <Text style={styles.stockText}>{inStock ? `${product.stock} en stock` : 'Indisponible'}</Text>
          </View>
          <TouchableOpacity style={[styles.cartButton, !inStock && styles.cartButtonDisabled]} onPress={handleAddToCart} disabled={!inStock}>
            <Ionicons name={cartItem ? 'checkmark' : 'bag-add-outline'} size={19} color={Colors.white} />
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
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  imageWrap: { position: 'relative', backgroundColor: '#F1F4F7' },
  image: { width: '100%', height: cardWidth * 0.9 },
  statusBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#EAF8F0', paddingHorizontal: 9, paddingVertical: 5, borderRadius: Radius.pill },
  statusBadgeOut: { backgroundColor: '#FFF0F0' },
  statusText: { color: '#18794E', fontSize: 10, fontWeight: '800' },
  statusTextOut: { color: Colors.error },
  discountBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 5, borderRadius: Radius.pill },
  discountText: { color: Colors.white, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  content: { padding: 12 },
  category: { color: Colors.primary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  name: { fontSize: 14, lineHeight: 18, fontWeight: '800', color: Colors.text, marginTop: 4, minHeight: 36 },
  description: { color: Colors.textSecondary, fontSize: 11, lineHeight: 15, marginTop: 5, minHeight: 30 },
  priceBlock: { marginTop: 10 },
  price: { fontSize: 17, fontWeight: '900', color: Colors.secondary },
  oldPrice: { marginTop: 2, fontSize: 11, color: Colors.gray, textDecorationLine: 'line-through' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 11 },
  stockInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stockText: { marginLeft: 4, color: Colors.textSecondary, fontSize: 10, fontWeight: '700' },
  cartButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  cartButtonDisabled: { backgroundColor: '#B7C0C9' },
});
