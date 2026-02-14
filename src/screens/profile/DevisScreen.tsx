// src/screens/profile/DevisScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import Button from '../../components/common/Button';

const SYSTEM_TYPES = [
  { id: 'residential', label: 'Installation résidentielle', icon: 'home' },
  { id: 'commercial', label: 'Installation commerciale', icon: 'business' },
  { id: 'industrial', label: 'Installation industrielle', icon: 'construct' },
  { id: 'pumping', label: 'Système de pompage', icon: 'water' },
  { id: 'other', label: 'Autre', icon: 'ellipsis-horizontal' },
];

const BUDGET_RANGES = [
  'Moins de 500 000 FCFA',
  '500 000 - 1 000 000 FCFA',
  '1 000 000 - 2 000 000 FCFA',
  '2 000 000 - 5 000 000 FCFA',
  'Plus de 5 000 000 FCFA',
  'Non défini',
];

export default function DevisScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    systemType: '',
    estimatedBudget: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre numéro de téléphone');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse');
      return false;
    }
    if (!formData.systemType) {
      Alert.alert('Erreur', 'Veuillez sélectionner un type de système');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // TODO: Connecter à l'API /api/devis
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Demande envoyée !',
        'Votre demande de devis a été enregistrée. Notre équipe vous contactera dans les 24h pour établir un devis personnalisé.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                systemType: '',
                estimatedBudget: '',
                message: '',
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="document-text" size={60} color={Colors.primary} />
          <Text style={styles.title}>Demande de devis</Text>
          <Text style={styles.subtitle}>
            Obtenez un devis gratuit et personnalisé pour votre projet solaire
          </Text>
        </View>

        {/* Avantages */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.benefitText}>Devis gratuit sous 24h</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.benefitText}>Étude personnalisée</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.benefitText}>Sans engagement</Text>
          </View>
        </View>

        {/* Formulaire */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Vos informations</Text>

          {/* Nom */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Jean Dupont"
                value={formData.name}
                onChangeText={(text) => updateField('name', text)}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          {/* Téléphone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="+226 70 00 00 00"
                value={formData.phone}
                onChangeText={(text) => updateField('phone', text)}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="exemple@email.com"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          {/* Adresse */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse du projet *</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons
                name="location-outline"
                size={20}
                color={Colors.gray}
                style={styles.textAreaIcon}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ville, quartier, secteur..."
                value={formData.address}
                onChangeText={(text) => updateField('address', text)}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Votre projet</Text>

          {/* Type de système */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type de système *</Text>
            <View style={styles.systemTypeGrid}>
              {SYSTEM_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.systemTypeCard,
                    formData.systemType === type.id && styles.systemTypeCardActive,
                  ]}
                  onPress={() => updateField('systemType', type.id)}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={32}
                    color={
                      formData.systemType === type.id ? Colors.white : Colors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.systemTypeLabel,
                      formData.systemType === type.id && styles.systemTypeLabelActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget estimé */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Budget estimé</Text>
            {BUDGET_RANGES.map((budget, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.budgetOption,
                  formData.estimatedBudget === budget && styles.budgetOptionActive,
                ]}
                onPress={() => updateField('estimatedBudget', budget)}
              >
                <View
                  style={[
                    styles.radio,
                    formData.estimatedBudget === budget && styles.radioActive,
                  ]}
                >
                  {formData.estimatedBudget === budget && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.budgetLabel}>{budget}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Message */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Détails supplémentaires</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons
                name="create-outline"
                size={20}
                color={Colors.gray}
                style={styles.textAreaIcon}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Décrivez votre projet, vos besoins spécifiques..."
                value={formData.message}
                onChangeText={(text) => updateField('message', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <Button
            title={isSubmitting ? 'Envoi...' : 'Demander un devis gratuit'}
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.submitButton}
          />

          <Text style={styles.disclaimer}>
            En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe
            pour discuter de votre projet.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  benefitsSection: {
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    fontWeight: '600',
  },
  formSection: {
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    marginTop: 8,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 16,
    paddingLeft: 12,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 0,
  },
  systemTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  systemTypeCard: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light,
  },
  systemTypeCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  systemTypeLabel: {
    fontSize: 12,
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  systemTypeLabelActive: {
    color: Colors.white,
  },
  budgetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  budgetOptionActive: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: Colors.primary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  budgetLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  submitButton: {
    marginTop: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 32,
  },
});