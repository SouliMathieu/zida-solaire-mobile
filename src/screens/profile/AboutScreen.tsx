// src/screens/profile/AboutScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Logo et nom */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="sunny" size={80} color={Colors.primary} />
        </View>
        <Text style={styles.appName}>ZIDA SOLAIRE</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      {/* À propos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos</Text>
        <Text style={styles.description}>
          ZIDA SOLAIRE est votre partenaire de confiance pour l'énergie solaire au Burkina Faso.
          Nous proposons une large gamme de produits solaires de qualité pour les particuliers et
          les professionnels.
        </Text>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => openLink('tel:+22670000000')}
        >
          <Ionicons name="call-outline" size={24} color={Colors.primary} />
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Téléphone</Text>
            <Text style={styles.contactValue}>+226 70 00 00 00</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => openLink('mailto:contact@zidasolaire.bf')}
        >
          <Ionicons name="mail-outline" size={24} color={Colors.primary} />
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>contact@zidasolaire.bf</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => openLink('https://site-de-l-entreprise-zida-solaire-au-burkina.vercel.app')}
        >
          <Ionicons name="globe-outline" size={24} color={Colors.primary} />
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Site web</Text>
            <Text style={styles.contactValue}>www.zidasolaire.bf</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.contactItem}>
          <Ionicons name="location-outline" size={24} color={Colors.primary} />
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Adresse</Text>
            <Text style={styles.contactValue}>
              Ouagadougou, Burkina Faso
            </Text>
          </View>
        </View>
      </View>

      {/* Réseaux sociaux */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suivez-nous</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink('https://facebook.com/zidasolaire')}
          >
            <Ionicons name="logo-facebook" size={28} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink('https://twitter.com/zidasolaire')}
          >
            <Ionicons name="logo-twitter" size={28} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink('https://instagram.com/zidasolaire')}
          >
            <Ionicons name="logo-instagram" size={28} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink('https://wa.me/22670000000')}
          >
            <Ionicons name="logo-whatsapp" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Légal */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.legalLink}>
          <Text style={styles.legalText}>Conditions d'utilisation</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.legalLink}>
          <Text style={styles.legalText}>Politique de confidentialité</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Copyright */}
      <View style={styles.footer}>
        <Text style={styles.copyright}>
          © 2026 ZIDA SOLAIRE. Tous droits réservés.
        </Text>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.white,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  contactContent: {
    flex: 1,
    marginLeft: 16,
  },
  contactLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: Colors.text,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  legalText: {
    fontSize: 16,
    color: Colors.text,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 80,
  },
});
