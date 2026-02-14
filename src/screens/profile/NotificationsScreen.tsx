// src/screens/profile/NotificationsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: string;
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'orders',
      title: 'Commandes',
      description: 'Notifications sur l\'état de vos commandes',
      enabled: true,
      icon: 'bag-outline',
    },
    {
      id: 'promotions',
      title: 'Promotions',
      description: 'Offres spéciales et réductions',
      enabled: true,
      icon: 'pricetag-outline',
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      description: 'Actualités et nouveaux produits',
      enabled: false,
      icon: 'mail-outline',
    },
    {
      id: 'tips',
      title: 'Conseils solaires',
      description: 'Astuces et guides d\'utilisation',
      enabled: true,
      icon: 'bulb-outline',
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting =>
      setting.id === id
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            Gérez vos préférences de notifications pour rester informé des événements importants.
          </Text>
        </View>

        <View style={styles.settingsList}>
          {settings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons
                  name={setting.icon as any}
                  size={24}
                  color={setting.enabled ? Colors.primary : Colors.gray}
                />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: Colors.light, true: `${Colors.primary}50` }}
                thumbColor={setting.enabled ? Colors.primary : Colors.gray}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres système</Text>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionText}>
              Pour activer ou désactiver complètement les notifications push, rendez-vous dans les paramètres de votre appareil.
            </Text>
            <TouchableOpacity style={styles.systemButton}>
              <Ionicons name="settings-outline" size={20} color={Colors.primary} />
              <Text style={styles.systemButtonText}>Ouvrir les paramètres système</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  settingsList: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
    gap: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  systemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
  },
  systemButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});