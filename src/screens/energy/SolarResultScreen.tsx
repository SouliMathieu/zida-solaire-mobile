import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import api from '../../services/api';
import { SolarAnswers, estimateSolarSystem, buildSolarStudyDescription } from '../../utils/solarEstimator';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';

type ResultRoute = RouteProp<HomeStackParamList, 'SolarResult'>;

const formatPrice = (value: number) => new Intl.NumberFormat('fr-FR').format(value);

export default function SolarResultScreen() {
  const route = useRoute<ResultRoute>();
  const { answers } = route.params;
  const result = useMemo(() => estimateSolarSystem(answers), [answers]);
  const [sending, setSending] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const submitStudy = async () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      Alert.alert('Informations requises', 'Veuillez renseigner votre prénom, nom et téléphone.');
      return;
    }
    setSending(true);
    try {
      const response = await api.post('/installation-requests', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        type: 'SOLAR',
        address: address.trim(),
        description: buildSolarStudyDescription(answers, result),
      });
      Alert.alert(
        'Étude demandée',
        `Votre demande ${response.data?.requestNumber || ''} a bien été transmise à ZIDA SOLAIRE.`,
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.error || "Impossible d'envoyer votre demande pour le moment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.recommendedBadge}>
        <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
        <Text style={styles.recommendedText}>Solution indicative recommandée par ZIDA</Text>
      </View>

      <Text style={styles.eyebrow}>VOTRE SOLUTION SOLAIRE</Text>
      <Text style={styles.title}>Une base adaptée à vos besoins</Text>
      <Text style={styles.subtitle}>Cette estimation sert à préparer votre étude technique. Elle sera confirmée par un technicien ZIDA.</Text>

      <View style={styles.metricsGrid}>
        <Metric icon="sunny-outline" label="Panneaux" value={`${result.solarArrayKw} kWc`} />
        <Metric icon="flash-outline" label="Onduleur" value={`${result.peakPowerKw} kW`} />
        <Metric icon="battery-charging-outline" label="Batterie" value={`${result.batteryKwh} kWh`} />
        <Metric icon="time-outline" label="Autonomie cible" value={`${result.autonomyHours} h`} />
      </View>

      <View style={styles.budgetCard}>
        <Text style={styles.budgetLabel}>Budget indicatif</Text>
        <Text style={styles.budgetValue}>{formatPrice(result.budgetLow)} – {formatPrice(result.budgetHigh)} FCFA</Text>
        <Text style={styles.budgetHint}>Matériel + installation estimative, à confirmer après étude du site.</Text>
      </View>

      <View style={styles.benefitsCard}>
        <Benefit text="Dimensionnement basé sur vos usages déclarés" />
        <Benefit text="Solution ajustable selon votre budget" />
        <Benefit text="Validation finale par l’équipe technique ZIDA" />
      </View>

      <Text style={styles.sectionTitle}>Demander une étude technique</Text>
      <Text style={styles.sectionSubtitle}>Votre demande arrivera dans le même back-office que les demandes du site.</Text>
      <View style={styles.formCard}>
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.half]} placeholder="Prénom *" value={firstName} onChangeText={setFirstName} />
          <TextInput style={[styles.input, styles.half]} placeholder="Nom *" value={lastName} onChangeText={setLastName} />
        </View>
        <TextInput style={styles.input} placeholder="Téléphone *" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Adresse / quartier" value={address} onChangeText={setAddress} />
        <TouchableOpacity style={[styles.primaryButton, sending && { opacity: 0.6 }]} onPress={submitStudy} disabled={sending} activeOpacity={0.85}>
          <Text style={styles.primaryText}>{sending ? 'Envoi...' : 'Demander une étude gratuite'}</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Metric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Ionicons name={icon as any} size={24} color={Colors.primary} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <View style={styles.benefitRow}>
      <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: Spacing.lg },
  recommendedBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: '#EAF8F0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, marginBottom: Spacing.lg },
  recommendedText: { color: '#18794E', fontWeight: '700', marginLeft: 6, fontSize: 12 },
  eyebrow: { color: Colors.primary, fontWeight: '800', fontSize: 12, letterSpacing: 0.7 },
  title: { fontSize: Typography.h1, fontWeight: '900', color: Colors.text, marginTop: 6 },
  subtitle: { color: Colors.textSecondary, lineHeight: 21, marginTop: 8, marginBottom: Spacing.xl },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { width: '48%', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadow.card },
  metricValue: { fontSize: 20, fontWeight: '900', color: Colors.text, marginTop: 8 },
  metricLabel: { color: Colors.textSecondary, marginTop: 2 },
  budgetCard: { backgroundColor: '#FFF4EC', borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.sm },
  budgetLabel: { color: Colors.textSecondary, fontWeight: '700' },
  budgetValue: { color: Colors.primary, fontSize: 22, fontWeight: '900', marginTop: 5 },
  budgetHint: { color: Colors.textSecondary, lineHeight: 19, marginTop: 6, fontSize: 13 },
  benefitsCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.lg, ...Shadow.card },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  benefitText: { flex: 1, color: Colors.text, marginLeft: 8, lineHeight: 20 },
  sectionTitle: { fontSize: Typography.h2, fontWeight: '900', color: Colors.text, marginTop: Spacing.xl },
  sectionSubtitle: { color: Colors.textSecondary, lineHeight: 20, marginTop: 4, marginBottom: Spacing.md },
  formCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  input: { borderWidth: 1, borderColor: '#DCE2E8', borderRadius: Radius.md, paddingHorizontal: 14, minHeight: 50, marginBottom: 12, color: Colors.text, backgroundColor: '#FBFCFD' },
  primaryButton: { height: 54, backgroundColor: Colors.primary, borderRadius: Radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryText: { color: Colors.white, fontWeight: '900', marginRight: 8 },
});
