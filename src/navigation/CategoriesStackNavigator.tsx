// src/navigation/CategoriesStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriesScreen from '../screens/categories/CategoriesScreen';
import CategoryProductsScreen from '../screens/categories/CategoryProductsScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import { Colors } from '../constants/colors';
import { Category, Product } from '../types';

export type CategoriesStackParamList = {
  CategoriesMain: undefined;
  CategoryProducts: { category: Category };
  ProductDetail: { product: Product };
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export default function CategoriesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="CategoriesMain" component={CategoriesScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
        options={({ route }) => ({ title: route.params.category.name, headerBackTitle: 'Retour' })}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Détails du produit', headerBackTitle: 'Retour' }}
      />
    </Stack.Navigator>
  );
}
