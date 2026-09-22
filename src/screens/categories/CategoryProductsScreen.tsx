// src/screens/categories/CategoryProductsScreen.tsx

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import { useProducts } from '../../hooks/useProducts';
import { Category, Product } from '../../types';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';

type RouteParams = { CategoryProducts: { category: Category } };
type SortMode = 'name' | 'price-asc' | 'price-desc';

export default function CategoryProductsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'CategoryProducts'>>();
  const navigation = useNavigation<any>();
  const { category } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortMode>('name');

  const { data: products = [], isLoading, refetch } = useProducts({ categoryId: category.slug });

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return [...products]
      .filter((product: Product) => !query || `${product.name} ${product.shortDescription || ''} ${product.description || ''}`.toLowerCase().includes(query))
      .sort((a: Product, b: Product) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return a.name.localeCompare(b.name);
      });
  }, [products, searchQuery, sortBy]);

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? [] : filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={refetch}
        ListHeaderComponent={
          <>
            <View style={styles.introCard}>
              <Text style={styles.eyebrow}>CATÉGORIE</Text>
              <Text style={styles.title}>{category.name}</Text>
              {!!category.description && <Text style={styles.subtitle}>{category.description}</Text>}
            </View>

            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher dans cette catégorie..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={Colors.textSecondary}
              />
              {!!searchQuery && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={Colors.gray} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.toolbar}>
              <Text style={styles.resultCount}>{filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}</Text>
              <View style={styles.sortRow}>
                <SortButton label="Nom" active={sortBy === 'name'} onPress={() => setSortBy('name')} />
                <SortButton label="Prix ↑" active={sortBy === 'price-asc'} onPress={() => setSortBy('price-asc')} />
                <SortButton label="Prix ↓" active={sortBy === 'price-desc'} onPress={() => setSortBy('price-desc')} />
              </View>
            </View>

            {isLoading && (
              <View style={styles.skeletonGrid}>
                {[1, 2, 3, 4, 5, 6].map((item) => <ProductCardSkeleton key={item} />)}
              </View>
            )}
          </>
        }
        ListEmptyComponent={!isLoading ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><Ionicons name="cube-outline" size={38} color={Colors.primary} /></View>
            <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
            <Text style={styles.emptyText}>{searchQuery ? 'Essayez une autre recherche.' : 'Cette catégorie ne contient pas encore de produits.'}</Text>
          </View>
        ) : null}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { product: item })} />
        )}
      />
    </View>
  );
}

function SortButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.sortButton, active && styles.sortButtonActive]} onPress={onPress}>
      <Text style={[styles.sortText, active && styles.sortTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  list: { paddingBottom: 120 },
  introCard: { margin: Spacing.lg, marginBottom: 12, borderRadius: Radius.lg, backgroundColor: '#0A365D', padding: Spacing.xl },
  eyebrow: { color: '#BDD3E4', fontSize: 11, fontWeight: '900', letterSpacing: 0.9 },
  title: { color: Colors.white, fontSize: Typography.h1, fontWeight: '900', marginTop: 5 },
  subtitle: { color: '#E1EBF2', marginTop: 8, lineHeight: 20 },
  searchBox: { marginHorizontal: Spacing.lg, minHeight: 50, backgroundColor: Colors.white, borderRadius: Radius.lg, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', ...Shadow.card },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: Colors.text, paddingVertical: 13 },
  toolbar: { paddingHorizontal: Spacing.lg, marginTop: 18, marginBottom: 16 },
  resultCount: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 10 },
  sortRow: { flexDirection: 'row' },
  sortButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: Colors.white, marginRight: 8, borderWidth: 1, borderColor: '#E1E6EB' },
  sortButtonActive: { backgroundColor: '#FFF3EC', borderColor: '#FFD4BD' },
  sortText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '800' },
  sortTextActive: { color: Colors.primary },
  row: { justifyContent: 'space-between', paddingHorizontal: Spacing.lg },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: Spacing.lg },
  emptyState: { alignItems: 'center', paddingHorizontal: 36, paddingTop: 50 },
  emptyIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: Typography.h3, fontWeight: '900', color: Colors.text, marginTop: 16 },
  emptyText: { color: Colors.textSecondary, textAlign: 'center', marginTop: 7, lineHeight: 20 },
});
