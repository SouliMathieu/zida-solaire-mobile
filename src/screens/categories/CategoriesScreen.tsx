// src/screens/categories/CategoriesScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { useCategories } from '../../hooks/useProducts';
import { Category } from '../../types';

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const { data: categories = [], isLoading } = useCategories();

  const handleCategoryPress = (category: Category) => {
    // @ts-ignore
navigation.navigate('CategoryProducts', { category });

  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/200' }}
              style={styles.categoryImage}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.overlay} />
            <View style={styles.categoryContent}>
              <Text style={styles.categoryName} numberOfLines={2}>
                {item.name}
              </Text>
              {item.description && (
                <Text style={styles.categoryDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={20} color={Colors.white} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoryContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    justifyContent: 'flex-end',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.9,
  },
  arrowContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
