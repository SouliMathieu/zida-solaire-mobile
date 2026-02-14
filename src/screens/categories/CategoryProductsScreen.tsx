// src/screens/categories/CategoryProductsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import { useProducts } from '../../hooks/useProducts';
import { Category, Product } from '../../types';

type CategoryProductsRouteProp = {
  CategoryProducts: {
    category: Category;
  };
};

export default function CategoryProductsScreen() {
  const route = useRoute<RouteProp<CategoryProductsRouteProp, 'CategoryProducts'>>();
  const navigation = useNavigation();
  const { category } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  const {
    data: products = [],
    isLoading,
    refetch,
  } = useProducts({ categoryId: category.slug });

  // Filtrer et trier les produits
  const filteredProducts = products
    .filter((product: Product) => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const handleProductPress = (product: Product) => {
    // @ts-ignore
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans cette catégorie..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
            onPress={() => setSortBy('name')}
          >
            <Ionicons
              name="text-outline"
              size={16}
              color={sortBy === 'name' ? Colors.white : Colors.text}
            />
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'name' && styles.sortButtonTextActive,
              ]}
            >
              Nom
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'price-asc' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('price-asc')}
          >
            <Ionicons
              name="arrow-up"
              size={16}
              color={sortBy === 'price-asc' ? Colors.white : Colors.text}
            />
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'price-asc' && styles.sortButtonTextActive,
              ]}
            >
              Prix
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'price-desc' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('price-desc')}
          >
            <Ionicons
              name="arrow-down"
              size={16}
              color={sortBy === 'price-desc' ? Colors.white : Colors.text}
            />
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'price-desc' && styles.sortButtonTextActive,
              ]}
            >
              Prix
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
      {isLoading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          keyExtractor={(item) => `skeleton-${item}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={() => <ProductCardSkeleton />}
        />
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={80} color={Colors.light} />
          <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'Essayez une autre recherche'
              : 'Cette catégorie ne contient pas encore de produits'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => handleProductPress(item)} />
          )}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchSection: {
    backgroundColor: Colors.white,
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
    gap: 4,
  },
  sortButtonActive: {
    backgroundColor: Colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  sortButtonTextActive: {
    color: Colors.white,
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
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
  },
});