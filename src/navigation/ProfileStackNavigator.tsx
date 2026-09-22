// src/navigation/ProfileStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import LoginScreen from '../screens/profile/LoginScreen';
import RegisterScreen from '../screens/profile/RegisterScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import ContactScreen from '../screens/profile/ContactScreen';
import DevisScreen from '../screens/profile/DevisScreen';
import InstallationRequestScreen from '../screens/profile/InstallationRequestScreen';
import RepairRequestScreen from '../screens/profile/RepairRequestScreen';
import { Colors } from '../constants/colors';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Login: undefined;
  Register: undefined;
  EditProfile: undefined;
  About: undefined;
  Contact: undefined;
  Devis: undefined;
  InstallationRequest: undefined;
  RepairRequest: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: '800',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Connexion' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Inscription' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Modifier le profil' }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'À propos' }}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: 'Contact' }}
      />
      <Stack.Screen
        name="Devis"
        component={DevisScreen}
        options={{ title: 'Demande de devis' }}
      />
      <Stack.Screen
        name="InstallationRequest"
        component={InstallationRequestScreen}
        options={{ title: "Demande d'installation" }}
      />
      <Stack.Screen
        name="RepairRequest"
        component={RepairRequestScreen}
        options={{ title: 'Assistance / SAV' }}
      />
    </Stack.Navigator>
  );
}
