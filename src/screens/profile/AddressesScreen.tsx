// src/screens/profile/AddressesScreen.tsx

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

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesScreen() {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Domicile',
      address: 'Secteur 15, Ouaga 2000',
      city: 'Ouagadougou',
      phone: '+226 70 00 00 00',
      isDefault: true,
    },
  ]);

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Supprimer l\'adresse',
      'Êtes-vous sûr de vouloir supprimer cette adresse ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => setAddresses(addresses.filter(addr => addr.id !== id)),
        },
      ]
    );
  };

  const handleAddNew = () => {
    Alert.alert('Fonction à venir', 'L\'ajout d\'adresse sera disponible prochainement');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes adresses</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={80} color={Colors.gray} />
            <Text style={styles.emptyText}>Aucune adresse enregistrée</Text>
            <Text style={styles.emptySubtext}>
              Ajoutez une adresse pour faciliter vos commandes
            </Text>
          </View>
        ) : (
          <View style={styles.addressList}>
            {addresses.map((address) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <View style={styles.addressNameContainer}>
                    <Text style={styles.addressName}>{address.name}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Par défaut</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(address.id)}>
                    <Ionicons name="trash-outline" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>

                <View style={styles.addressDetails}>
                  <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={16} color={Colors.gray} />
                    <Text style={styles.addressText}>{address.address}</Text>
                  </View>
                  <View style={styles.addressRow}>
                    <Ionicons name="business-outline" size={16} color={Colors.gray} />
                    <Text style={styles.addressText}>{address.city}</Text>
                  </View>
                  <View style={styles.addressRow}>
                    <Ionicons name="call-outline" size={16} color={Colors.gray} />
                    <Text style={styles.addressText}>{address.phone}</Text>
                  </View>
                </View>

                {!address.isDefault && (
                  <TouchableOpacity
                    style={styles.setDefaultButton}
                    onPress={() => handleSetDefault(address.id)}
                  >
                    <Ionicons name="star-outline" size={16} color={Colors.primary} />
                    <Text style={styles.setDefaultText}>Définir par défaut</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <Ionicons name="add" size={24} color={Colors.white} />
        <Text style={styles.addButtonText}>Ajouter une adresse</Text>
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
    flex: 1,
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
  addressList: {
    gap: 12,
  },
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressName: {
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
  addressDetails: {
    gap: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
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