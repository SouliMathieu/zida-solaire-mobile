// src/screens/profile/PaymentMethodsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';

interface PaymentMethod {
  id: string;
  type: 'orange' | 'moov' | 'wave' | 'card';
  name: string;
  details: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const navigation = useNavigation();
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'orange',
      name: 'Orange Money',
      details: '+226 70 XX XX XX',
      isDefault: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'orange':
        return { name: 'phone-portrait-outline', color: '#FF6600' };
      case 'moov':
        return { name: 'phone-portrait-outline', color: '#009FE3' };
      case 'wave':
        return { name: 'phone-portrait-outline', color: '#00D9A3' };
      case 'card':
        return { name: 'card-outline', color: Colors.primary };
      default:
        return { name: 'wallet-outline', color: Colors.gray };
    }
  };

  const handleSetDefault = (id: string) => {
    setMethods(methods.map(method => ({
      ...method,
      isDefault: method.id === id,
    })));
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Supprimer le moyen de paiement',
      'Êtes-vous sûr de vouloir supprimer ce moyen de paiement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => setMethods(methods.filter(m => m.id !== id)),
        },
      ]
    );
  };

  const handleAddNew = () => {
    Alert.alert(
      'Ajouter un moyen de paiement',
      'Choisissez un type de paiement',
      [
        { text: 'Orange Money', onPress: () => addPaymentMethod('orange') },
        { text: 'Moov Money', onPress: () => addPaymentMethod('moov') },
        { text: 'Wave', onPress: () => addPaymentMethod('wave') },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const addPaymentMethod = (type: string) => {
    Alert.alert('Fonction à venir', `L'ajout de ${type} sera disponible prochainement`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moyens de paiement</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {methods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={80} color={Colors.gray} />
            <Text style={styles.emptyText}>Aucun moyen de paiement</Text>
            <Text style={styles.emptySubtext}>
              Ajoutez un moyen de paiement pour faciliter vos achats
            </Text>
          </View>
        ) : (
          <View style={styles.methodList}>
            {methods.map((method) => {
              const icon = getIcon(method.type);
              return (
                <View key={method.id} style={styles.methodCard}>
                  <View style={styles.methodHeader}>
                    <View style={styles.methodInfo}>
                      <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
                        <Ionicons name={icon.name as any} size={24} color={icon.color} />
                      </View>
                      <View style={styles.methodDetails}>
                        <View style={styles.methodNameRow}>
                          <Text style={styles.methodName}>{method.name}</Text>
                          {method.isDefault && (
                            <View style={styles.defaultBadge}>
                              <Text style={styles.defaultBadgeText}>Par défaut</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.methodDetailsText}>{method.details}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(method.id)}>
                      <Ionicons name="trash-outline" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>

                  {!method.isDefault && (
                    <TouchableOpacity
                      style={styles.setDefaultButton}
                      onPress={() => handleSetDefault(method.id)}
                    >
                      <Ionicons name="star-outline" size={16} color={Colors.primary} />
                      <Text style={styles.setDefaultText}>Définir par défaut</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            Vos informations de paiement sont sécurisées et ne sont jamais partagées.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <Ionicons name="add" size={24} color={Colors.white} />
        <Text style={styles.addButtonText}>Ajouter un moyen de paiement</Text>
      </TouchableOpacity>
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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  methodList: {
    gap: 12,
  },
  methodCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodDetails: {
    flex: 1,
  },
  methodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  methodDetailsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
    paddingTop: 12,
  },
  setDefaultText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  infoCard: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});