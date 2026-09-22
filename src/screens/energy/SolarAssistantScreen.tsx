import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';

const PROPERTY_TYPES = [
  { id: 'home', label: 'Maison', icon: 'home-outline' },
  { id: 'shop', label: 'Commerce', icon: 'storefront-outline' },
  { id: 'business', label: 'Entreprise', icon: 'business-outline' },
  { id: 'farm', label: 'Agriculture', icon: 'leaf-outline' },
];

const APPLIANCES = [
  { id: 'lights', label: 'Éclairage', icon: 'bulb-outline' },
  { id: 'tv', label: 'Télévision', icon: 'tv-outline' },
  { id: 'fridge', label: 'Réfrigérateur', icon: 'snow-outline' },
  { id: 'ac', label: 'Climatiseur', icon: 'thermometer-outline' },
  { id: 'pump', label: 'Pompe à eau', icon: 'water-outline' },
];

export default function SolarAssistantScreen() {
  const [propertyType, setPropertyType] = useState('home');
  const [rooms, setRooms] = useState(3);
  const [appliances, setAppliances] = useState<string[]>(['lights', 'tv']);

  const toggleAppliance = (id: string) => {
    setAppliances((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressRow}>
          {[1, 2, 3, 4].map((step) => (
            <View key={step} style={styles.progressItem}>
              <View style={[styles.step, step === 1 && styles.stepActive]}>
                <Text style={[styles.stepText, step === 1 && styles.stepTextActive]}>{step}</Text>
              </View>
              {step < 4 && <View style={styles.line} />}
            </View>
          ))}
        </View>
        <Text style={styles.progressLabel}>Vos besoins</Text>

        <Text style={styles.title}>Votre projet concerne :</Text>
        <View style={styles.grid}>
          {PROPERTY_TYPES.map((item) => {
            const active = propertyType === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.typeCard, active && styles.typeCardActive]}
                onPress={() => setPropertyType(item.id)}
                activeOpacity={0.82}
              >
                <Ionicons name={item.icon as any} size={30} color={active ? Colors.primary : Colors.secondary} />
                <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.title}>Combien de chambres ?</Text>
        <View style={styles.counter}>
          <TouchableOpacity style={styles.counterButton} onPress={() => setRooms(Math.max(1, rooms - 1))}>
            <Ionicons name="remove" size={22} color={Colors.secondary} />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{rooms}</Text>
          <TouchableOpacity style={styles.counterButton} onPress={() => setRooms(Math.min(20, rooms + 1))}>
            <Ionicons name="add" size={22} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Quels appareils souhaitez-vous alimenter ?</Text>
        <View style={styles.applianceList}>
          {APPLIANCES.map((item) => {
            const active = appliances.includes(item.id);
            return (
              <TouchableOpacity key={item.id} style={styles.applianceRow} onPress={() => toggleAppliance(item.id)}>
                <View style={[styles.checkbox, active && styles.checkboxActive]}>
                  {active && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                </View>
                <Ionicons name={item.icon as any} size={20} color={Colors.secondary} />
                <Text style={styles.applianceLabel}>{item.label}</Text>
                <Ionicons name="information-circle-outline" size={18} color={Colors.gray} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86}>
          <Text style={styles.primaryButtonText}>Continuer</Text>
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
  progressItem: { flexDirection: 'row', alignItems: 'center' },
  step: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E7EBF0', alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: Colors.primary },
  stepText: { color: Colors.textSecondary, fontWeight: '700' },
  stepTextActive: { color: Colors.white },
  line: { width: 42, height: 2, backgroundColor: '#E7EBF0' },
  progressLabel: { textAlign: 'center', color: Colors.primary, fontSize: Typography.caption, fontWeight: '700', marginTop: Spacing.xs, marginBottom: Spacing.xl },
  title: { fontSize: Typography.h2, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: Spacing.xl },
  typeCard: { width: '48%', minHeight: 104, backgroundColor: Colors.white, borderRadius: Radius.md, borderWidth: 1.5, borderColor: '#E5EAF0', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, ...Shadow.card },
  typeCardActive: { borderColor: Colors.primary, backgroundColor: '#FFF6F1' },
  typeLabel: { marginTop: Spacing.sm, color: Colors.text, fontWeight: '700' },
  typeLabelActive: { color: Colors.primary },
  counter: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.md, marginBottom: Spacing.xl, ...Shadow.card },
  counterButton: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  counterValue: { minWidth: 64, textAlign: 'center', fontSize: Typography.h2, color: Colors.text, fontWeight: '800' },
  applianceList: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  applianceRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, borderBottomWidth: 1, borderBottomColor: '#EEF1F4' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#C8D0DA', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  applianceLabel: { flex: 1, marginLeft: Spacing.md, fontSize: Typography.body, color: Colors.text, fontWeight: '600' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: Spacing.lg, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#E9EDF2' },
  primaryButton: { height: 54, borderRadius: Radius.md, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: Colors.white, fontSize: 16, fontWeight: '800', marginRight: Spacing.sm },
});
