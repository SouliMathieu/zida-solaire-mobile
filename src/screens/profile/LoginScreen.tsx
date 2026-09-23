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
import { useRequestLoginOtp, useVerifyLoginOtp } from '../../hooks/useAuth';

export default function LoginScreen() {
  const navigation = useNavigation();
  const requestOtp = useRequestLoginOtp();
  const verifyOtp = useVerifyLoginOtp();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
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
    if (challengeId && resendIn > 0) return;
    if (!phone.trim()) {
      Alert.alert('Numéro requis', 'Entrez votre numéro de téléphone.');
      return;
    }

    try {
      const result = await requestOtp.mutateAsync(phone.trim());
      setChallengeId(result.challengeId);
      setDevCode(result.devCode);
      setPhone(result.phone || phone.trim());
      setCode('');
      setResendIn(60);
    } catch (error: any) {
      const retryAfter = Number(error.response?.data?.retryAfter || 0);
      if (retryAfter > 0) setResendIn(retryAfter);
      Alert.alert('Connexion', error.response?.data?.error || "Impossible d'envoyer le code.");
    }
  };

  const verifyCode = async () => {
    if (!challengeId || code.trim().length !== 6) {
      Alert.alert('Code requis', 'Entrez le code à 6 chiffres reçu par SMS.');
      return;
    }

    try {
      await verifyOtp.mutateAsync({ challengeId, phone, code: code.trim() });
      Alert.alert('Connexion réussie', 'Votre numéro a été vérifié.', [
        { text: 'Continuer', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Code invalide', error.response?.data?.error || 'Impossible de vérifier le code.');
    }
  };

  const resetPhone = () => {
    setChallengeId(null);
    setCode('');
    setDevCode(undefined);
    setResendIn(0);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.iconWrap}>
            <Ionicons name={challengeId ? 'shield-checkmark-outline' : 'phone-portrait-outline'} size={30} color={Colors.primary} />
          </View>
          <Text style={styles.eyebrow}>COMPTE ZIDA</Text>
          <Text style={styles.title}>{challengeId ? 'Vérifiez votre numéro' : 'Connexion sécurisée'}</Text>
          <Text style={styles.subtitle}>
            {challengeId
              ? `Un code à 6 chiffres a été envoyé au ${phone}.`
              : 'Entrez votre numéro. ZIDA vous enverra un code de vérification par SMS.'}
          </Text>
        </View>

        <View style={styles.card}>
          {!challengeId ? (
            <>
              <Text style={styles.label}>Numéro de téléphone</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="call-outline" size={20} color={Colors.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="+226 70 00 00 00"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoFocus
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={requestCode} disabled={requestOtp.isPending}>
                <Text style={styles.primaryText}>{requestOtp.isPending ? 'Envoi...' : 'Recevoir mon code'}</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.label}>Code de vérification</Text>
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
                <Text style={styles.primaryText}>{verifyOtp.isPending ? 'Vérification...' : 'Vérifier et me connecter'}</Text>
                <Ionicons name="shield-checkmark-outline" size={18} color={Colors.white} />
              </TouchableOpacity>

              <View style={styles.secondaryRow}>
                <TouchableOpacity onPress={requestCode} disabled={requestOtp.isPending || resendIn > 0}>
                  <Text style={[styles.link, resendIn > 0 && styles.linkDisabled]}>
                    {resendIn > 0 ? `Renvoyer dans ${resendIn}s` : 'Renvoyer le code'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={resetPhone}>
                  <Text style={styles.link}>Changer de numéro</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={styles.securityCard}>
          <Ionicons name="lock-closed-outline" size={22} color={Colors.success} />
          <Text style={styles.securityText}>Aucune session n'est créée avant vérification du code SMS.</Text>
        </View>

        {!challengeId && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
              <Text style={styles.registerLink}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { flexGrow: 1, padding: Spacing.lg, paddingBottom: 40 },
  hero: { marginTop: 24, marginBottom: 22 },
  iconWrap: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: '900', letterSpacing: 1, marginTop: 18 },
  title: { fontSize: Typography.h1, fontWeight: '900', color: Colors.text, marginTop: 6 },
  subtitle: { color: Colors.textSecondary, lineHeight: 21, marginTop: 8 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, ...Shadow.card },
  label: { fontSize: 13, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  inputWrap: { minHeight: 54, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDE3E9', borderRadius: Radius.md, paddingHorizontal: 14 },
  input: { flex: 1, fontSize: 16, color: Colors.text, paddingVertical: 14, paddingLeft: 10 },
  codeInput: { height: 66, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.primary, fontSize: 30, fontWeight: '900', letterSpacing: 8, color: Colors.text, backgroundColor: '#FFFDFC' },
  devNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF4FA', borderRadius: Radius.md, padding: 12, marginTop: 12 },
  devText: { color: Colors.secondary, fontWeight: '800', marginLeft: 8 },
  primaryButton: { height: 54, borderRadius: Radius.md, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  primaryText: { color: Colors.white, fontWeight: '900', marginRight: 8 },
  secondaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  link: { color: Colors.secondary, fontWeight: '800', fontSize: 13 },
  linkDisabled: { color: Colors.gray },
  securityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECF8F1', borderRadius: Radius.lg, padding: Spacing.lg, marginTop: 16 },
  securityText: { flex: 1, color: Colors.text, fontSize: 12, lineHeight: 18, marginLeft: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 26 },
  footerText: { color: Colors.textSecondary },
  registerLink: { color: Colors.primary, fontWeight: '900', marginLeft: 5 },
});
