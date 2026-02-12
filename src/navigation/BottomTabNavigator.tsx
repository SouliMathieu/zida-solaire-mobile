// src/navigation/BottomTabNavigator.tsx

import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useCartStore } from '../store/cartStore';

import HomeStackNavigator from './HomeStackNavigator';
import CategoriesStackNavigator from './CategoriesStackNavigator';
import CartStackNavigator from './CartStackNavigator';
import OrdersStackNavigator from './OrdersStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator();

// Composant Badge personnalisé
function CartIconWithBadge({ color, size }: { color: string; size: number }) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <View style={styles.iconContainer}>
      <Ionicons name="cart" size={size} color={color} />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalItems > 99 ? '99+' : totalItems}
          </Text>
        </View>
      )}
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
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: Colors.light,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
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
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
