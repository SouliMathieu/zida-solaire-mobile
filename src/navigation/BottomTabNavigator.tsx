import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

import HomeStackNavigator from './HomeStackNavigator';
import CategoriesStackNavigator from './CategoriesStackNavigator';
import EnergyStackNavigator from './EnergyStackNavigator';
import SupportStackNavigator from './SupportStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const baseHeight = 54;
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 18 : 10);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#7A8794',
        tabBarStyle: {
          height: baseHeight + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          elevation: 14,
          shadowColor: '#0B2545',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.09,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginBottom: Platform.OS === 'ios' ? 0 : 3,
        },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeStackNavigator}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Solutions"
        component={CategoriesStackNavigator}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Mon énergie"
        component={EnergyStackNavigator}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="sunny-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Assistance"
        component={SupportStackNavigator}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="headset-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Compte"
        component={ProfileStackNavigator}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
