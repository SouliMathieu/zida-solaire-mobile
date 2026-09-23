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
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { useUserStore } from '../../store/userStore';
import { useUpdateProfile } from '../../hooks/useAuth';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
  });

  const handleUpdate = async () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Information manquante', 'Le prénom est obligatoire.');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
      });
      Alert.alert('Profil mis à jour', 'Vos informations ont été enregistrées.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.error || 'Impossible de mettre à jour le profil.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}><Ionicons name="person-outline" size={27} color={Colors.primary} /></View>
        <Text style={styles.eyebrow}>MON COMPTE</Text>
        <Text style={styles.title}>Mes informations</Text>
        <Text style={styles.subtitle}>Gardez vos coordonnées à jour pour les commandes, installations et interventions ZIDA.</Text>
      </View>

      <View style={styles.formCard}>
        <Field label="Prénom *" value={formData.firstName} onChangeText={(value) => setFormData({ ...formData, firstName: value })} placeholder="Votre prénom" />
        <Field label="Nom" value={formData.lastName} onChangeText={(value) => setFormData({ ...formData, lastName: value })} placeholder="Votre nom" />
        <Field label="Email" value={formData.email} onChangeText={(value) => setFormData({ ...formData, email: value })} placeholder="votre@email.com" keyboardType="email-address" />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Téléphone vérifié</Text>
          <View style={styles.verifiedPhone}>
            <View style={styles.verifiedIcon}><Ionicons name="shield-checkmark" size={20} color={Colors.success} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.phoneValue}>{user?.phone || '—'}</Text>
              <Text style={styles.phoneHelp}>Ce numéro est votre identifiant sécurisé. Son changement nécessitera une nouvelle vérification OTP.</Text>
            </View>
          </View>
        </View>

        <Field label="Ville" value={formData.city} onChangeText={(value) => setFormData({ ...formData, city: value })} placeholder="Ouagadougou" />
        <Field label="Adresse" value={formData.address} onChangeText={(value) => setFormData({ ...formData, address: value })} placeholder="Votre adresse complète" multiline />

        <TouchableOpacity
          style={[styles.saveButton, updateProfileMutation.isPending && styles.saveButtonDisabled]}
          onPress={handleUpdate}
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
              <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address';
  multiline?: boolean;
};

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline }: FieldProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { padding: Spacing.lg, paddingBottom: 60 },
  hero: { marginBottom: 20 },
  heroIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: '900', letterSpacing: 1, marginTop: 16 },
  title: { color: Colors.text, fontSize: Typography.h1, fontWeight: '900', marginTop: 5 },
  subtitle: { color: Colors.textSecondary, lineHeight: 20, marginTop: 7 },
  formCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, ...Shadow.card },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  input: { minHeight: 52, backgroundColor: '#FBFCFD', borderWidth: 1, borderColor: '#DDE3E9', borderRadius: Radius.md, paddingHorizontal: 14, fontSize: 15, color: Colors.text },
  textArea: { minHeight: 92, paddingTop: 14 },
  verifiedPhone: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#ECF8F1', borderRadius: Radius.md, padding: 14 },
  verifiedIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  phoneValue: { color: Colors.text, fontWeight: '900', fontSize: 15 },
  phoneHelp: { color: Colors.textSecondary, fontSize: 11, lineHeight: 16, marginTop: 3 },
  saveButton: { minHeight: 54, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, marginTop: 4 },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: Colors.white, fontSize: 15, fontWeight: '900', marginLeft: 8 },
});
