// src/screens/profile/ProfileScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';
import { ProfileStackParamList } from '../../navigation/ProfileStackNavigator';

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, isAuthenticated, logout } = useUserStore();

  // Si l'utilisateur n'est pas connecté
  if (!isAuthenticated()) {
    return (
      <View style={styles.notAuthContainer}>
        <LinearGradient
          colors={[Colors.primary, Colors.accent]}
          style={styles.notAuthIconContainer}
        >
          <Ionicons name="person-circle-outline" size={80} color={Colors.white} />
        </LinearGradient>
        <Text style={styles.notAuthTitle}>Connectez-vous</Text>
        <Text style={styles.notAuthText}>
          Créez un compte pour profiter de toutes les fonctionnalités
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButtonGradient}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.8}
        >
          <Text style={styles.registerButtonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Menu items avec couleurs variées
  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Mes informations',
      subtitle: 'Modifier mes données personnelles',
      color: Colors.secondary,
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'document-text-outline',
      title: 'Demander un devis',
      subtitle: 'Obtenez un devis gratuit et personnalisé',
      color: Colors.accent,
      onPress: () => navigation.navigate('Devis'),
    },
    {
      icon: 'construct-outline',
      title: "Demande d'installation",
      subtitle: 'Faites installer votre système solaire',
      color: Colors.purple,
      onPress: () => navigation.navigate('InstallationRequest'),
    },
    {
      icon: 'mail-outline',
      title: 'Nous contacter',
      subtitle: 'Posez-nous vos questions',
      color: Colors.teal,
      onPress: () => navigation.navigate('Contact'),
    },
    {
      icon: 'information-circle-outline',
      title: 'À propos',
      subtitle: 'En savoir plus sur ZIDA SOLAIRE',
      color: Colors.info,
      onPress: () => navigation.navigate('About'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <LinearGradient
        colors={[Colors.secondary, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={Colors.white} />
        </View>
        <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
        <Text style={styles.userEmail}>{user?.email || user?.phone || 'Compte utilisateur'}</Text>
      </LinearGradient>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
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
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={logout}
        activeOpacity={0.7}
      >
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
  notAuthIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 48,
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
    opacity: 0.9,
  },
  menuContainer: {
    backgroundColor: Colors.white,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 13,
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
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 140,
  },
});