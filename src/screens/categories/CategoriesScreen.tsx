import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../constants/colors';
import HeaderActions from '../../components/common/HeaderActions';
import CategoryCard from '../../components/product/CategoryCard';
import CategoryCardSkeleton from '../../components/product/CategoryCardSkeleton';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import EmptyState from '../../components/common/EmptyState';

import { useCategories } from '../../hooks/useProducts';
import { useProducts } from '../../hooks/useProducts';

import { CategoriesStackParamList } from '../../navigation/CategoriesStackNavigator';
import { Product } from '../../types';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';

type Nav = NativeStackNavigationProp<CategoriesStackParamList>;

export default function CategoriesScreen() {
  const navigation = useNavigation<Nav>();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useCategories();

  const {
    data: products = [],
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useProducts({
    search: searchQuery.trim(),
  });

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([
        refetchCategories(),
        refetchProducts(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList<Product>
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        keyboardShouldPersistTaps="handled"

        ListHeaderComponent={
          <>
            {/* =====================================================
                HERO BOUTIQUE
               ===================================================== */}

            <ImageBackground
              source={require('../../../assets/images/store_hero_image.jpeg')}
              style={styles.hero}
              imageStyle={styles.heroImage}
            >
              <View style={styles.heroOverlay} />

              <View style={styles.heroActions}>
                <HeaderActions
                  overlay
                  onNotifications={() =>
                    (navigation.getParent() as any)?.navigate(
                      'Profil',
                      { screen: 'Notifications' }
                    )
                  }
                  onCart={() =>
                    (navigation.getParent() as any)?.navigate(
                      'Profil',
                      { screen: 'CartArea' }
                    )
                  }
                />
              </View>

              <View style={styles.heroContent}>
                <Text style={styles.eyebrow}>
                  BOUTIQUE ZIDA
                </Text>

                <Text style={styles.heroTitle}>
                  Découvrez nos équipements
                </Text>

                <Text style={styles.heroSubtitle}>
                  Panneaux, batteries, kits solaires et équipements pour vos besoins.
                </Text>
              </View>
            </ImageBackground>

            {/* =====================================================
                RECHERCHE
               ===================================================== */}

            <View style={styles.searchBox}>
              <Ionicons
                name="search"
                size={23}
                color={Colors.textSecondary}
              />

              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un produit..."
                placeholderTextColor={Colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />

              {!!searchQuery && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSearchQuery('')}
                  accessibilityRole="button"
                  accessibilityLabel="Effacer la recherche"
                >
                  <Ionicons
                    name="close-circle"
                    size={21}
                    color={Colors.gray}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* =====================================================
                CATÉGORIES
               ===================================================== */}

            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeadingCopy}>
                <Text style={styles.sectionTitle}>
                  Catégories
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Choisissez une catégorie
                </Text>
              </View>
            </View>

            {categoriesLoading ? (
              <FlatList
                data={[1, 2, 3, 4]}
                horizontal
                keyExtractor={(item) => `category-skeleton-${item}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                ItemSeparatorComponent={() => (
                  <View style={styles.categorySeparator} />
                )}
                renderItem={() => (
                  <CategoryCardSkeleton width={210} />
                )}
              />
            ) : categories.length > 0 ? (
              <FlatList
                data={categories}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                ItemSeparatorComponent={() => (
                  <View style={styles.categorySeparator} />
                )}
                renderItem={({ item }) => (
                  <CategoryCard
                    category={item}
                    onPress={() =>
                      navigation.navigate(
                        'CategoryProducts',
                        { category: item },
                      )
                    }
                  />
                )}
              />
            ) : (
              <EmptyState
                icon="grid-outline"
                title="Aucune catégorie"
                message="Aucune catégorie disponible pour le moment."
              />
            )}

            {/* =====================================================
                PRODUITS
               ===================================================== */}

            <View style={styles.productsHeader}>
              <View style={styles.sectionHeadingCopy}>
                <Text style={styles.sectionTitle}>
                  Nos produits
                </Text>

                <Text style={styles.sectionSubtitle}>
                  {productsLoading
                    ? 'Chargement des produits...'
                    : `${products.length} produit${products.length > 1 ? 's' : ''} disponible${products.length > 1 ? 's' : ''}`}
                </Text>
              </View>
            </View>
          </>
        }

        ListEmptyComponent={
          productsLoading ? (
            <View style={styles.skeletonGrid}>
              {[1, 2, 3, 4].map((item) => (
                <ProductCardSkeleton key={`product-skeleton-${item}`} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyProducts}>
              <EmptyState
                icon="cube-outline"
                title="Aucun produit trouvé"
                message={
                  searchQuery.trim()
                    ? 'Aucun produit ne correspond à votre recherche.'
                    : 'Aucun produit disponible pour le moment.'
                }
              />
            </View>
          )
        }

        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate('ProductDetail', {
                product: item,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },

  list: {
    paddingBottom: 120,
  },

  /* =========================================================
     HERO
     ========================================================= */

  hero: {
    minHeight: 235,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  heroImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 45, 76, 0.58)',
  },

  heroActions: {
    position: 'absolute',
    top: 18,
    right: 12,
    zIndex: 3,
  },

  heroContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 78,
    paddingBottom: 58,
  },

  eyebrow: {
    color: '#D5E5F0',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroTitle: {
    color: Colors.white,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
    marginTop: 10,
  },

  heroSubtitle: {
    color: '#E5EFF5',
    fontSize: 19,
    lineHeight: 27,
    fontWeight: '500',
    marginTop: 6,
    maxWidth: '92%',
  },

  /* =========================================================
     RECHERCHE
     ========================================================= */

  searchBox: {
    marginHorizontal: Spacing.lg,
    marginTop: -27,
    minHeight: 56,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.floating,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 15,
  },

  /* =========================================================
     SECTIONS
     ========================================================= */

  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    marginTop: 28,
    marginBottom: 13,
  },

  productsHeader: {
    paddingHorizontal: Spacing.lg,
    marginTop: 30,
    marginBottom: 16,
  },

  sectionHeadingCopy: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: Typography.h2,
    lineHeight: 31,
    fontWeight: '900',
    color: Colors.text,
  },

  sectionSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },

  /* =========================================================
     CATÉGORIES HORIZONTALES
     ========================================================= */

  horizontalList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 4,
  },

  categorySeparator: {
    width: 12,
  },

  /* =========================================================
     PRODUITS
     ========================================================= */

  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },

  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },

  emptyProducts: {
    paddingHorizontal: Spacing.lg,
  },
});
