// src/screens/product/ProductDetailWrapper.tsx

import React from 'react';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import ProductDetailScreen from './ProductDetailScreen';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

export default function ProductDetailWrapper() {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation();
  const { product } = route.params;

  return (
    <ProductDetailScreen
      product={product}
      onBack={() => navigation.goBack()}
    />
  );
}
