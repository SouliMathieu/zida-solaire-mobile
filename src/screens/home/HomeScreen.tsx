// src/screens/home/HomeScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import ProductCard from '../../components/product/ProductCard';
import CategoryCard from '../../components/product/CategoryCard';
import StatsCard from '../../components/home/StatsCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import CategoryCardSkeleton from '../../components/product/CategoryCardSkeleton';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import FadeInView from '../../components/common/FadeInView';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import { Product, Category } from '../../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: products = [],
    isLoading: productsLoading,
    refetch: refetchProducts,
    error: productsError,
  } = useProducts({ search: searchQuery });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchProducts();
    } finally {
      setTimeout(() => setRefreshing(false), 300);
    }
  };

  const handleProductPress = (product: Product) => {
    // @ts-ignore
    navigation.navigate('ProductDetail', { product });
  };

  const handleSeeAllCategories = () => {
    // @ts-ignore
    navigation.getParent()?.navigate('Catégories');
  };

  const handleCategoryPress = (category: Category) => {
    // @ts-ignore
    navigation.navigate('CategoryProducts', { category });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
        />
      }
    >
      {/* Header Section */}
      <LinearGradient
        colors={[Colors.secondary, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.welcomeText}>Bienvenue chez</Text>
        <Text style={styles.brandText}>ZIDA SOLAIRE</Text>
        <Text style={styles.tagline}>
          Votre partenaire en énergie solaire au Burkina Faso
        </Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textSecondary}
        />
      </View>

      {/* Stats Cards */}
      <FadeInView delay={100}>
        <View style={styles.statsSection}>
          <StatsCard
            icon="cube-outline"
            title="Produits disponibles"
            value={products.length.toString()}
            color={Colors.secondary}
          />
          <StatsCard
            icon="rocket-outline"
            title="Livraison rapide"
            value="24-48h"
            color={Colors.accent}
          />
        </View>
      </FadeInView>

      {/* Categories Section */}
      <FadeInView delay={200}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Catégories</Text>
            <TouchableOpacity onPress={handleSeeAllCategories} activeOpacity={0.7}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {categoriesError ? (
            <ErrorMessage
              message="Impossible de charger les catégories"
              onRetry={() => {}}
            />
          ) : categoriesLoading ? (
            <FlatList
              data={[1, 2, 3, 4]}
              keyExtractor={(item) => `cat-skeleton-${item}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
              renderItem={() => (
                <View style={styles.categoryItem}>
                  <CategoryCardSkeleton />
                </View>
              )}
            />
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
              renderItem={({ item }) => (
                <View style={styles.categoryItem}>
                  <CategoryCard 
                    category={item} 
                    onPress={() => handleCategoryPress(item)} 
                  />
                </View>
              )}
            />
          )}
        </View>
      </FadeInView>

      {/* Featured Products */}
      <FadeInView delay={300}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produits populaires</Text>
            <TouchableOpacity onPress={handleSeeAllCategories} activeOpacity={0.7}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {productsError ? (
            <ErrorMessage
              message="Impossible de charger les produits"
              onRetry={refetchProducts}
            />
          ) : productsLoading ? (
            <View style={styles.productsGrid}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <ProductCardSkeleton key={`prod-skeleton-${item}`} />
              ))}
            </View>
          ) : products.length === 0 ? (
            <EmptyState
              icon="cube-outline"
              title="Aucun produit"
              message={
                searchQuery
                  ? 'Aucun produit ne correspond à votre recherche'
                  : 'Aucun produit disponible pour le moment'
              }
            />
          ) : (
            <View style={styles.productsGrid}>
              {products.slice(0, 6).map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => handleProductPress(product)}
                />
              ))}
            </View>
          )}
        </View>
      </FadeInView>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 4,
  },
  tagline: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: -20,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  statsSection: {
    padding: 16,
    paddingTop: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    marginRight: 12,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  bottomSpacing: {
    height: 140,
  },
});