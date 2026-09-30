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
  ActivityIndicator,
} from 'react-native';

// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { useSubmitInstallation } from '../../hooks/useForms';
import { useUserStore } from '../../store/userStore';

const PROJECT_TYPES = [
  { id: 'Maison', label: 'Maison', icon: 'home-outline' },
  { id: 'Commerce', label: 'Commerce', icon: 'storefront-outline' },
  { id: 'Entreprise', label: 'Entreprise', icon: 'business-outline' },
  { id: 'Agriculture', label: 'Agriculture', icon: 'leaf-outline' },
];

const ROOF_TYPES = [
  'Tôle',
  'Dalle béton',
  'Tuiles',
  'Autre',
  'Je ne sais pas',
];

const MONTHLY_BILLS = [
  '< 20 000',
  '20 000 - 50 000',
  '50 000 - 100 000',
  '100 000 - 200 000',
  '> 200 000',
  'Je ne sais pas',
];

export default function InstallationRequestScreen() {
  const submitInstallation = useSubmitInstallation();
  const user = useUserStore((state) => state.user);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: '',
    phone: user?.phone || '',
    address: user?.address || '',
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
    if (!formData.propertyType) {
      Alert.alert(
        'Type de projet',
        'Choisissez le type de lieu concerné par votre installation.'
      );
      return false;
    }

    if (!formData.name.trim()) {
      Alert.alert('Nom requis', 'Indiquez votre nom.');
      return false;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Téléphone requis', 'Indiquez un numéro de téléphone.');
      return false;
    }

    if (!formData.address.trim()) {
      Alert.alert(
        'Localisation requise',
        'Indiquez la ville, le quartier ou un point de repère.'
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await submitInstallation.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        propertyType: formData.propertyType,
        roofType: formData.roofType || undefined,
        averageMonthlyBill:
          formData.averageMonthlyBill &&
          formData.averageMonthlyBill !== 'Je ne sais pas'
            ? `${formData.averageMonthlyBill} FCFA`
            : formData.averageMonthlyBill || undefined,
        notes: formData.notes.trim() || undefined,
      });

      Alert.alert(
        'Demande envoyée',
        "Votre demande a bien été enregistrée. L'équipe ZIDA vous contactera pour confirmer votre besoin et organiser la suite.",
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData((prev) => ({
                ...prev,
                propertyType: '',
                roofType: '',
                averageMonthlyBill: '',
                notes: '',
              }));
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Envoi impossible',
        error.response?.data?.message ||
          "Impossible d'envoyer votre demande pour le moment. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showRoof = formData.propertyType !== 'Agriculture';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="construct-outline"
              size={28}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.eyebrow}>INSTALLATION ZIDA</Text>

          <Text style={styles.heroTitle}>
            Demandez une installation solaire
          </Text>

          <Text style={styles.heroText}>
            Donnez-nous quelques informations. L'équipe ZIDA pourra ensuite
            étudier votre besoin avec vous.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Comment ça se passe ?</Text>

        <View style={styles.processCard}>
          <ProcessStep
            number="1"
            title="Envoyez votre demande"
            text="Quelques informations suffisent."
          />

          <ProcessStep
            number="2"
            title="Nous vous contactons"
            text="Nous confirmons votre besoin et la localisation."
          />

          <ProcessStep
            number="3"
            title="Visite et proposition"
            text="Si nécessaire, une visite permet de préparer la solution et le devis."
            last
          />
        </View>

        <Text style={styles.sectionTitle}>Quel est votre projet ?</Text>

        <View style={styles.projectGrid}>
          {PROJECT_TYPES.map((item) => {
            const active = formData.propertyType === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.projectCard,
                  active && styles.projectCardActive,
                ]}
                activeOpacity={0.82}
                onPress={() => updateField('propertyType', item.id)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={27}
                  color={active ? Colors.white : Colors.primary}
                />

                <Text
                  style={[
                    styles.projectLabel,
                    active && styles.projectLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Où se trouve le projet ?</Text>

        <View style={styles.formCard}>
          <FieldLabel text="Nom complet *" />
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="Votre nom"
            placeholderTextColor={Colors.textSecondary}
          />

          <FieldLabel text="Téléphone *" />
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            placeholder="+226 70 00 00 00"
            keyboardType="phone-pad"
            placeholderTextColor={Colors.textSecondary}
          />

          <FieldLabel text="Ville, quartier ou point de repère *" />
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => updateField('address', text)}
            placeholder="Ex. : Ouagadougou, Cissin, près du marché..."
            placeholderTextColor={Colors.textSecondary}
          />

          <FieldLabel text="Email (facultatif)" />
          <TextInput
            style={[styles.input, styles.lastInput]}
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        {showRoof && (
          <>
            <Text style={styles.sectionTitle}>
              Quel type de toiture ?
            </Text>

            <Text style={styles.helperText}>
              Facultatif. Choisissez « Je ne sais pas » si vous n'êtes pas sûr.
            </Text>

            <View style={styles.chips}>
              {ROOF_TYPES.map((roof) => {
                const active = formData.roofType === roof;

                return (
                  <TouchableOpacity
                    key={roof}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => updateField('roofType', roof)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}
                    >
                      {roof}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>
          Environ combien payez-vous d'électricité par mois ?
        </Text>

        <Text style={styles.helperText}>
          Cette information est facultative.
        </Text>

        <View style={styles.chips}>
          {MONTHLY_BILLS.map((bill) => {
            const active = formData.averageMonthlyBill === bill;

            return (
              <TouchableOpacity
                key={bill}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() =>
                  updateField(
                    'averageMonthlyBill',
                    active ? '' : bill
                  )
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    active && styles.chipTextActive,
                  ]}
                >
                  {bill === 'Je ne sais pas'
                    ? bill
                    : `${bill} FCFA`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>
          Une précision à ajouter ?
        </Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.notes}
          onChangeText={(text) => updateField('notes', text)}
          multiline
          textAlignVertical="top"
          placeholder="Ex. : je veux alimenter une pompe, réduire les coupures, installer le système sur une boutique..."
          placeholderTextColor={Colors.textSecondary}
        />

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={Colors.secondary}
          />

          <Text style={styles.noticeText}>
            Cette demande ne vous engage pas. Le matériel et le prix seront
            confirmés après étude de votre besoin.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.86}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text style={styles.submitText}>
                Envoyer ma demande
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color={Colors.white}
              />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ProcessStep({
  number,
  title,
  text,
  last = false,
}: {
  number: string;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.processRow, last && styles.processRowLast]}>
      <View style={styles.processNumber}>
        <Text style={styles.processNumberText}>{number}</Text>
      </View>

      <View style={styles.processCopy}>
        <Text style={styles.processTitle}>{title}</Text>
        <Text style={styles.processText}>{text}</Text>
      </View>
    </View>
  );
}

function FieldLabel({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },

  content: {
    padding: Spacing.lg,
    paddingBottom: 130,
  },

  hero: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.card,
  },

  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyebrow: {
    marginTop: 16,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroTitle: {
    marginTop: 6,
    color: Colors.text,
    fontSize: Typography.h1,
    lineHeight: 31,
    fontWeight: '900',
  },

  heroText: {
    marginTop: 8,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  sectionTitle: {
    marginTop: 26,
    marginBottom: 10,
    color: Colors.text,
    fontSize: Typography.h2,
    fontWeight: '900',
  },

  helperText: {
    marginTop: -4,
    marginBottom: 12,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },

  processCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },

  processRow: {
    flexDirection: 'row',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0F3',
  },

  processRowLast: {
    paddingBottom: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
  },

  processNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  processNumberText: {
    color: Colors.primary,
    fontWeight: '900',
  },

  processCopy: {
    flex: 1,
  },

  processTitle: {
    color: Colors.text,
    fontWeight: '900',
  },

  processText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  projectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  projectCard: {
    width: '48%',
    minHeight: 96,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#E4E8ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...Shadow.card,
  },

  projectCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  projectLabel: {
    marginTop: 7,
    color: Colors.text,
    fontWeight: '800',
  },

  projectLabelActive: {
    color: Colors.white,
  },

  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },

  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 7,
  },

  input: {
    minHeight: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#DCE2E8',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    marginBottom: 16,
    color: Colors.text,
    fontSize: 15,
  },

  lastInput: {
    marginBottom: 0,
  },

  textArea: {
    minHeight: 125,
    paddingTop: 14,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chip: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#DDE3E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 9,
  },

  chipActive: {
    backgroundColor: '#FFF3EC',
    borderColor: Colors.primary,
  },

  chipText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },

  chipTextActive: {
    color: Colors.primary,
    fontWeight: '900',
  },

  notice: {
    flexDirection: 'row',
    backgroundColor: '#EEF4FA',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: 6,
  },

  noticeText: {
    flex: 1,
    marginLeft: 10,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  submitButton: {
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  submitDisabled: {
    opacity: 0.6,
  },

  submitText: {
    color: Colors.white,
    fontWeight: '900',
    marginRight: 9,
  },
});
