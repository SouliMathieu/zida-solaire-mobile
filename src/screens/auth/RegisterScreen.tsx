// src/screens/auth/RegisterScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import Button from '../../components/common/Button';
import { useUserStore } from '../../store/userStore';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const setUser = useUserStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom complet');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre email');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre numéro de téléphone');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un mot de passe');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simuler une inscription (à remplacer par un vrai appel API)
    setTimeout(() => {
      setIsLoading(false);

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        phone: phone,
      };

      const mockToken = 'mock-jwt-token-' + newUser.id;

      setUser(newUser, mockToken);

      Alert.alert(
        'Compte créé !',
        `Bienvenue ${newUser.name}. Votre compte a été créé avec succès.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="sunny" size={60} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Rejoignez ZIDA SOLAIRE pour profiter de nos services
          </Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          {/* Nom complet */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="Jean Dupont"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
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
                placeholder="votre.email@exemple.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          {/* Téléphone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="+226 70 00 00 00"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          {/* Mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={Colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmer mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={Colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bouton d'inscription */}
          <Button
            title="Créer mon compte"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />

          {/* Lien vers connexion */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Vous avez déjà un compte ? </Text>
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
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 14,
    paddingLeft: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});
