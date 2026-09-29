import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import {
  useConfirmPinReset,
  useRequestPinReset,
} from '../../hooks/useAuth';

const WEAK_PINS = new Set(['0000', '1111', '1234', '4321']);

export default function ForgotPinScreen() {
  const navigation = useNavigation<any>();
  const requestReset = useRequestPinReset();
  const confirmReset = useConfirmPinReset();

  const [identifier, setIdentifier] = useState('');
  const [resetId, setResetId] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [devCode, setDevCode] = useState<string | undefined>();
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;

    const timer = setInterval(() => {
      setResendIn((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendIn]);

  const requestCode = async () => {
    if (resetId && resendIn > 0) return;

    if (!identifier.trim()) {
      Alert.alert(
        'Information requise',
        'Entrez votre numéro de téléphone ou votre email.'
      );
      return;
    }

    try {
      const result = await requestReset.mutateAsync(identifier.trim());

      setResetId(result.resetId);
      setMaskedEmail(result.email || '');
      setDevCode(result.devCode);
      setCode('');
      setResendIn(60);
    } catch (error: any) {
      const retryAfter = Number(error.response?.data?.retryAfter || 0);

      if (retryAfter > 0) {
        setResendIn(retryAfter);
      }

      Alert.alert(
        'Réinitialisation',
        error.response?.data?.error ||
          "Impossible d'envoyer le code pour le moment."
      );
    }
  };

  const submitNewPin = async () => {
    if (!resetId || code.length !== 6) {
      Alert.alert(
        'Code requis',
        'Entrez le code à 6 chiffres reçu par email.'
      );
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      Alert.alert(
        'PIN invalide',
        'Votre nouveau PIN doit contenir 4 chiffres.'
      );
      return;
    }

    if (WEAK_PINS.has(newPin)) {
      Alert.alert(
        'PIN trop simple',
        'Choisissez un PIN différent de 0000, 1111, 1234 ou 4321.'
      );
      return;
    }

    if (newPin !== confirmPin) {
      Alert.alert(
        'PIN différents',
        'Les deux PIN doivent être identiques.'
      );
      return;
    }

    try {
      const result = await confirmReset.mutateAsync({
        resetId,
        code,
        newPin,
        confirmPin,
      });

      Alert.alert(
        'PIN modifié',
        result.message ||
          'Votre nouveau PIN a été enregistré. Vous pouvez vous connecter.',
        [{ text: 'Se connecter', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert(
        'Réinitialisation impossible',
        error.response?.data?.error ||
          'Vérifiez le code et réessayez.'
      );
    }
  };

  if (!resetId) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <View style={styles.iconWrap}>
              <Ionicons name="key-outline" size={30} color={Colors.primary} />
            </View>

            <Text style={styles.eyebrow}>RÉCUPÉRATION</Text>
            <Text style={styles.title}>PIN oublié ?</Text>

            <Text style={styles.subtitle}>
              Entrez votre téléphone ou votre email. Nous enverrons un code à l'adresse email enregistrée sur votre compte.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Téléphone ou email</Text>

            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={20} color={Colors.gray} />

              <TextInput
                style={styles.input}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Téléphone ou email"
                autoCapitalize="none"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={requestCode}
              disabled={requestReset.isPending}
            >
              <Text style={styles.primaryText}>
                {requestReset.isPending
                  ? 'Envoi...'
                  : 'Recevoir le code par email'}
              </Text>

              <Ionicons name="mail-outline" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <View style={styles.iconWrap}>
            <Ionicons
              name="shield-checkmark-outline"
              size={30}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.eyebrow}>NOUVEAU PIN</Text>
          <Text style={styles.title}>Créez votre nouveau PIN</Text>

          <Text style={styles.subtitle}>
            {maskedEmail
              ? `Un code a été envoyé à ${maskedEmail}.`
              : "Si un compte correspond à vos informations, un code a été envoyé à l'email enregistré."}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Code à 6 chiffres</Text>

          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={(value) =>
              setCode(value.replace(/\D/g, '').slice(0, 6))
            }
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            textAlign="center"
            placeholderTextColor="#C3CBD3"
          />

          {!!devCode && (
            <View style={styles.devNotice}>
              <Ionicons
                name="code-slash-outline"
                size={18}
                color={Colors.secondary}
              />
              <Text style={styles.devText}>Mode test : code {devCode}</Text>
            </View>
          )}

          <Text style={[styles.label, styles.spacedLabel]}>
            Nouveau PIN à 4 chiffres
          </Text>

          <TextInput
            style={styles.pinInput}
            value={newPin}
            onChangeText={(value) =>
              setNewPin(value.replace(/\D/g, '').slice(0, 4))
            }
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            placeholder="••••"
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={[styles.label, styles.spacedLabel]}>
            Confirmer le nouveau PIN
          </Text>

          <TextInput
            style={styles.pinInput}
            value={confirmPin}
            onChangeText={(value) =>
              setConfirmPin(value.replace(/\D/g, '').slice(0, 4))
            }
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            placeholder="••••"
            placeholderTextColor={Colors.textSecondary}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={submitNewPin}
            disabled={confirmReset.isPending}
          >
            <Text style={styles.primaryText}>
              {confirmReset.isPending
                ? 'Enregistrement...'
                : 'Enregistrer mon nouveau PIN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={requestCode}
            disabled={requestReset.isPending || resendIn > 0}
          >
            <Text
              style={[
                styles.link,
                resendIn > 0 && styles.linkDisabled,
              ]}
            >
              {resendIn > 0
                ? `Renvoyer le code dans ${resendIn}s`
                : 'Renvoyer le code'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  content: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  hero: {
    marginTop: 24,
    marginBottom: 22,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 18,
  },
  title: {
    fontSize: Typography.h1,
    fontWeight: '900',
    color: Colors.text,
    marginTop: 6,
  },
  subtitle: {
    color: Colors.textSecondary,
    lineHeight: 21,
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.card,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  spacedLabel: {
    marginTop: 16,
  },
  inputWrap: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE3E9',
    borderRadius: Radius.md,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 14,
    paddingLeft: 10,
  },
  codeInput: {
    height: 66,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 8,
    color: Colors.text,
    backgroundColor: '#FFFDFC',
  },
  pinInput: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#DDE3E9',
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    fontSize: 18,
    color: Colors.text,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 12,
  },
  primaryText: {
    color: Colors.white,
    fontWeight: '900',
    marginRight: 8,
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 18,
  },
  link: {
    color: Colors.secondary,
    fontWeight: '800',
  },
  linkDisabled: {
    color: Colors.gray,
  },
  devNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FA',
    borderRadius: Radius.md,
    padding: 12,
    marginTop: 12,
  },
  devText: {
    color: Colors.secondary,
    fontWeight: '800',
    marginLeft: 8,
  },
});
