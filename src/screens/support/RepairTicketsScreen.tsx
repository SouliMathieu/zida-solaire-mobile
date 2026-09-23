import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { SupportStackParamList } from '../../navigation/SupportStackNavigator';
import { RepairTicket, useCustomerRepairs } from '../../hooks/useRepairs';
import { useUserStore } from '../../store/userStore';

type Nav = NativeStackNavigationProp<SupportStackParamList, 'RepairTickets'>;

const STATUS: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: 'Reçue', color: '#9A5B00', bg: '#FFF6DF', icon: 'time-outline' },
  in_progress: { label: 'En traitement', color: '#165D9B', bg: '#EAF4FF', icon: 'construct-outline' },
  completed: { label: 'Terminée', color: '#18794E', bg: '#EAF8F0', icon: 'checkmark-circle-outline' },
  cancelled: { label: 'Annulée', color: '#B42318', bg: '#FFF0F0', icon: 'close-circle-outline' },
};

export default function RepairTicketsScreen() {
  const navigation = useNavigation<Nav>();
  const authenticated = useUserStore((state) => state.isAuthenticated());
  const { data = [], isLoading, isRefetching, refetch, error } = useCustomerRepairs();

  if (!authenticated) {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed-outline" size={46} color={Colors.secondary} />
        <Text style={styles.emptyTitle}>Connexion requise</Text>
        <Text style={styles.emptyText}>Connectez-vous pour retrouver les demandes SAV associées à votre numéro de téléphone.</Text>
      </View>
    );
  }

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={data.length ? styles.list : styles.emptyList}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[Colors.primary]} />}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={styles.eyebrow}>SAV ZIDA</Text>
            <Text style={styles.headerTitle}>Mes demandes d'assistance</Text>
            <Text style={styles.headerText}>Suivez ici les tickets enregistrés avec le numéro de votre compte.</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.centerInline}>
            <Ionicons name="build-outline" size={48} color={Colors.gray} />
            <Text style={styles.emptyTitle}>{error ? 'Historique indisponible' : 'Aucun ticket SAV'}</Text>
            <Text style={styles.emptyText}>{error ? 'Le service client n’est pas encore accessible sur cette version du backend.' : 'Vos futures demandes apparaîtront ici.'}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('RepairRequest')}>
              <Text style={styles.primaryText}>Signaler un problème</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => <TicketCard ticket={item} onPress={() => navigation.navigate('RepairTicketDetail', { ticket: item })} />}
      />
    </View>
  );
}

function TicketCard({ ticket, onPress }: { ticket: RepairTicket; onPress: () => void }) {
  const status = STATUS[ticket.status] || STATUS.pending;
  const date = new Date(ticket.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.cardTop}>
        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
          <Ionicons name={status.icon as any} size={15} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.ticketType}>{ticket.installationType || 'Assistance technique'}</Text>
      <Text style={styles.description} numberOfLines={2}>{ticket.problemDescription}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.reference}>Réf. {ticket.id.slice(-8).toUpperCase()}</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  list: { padding: Spacing.lg, paddingBottom: 120 },
  emptyList: { flexGrow: 1, padding: Spacing.lg },
  headerCard: { backgroundColor: '#0A365D', borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: 18 },
  eyebrow: { color: '#BFD6E8', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  headerTitle: { color: Colors.white, fontSize: Typography.h1, fontWeight: '900', marginTop: 6 },
  headerText: { color: '#DFEAF2', lineHeight: 20, marginTop: 8 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: 12, ...Shadow.card },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  statusText: { fontSize: 11, fontWeight: '900', marginLeft: 5 },
  date: { color: Colors.textSecondary, fontSize: 11 },
  ticketType: { color: Colors.text, fontSize: 16, fontWeight: '900', marginTop: 14 },
  description: { color: Colors.textSecondary, lineHeight: 19, marginTop: 5 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EDF0F3' },
  reference: { color: Colors.secondary, fontSize: 11, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F6F8FB' },
  centerInline: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 19, fontWeight: '900', color: Colors.text, marginTop: 14, textAlign: 'center' },
  emptyText: { color: Colors.textSecondary, lineHeight: 20, textAlign: 'center', marginTop: 7, maxWidth: 300 },
  primaryButton: { marginTop: 20, backgroundColor: Colors.primary, paddingHorizontal: 20, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: Colors.white, fontWeight: '900' },
});
