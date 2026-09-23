import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { SupportStackParamList } from '../../navigation/SupportStackNavigator';

const STATUS: Record<string, { label: string; color: string; bg: string; icon: string; text: string }> = {
  pending: { label: 'Demande reçue', color: '#9A5B00', bg: '#FFF6DF', icon: 'time-outline', text: 'Votre demande a été enregistrée et attend sa prise en charge.' },
  in_progress: { label: 'En traitement', color: '#165D9B', bg: '#EAF4FF', icon: 'construct-outline', text: 'L’équipe ZIDA traite actuellement votre demande.' },
  completed: { label: 'Intervention terminée', color: '#18794E', bg: '#EAF8F0', icon: 'checkmark-circle-outline', text: 'La demande a été clôturée par le service technique.' },
  cancelled: { label: 'Demande annulée', color: '#B42318', bg: '#FFF0F0', icon: 'close-circle-outline', text: 'Cette demande n’est plus active.' },
};

type TicketRoute = RouteProp<SupportStackParamList, 'RepairTicketDetail'>;

export default function RepairTicketDetailScreen() {
  const route = useRoute<TicketRoute>();
  const navigation = useNavigation<any>();
  const { ticket } = route.params;
  const status = STATUS[ticket.status] || STATUS.pending;

  const createdAt = new Date(ticket.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const updatedAt = new Date(ticket.updatedAt).toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.statusCard, { backgroundColor: status.bg }]}>
        <View style={[styles.statusIcon, { backgroundColor: Colors.white }]}>
          <Ionicons name={status.icon as any} size={28} color={status.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.statusTitle, { color: status.color }]}>{status.label}</Text>
          <Text style={styles.statusText}>{status.text}</Text>
        </View>
      </View>

      <Text style={styles.reference}>TICKET {ticket.id.slice(-8).toUpperCase()}</Text>
      <Text style={styles.title}>{ticket.installationType || 'Assistance technique'}</Text>

      <Section title="Problème signalé">
        <Text style={styles.body}>{ticket.problemDescription}</Text>
      </Section>

      <Section title="Informations du ticket">
        <InfoRow icon="alert-circle-outline" label="Urgence" value={urgencyLabel(ticket.urgency)} />
        <InfoRow icon="shield-checkmark-outline" label="Installation ZIDA" value={ticket.installedByZida ? 'Oui' : 'Non'} />
        {!!ticket.address && <InfoRow icon="location-outline" label="Adresse" value={ticket.address} />}
        <InfoRow icon="calendar-outline" label="Créé le" value={createdAt} />
        <InfoRow icon="refresh-outline" label="Dernière mise à jour" value={updatedAt} />
      </Section>

      <View style={styles.notice}>
        <Ionicons name="information-circle-outline" size={22} color={Colors.secondary} />
        <Text style={styles.noticeText}>Le statut affiché provient directement du système ZIDA SOLAIRE. Pour ajouter des précisions ou demander une modification, contactez l’assistance.</Text>
      </View>

      <TouchableOpacity style={styles.supportButton} onPress={() => navigation.navigate('Contact')}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.white} />
        <Text style={styles.supportText}>Contacter ZIDA à propos de ce ticket</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><View style={styles.sectionCard}>{children}</View></View>;
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon as any} size={19} color={Colors.primary} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function urgencyLabel(value: string) {
  if (value === 'high') return 'Urgent';
  if (value === 'low') return 'Faible';
  return 'Normal';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { padding: Spacing.lg, paddingBottom: 120 },
  statusCard: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.xl, padding: Spacing.lg },
  statusIcon: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginRight: 14, ...Shadow.card },
  statusTitle: { fontSize: Typography.h3, fontWeight: '900' },
  statusText: { color: Colors.textSecondary, lineHeight: 18, marginTop: 4 },
  reference: { color: Colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: 24 },
  title: { color: Colors.text, fontSize: Typography.h1, fontWeight: '900', marginTop: 5 },
  section: { marginTop: 24 },
  sectionTitle: { color: Colors.text, fontSize: Typography.h3, fontWeight: '900', marginBottom: 10 },
  sectionCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  body: { color: Colors.textSecondary, lineHeight: 21 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EDF0F3' },
  infoLabel: { color: Colors.textSecondary, fontSize: 11 },
  infoValue: { color: Colors.text, fontWeight: '700', marginTop: 2, lineHeight: 18 },
  notice: { flexDirection: 'row', backgroundColor: '#EEF4FA', borderRadius: Radius.lg, padding: Spacing.lg, marginTop: 22 },
  noticeText: { flex: 1, color: Colors.textSecondary, lineHeight: 19, marginLeft: 10 },
  supportButton: { height: 52, borderRadius: Radius.md, backgroundColor: Colors.secondary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  supportText: { color: Colors.white, fontWeight: '900', marginLeft: 8 },
});
