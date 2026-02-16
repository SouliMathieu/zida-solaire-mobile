// src/screens/orders/OrdersScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { useOrders } from '../../hooks/useOrders';
import { OrdersStackParamList } from '../../navigation/OrdersStackNavigator';
import { Order } from '../../types';

type OrdersScreenNavigationProp = NativeStackNavigationProp<OrdersStackParamList>;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'EN_ATTENTE':
      return Colors.warning;
    case 'CONFIRMEE':
      return Colors.info;
    case 'EN_PREPARATION':
      return Colors.purple;
    case 'PRETE':
      return Colors.teal;
    case 'EN_LIVRAISON':
      return Colors.primary;
    case 'LIVREE':
      return Colors.success;
    case 'ANNULEE':
      return Colors.error;
    default:
      return Colors.gray;
  }
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

export default function OrdersScreen() {
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const { data: orders = [], isLoading, refetch } = useOrders();

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
    });
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', { order });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={[Colors.primary, Colors.accent]}
          style={styles.emptyIconContainer}
        >
          <Ionicons name="receipt-outline" size={64} color={Colors.white} />
        </LinearGradient>
        <Text style={styles.emptyTitle}>Aucune commande</Text>
        <Text style={styles.emptyText}>
          Vous n'avez pas encore passé de commande
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
            colors={[Colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => handleOrderPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{item.id}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(item.status)}20` }
                ]}
              >
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) }
                ]}>
                  {STATUS_LABELS[item.status]}
                </Text>
              </View>
            </View>

            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>

            <View style={styles.orderInfo}>
              <Ionicons name="location-outline" size={16} color={Colors.secondary} />
              <Text style={styles.orderAddress} numberOfLines={1}>
                {item.deliveryAddress}
              </Text>
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>
                {formatPrice(item.totalAmount)}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderAddress: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
});