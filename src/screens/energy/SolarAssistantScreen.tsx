import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import { SOLAR_APPLIANCES, SolarApplianceId, SolarApplianceSelection, SolarPropertyType } from '../../utils/solarEstimator';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'SolarAssistant'>;

const PROPERTY_TYPES: { id: SolarPropertyType; label: string; icon: string }[] = [
  { id: 'home', label: 'Maison', icon: 'home-outline' },
  { id: 'shop', label: 'Commerce', icon: 'storefront-outline' },
  { id: 'business', label: 'Entreprise', icon: 'business-outline' },
  { id: 'farm', label: 'Agriculture', icon: 'leaf-outline' },
];

const APPLIANCE_ICONS: Record<SolarApplianceId, string> = {
  lights: 'bulb-outline', tv: 'tv-outline', fridge: 'snow-outline', freezer: 'cube-outline',
  fan: 'sync-outline', computer: 'laptop-outline', ac: 'thermometer-outline', pump: 'water-outline',
};

const BILL_OPTIONS = ['< 10 000 FCFA', '10 000 – 25 000 FCFA', '25 000 – 50 000 FCFA', '50 000 – 100 000 FCFA', '> 100 000 FCFA'];
const AUTONOMY_OPTIONS = [4, 8, 12, 24];

export default function SolarAssistantScreen() {
  const navigation = useNavigation<Nav>();
  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState<SolarPropertyType>('home');
  const [rooms, setRooms] = useState(3);
  const [appliances, setAppliances] = useState<SolarApplianceSelection[]>([
    { id: 'lights', quantity: 1, hoursPerDay: 6 },
    { id: 'tv', quantity: 1, hoursPerDay: 5 },
  ]);
  const [autonomyHours, setAutonomyHours] = useState(8);
  const [monthlyBill, setMonthlyBill] = useState('25 000 – 50 000 FCFA');

  const selectedIds = useMemo(() => appliances.map((a) => a.id), [appliances]);

  const toggleAppliance = (id: SolarApplianceId) => {
    setAppliances((current) => {
      if (current.some((item) => item.id === id)) return current.filter((item) => item.id !== id);
      const spec = SOLAR_APPLIANCES[id];
      return [...current, { id, quantity: 1, hoursPerDay: spec.defaultHours }];
    });
  };

  const changeQuantity = (id: SolarApplianceId, delta: number) => {
    setAppliances((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(12, item.quantity + delta)) } : item));
  };

  const finish = () => navigation.navigate('SolarResult', {
    answers: { propertyType, rooms, appliances, autonomyHours, monthlyBill },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressRow}>
          {[1, 2, 3].map((n) => (
            <React.Fragment key={n}>
              <View style={[styles.step, n <= step && styles.stepActive]}>
                <Text style={[styles.stepText, n <= step && styles.stepTextActive]}>{n}</Text>
              </View>
              {n < 3 && <View style={[styles.line, n < step && styles.lineActive]} />}
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.progressLabel}>{step === 1 ? 'Votre projet' : step === 2 ? 'Vos équipements' : 'Votre autonomie'}</Text>

        {step === 1 && (
          <>
            <Text style={styles.title}>Quel type de projet souhaitez-vous alimenter ?</Text>
            <View style={styles.grid}>
              {PROPERTY_TYPES.map((item) => {
                const active = propertyType === item.id;
                return (
                  <TouchableOpacity key={item.id} style={[styles.typeCard, active && styles.typeCardActive]} onPress={() => setPropertyType(item.id)} activeOpacity={0.82}>
                    <Ionicons name={item.icon as any} size={30} color={active ? Colors.primary : Colors.secondary} />
                    <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.title}>Combien de pièces ou chambres principales ?</Text>
            <View style={styles.counter}>
              <TouchableOpacity style={styles.counterButton} onPress={() => setRooms(Math.max(1, rooms - 1))}><Ionicons name="remove" size={22} color={Colors.secondary} /></TouchableOpacity>
              <Text style={styles.counterValue}>{rooms}</Text>
              <TouchableOpacity style={styles.counterButton} onPress={() => setRooms(Math.min(30, rooms + 1))}><Ionicons name="add" size={22} color={Colors.secondary} /></TouchableOpacity>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Quels appareils voulez-vous alimenter ?</Text>
            <Text style={styles.helper}>Sélectionnez les équipements puis ajustez les quantités.</Text>
            <View style={styles.applianceList}>
              {(Object.keys(SOLAR_APPLIANCES) as SolarApplianceId[]).map((id) => {
                const active = selectedIds.includes(id);
                const selection = appliances.find((a) => a.id === id);
                return (
                  <View key={id} style={styles.applianceRow}>
                    <TouchableOpacity style={styles.applianceMain} onPress={() => toggleAppliance(id)}>
                      <View style={[styles.checkbox, active && styles.checkboxActive]}>{active && <Ionicons name="checkmark" size={14} color={Colors.white} />}</View>
                      <Ionicons name={APPLIANCE_ICONS[id] as any} size={20} color={Colors.secondary} />
                      <Text style={styles.applianceLabel}>{SOLAR_APPLIANCES[id].label}</Text>
                    </TouchableOpacity>
                    {active && selection && (
                      <View style={styles.miniCounter}>
                        <TouchableOpacity onPress={() => changeQuantity(id, -1)}><Ionicons name="remove-circle-outline" size={22} color={Colors.secondary} /></TouchableOpacity>
                        <Text style={styles.qty}>{selection.quantity}</Text>
                        <TouchableOpacity onPress={() => changeQuantity(id, 1)}><Ionicons name="add-circle-outline" size={22} color={Colors.primary} /></TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Combien d'heures d'autonomie souhaitez-vous ?</Text>
            <View style={styles.optionGrid}>
              {AUTONOMY_OPTIONS.map((hours) => (
                <TouchableOpacity key={hours} style={[styles.optionCard, autonomyHours === hours && styles.optionCardActive]} onPress={() => setAutonomyHours(hours)}>
                  <Text style={[styles.optionValue, autonomyHours === hours && styles.optionValueActive]}>{hours} h</Text>
                  <Text style={styles.optionHint}>{hours === 24 ? 'journée complète' : 'hors réseau'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.title}>Votre facture d'électricité mensuelle ?</Text>
            <View style={styles.billList}>
              {BILL_OPTIONS.map((bill) => (
                <TouchableOpacity key={bill} style={[styles.billOption, monthlyBill === bill && styles.billOptionActive]} onPress={() => setMonthlyBill(bill)}>
                  <Ionicons name={monthlyBill === bill ? 'radio-button-on' : 'radio-button-off'} size={20} color={monthlyBill === bill ? Colors.primary : Colors.gray} />
                  <Text style={styles.billText}>{bill}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={22} color={Colors.info} />
              <Text style={styles.infoText}>Le résultat reste une estimation indicative. Un technicien ZIDA validera le dimensionnement final sur site.</Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(step - 1)}><Text style={styles.secondaryText}>Retour</Text></TouchableOpacity>}
        <TouchableOpacity style={styles.primaryButton} onPress={() => step < 3 ? setStep(step + 1) : finish()} activeOpacity={0.86}>
          <Text style={styles.primaryButtonText}>{step < 3 ? 'Continuer' : 'Voir ma recommandation'}</Text>
          <Ionicons name="arrow-forward" size={19} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: Spacing.lg, paddingBottom: 120 },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.sm },
  step: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E7EBF0', alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: Colors.primary },
  stepText: { color: Colors.textSecondary, fontWeight: '800' },
  stepTextActive: { color: Colors.white },
  line: { width: 70, height: 2, backgroundColor: '#E7EBF0' },
  lineActive: { backgroundColor: Colors.primary },
  progressLabel: { textAlign: 'center', color: Colors.primary, fontSize: Typography.caption, fontWeight: '800', marginTop: Spacing.xs, marginBottom: Spacing.xl },
  title: { fontSize: Typography.h2, fontWeight: '900', color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.sm },
  helper: { color: Colors.textSecondary, marginTop: -6, marginBottom: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: Spacing.xl },
  typeCard: { width: '48%', minHeight: 104, backgroundColor: Colors.white, borderRadius: Radius.md, borderWidth: 1.5, borderColor: '#E5EAF0', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, ...Shadow.card },
  typeCardActive: { borderColor: Colors.primary, backgroundColor: '#FFF6F1' },
  typeLabel: { marginTop: Spacing.sm, color: Colors.text, fontWeight: '700' },
  typeLabelActive: { color: Colors.primary },
  counter: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.md, marginBottom: Spacing.xl, ...Shadow.card },
  counterButton: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  counterValue: { minWidth: 70, textAlign: 'center', fontSize: Typography.h2, color: Colors.text, fontWeight: '900' },
  applianceList: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  applianceRow: { minHeight: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, borderBottomWidth: 1, borderBottomColor: '#EEF1F4' },
  applianceMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#C8D0DA', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  applianceLabel: { flex: 1, marginLeft: Spacing.md, fontSize: Typography.body, color: Colors.text, fontWeight: '600' },
  miniCounter: { flexDirection: 'row', alignItems: 'center' },
  qty: { minWidth: 30, textAlign: 'center', fontWeight: '800', color: Colors.text },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: Spacing.xl },
  optionCard: { width: '48%', backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 1.5, borderColor: '#E5EAF0', ...Shadow.card },
  optionCardActive: { borderColor: Colors.primary, backgroundColor: '#FFF6F1' },
  optionValue: { fontSize: 22, fontWeight: '900', color: Colors.text },
  optionValueActive: { color: Colors.primary },
  optionHint: { color: Colors.textSecondary, marginTop: 3 },
  billList: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  billOption: { minHeight: 54, flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, borderBottomWidth: 1, borderBottomColor: '#EEF1F4' },
  billOptionActive: { backgroundColor: '#FFF9F5' },
  billText: { marginLeft: Spacing.md, color: Colors.text, fontWeight: '600' },
  infoCard: { flexDirection: 'row', backgroundColor: '#EEF6FF', borderRadius: Radius.md, padding: Spacing.lg, marginTop: Spacing.xl },
  infoText: { flex: 1, marginLeft: Spacing.sm, color: Colors.text, lineHeight: 20 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: Spacing.lg, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#E9EDF2', flexDirection: 'row' },
  secondaryButton: { height: 54, minWidth: 96, borderRadius: Radius.md, borderWidth: 1, borderColor: '#D7DDE5', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  secondaryText: { color: Colors.text, fontWeight: '800' },
  primaryButton: { flex: 1, height: 54, borderRadius: Radius.md, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: Colors.white, fontSize: 15, fontWeight: '900', marginRight: Spacing.sm },
});