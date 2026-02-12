// src/navigation/CartStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import { Colors } from '../constants/colors';

export type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
};

const Stack = createNativeStackNavigator<CartStackParamList>();

export default function CartStackNavigator() {
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
        name="CartMain"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: 'Finaliser la commande',
          headerBackTitle: 'Retour',
        }}
      />
    </Stack.Navigator>
  );
}
