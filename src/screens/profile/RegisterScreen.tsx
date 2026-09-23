import React, { useEffect, useState } from 'react';
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
  KeyboardTypeOptions,
} from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { useRequestRegisterOtp, useVerifyRegisterOtp } from '../../hooks/useAuth';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const requestOtp = useRequestRegisterOtp();
  const verifyOtp = useVerifyRegisterOtp();

  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | undefined>();
  const [resendIn, setResendIn] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Ouagadougou',
  });

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => {
      setResendIn((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const registrationPayload = () => ({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    phone: formData.phone.trim(),
    email: formData.email.trim() || undefined,
    address: formData.address.trim() || undefined,
    city: formData.city.trim() || 'Ouagadougou',
  });

  const requestCode = async () => {
    if (challengeId && resendIn > 0) return;
    if (!formData.firstName.trim() || !formData.phone.trim()) {
      Alert.alert('Informations manquantes', 'Prénom et téléphone sont obligatoires.');
      return;
    }

    try {
      const result = await requestOtp.mutateAsync(registrationPayload());
      setChallengeId(result.challengeId);
      setDevCode(result.devCode);
      updateField('phone', result.phone || formData.phone);
      setCode('');
      setResendIn(60);
    } catch (error: any) {
      const retryAfter = Number(error.response?.data?.retryAfter || 0);
      if (retryAfter > 0) setResendIn(retryAfter);
      Alert.alert('Inscription', error.response?.data?.error || "Impossible d'envoyer le code.");
    }
  };

  const verifyCode = async () => {
    if (!challengeId || code.length !== 6) {
      Alert.alert('Code requis', 'Entrez le code à 6 chiffres reçu par SMS.');
      return;
    }

    try {
      await verifyOtp.mutateAsync({
        ...registrationPayload(),
        challengeId,
        code,
      });
      Alert.alert('Compte créé', 'Votre numéro est vérifié et votre compte ZIDA est prêt.', [
        { text: 'Continuer', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Vérification', error.response?.data?.error || 'Impossible de vérifier le code.');
    }
  };

  const resetRegistration = () => {
    setChallengeId(null);
    setCode('');
    setDevCode(undefined);
    setResendIn(0);
  };

  if (challengeId) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.iconWrap}><Ionicons name="shield-checkmark-outline" size={30} color={Colors.primary} /></View>
            <Text style={styles.eyebrow}>DERNIÈRE ÉTAPE</Text>
            <Text style={styles.title}>Vérifiez votre numéro</Text>
            <Text style={styles.subtitle}>Entrez le code envoyé au {formData.phone}. Votre compte ne sera créé qu'après cette vérification.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Code à 6 chiffres</Text>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              textAlign="center"
              placeholder="000000"
              placeholderTextColor="#C3CBD3"
            />

            {!!devCode && (
              <View style={styles.devNotice}>
                <Ionicons name="code-slash-outline" size={18} color={Colors.secondary} />
                <Text style={styles.devText}>Mode test : code {devCode}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={verifyCode} disabled={verifyOtp.isPending}>
              <Text style={styles.primaryText}>{verifyOtp.isPending ? 'Vérification...' : 'Vérifier et créer mon compte'}</Text>
              <Ionicons name="checkmark-circle-outline" size={19} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.secondaryRow}>
              <TouchableOpacity onPress={requestCode} disabled={requestOtp.isPending || resendIn > 0}>
                <Text style={[styles.link, resendIn > 0 && styles.linkDisabled]}>
                  {resendIn > 0 ? `Renvoyer dans ${resendIn}s` : 'Renvoyer le code'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={resetRegistration}>
                <Text style={styles.link}>Modifier mes informations</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.iconWrap}><Ionicons name="person-add-outline" size={30} color={Colors.primary} /></View>
          <Text style={styles.eyebrow}>COMPTE ZIDA</Text>
          <Text style={styles.title}>Créer mon compte</Text>
          <Text style={styles.subtitle}>Retrouvez vos commandes, installations et demandes SAV dans un seul espace sécurisé.</Text>
        </View>

        <View style={styles.card}>
          <Field label="Prénom *" icon="person-outline" value={formData.firstName} onChangeText={(v) => updateField('firstName', v)} placeholder="Votre prénom" />
          <Field label="Nom" icon="person-outline" value={formData.lastName} onChangeText={(v) => updateField('lastName', v)} placeholder="Votre nom" />
          <Field label="Téléphone *" icon="call-outline" value={formData.phone} onChangeText={(v) => updateField('phone', v)} placeholder="+226 70 00 00 00" keyboardType="phone-pad" />
          <Field label="Email" icon="mail-outline" value={formData.email} onChangeText={(v) => updateField('email', v)} placeholder="exemple@email.com" keyboardType="email-address" />
          <Field label="Ville" icon="location-outline" value={formData.city} onChangeText={(v) => updateField('city', v)} placeholder="Ouagadougou" />
          <Field label="Adresse" icon="home-outline" value={formData.address} onChangeText={(v) => updateField('address', v)} placeholder="Quartier, secteur, rue..." />

          <TouchableOpacity style={styles.primaryButton} onPress={requestCode} disabled={requestOtp.isPending}>
            <Text style={styles.primaryText}>{requestOtp.isPending ? 'Envoi...' : 'Vérifier mon numéro'}</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.securityCard}>
          <Ionicons name="lock-closed-outline" size={22} color={Colors.success} />
          <Text style={styles.securityText}>Votre compte sera créé seulement après validation du code reçu sur votre téléphone.</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.loginLink}>Se connecter</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type FieldProps = {
  label: string;
  icon: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
};

function Field({ label, icon, value, onChangeText, placeholder, keyboardType }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={icon as any} size={19} color={Colors.gray} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          placeholderTextColor={Colors.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { flexGrow: 1, padding: Spacing.lg, paddingBottom: 40 },
  hero: { marginTop: 18, marginBottom: 20 },
  iconWrap: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: '900', letterSpacing: 1, marginTop: 16 },
  title: { fontSize: Typography.h1, fontWeight: '900', color: Colors.text, marginTop: 5 },
  subtitle: { color: Colors.textSecondary, lineHeight: 21, marginTop: 8 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, ...Shadow.card },
  field: { marginBottom: 15 },
  label: { color: Colors.text, fontSize: 13, fontWeight: '800', marginBottom: 7 },
  inputWrap: { minHeight: 52, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDE3E9', borderRadius: Radius.md, paddingHorizontal: 13 },
  input: { flex: 1, color: Colors.text, fontSize: 15, paddingVertical: 13, paddingLeft: 9 },
  codeInput: { height: 66, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.primary, fontSize: 30, fontWeight: '900', letterSpacing: 8, color: Colors.text, backgroundColor: '#FFFDFC' },
  devNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF4FA', borderRadius: Radius.md, padding: 12, marginTop: 12 },
  devText: { color: Colors.secondary, fontWeight: '800', marginLeft: 8 },
  primaryButton: { height: 54, borderRadius: Radius.md, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  primaryText: { color: Colors.white, fontWeight: '900', marginRight: 8 },
  secondaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  link: { color: Colors.secondary, fontWeight: '800', fontSize: 13 },
  linkDisabled: { color: Colors.gray },
  securityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECF8F1', borderRadius: Radius.lg, padding: Spacing.lg, marginTop: 16 },
  securityText: { flex: 1, marginLeft: 10, color: Colors.text, fontSize: 12, lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: Colors.textSecondary },
  loginLink: { color: Colors.primary, fontWeight: '900', marginLeft: 5 },
});
