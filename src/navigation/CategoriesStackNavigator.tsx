// src/navigation/CategoriesStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriesScreen from '../screens/categories/CategoriesScreen';
import CategoryProductsScreen from '../screens/categories/CategoryProductsScreen';
import ProductDetailWrapper from '../screens/product/ProductDetailWrapper';
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
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="CategoriesMain"
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
        options={({ route }) => ({
          title: route.params.category.name,
          headerBackTitle: 'Retour',
        })}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailWrapper}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
