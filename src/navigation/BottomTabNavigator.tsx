// src/navigation/BottomTabNavigator.tsx

import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import CartBadge from '../components/common/CartBadge';
import { useCartStore } from '../store/cartStore';

import HomeStackNavigator from './HomeStackNavigator';
import CategoriesStackNavigator from './CategoriesStackNavigator';
import CartStackNavigator from './CartStackNavigator';
import OrdersStackNavigator from './OrdersStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator();

function CartIconWithBadge({ color, size }: { color: string; size: number }) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <View style={styles.iconContainer}>
      <Ionicons name="cart" size={size} color={color} />
      <CartBadge count={totalItems} />
    </View>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 75, // Augmenté
          paddingBottom: Platform.OS === 'ios' ? 30 : 15, // Augmenté
          paddingTop: 10,
          backgroundColor: Colors.white,
          borderTopWidth: 0, // Supprimé la bordure
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Catégories"
        component={CategoriesStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Panier"
        component={CartStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <CartIconWithBadge color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Commandes"
        component={OrdersStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 28,
    height: 28,
    position: 'relative',
  },
});