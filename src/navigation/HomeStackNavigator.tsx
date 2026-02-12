// src/navigation/HomeStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import ProductDetailWrapper from '../screens/product/ProductDetailWrapper';
import { Product } from '../types';

export type HomeStackParamList = {
  HomeMain: undefined;
  ProductDetail: { product: Product };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailWrapper} />
    </Stack.Navigator>
  );
}
