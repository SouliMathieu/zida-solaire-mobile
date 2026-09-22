// src/navigation/HomeStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import CategoryProductsScreen from '../screens/categories/CategoryProductsScreen';
import SolarAssistantScreen from '../screens/energy/SolarAssistantScreen';
import SolarResultScreen from '../screens/energy/SolarResultScreen';
import { Colors } from '../constants/colors';
import { Category, Product } from '../types';
import { SolarAnswers } from '../utils/solarEstimator';

export type HomeStackParamList = {
  HomeMain: undefined;
  SolarAssistant: undefined;
  SolarResult: { answers: SolarAnswers };
  ProductDetail: { product: Product };
  CategoryProducts: { category: Category };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SolarAssistant" component={SolarAssistantScreen} options={{ title: 'Assistant solaire' }} />
      <Stack.Screen name="SolarResult" component={SolarResultScreen} options={{ title: 'Votre solution solaire' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Détails du produit' }} />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
        options={({ route }) => ({ title: route.params.category.name })}
      />
    </Stack.Navigator>
  );
}
