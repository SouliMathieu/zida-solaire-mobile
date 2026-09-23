import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { fetchCustomerInstallations } from '../../services/api';
import { EnergyStackParamList } from '../../navigation/EnergyStackNavigator';
import { useUserStore } from '../../store/userStore';

export type CustomerInstallation = {
  id: string;
  requestNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  installationType: string;
  description: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'ACCEPTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  estimatedCost?: number | null;
  technicianNotes?: string | null;
  appointmentDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

type Nav = NativeStackNavigationProp<EnergyStackParamList, 'Installations'>;

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Demande reçue',
  CONTACTED: 'Contacté',
  QUOTED: 'Devis prêt',
  ACCEPTED: 'Devis accepté',
  SCHEDULED: 'Installation planifiée',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
};

export default function InstallationsScreen() {
  const navigation = useNavigation<Nav>();
  const authenticated = useUserStore((state) => !!state.user && !!state.token);
  const { data = [], isLoading, isError, refetch } = useQuery<CustomerInstallation[]>({
    queryKey: ['customer-installations'],
    queryFn: fetchCustomerInstallations,
    enabled: authenticated,
  });

  if (!authenticated) {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed-outline" size={44} color={Colors.secondary} />
        <Text style={styles.emptyTitle}>Connexion requise</Text>
        <Text style={styles.emptyText}>Connectez-vous pour consulter vos projets et leur avancement.</Text>
      </View>
    );
  }

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={44} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>Suivi indisponible</Text>
        <Text style={styles.emptyText}>Le service de suivi n'est pas encore disponible sur le serveur utilisé par cette version.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}><Text style={styles.retryText}>Réessayer</Text></TouchableOpacity>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.center}>
        <Ionicons name="home-outline" size={46} color={Colors.primary} />
        <Text style={styles.emptyTitle}>Aucun projet en cours</Text>
        <Text style={styles.emptyText}>Vos futures demandes d'étude et installations ZIDA apparaîtront ici.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={data}
      keyExtractor={(item) => item.id}
      onRefresh={refetch}
      refreshing={false}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('InstallationDetail', { installation: item })} activeOpacity={0.84}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.requestNumber}>{item.requestNumber}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('fr-FR')}</Text>
            </View>
            <View style={styles.statusPill}><Text style={styles.statusText}>{STATUS_LABELS[item.status] || item.status}</Text></View>
          </View>
          <View style={styles.row}><Ionicons name="location-outline" size={18} color={Colors.secondary} /><Text style={styles.rowText} numberOfLines={1}>{item.customerAddress || 'Adresse non renseignée'}</Text></View>
          <View style={styles.row}><Ionicons name="construct-outline" size={18} color={Colors.primary} /><Text style={styles.rowText}>{item.installationType}</Text></View>
          <View style={styles.footerRow}><Text style={styles.followText}>Voir le suivi</Text><Ionicons name="chevron-forward" size={20} color={Colors.primary} /></View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  list: { padding: Spacing.lg, paddingBottom: 120 },
  center: { flex: 1, backgroundColor: '#F6F8FB', alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { marginTop: 14, fontSize: Typography.h2, fontWeight: '900', color: Colors.text, textAlign: 'center' },
  emptyText: { marginTop: 7, color: Colors.textSecondary, lineHeight: 20, textAlign: 'center' },
  retryButton: { marginTop: 18, height: 46, paddingHorizontal: 24, borderRadius: Radius.md, backgroundColor: Colors.primary, justifyContent: 'center' },
  retryText: { color: Colors.white, fontWeight: '900' },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadow.card },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  requestNumber: { fontSize: 16, fontWeight: '900', color: Colors.text },
  date: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  statusPill: { backgroundColor: '#FFF3EC', borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  statusText: { color: Colors.primary, fontWeight: '800', fontSize: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  rowText: { flex: 1, marginLeft: 8, color: Colors.textSecondary, fontSize: 13 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 13, borderTopWidth: 1, borderTopColor: '#EDF0F3' },
  followText: { color: Colors.primary, fontWeight: '900' },
});
