import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { EnergyStackParamList } from '../../navigation/EnergyStackNavigator';

const STEPS = [
  { key: 'NEW', label: 'Demande reçue', icon: 'mail-outline' },
  { key: 'CONTACTED', label: 'Contact ZIDA', icon: 'call-outline' },
  { key: 'QUOTED', label: 'Devis prêt', icon: 'document-text-outline' },
  { key: 'ACCEPTED', label: 'Devis accepté', icon: 'checkmark-circle-outline' },
  { key: 'SCHEDULED', label: 'Installation planifiée', icon: 'calendar-outline' },
  { key: 'COMPLETED', label: 'Installation terminée', icon: 'shield-checkmark-outline' },
] as const;

type Route = RouteProp<EnergyStackParamList, 'InstallationDetail'>;

export default function InstallationDetailScreen() {
  const route = useRoute<Route>();
  const { installation } = route.params;
  const currentIndex = STEPS.findIndex((step) => step.key === installation.status);
  const cancelled = installation.status === 'CANCELLED';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>PROJET ZIDA SOLAIRE</Text>
        <Text style={styles.title}>{installation.requestNumber}</Text>
        <Text style={styles.subtitle}>{installation.customerAddress || 'Adresse non renseignée'}</Text>
      </View>

      {cancelled ? (
        <View style={styles.cancelledCard}>
          <Ionicons name="close-circle-outline" size={26} color={Colors.error} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cancelledTitle}>Projet annulé</Text>
            <Text style={styles.cancelledText}>Contactez ZIDA SOLAIRE si vous souhaitez relancer cette demande.</Text>
          </View>
        </View>
      ) : (
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Avancement</Text>
          {STEPS.map((step, index) => {
            const done = currentIndex >= index;
            const current = currentIndex === index;
            return (
              <View key={step.key} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View style={[styles.dot, done && styles.dotDone, current && styles.dotCurrent]}>
                    <Ionicons name={step.icon as any} size={15} color={done ? Colors.white : Colors.gray} />
                  </View>
                  {index < STEPS.length - 1 && <View style={[styles.line, currentIndex > index && styles.lineDone]} />}
                </View>
                <View style={styles.timelineCopy}>
                  <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{step.label}</Text>
                  {current && <Text style={styles.currentText}>Étape actuelle</Text>}
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Détails du projet</Text>
        <InfoRow label="Type" value={installation.installationType} />
        <InfoRow label="Demande créée" value={new Date(installation.createdAt).toLocaleDateString('fr-FR')} />
        {!!installation.appointmentDate && <InfoRow label="Rendez-vous" value={new Date(installation.appointmentDate).toLocaleString('fr-FR')} />}
        {!!installation.estimatedCost && <InfoRow label="Montant estimé" value={`${new Intl.NumberFormat('fr-FR').format(installation.estimatedCost)} FCFA`} />}
      </View>

      {!!installation.description && (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Demande</Text>
          <Text style={styles.description}>{installation.description}</Text>
        </View>
      )}

      {!!installation.technicianNotes && (
        <View style={styles.notesCard}>
          <Ionicons name="construct-outline" size={23} color={Colors.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.notesTitle}>Note du technicien</Text>
            <Text style={styles.notesText}>{installation.technicianNotes}</Text>
          </View>
        </View>
      )}

      {installation.status === 'COMPLETED' && (
        <View style={styles.successCard}>
          <Ionicons name="shield-checkmark" size={26} color={Colors.success} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.successTitle}>Installation terminée</Text>
            <Text style={styles.successText}>Cet espace accueillera ensuite les informations de garantie, équipements et maintenance associés au projet.</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoRow}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { padding: Spacing.lg, paddingBottom: 120 },
  hero: { backgroundColor: '#0A365D', borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.lg },
  eyebrow: { color: '#BFD6E8', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  title: { color: Colors.white, fontSize: Typography.h1, fontWeight: '900', marginTop: 6 },
  subtitle: { color: '#DFEAF2', marginTop: 8, lineHeight: 20 },
  timelineCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  sectionTitle: { fontSize: Typography.h3, fontWeight: '900', color: Colors.text, marginBottom: 14 },
  timelineRow: { flexDirection: 'row', minHeight: 64 },
  timelineRail: { width: 36, alignItems: 'center' },
  dot: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E7EBF0', alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: Colors.secondary },
  dotCurrent: { backgroundColor: Colors.primary },
  line: { width: 2, flex: 1, backgroundColor: '#E7EBF0' },
  lineDone: { backgroundColor: Colors.secondary },
  timelineCopy: { flex: 1, paddingLeft: 10, paddingTop: 5 },
  stepLabel: { color: Colors.textSecondary, fontWeight: '700' },
  stepLabelDone: { color: Colors.text, fontWeight: '900' },
  currentText: { color: Colors.primary, fontSize: 11, fontWeight: '800', marginTop: 3 },
  infoCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.lg, ...Shadow.card },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EDF0F3' },
  infoLabel: { flex: 1, color: Colors.textSecondary, fontSize: 13 },
  infoValue: { flex: 1, color: Colors.text, textAlign: 'right', fontWeight: '800', fontSize: 13 },
  description: { color: Colors.textSecondary, lineHeight: 21 },
  notesCard: { flexDirection: 'row', backgroundColor: '#FFF3EC', borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.lg },
  notesTitle: { color: Colors.text, fontWeight: '900' },
  notesText: { color: Colors.textSecondary, lineHeight: 20, marginTop: 4 },
  successCard: { flexDirection: 'row', backgroundColor: '#EDF9F2', borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.lg },
  successTitle: { color: Colors.text, fontWeight: '900' },
  successText: { color: Colors.textSecondary, lineHeight: 20, marginTop: 4 },
  cancelledCard: { flexDirection: 'row', backgroundColor: '#FFF0F0', borderRadius: Radius.lg, padding: Spacing.lg },
  cancelledTitle: { color: Colors.error, fontWeight: '900' },
  cancelledText: { color: Colors.textSecondary, lineHeight: 20, marginTop: 4 },
});
