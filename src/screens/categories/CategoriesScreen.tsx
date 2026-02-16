// src/screens/categories/CategoriesScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-expect-error - Expo vector icons types issue
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

type CategoriesScreenNavigationProp = NativeStackNavigationProp<CategoriesStackParamList>;

export default function CategoriesScreen() {
  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: categories = [], isLoading } = useCategories();

  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (category: Category) => {
    // @ts-ignore
    navigation.navigate('CategoryProducts', { category });
  };

  return (
    <View style={styles.container}>
      {/* Header avec gradient */}
      <LinearGradient
        colors={[Colors.secondary, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Catégories</Text>
        <Text style={styles.headerSubtitle}>
          Explorez nos produits solaires
        </Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une catégorie..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textSecondary}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={Colors.gray}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>

      {/* Categories List */}
      {isLoading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          keyExtractor={(item) => `skeleton-${item}`}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={() => (
            <View style={styles.categoryItem}>
              <CategoryCardSkeleton />
            </View>
          )}
        />
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          icon="grid-outline"
          title="Aucune catégorie"
          message={
            searchQuery
              ? 'Aucune catégorie ne correspond à votre recherche'
              : 'Aucune catégorie disponible'
          }
        />
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginTop: 4,
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
  list: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 120,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    marginBottom: 16,
  },
});