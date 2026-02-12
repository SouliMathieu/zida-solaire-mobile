// src/screens/product/ProductDetailScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import Button from '../../components/common/Button';
import { useCartStore } from '../../store/cartStore';
import { Product } from '../../types';

const { width } = Dimensions.get('window');

interface ProductDetailScreenProps {
  product: Product;
  onBack?: () => void;
}

export default function ProductDetailScreen({
  product,
  onBack,
}: ProductDetailScreenProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getItem } = useCartStore();

  const cartItem = getItem(product.id);
  const currentQuantityInCart = cartItem?.quantity || 0;

  // Gérer à la fois image (string) et images (array) pour compatibilité
  const productImages = product.images || [product.image];
  const hasMultipleImages = productImages.length > 1;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert(
      'Ajouté au panier',
      `${quantity} ${quantity > 1 ? 'articles ajoutés' : 'article ajouté'} au panier`,
      [{ text: 'OK' }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez ${product.name} chez ZIDA SOLAIRE\n\nPrix: ${formatPrice(product.price)}\n\n${product.description}`,
        title: product.name,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le produit');
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity + currentQuantityInCart < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const availableStock = product.stock - currentQuantityInCart;
  const canAddToCart = availableStock > 0 && quantity <= availableStock;

  return (
    <View style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Images du produit */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: productImages[selectedImageIndex] || 'https://via.placeholder.com/400',
            }}
            style={styles.mainImage}
            contentFit="cover"
            transition={300}
          />

          {/* Indicateurs d'images */}
          {hasMultipleImages && (
            <View style={styles.imageIndicators}>
              {productImages.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    selectedImageIndex === index && styles.activeIndicator,
                  ]}
                  onPress={() => setSelectedImageIndex(index)}
                />
              ))}
            </View>
          )}

          {/* Badge stock */}
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>
              {product.stock > 0
                ? `${product.stock} en stock`
                : 'Rupture de stock'}
            </Text>
          </View>
        </View>

        {/* Miniatures des images */}
        {hasMultipleImages && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailsContainer}
            contentContainerStyle={styles.thumbnails}
          >
            {productImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.activeThumbnail,
                ]}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.thumbnailImage}
                  contentFit="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Informations du produit */}
        <View style={styles.contentContainer}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {currentQuantityInCart > 0 && (
              <View style={styles.cartBadge}>
                <Ionicons name="cart" size={16} color={Colors.white} />
                <Text style={styles.cartBadgeText}>{currentQuantityInCart}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Spécifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Spécifications techniques</Text>
              <View style={styles.specificationsContainer}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <View key={key} style={styles.specRow}>
                    <Text style={styles.specLabel}>{key}</Text>
                    <Text style={styles.specValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Informations de livraison */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations de livraison</Text>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Livraison à Ouagadougou</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Délai: 2-5 jours ouvrables</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Garantie fabricant incluse</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Footer avec actions */}
      <View style={styles.footer}>
        {/* Sélecteur de quantité */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantité</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecreaseQuantity}
              disabled={quantity <= 1}
            >
              <Ionicons name="remove" size={20} color={Colors.primary} />
            </TouchableOpacity>

            <Text style={styles.quantityValue}>{quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncreaseQuantity}
              disabled={quantity >= availableStock}
            >
              <Ionicons name="add" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bouton ajouter au panier */}
        <Button
          title={canAddToCart ? 'Ajouter au panier' : 'Stock insuffisant'}
          onPress={handleAddToCart}
          disabled={!canAddToCart}
          style={styles.addButton}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: width,
    backgroundColor: Colors.light,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.white,
    width: 24,
  },
  stockBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  thumbnailsContainer: {
    backgroundColor: Colors.white,
  },
  thumbnails: {
    padding: 16,
    gap: 8,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: Colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    backgroundColor: Colors.white,
    padding: 16,
    marginTop: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  cartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  cartBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  specificationsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  specLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quantityContainer: {
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 24,
    minWidth: 32,
    textAlign: 'center',
  },
  addButton: {
    width: '100%',
  },
});