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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="sunny" size={60} color={Colors.primary} />
        </View>
        <Text style={styles.appName}>ZIDA SOLAIRE</Text>
        <Text style={styles.tagline}>
          L'énergie solaire pour tous au Burkina Faso, depuis 2005
        </Text>
      </View>

      {/* Notre Histoire */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notre histoire</Text>
        <Text style={styles.paragraph}>
          ZIDA SOLAIRE est née en <Text style={styles.bold}>2005</Text> de la vision de son fondateur{' '}
          <Text style={styles.bold}>Zida Aboubacar</Text>. Face aux coupures d'électricité répétées et au coût élevé de l'énergie, 
          il se fixe une mission claire : <Text style={styles.bold}>apporter des solutions solaires et électriques accessibles, 
          fiables et durables</Text> aux Burkinabè.
        </Text>
        
        <Text style={styles.paragraph}>
          L'entreprise commence par la vente de matériel solaire et quelques installations chez des particuliers à Ouagadougou. 
          Année après année, grâce au bouche-à-oreille et à la qualité du service, ZIDA SOLAIRE se développe et gagne la confiance{' '}
          <Text style={styles.bold}>des particuliers, des entreprises privées et des institutions publiques</Text>.
        </Text>

        <Text style={styles.paragraph}>
          Aujourd'hui, ZIDA SOLAIRE réalise chaque année de nombreuses installations solaires et électriques dans tout le pays, 
          et accompagne ses clients dans des projets <Text style={styles.bold}>classiques, solaires ou hybrides (solaire + réseau)</Text>{' '}
          pour réduire les factures et sécuriser l'alimentation en énergie.
        </Text>

        <Text style={styles.paragraph}>
          L'entreprise a également réalisé des installations à l'international, notamment au{' '}
          <Text style={styles.bold}>Ghana</Text> et au <Text style={styles.bold}>Mali</Text>, preuve de la confiance accordée 
          à son expertise au-delà des frontières du Burkina Faso.
        </Text>
      </View>

      {/* Ce que nous faisons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ce que nous faisons pour vous</Text>
        <Text style={styles.paragraph}>
          ZIDA SOLAIRE est spécialisée dans la <Text style={styles.bold}>vente et l'installation de matériel solaire et électrique</Text>. 
          Chaque année, nous accompagnons des particuliers, des entreprises et des structures publiques :
        </Text>

        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.listText}>Installations solaires complètes pour maisons, boutiques et entreprises</Text>
        </View>

        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.listText}>Installations <Text style={styles.bold}>hybrides</Text> (solaire + réseau)</Text>
        </View>

        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.listText}>Installations électriques classiques</Text>
        </View>

        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.listText}><Text style={styles.bold}>Forages électriques</Text> et pompage solaire</Text>
        </View>

        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.listText}>Vente d'<Text style={styles.bold}>appareils électroménagers</Text> (frigos, congélateurs...)</Text>
        </View>

        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.listText}>Vente d'<Text style={styles.bold}>appareils électroniques</Text> (téléviseurs...)</Text>
        </View>

        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.listText}><Text style={styles.bold}>Livraison de produits</Text> à Ouagadougou et dans tout le Burkina</Text>
        </View>
      </View>

      {/* Nos valeurs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nos valeurs</Text>

        <View style={styles.valueCard}>
          <View style={styles.valueIcon}>
            <Ionicons name="star" size={24} color={Colors.primary} />
          </View>
          <View style={styles.valueContent}>
            <Text style={styles.valueTitle}>Qualité du matériel</Text>
            <Text style={styles.valueText}>
              Matériel de première qualité importé directement de nos partenaires en Chine
            </Text>
          </View>
        </View>

        <View style={styles.valueCard}>
          <View style={styles.valueIcon}>
            <Ionicons name="people" size={24} color={Colors.primary} />
          </View>
          <View style={styles.valueContent}>
            <Text style={styles.valueTitle}>Proximité & service client</Text>
            <Text style={styles.valueText}>
              Nous restons toujours à l'écoute et intervenons rapidement
            </Text>
          </View>
        </View>

        <View style={styles.valueCard}>
          <View style={styles.valueIcon}>
            <Ionicons name="flash" size={24} color={Colors.primary} />
          </View>
          <View style={styles.valueContent}>
            <Text style={styles.valueTitle}>Autonomie énergétique</Text>
            <Text style={styles.valueText}>
              Réduire la dépendance au réseau et le coût des factures
            </Text>
          </View>
        </View>

        <View style={styles.valueCard}>
          <View style={styles.valueIcon}>
            <Ionicons name="bulb" size={24} color={Colors.primary} />
          </View>
          <View style={styles.valueContent}>
            <Text style={styles.valueTitle}>Innovation</Text>
            <Text style={styles.valueText}>
              Forages, électroménager, livraisons... Des services diversifiés
            </Text>
          </View>
        </View>
      </View>

      {/* Repères */}
      <View style={[styles.section, styles.darkSection]}>
        <Text style={[styles.sectionTitle, styles.lightText]}>Quelques repères</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>Depuis 2005</Text>
            <Text style={styles.statLabel}>Plus de 20 ans d'engagement</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2 sites</Text>
            <Text style={styles.statLabel}>CISSIN et SAABA</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3 pays</Text>
            <Text style={styles.statLabel}>Burkina, Ghana, Mali</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Clients fidèles</Text>
          </View>
        </View>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nous contacter</Text>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => openLink('tel:+22625506464')}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="call" size={24} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Téléphone</Text>
            <Text style={styles.contactValue}>+226 25 50 64 64</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => openLink('mailto:contact@zidasolaire.bf')}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="mail" size={24} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>contact@zidasolaire.bf</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => openLink('https://site-de-l-entreprise-zida-solaire-au-burkina.vercel.app')}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="globe" size={24} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Site web</Text>
            <Text style={styles.contactValue}>www.zidasolaire.bf</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>

        <View style={styles.contactCard}>
          <View style={styles.contactIcon}>
            <Ionicons name="location" size={24} color={Colors.primary} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Adresse</Text>
            <Text style={styles.contactValue}>Ouagadougou, Burkina Faso</Text>
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
            onPress={() => openLink('https://wa.me/22625506464')}
          >
            <Ionicons name="logo-whatsapp" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>
          © 2024 ZIDA SOLAIRE. Tous droits réservés.
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
    backgroundColor: Colors.primary,
    padding: 32,
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 16,
  },
  darkSection: {
    backgroundColor: Colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  lightText: {
    color: Colors.white,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  bold: {
    fontWeight: '600',
    color: Colors.text,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
  valueCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 12,
  },
  valueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  valueText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 24,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
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
  footer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginTop: 16,
  },
  version: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 32,
  },
});