// src/screens/profile/RepairRequestScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';

export default function RepairRequestScreen() {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    installationType: '',
    problemDescription: '',
    urgency: 'normal',
    installedByZida: 'yes',
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.problemDescription) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      // TODO: Appel API pour créer la demande de dépannage
      // const response = await api.post('/api/repair-requests', formData);
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
      
      Alert.alert(
        'Demande envoyée',
        'Votre demande de dépannage a été envoyée avec succès. Nous vous contacterons dans les plus brefs délais.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer la demande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demande de dépannage</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="build-outline" size={32} color={Colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Service de dépannage</Text>
            <Text style={styles.infoText}>
              Notre équipe technique interviendra rapidement pour résoudre vos problèmes d'installation solaire.
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          {/* Nom */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Votre nom complet"
              placeholderTextColor={Colors.gray}
            />
          </View>

          {/* Téléphone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="+226 XX XX XX XX"
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
            />
          </View>

          {/* Adresse */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse de l'installation</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Localisation précise"
              placeholderTextColor={Colors.gray}
            />
          </View>

          {/* Installation par Zida ? */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Installation réalisée par ZIDA SOLAIRE ?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  formData.installedByZida === 'yes' && styles.radioButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, installedByZida: 'yes' })}
              >
                <Text
                  style={[
                    styles.radioText,
                    formData.installedByZida === 'yes' && styles.radioTextActive,
                  ]}
                >
                  Oui
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  formData.installedByZida === 'no' && styles.radioButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, installedByZida: 'no' })}
              >
                <Text
                  style={[
                    styles.radioText,
                    formData.installedByZida === 'no' && styles.radioTextActive,
                  ]}
                >
                  Non
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Type d'installation */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type d'installation</Text>
            <TextInput
              style={styles.input}
              value={formData.installationType}
              onChangeText={(text) => setFormData({ ...formData, installationType: text })}
              placeholder="Ex: Panneaux solaires, Pompe, Éclairage..."
              placeholderTextColor={Colors.gray}
            />
          </View>

          {/* Urgence */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Niveau d'urgence</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.urgencyButton,
                  formData.urgency === 'low' && styles.urgencyButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, urgency: 'low' })}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    formData.urgency === 'low' && styles.urgencyTextActive,
                  ]}
                >
                  Faible
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.urgencyButton,
                  formData.urgency === 'normal' && styles.urgencyButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, urgency: 'normal' })}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    formData.urgency === 'normal' && styles.urgencyTextActive,
                  ]}
                >
                  Normal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.urgencyButton,
                  formData.urgency === 'high' && styles.urgencyButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, urgency: 'high' })}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    formData.urgency === 'high' && styles.urgencyTextActive,
                  ]}
                >
                  Urgent
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description du problème */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description du problème *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.problemDescription}
              onChangeText={(text) => setFormData({ ...formData, problemDescription: text })}
              placeholder="Décrivez le problème rencontré en détail..."
              placeholderTextColor={Colors.gray}
              multiline
              numberOfLines={5}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="send" size={20} color={Colors.white} />
                <Text style={styles.submitButtonText}>Envoyer la demande</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.contactCard}>
          <Ionicons name="call-outline" size={24} color={Colors.primary} />
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Besoin d'une assistance immédiate ?</Text>
            <Text style={styles.contactText}>Appelez-nous au +226 XX XX XX XX</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
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
  },
  infoCard: {
    backgroundColor: `${Colors.primary}10`,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  radioButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  radioText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  radioTextActive: {
    color: Colors.white,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  urgencyButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  urgencyText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  urgencyTextActive: {
    color: Colors.white,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: Colors.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 13,
    color: Colors.primary,
  },
  bottomSpacing: {
    height: 40,
  },
});