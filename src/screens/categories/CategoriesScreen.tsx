// src/screens/categories/CategoriesScreen.tsx

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import CategoryCard from '../../components/product/CategoryCard';
import CategoryCardSkeleton from '../../components/product/CategoryCardSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { useCategories } from '../../hooks/useProducts';
import { CategoriesStackParamList } from '../../navigation/CategoriesStackNavigator';
import { Category } from '../../types';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';

type Nav = NativeStackNavigationProp<CategoriesStackParamList>;

export default function CategoriesScreen() {
  const navigation = useNavigation<Nav>();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: categories = [], isLoading, refetch } = useCategories();

  const filteredCategories = useMemo(
    () => categories.filter((category: Category) =>
      `${category.name} ${category.description || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [categories, searchQuery]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? [] : filteredCategories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={refetch}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>SOLUTIONS ZIDA</Text>
              <Text style={styles.title}>Trouvez l’équipement adapté à votre projet</Text>
              <Text style={styles.subtitle}>Panneaux, batteries, onduleurs, pompage et équipements électriques réunis dans un seul catalogue.</Text>
            </View>

            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une solution..."
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

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Catégories</Text>
                <Text style={styles.sectionSubtitle}>{filteredCategories.length} solution{filteredCategories.length > 1 ? 's' : ''} disponible{filteredCategories.length > 1 ? 's' : ''}</Text>
              </View>
            </View>

            {isLoading && (
              <View style={styles.skeletonGrid}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <View style={styles.categoryItem} key={item}><CategoryCardSkeleton /></View>
                ))}
              </View>
            )}
          </>
        }
        ListEmptyComponent={!isLoading ? (
          <EmptyState icon="grid-outline" title="Aucune solution" message={searchQuery ? 'Aucune catégorie ne correspond à votre recherche.' : 'Aucune catégorie disponible pour le moment.'} />
        ) : null}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <CategoryCard category={item} onPress={() => navigation.navigate('CategoryProducts', { category: item })} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  list: { paddingBottom: 120 },
  hero: { backgroundColor: '#0A365D', paddingHorizontal: Spacing.lg, paddingTop: 28, paddingBottom: 54, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  eyebrow: { color: '#BCD3E5', fontSize: 12, fontWeight: '900', letterSpacing: 0.9 },
  title: { color: Colors.white, fontSize: Typography.h1, lineHeight: 31, fontWeight: '900', marginTop: 7, maxWidth: '94%' },
  subtitle: { color: '#E3EDF4', lineHeight: 21, marginTop: 9, maxWidth: '94%' },
  searchBox: { marginHorizontal: Spacing.lg, marginTop: -26, minHeight: 52, backgroundColor: Colors.white, borderRadius: Radius.lg, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', ...Shadow.floating },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: Colors.text, paddingVertical: 14 },
  sectionHeader: { paddingHorizontal: Spacing.lg, marginTop: 28, marginBottom: 16 },
  sectionTitle: { fontSize: Typography.h2, fontWeight: '900', color: Colors.text },
  sectionSubtitle: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  row: { justifyContent: 'space-between', paddingHorizontal: Spacing.lg },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: Spacing.lg },
  categoryItem: { width: '48%', marginBottom: 16 },
});
