// src/screens/profile/RegisterScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import Button from '../../components/common/Button';
import { useRegister } from '../../hooks/useAuth';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Ouagadougou',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!formData.firstName.trim() || !formData.phone.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email || undefined,
        address: formData.address || undefined,
        city: formData.city,
      });

      Alert.alert('Succès', 'Compte créé avec succès !', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erreur lors de la création du compte';
      Alert.alert('Erreur', errorMessage);
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
        <View style={styles.header}>
          <Ionicons name="person-add" size={80} color={Colors.primary} />
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Rejoignez ZIDA SOLAIRE pour profiter de tous nos services
          </Text>
        </View>

        <View style={styles.form}>
          {/* Prénom */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prénom *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Jean"
                value={formData.firstName}
                onChangeText={(text) => updateField('firstName', text)}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          {/* Nom */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Dupont"
                value={formData.lastName}
                onChangeText={(text) => updateField('lastName', text)}
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

          {/* Ville */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ville</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="Ouagadougou"
                value={formData.city}
                onChangeText={(text) => updateField('city', text)}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          {/* Adresse */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons
                name="home-outline"
                size={20}
                color={Colors.gray}
                style={styles.textAreaIcon}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Secteur, quartier, rue..."
                value={formData.address}
                onChangeText={(text) => updateField('address', text)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <Button
            title={registerMutation.isPending ? 'Création...' : "Créer mon compte"}
            onPress={handleRegister}
            loading={registerMutation.isPending}
            style={styles.registerButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    flex: 1,
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
    backgroundColor: Colors.white,
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
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
});