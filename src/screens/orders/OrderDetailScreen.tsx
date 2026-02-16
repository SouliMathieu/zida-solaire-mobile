// src/screens/orders/OrderDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import Button from '../../components/common/Button';
import { useCancelOrder } from '../../hooks/useOrders';
import { Order } from '../../types';

type OrderDetailRouteProp = RouteProp<
  { OrderDetail: { order: Order } },
  'OrderDetail'
>;

const STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: Colors.warning,
  CONFIRMEE: Colors.info,
  EN_PREPARATION: Colors.info,
  PRETE: Colors.success,
  EN_LIVRAISON: Colors.primary,
  LIVREE: Colors.success,
  ANNULEE: Colors.error,
};

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmée',
  EN_PREPARATION: 'En préparation',
  PRETE: 'Prête',
  EN_LIVRAISON: 'En livraison',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée',
};

const STATUS_ICONS: Record<string, string> = {
  EN_ATTENTE: 'time-outline',
  CONFIRMEE: 'checkmark-circle-outline',
  EN_PREPARATION: 'build-outline',
  PRETE: 'cube-outline',
  EN_LIVRAISON: 'bicycle-outline',
  LIVREE: 'checkmark-done-circle-outline',
  ANNULEE: 'close-circle-outline',
};

export default function OrderDetailScreen() {
  const route = useRoute<OrderDetailRouteProp>();
  const { order } = route.params;
  const cancelOrder = useCancelOrder();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCancel = ['EN_ATTENTE', 'CONFIRMEE'].includes(order.status);

  const handleCancelOrder = () => {
    Alert.alert(
      'Annuler la commande',
      'Êtes-vous sûr de vouloir annuler cette commande ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelOrder.mutateAsync(order.id);
              Alert.alert('Succès', 'Votre commande a été annulée');
            } catch (error) {
              Alert.alert('Erreur', "Impossible d'annuler la commande");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête de commande */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.orderNumber}>Commande #{order.id}</Text>
              <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: STATUS_COLORS[order.status] },
              ]}
            >
              <Ionicons
                name={STATUS_ICONS[order.status] as any}
                size={16}
                color={Colors.white}
              />
              <Text style={styles.statusText}>{STATUS_LABELS[order.status]}</Text>
            </View>
          </View>
        </View>

        {/* Progression de la commande */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suivi de la commande</Text>
          <View style={styles.timeline}>
            {[
              { status: 'EN_ATTENTE', label: 'En attente' },
              { status: 'CONFIRMEE', label: 'Confirmée' },
              { status: 'EN_PREPARATION', label: 'En préparation' },
              { status: 'EN_LIVRAISON', label: 'En livraison' },
              { status: 'LIVREE', label: 'Livrée' },
            ].map((step, index) => {
              const isActive = getStatusIndex(order.status) >= index;
              const isCurrent = step.status === order.status;

              return (
                <View key={step.status} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        isActive && styles.timelineDotActive,
                        isCurrent && styles.timelineDotCurrent,
                      ]}
                    >
                      {isActive && (
                        <Ionicons
                          name="checkmark"
                          size={12}
                          color={Colors.white}
                        />
                      )}
                    </View>
                    {index < 4 && (
                      <View
                        style={[
                          styles.timelineLine,
                          isActive && styles.timelineLineActive,
                        ]}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.timelineLabel,
                      isActive && styles.timelineLabelActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Informations de livraison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de livraison</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Adresse</Text>
                <Text style={styles.infoValue}>{order.deliveryAddress}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>{order.phone}</Text>
              </View>
            </View>

            {order.notes && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color={Colors.primary}
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Notes</Text>
                    <Text style={styles.infoValue}>{order.notes}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Résumé de la commande */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(order.totalAmount)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={styles.summaryValue}>Gratuite</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatPrice(order.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Mode de paiement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>
          <View style={styles.paymentCard}>
            <Ionicons name="cash-outline" size={24} color={Colors.primary} />
            <Text style={styles.paymentText}>Paiement à la livraison</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Footer avec bouton d'annulation */}
      {canCancel && (
        <View style={styles.footer}>
          <Button
            title="Annuler la commande"
            onPress={handleCancelOrder}
            loading={cancelOrder.isPending}
            style={styles.cancelButton}
            variant="outline"
          />
        </View>
      )}
    </View>
  );
}

function getStatusIndex(status: string): number {
  const statuses = ['EN_ATTENTE', 'CONFIRMEE', 'EN_PREPARATION', 'EN_LIVRAISON', 'LIVREE'];
  const index = statuses.indexOf(status);
  return index === -1 ? 0 : index;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  timeline: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotActive: {
    backgroundColor: Colors.primary,
  },
  timelineDotCurrent: {
    backgroundColor: Colors.success,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 30,
    backgroundColor: Colors.light,
  },
  timelineLineActive: {
    backgroundColor: Colors.primary,
  },
  timelineLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingTop: 2,
  },
  timelineLabelActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light,
    marginVertical: 12,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  paymentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 140,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
  },
  cancelButton: {
    borderColor: Colors.error,
  },
  
});
