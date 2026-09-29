import React, { useState } from 'react';
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
import { useLoginWithPin } from '../../hooks/useAuth';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const login = useLoginWithPin();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  const submit = async () => {
    if (!phone.trim()) {
      Alert.alert('Téléphone requis', 'Entrez votre numéro de téléphone.');
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      Alert.alert('PIN requis', 'Entrez votre PIN à 4 chiffres.');
      return;
    }

    try {
      await login.mutateAsync({
        phone: phone.trim(),
        pin,
      });

      Alert.alert(
        'Bienvenue',
        'Connexion réussie.',
        [{ text: 'Continuer', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      const data = error.response?.data;

      if (data?.code === 'PIN_NOT_SET') {
        Alert.alert(
          'PIN à créer',
          'Ce compte ne possède pas encore de PIN. Utilisez « PIN oublié ? » pour en créer un.'
        );
        return;
      }

      Alert.alert(
        'Connexion impossible',
        data?.error || 'Vérifiez votre numéro et votre PIN.'
      );
    }
  };

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
            <Ionicons name="lock-closed-outline" size={30} color={Colors.primary} />
          </View>

          <Text style={styles.eyebrow}>COMPTE ZIDA</Text>
          <Text style={styles.title}>Se connecter</Text>

          <Text style={styles.subtitle}>
            Utilisez votre numéro de téléphone et votre PIN à 4 chiffres.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Numéro de téléphone</Text>

          <View style={styles.inputWrap}>
            <Ionicons name="call-outline" size={20} color={Colors.gray} />

            <TextInput
              style={styles.input}
              placeholder="+226 70 00 00 00"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <Text style={[styles.label, styles.pinLabel]}>PIN à 4 chiffres</Text>

          <View style={styles.inputWrap}>
            <Ionicons name="keypad-outline" size={20} color={Colors.gray} />

            <TextInput
              style={styles.input}
              placeholder="••••"
              value={pin}
              onChangeText={(value) =>
                setPin(value.replace(/\D/g, '').slice(0, 4))
              }
              keyboardType="number-pad"
              secureTextEntry={!showPin}
              maxLength={4}
              placeholderTextColor={Colors.textSecondary}
            />

            <TouchableOpacity onPress={() => setShowPin((value) => !value)}>
              <Ionicons
                name={showPin ? 'eye-off-outline' : 'eye-outline'}
                size={21}
                color={Colors.gray}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate('ForgotPin')}
          >
            <Text style={styles.forgotText}>PIN oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={submit}
            disabled={login.isPending}
          >
            <Text style={styles.primaryText}>
              {login.isPending ? 'Connexion...' : 'Se connecter'}
            </Text>

            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.securityCard}>
          <Ionicons name="shield-checkmark-outline" size={22} color={Colors.success} />

          <Text style={styles.securityText}>
            Votre PIN protège l'accès à votre espace ZIDA.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Créer un compte</Text>
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
  pinLabel: {
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
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 14,
    paddingLeft: 10,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 13,
  },
  forgotText: {
    color: Colors.secondary,
    fontWeight: '800',
  },
  primaryButton: {
    height: 54,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  primaryText: {
    color: Colors.white,
    fontWeight: '900',
    marginRight: 8,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECF8F1',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: 16,
  },
  securityText: {
    flex: 1,
    color: Colors.text,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  footerText: {
    color: Colors.textSecondary,
  },
  registerLink: {
    color: Colors.primary,
    fontWeight: '900',
    marginLeft: 5,
  },
});
