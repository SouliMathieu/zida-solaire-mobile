import React from 'react';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import ProductDetailScreen from './ProductDetailScreen';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

export default function ProductDetailWrapper() {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation();
  const { product } = route.params;

  return <ProductDetailScreen />;
}