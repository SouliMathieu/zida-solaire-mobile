// src/navigation/OrdersStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import { Colors } from '../constants/colors';
import { Order } from '../types';

export type OrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetail: { order: Order };
};

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export default function OrdersStackNavigator() {
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
        name="OrdersMain"
        component={OrdersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          title: 'Détails de la commande',
          headerBackTitle: 'Retour',
        }}
      />
    </Stack.Navigator>
  );
}
