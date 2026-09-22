// src/screens/orders/OrderDetailScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Order } from '../../types';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';

type Route = RouteProp<{ OrderDetail: { order: Order } }, 'OrderDetail'>;

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
const formatDate = (value: string) => new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function OrderDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<any>();
  const { order } = route.params;

  const goToSupport = () => {
    navigation.getParent()?.getParent()?.getParent()?.navigate('Assistance');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.eyebrow}>COMMANDE</Text>
            <Text style={styles.orderNumber}>#{order.id}</Text>
            <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor(order.status)}18` }]}>
            <Text style={[styles.statusText, { color: statusColor(order.status) }]}>{STATUS_LABELS[order.status] || order.status}</Text>
          </View>
        </View>
        <Text style={styles.heroTotal}>{formatPrice(order.totalAmount)}</Text>
      </View>

      <View style={styles.notice}>
        <Ionicons name="information-circle-outline" size={22} color={Colors.info} />
        <Text style={styles.noticeText}>Cette commande a bien été créée depuis l’application. Son suivi détaillé sera synchronisé avec le back-office ZIDA dès que l’espace client serveur sera activé.</Text>
      </View>

      <Section title="Articles">
        <View style={styles.card}>
          {order.items.map((item, index) => (
            <View key={`${item.productId}-${index}`} style={[styles.itemRow, index === order.items.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.itemIcon}><Ionicons name="cube-outline" size={20} color={Colors.secondary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemMeta}>{item.quantity} × {formatPrice(item.price)}</Text>
              </View>
              <Text style={styles.itemTotal}>{formatPrice(item.quantity * item.price)}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Livraison">
        <View style={styles.card}>
          <InfoRow icon="location-outline" label="Adresse" value={order.deliveryAddress} />
          <InfoRow icon="call-outline" label="Téléphone" value={order.phone} />
          {!!order.notes && <InfoRow icon="document-text-outline" label="Notes" value={order.notes} last />}
        </View>
      </Section>

      <Section title="Paiement">
        <View style={styles.paymentCard}>
          <View style={styles.paymentIcon}><Ionicons name="cash-outline" size={23} color={Colors.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentTitle}>Paiement à la livraison</Text>
            <Text style={styles.paymentText}>Le règlement est effectué au moment de la réception selon les conditions convenues avec ZIDA.</Text>
          </View>
        </View>
      </Section>

      <Section title="Besoin d’une modification ?">
        <TouchableOpacity style={styles.supportCard} onPress={goToSupport} activeOpacity={0.85}>
          <View style={styles.supportIcon}><Ionicons name="headset-outline" size={24} color={Colors.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.supportTitle}>Contacter ZIDA SOLAIRE</Text>
            <Text style={styles.supportText}>Pour une annulation, une modification d’adresse ou une question sur le statut de la commande.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>
      </Section>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;
}

function InfoRow({ icon, label, value, last = false }: { icon: string; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <Ionicons name={icon as any} size={20} color={Colors.primary} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { padding: Spacing.lg },
  hero: { backgroundColor: '#0A365D', borderRadius: Radius.xl, padding: Spacing.xl },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { color: '#BDD3E4', fontSize: 11, fontWeight: '900', letterSpacing: 0.9 },
  orderNumber: { color: Colors.white, fontSize: Typography.h1, fontWeight: '900', marginTop: 4 },
  orderDate: { color: '#D9E6EF', fontSize: 11, marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.pill, backgroundColor: Colors.white },
  statusText: { fontSize: 10, fontWeight: '900' },
  heroTotal: { color: Colors.white, fontSize: 28, fontWeight: '900', marginTop: 24 },
  notice: { flexDirection: 'row', backgroundColor: '#EEF6FF', borderRadius: Radius.md, padding: Spacing.lg, marginTop: 16 },
  noticeText: { flex: 1, marginLeft: 8, color: Colors.text, fontSize: 12, lineHeight: 18 },
  section: { marginTop: 26 },
  sectionTitle: { color: Colors.text, fontSize: Typography.h3, fontWeight: '900', marginBottom: 12 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, paddingHorizontal: Spacing.lg, ...Shadow.card },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EDF0F3' },
  itemIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EDF4FA', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  itemName: { color: Colors.text, fontWeight: '800', fontSize: 13 },
  itemMeta: { color: Colors.textSecondary, fontSize: 11, marginTop: 3 },
  itemTotal: { color: Colors.secondary, fontWeight: '900', fontSize: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EDF0F3' },
  infoLabel: { color: Colors.textSecondary, fontSize: 10, fontWeight: '700' },
  infoValue: { color: Colors.text, fontSize: 13, marginTop: 3, lineHeight: 18 },
  paymentCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  paymentIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  paymentTitle: { color: Colors.text, fontWeight: '900' },
  paymentText: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 4 },
  supportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  supportIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  supportTitle: { color: Colors.text, fontWeight: '900' },
  supportText: { color: Colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
});
