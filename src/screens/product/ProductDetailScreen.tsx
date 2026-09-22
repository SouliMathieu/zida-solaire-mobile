// src/screens/product/ProductDetailScreen.tsx

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Share, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { useCartStore } from '../../store/cartStore';
import { useProduct } from '../../hooks/useProducts';
import { Product } from '../../types';

const { width } = Dimensions.get('window');
const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(price);

type ProductDetailParams = { product: Product };

export default function ProductDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const initialProduct = (route.params as ProductDetailParams).product;
  const { data: fullProduct, isLoading } = useProduct(initialProduct.id);
  const product = fullProduct || initialProduct;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getItem } = useCartStore();

  const cartItem = getItem(product.id);
  const currentQuantityInCart = cartItem?.quantity || 0;
  const productImages = useMemo(() => {
    const images = product.images?.filter(Boolean) || [];
    return images.length ? images : [product.image];
  }, [product.images, product.image]);

  const availableStock = Math.max(0, product.stock - currentQuantityInCart);
  const inStock = product.stock > 0 && product.isAvailable !== false;
  const canAddToCart = inStock && availableStock > 0 && quantity <= availableStock;
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert('Ajouté au panier', `${quantity} article${quantity > 1 ? 's' : ''} ajouté${quantity > 1 ? 's' : ''}.`, [
      { text: 'Continuer' },
      { text: 'Voir le panier', onPress: () => navigation.getParent()?.getParent()?.navigate('Compte', { screen: 'CartArea' }) },
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `${product.name} – ${formatPrice(product.price)} chez ZIDA SOLAIRE` });
    } catch {
      Alert.alert('Erreur', 'Impossible de partager ce produit.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={styles.imageSection}>
          <Image source={{ uri: productImages[selectedImageIndex] }} style={styles.mainImage} contentFit="cover" transition={200} />
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={21} color={Colors.text} />
          </TouchableOpacity>
          <View style={[styles.stockPill, !inStock && styles.stockPillOut]}>
            <Ionicons name={inStock ? 'checkmark-circle' : 'close-circle'} size={16} color={inStock ? Colors.success : Colors.error} />
            <Text style={[styles.stockPillText, !inStock && { color: Colors.error }]}>{inStock ? `${product.stock} en stock` : 'Rupture de stock'}</Text>
          </View>
        </View>

        {productImages.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnails}>
            {productImages.map((image, index) => (
              <TouchableOpacity key={`${image}-${index}`} style={[styles.thumbnail, selectedImageIndex === index && styles.thumbnailActive]} onPress={() => setSelectedImageIndex(index)}>
                <Image source={{ uri: image }} style={styles.thumbnailImage} contentFit="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.content}>
          {isLoading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Chargement des détails...</Text>
            </View>
          )}

          {!!product.category?.name && <Text style={styles.category}>{product.category.name}</Text>}
          <Text style={styles.productName}>{product.name}</Text>
          {!!product.sku && <Text style={styles.sku}>Réf. {product.sku}</Text>}

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              {hasDiscount && <Text style={styles.oldPrice}>{formatPrice(product.compareAtPrice as number)}</Text>}
            </View>
            {currentQuantityInCart > 0 && (
              <View style={styles.inCartBadge}>
                <Ionicons name="bag-check-outline" size={16} color={Colors.primary} />
                <Text style={styles.inCartText}>{currentQuantityInCart} au panier</Text>
              </View>
            )}
          </View>

          {!!product.shortDescription && <Text style={styles.shortDescription}>{product.shortDescription}</Text>}

          <View style={styles.reassuranceRow}>
            <Reassurance icon="shield-checkmark-outline" title="Garantie" text={product.warranty || 'Selon fabricant'} />
            <Reassurance icon="construct-outline" title="Installation" text="Disponible avec ZIDA" />
            <Reassurance icon="call-outline" title="Conseil" text="Assistance technique" />
          </View>

          {!!product.description && (
            <Section title="Description">
              <Text style={styles.description}>{product.description}</Text>
            </Section>
          )}

          {!!product.features?.length && (
            <Section title="Points forts">
              {product.features.map((feature, index) => (
                <View style={styles.featureRow} key={`${feature}-${index}`}>
                  <Ionicons name="checkmark-circle" size={19} color={Colors.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </Section>
          )}

          {!!product.specifications && Object.keys(product.specifications).length > 0 && (
            <Section title="Caractéristiques techniques">
              <View style={styles.specCard}>
                {Object.entries(product.specifications).map(([key, value], index, array) => (
                  <View style={[styles.specRow, index === array.length - 1 && { borderBottomWidth: 0 }]} key={key}>
                    <Text style={styles.specLabel}>{key}</Text>
                    <Text style={styles.specValue}>{String(value)}</Text>
                  </View>
                ))}
              </View>
            </Section>
          )}

          {!!product.warranty && (
            <Section title="Garantie">
              <View style={styles.infoCard}>
                <Ionicons name="shield-checkmark" size={23} color={Colors.success} />
                <Text style={styles.infoCardText}>{product.warranty}</Text>
              </View>
            </Section>
          )}

          <Section title="Besoin d'aide avant l'achat ?">
            <TouchableOpacity style={styles.adviceCard} onPress={() => navigation.getParent()?.getParent()?.navigate('Assistance')}>
              <View style={styles.adviceIcon}><Ionicons name="headset-outline" size={25} color={Colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.adviceTitle}>Parler à ZIDA SOLAIRE</Text>
                <Text style={styles.adviceText}>Demandez conseil pour vérifier la compatibilité avec votre projet.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
          </Section>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
            <Ionicons name="remove" size={20} color={Colors.secondary} />
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.min(availableStock, quantity + 1))} disabled={quantity >= availableStock}>
            <Ionicons name="add" size={20} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.addButton, !canAddToCart && styles.addButtonDisabled]} onPress={handleAddToCart} disabled={!canAddToCart}>
          <Ionicons name="bag-add-outline" size={20} color={Colors.white} />
          <Text style={styles.addButtonText}>{canAddToCart ? 'Ajouter au panier' : 'Indisponible'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;
}

function Reassurance({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <View style={styles.reassuranceItem}>
      <Ionicons name={icon as any} size={21} color={Colors.primary} />
      <Text style={styles.reassuranceTitle}>{title}</Text>
      <Text style={styles.reassuranceText} numberOfLines={2}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  imageSection: { position: 'relative', backgroundColor: Colors.white },
  mainImage: { width, height: width * 0.88, backgroundColor: '#EDF1F4' },
  shareButton: { position: 'absolute', top: 16, right: 16, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  stockPill: { position: 'absolute', left: 16, bottom: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#EAF8F0', paddingHorizontal: 11, paddingVertical: 7, borderRadius: Radius.pill },
  stockPillOut: { backgroundColor: '#FFF0F0' },
  stockPillText: { color: '#18794E', fontSize: 11, fontWeight: '800', marginLeft: 5 },
  thumbnails: { paddingHorizontal: Spacing.lg, paddingVertical: 12, backgroundColor: Colors.white },
  thumbnail: { width: 64, height: 64, borderRadius: Radius.sm, overflow: 'hidden', marginRight: 9, borderWidth: 2, borderColor: 'transparent' },
  thumbnailActive: { borderColor: Colors.primary },
  thumbnailImage: { width: '100%', height: '100%' },
  content: { padding: Spacing.lg },
  loadingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  loadingText: { marginLeft: 8, color: Colors.textSecondary, fontSize: 12 },
  category: { color: Colors.primary, fontWeight: '900', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.7 },
  productName: { color: Colors.text, fontSize: Typography.h1, lineHeight: 31, fontWeight: '900', marginTop: 5 },
  sku: { color: Colors.textSecondary, marginTop: 5, fontSize: 12 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  price: { color: Colors.secondary, fontSize: 28, fontWeight: '900' },
  oldPrice: { color: Colors.gray, textDecorationLine: 'line-through', marginTop: 2 },
  inCartBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3EC', borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 7 },
  inCartText: { color: Colors.primary, fontWeight: '800', fontSize: 11, marginLeft: 5 },
  shortDescription: { color: Colors.textSecondary, lineHeight: 21, marginTop: 14 },
  reassuranceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  reassuranceItem: { width: '31%', backgroundColor: Colors.white, borderRadius: Radius.md, padding: 11, ...Shadow.card },
  reassuranceTitle: { color: Colors.text, fontSize: 11, fontWeight: '900', marginTop: 6 },
  reassuranceText: { color: Colors.textSecondary, fontSize: 9, lineHeight: 13, marginTop: 2 },
  section: { marginTop: 28 },
  sectionTitle: { fontSize: Typography.h3, fontWeight: '900', color: Colors.text, marginBottom: 12 },
  description: { color: Colors.textSecondary, fontSize: 14, lineHeight: 22 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 9 },
  featureText: { flex: 1, color: Colors.text, marginLeft: 8, lineHeight: 20 },
  specCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, paddingHorizontal: Spacing.lg, ...Shadow.card },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#EDF0F3' },
  specLabel: { flex: 1, color: Colors.textSecondary, fontSize: 13 },
  specValue: { flex: 1, color: Colors.text, textAlign: 'right', fontSize: 13, fontWeight: '800' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#EDF9F2', borderRadius: Radius.lg, padding: Spacing.lg },
  infoCardText: { flex: 1, marginLeft: 10, color: Colors.text, lineHeight: 20 },
  adviceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  adviceIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  adviceTitle: { color: Colors.text, fontWeight: '900' },
  adviceText: { color: Colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: Spacing.lg, borderTopWidth: 1, borderTopColor: '#E8ECF0', ...Shadow.floating },
  quantitySelector: { height: 50, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F4F7', borderRadius: Radius.md, marginRight: 10 },
  quantityButton: { width: 40, height: 50, alignItems: 'center', justifyContent: 'center' },
  quantityValue: { minWidth: 28, textAlign: 'center', fontWeight: '900', color: Colors.text },
  addButton: { flex: 1, height: 50, borderRadius: Radius.md, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  addButtonDisabled: { backgroundColor: '#AEB8C2' },
  addButtonText: { color: Colors.white, fontWeight: '900', marginLeft: 8 },
});
