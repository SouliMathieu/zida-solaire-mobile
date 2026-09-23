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
import { useUserStore } from '../../store/userStore';
import { useRequestPhoneChangeOtp, useVerifyPhoneChangeOtp } from '../../hooks/useAuth';

export default function ChangePhoneScreen() {
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);
  const requestOtp = useRequestPhoneChangeOtp();
  const verifyOtp = useVerifyPhoneChangeOtp();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | undefined>();
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => {
      setResendIn((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const requestCode = async () => {
    if (challengeId && resendIn > 0) return;
    if (!phone.trim()) {
      Alert.alert('Numéro requis', 'Entrez votre nouveau numéro de téléphone.');
      return;
    }

    try {
      const result = await requestOtp.mutateAsync(phone.trim());
      setChallengeId(result.challengeId);
      setPhone(result.phone || phone.trim());
      setDevCode(result.devCode);
      setCode('');
      setResendIn(60);
    } catch (error: any) {
      const retryAfter = Number(error.response?.data?.retryAfter || 0);
      if (retryAfter > 0) setResendIn(retryAfter);
      Alert.alert('Changement de numéro', error.response?.data?.error || "Impossible d'envoyer le code.");
    }
  };

  const verifyCode = async () => {
    if (!challengeId || code.length !== 6) {
      Alert.alert('Code requis', 'Entrez le code à 6 chiffres reçu sur le nouveau numéro.');
      return;
    }

    try {
      await verifyOtp.mutateAsync({ challengeId, phone, code });
      Alert.alert('Numéro modifié', 'Votre nouveau numéro est maintenant vérifié et associé à votre compte.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Vérification', error.response?.data?.error || 'Impossible de vérifier le code.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.iconWrap}><Ionicons name="phone-portrait-outline" size={29} color={Colors.primary} /></View>
          <Text style={styles.eyebrow}>SÉCURITÉ DU COMPTE</Text>
          <Text style={styles.title}>Changer mon numéro</Text>
          <Text style={styles.subtitle}>Votre numéro actuel est {user?.phone || 'non disponible'}. Le nouveau numéro devra être vérifié par SMS.</Text>
        </View>

        <View style={styles.card}>
          {!challengeId ? (
            <>
              <Text style={styles.label}>Nouveau numéro</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="call-outline" size={20} color={Colors.gray} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="+226 70 00 00 00"
                  placeholderTextColor={Colors.textSecondary}
                  autoFocus
                />
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={requestCode} disabled={requestOtp.isPending}>
                <Text style={styles.primaryText}>{requestOtp.isPending ? 'Envoi...' : 'Envoyer le code de vérification'}</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.label}>Code envoyé au {phone}</Text>
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
                <Text style={styles.primaryText}>{verifyOtp.isPending ? 'Vérification...' : 'Confirmer le nouveau numéro'}</Text>
                <Ionicons name="shield-checkmark-outline" size={18} color={Colors.white} />
              </TouchableOpacity>

              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={requestCode} disabled={requestOtp.isPending || resendIn > 0}>
                  <Text style={[styles.link, resendIn > 0 && styles.linkDisabled]}>
                    {resendIn > 0 ? `Renvoyer dans ${resendIn}s` : 'Renvoyer le code'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setChallengeId(null); setCode(''); setDevCode(undefined); setResendIn(0); }}>
                  <Text style={styles.link}>Changer le numéro</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={22} color={Colors.secondary} />
          <Text style={styles.noticeText}>Après validation, vos commandes, installations et tickets SAV restent associés à votre compte.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { padding: Spacing.lg, paddingBottom: 50 },
  hero: { marginTop: 16, marginBottom: 20 },
  iconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: '900', letterSpacing: 1, marginTop: 16 },
  title: { fontSize: Typography.h1, fontWeight: '900', color: Colors.text, marginTop: 5 },
  subtitle: { color: Colors.textSecondary, lineHeight: 20, marginTop: 7 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, ...Shadow.card },
  label: { fontSize: 13, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  inputWrap: { minHeight: 54, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDE3E9', borderRadius: Radius.md, paddingHorizontal: 14 },
  input: { flex: 1, paddingLeft: 9, fontSize: 16, color: Colors.text },
  codeInput: { height: 66, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.primary, fontSize: 30, fontWeight: '900', letterSpacing: 8, color: Colors.text, backgroundColor: '#FFFDFC' },
  primaryButton: { minHeight: 54, borderRadius: Radius.md, backgroundColor: Colors.primary, marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  primaryText: { color: Colors.white, fontWeight: '900', marginRight: 8, textAlign: 'center' },
  devNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF4FA', borderRadius: Radius.md, padding: 12, marginTop: 12 },
  devText: { color: Colors.secondary, fontWeight: '800', marginLeft: 8 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  link: { color: Colors.secondary, fontWeight: '800', fontSize: 13 },
  linkDisabled: { color: Colors.gray },
  notice: { flexDirection: 'row', backgroundColor: '#EEF4FA', borderRadius: Radius.lg, padding: Spacing.lg, marginTop: 16 },
  noticeText: { flex: 1, color: Colors.textSecondary, marginLeft: 10, lineHeight: 18, fontSize: 12 },
});
