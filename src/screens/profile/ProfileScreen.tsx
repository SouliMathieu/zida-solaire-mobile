// src/screens/profile/ProfileScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';
import { ProfileStackParamList } from '../../navigation/ProfileStackNavigator';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileMain'
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, isAuthenticated, logout } = useUserStore();

  // Si l'utilisateur n'est pas connecté
  if (!isAuthenticated()) {
    return (
      <View style={styles.notAuthContainer}>
        <Ionicons name="person-circle-outline" size={100} color={Colors.light} />
        <Text style={styles.notAuthTitle}>Connectez-vous</Text>
        <Text style={styles.notAuthText}>
          Créez un compte pour profiter de toutes les fonctionnalités
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Menu items
  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Mes informations',
      subtitle: 'Modifier mes données personnelles',
      onPress: () => {},
    },
    {
      icon: 'location-outline',
      title: 'Adresses',
      subtitle: 'Gérer mes adresses de livraison',
      onPress: () => {},
    },
    {
      icon: 'card-outline',
      title: 'Moyens de paiement',
      subtitle: 'Gérer mes modes de paiement',
      onPress: () => {},
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Paramètres de notifications',
      onPress: () => {},
    },
    {
      icon: 'help-circle-outline',
      title: 'Aide & Support',
      subtitle: "Besoin d'aide ?",
      onPress: () => {},
    },
    {
      icon: 'information-circle-outline',
      title: 'À propos',
      subtitle: 'En savoir plus sur ZIDA SOLAIRE',
      onPress: () => navigation.navigate('About'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={Colors.white} />
        </View>
        <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={24} color={Colors.error} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.background,
  },
  notAuthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
  },
  notAuthText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  menuContainer: {
    backgroundColor: Colors.white,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 80,
  },
});
