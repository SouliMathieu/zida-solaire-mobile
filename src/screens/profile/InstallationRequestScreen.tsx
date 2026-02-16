// src/screens/profile/InstallationRequestScreen.tsx

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
import { LinearGradient } from 'expo-linear-gradient';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import GradientButton from '../../components/common/GradientButton';
import { useSubmitInstallation } from '../../hooks/useForms';

const PROPERTY_TYPES = [
  { id: 'house', label: 'Maison individuelle', icon: 'home' },
  { id: 'apartment', label: 'Appartement', icon: 'business' },
  { id: 'commercial', label: 'Local commercial', icon: 'storefront' },
  { id: 'industrial', label: 'Bâtiment industriel', icon: 'construct' },
];

const ROOF_TYPES = [
  'Tôle ondulée',
  'Dalle en béton',
  'Tuiles',
  'Autre',
  'Je ne sais pas',
];

const MONTHLY_BILLS = [
  'Moins de 20 000 FCFA',
  '20 000 - 50 000 FCFA',
  '50 000 - 100 000 FCFA',
  '100 000 - 200 000 FCFA',
  'Plus de 200 000 FCFA',
];

export default function InstallationRequestScreen() {
  const submitInstallation = useSubmitInstallation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    propertyType: '',
    roofType: '',
    averageMonthlyBill: '',
    notes: '',
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
    if (!formData.propertyType) {
      Alert.alert('Erreur', 'Veuillez sélectionner un type de propriété');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await submitInstallation.mutateAsync({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        address: formData.address,
        propertyType: formData.propertyType,
        roofType: formData.roofType || undefined,
        averageMonthlyBill: formData.averageMonthlyBill || undefined,
        notes: formData.notes || undefined,
      });

      Alert.alert(
        'Demande enregistrée !',
        'Votre demande d\'installation a été enregistrée. Notre équipe technique vous contactera dans les 48h pour planifier une visite sur site.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                propertyType: '',
                roofType: '',
                averageMonthlyBill: '',
                notes: '',
              });
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer."
      );
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
        <LinearGradient
          colors={[Colors.success, Colors.teal]}
          style={styles.header}
        >
          <Ionicons name="construct" size={60} color={Colors.white} />
          <Text style={styles.title}>Demande d'installation</Text>
          <Text style={styles.subtitle}>
            Faites installer votre système solaire par nos experts
          </Text>
        </LinearGradient>

        {/* Process */}
        <View style={styles.processSection}>
          <Text style={styles.sectionTitle}>Notre processus</Text>

          <View style={styles.processStep}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.primary }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Demande en ligne</Text>
              <Text style={styles.stepText}>Remplissez le formulaire ci-dessous</Text>
            </View>
          </View>

          <View style={styles.processStep}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.info }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Visite technique</Text>
              <Text style={styles.stepText}>Notre équipe vient évaluer votre site</Text>
            </View>
          </View>

          <View style={styles.processStep}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.accent }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Devis personnalisé</Text>
              <Text style={styles.stepText}>Vous recevez un devis détaillé</Text>
            </View>
          </View>

          <View style={styles.processStep}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.success }]}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Installation</Text>
              <Text style={styles.stepText}>Installation professionnelle et garantie</Text>
            </View>
          </View>
        </View>

        {/* Formulaire */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Vos informations</Text>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse du site *</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons
                name="location-outline"
                size={20}
                color={Colors.gray}
                style={styles.textAreaIcon}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ville, quartier, secteur, point de repère..."
                value={formData.address}
                onChangeText={(text) => updateField('address', text)}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Détails de la propriété</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type de propriété *</Text>
            <View style={styles.propertyTypeGrid}>
              {PROPERTY_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.propertyTypeCard,
                    formData.propertyType === type.id && styles.propertyTypeCardActive,
                  ]}
                  onPress={() => updateField('propertyType', type.id)}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={32}
                    color={
                      formData.propertyType === type.id ? Colors.white : Colors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.propertyTypeLabel,
                      formData.propertyType === type.id && styles.propertyTypeLabelActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type de toiture</Text>
            {ROOF_TYPES.map((roof, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.roofOption,
                  formData.roofType === roof && styles.roofOptionActive,
                ]}
                onPress={() => updateField('roofType', roof)}
              >
                <View
                  style={[
                    styles.radio,
                    formData.roofType === roof && styles.radioActive,
                  ]}
                >
                  {formData.roofType === roof && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.roofLabel}>{roof}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Facture d'électricité mensuelle moyenne</Text>
            {MONTHLY_BILLS.map((bill, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.billOption,
                  formData.averageMonthlyBill === bill && styles.billOptionActive,
                ]}
                onPress={() => updateField('averageMonthlyBill', bill)}
              >
                <View
                  style={[
                    styles.radio,
                    formData.averageMonthlyBill === bill && styles.radioActive,
                  ]}
                >
                  {formData.averageMonthlyBill === bill && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.billLabel}>{bill}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Informations supplémentaires</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons
                name="create-outline"
                size={20}
                color={Colors.gray}
                style={styles.textAreaIcon}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Besoins spécifiques, contraintes particulières, questions..."
                value={formData.notes}
                onChangeText={(text) => updateField('notes', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <GradientButton
            title={isSubmitting ? 'Envoi...' : 'Demander une visite technique'}
            onPress={handleSubmit}
            loading={isSubmitting}
            colors={[Colors.success, Colors.teal]}
          />

          <Text style={styles.disclaimer}>
            La visite technique est gratuite et sans engagement. Elle nous permet de
            vous proposer la solution la plus adaptée à vos besoins.
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
  processSection: {
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  formSection: {
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 16,
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
  propertyTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  propertyTypeCard: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light,
  },
  propertyTypeCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  propertyTypeLabel: {
    fontSize: 12,
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  propertyTypeLabelActive: {
    color: Colors.white,
  },
  roofOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  roofOptionActive: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: Colors.primary,
  },
  billOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  billOptionActive: {
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
  roofLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  billLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 140,
  },
});