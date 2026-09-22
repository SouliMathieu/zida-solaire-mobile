// src/screens/orders/OrdersScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { useOrders } from '../../hooks/useOrders';
import { OrdersStackParamList } from '../../navigation/OrdersStackNavigator';
import { Order } from '../../types';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';

type Nav = NativeStackNavigationProp<OrdersStackParamList>;

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmée',
  EN_PREPARATION: 'En préparation',
  PRETE: 'Prête',
  EN_LIVRAISON: 'En livraison',
  EXPEDIEE: 'Expédiée',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée',
};

const statusColor = (status: string) => {
  if (status === 'LIVREE') return Colors.success;
  if (status === 'ANNULEE') return Colors.error;
  if (status === 'EN_ATTENTE') return Colors.warning;
  return Colors.secondary;
};

const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(price);
const formatDate = (value: string) => new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function OrdersScreen() {
  const navigation = useNavigation<Nav>();
  const { data: orders = [], refetch } = useOrders();

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={refetch}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <View style={styles.heroIcon}><Ionicons name="receipt-outline" size={26} color={Colors.primary} /></View>
              <Text style={styles.eyebrow}>MES COMMANDES</Text>
              <Text style={styles.title}>Vos achats ZIDA sur cet appareil</Text>
              <Text style={styles.subtitle}>En attendant la synchronisation complète avec votre compte client, cet écran conserve les commandes passées depuis cette application.</Text>
            </View>

            <View style={styles.notice}>
              <Ionicons name="information-circle-outline" size={21} color={Colors.info} />
              <Text style={styles.noticeText}>Les statuts affichés ici ne sont pas encore synchronisés automatiquement avec le back-office ZIDA.</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><Ionicons name="bag-handle-outline" size={38} color={Colors.primary} /></View>
            <Text style={styles.emptyTitle}>Aucune commande sur cet appareil</Text>
            <Text style={styles.emptyText}>Les prochaines commandes passées depuis l’application apparaîtront ici automatiquement.</Text>
          </View>
        }
        renderItem={({ item }: { item: Order }) => (
          <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate('OrderDetail', { order: item })} activeOpacity={0.84}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.orderNumber}>#{item.id}</Text>
                <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor(item.status)}18` }]}>
                <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{STATUS_LABELS[item.status] || item.status}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={17} color={Colors.secondary} />
              <Text style={styles.metaText} numberOfLines={1}>{item.deliveryAddress}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="cube-outline" size={17} color={Colors.secondary} />
              <Text style={styles.metaText}>{item.items.length} article{item.items.length > 1 ? 's' : ''}</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.total}>{formatPrice(item.totalAmount)}</Text>
              <View style={styles.detailLink}>
                <Text style={styles.detailText}>Voir le détail</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  list: { paddingBottom: 120 },
  hero: { margin: Spacing.lg, marginBottom: 12, backgroundColor: '#0A365D', borderRadius: Radius.xl, padding: Spacing.xl },
  heroIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  eyebrow: { color: '#BDD3E4', fontSize: 11, fontWeight: '900', letterSpacing: 0.9 },
  title: { color: Colors.white, fontSize: Typography.h1, lineHeight: 31, fontWeight: '900', marginTop: 5 },
  subtitle: { color: '#DFEAF2', lineHeight: 20, marginTop: 8 },
  notice: { flexDirection: 'row', backgroundColor: '#EEF6FF', borderRadius: Radius.md, marginHorizontal: Spacing.lg, marginBottom: 18, padding: Spacing.lg },
  noticeText: { flex: 1, marginLeft: 8, color: Colors.text, fontSize: 12, lineHeight: 18 },
  orderCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, marginHorizontal: Spacing.lg, marginBottom: 14, padding: Spacing.lg, ...Shadow.card },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderNumber: { color: Colors.text, fontSize: 16, fontWeight: '900' },
  orderDate: { color: Colors.textSecondary, fontSize: 11, marginTop: 3 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.pill },
  statusText: { fontSize: 10, fontWeight: '900' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  metaText: { flex: 1, marginLeft: 7, color: Colors.textSecondary, fontSize: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#EDF0F3' },
  total: { color: Colors.secondary, fontSize: 18, fontWeight: '900' },
  detailLink: { flexDirection: 'row', alignItems: 'center' },
  detailText: { color: Colors.primary, fontSize: 11, fontWeight: '900', marginRight: 3 },
  emptyState: { alignItems: 'center', paddingHorizontal: 34, paddingTop: 40 },
  emptyIcon: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: Colors.text, fontSize: Typography.h3, fontWeight: '900', marginTop: 16, textAlign: 'center' },
  emptyText: { color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginTop: 7 },
});
