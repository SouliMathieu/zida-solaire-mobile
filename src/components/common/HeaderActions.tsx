import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Spacing } from '../../theme/tokens';
import { useCartStore } from '../../store/cartStore';
import { useNotifications } from '../../hooks/useNotifications';

interface HeaderActionsProps {
  onNotifications: () => void;
  onCart: () => void;
  overlay?: boolean;
}

export default function HeaderActions({
  onNotifications,
  onCart,
  overlay = false,
}: HeaderActionsProps) {
  const totalItems = useCartStore(
    (state) => state.getTotalItems()
  );

  const notifications = useNotifications();
  const unreadCount =
    notifications.data?.unreadCount || 0;

  const iconColor = overlay ? Colors.white : Colors.text;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          overlay && styles.overlayButton,
        ]}
        onPress={onNotifications}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Voir mes notifications"
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color={iconColor}
        />

        {unreadCount > 0 && (
          <View
            style={[
              styles.badge,
              overlay && styles.overlayBadge,
            ]}
          >
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          overlay && styles.overlayButton,
        ]}
        onPress={onCart}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Voir mon panier"
      >
        <Ionicons
          name="cart-outline"
          size={22}
          color={iconColor}
        />

        {totalItems > 0 && (
          <View
            style={[
              styles.badge,
              overlay && styles.overlayBadge,
            ]}
          >
            <Text style={styles.badgeText}>
              {totalItems > 99 ? '99+' : totalItems}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E9EDF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },

  overlayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.12)',
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  overlayBadge: {
    borderColor: Colors.white,
  },

  badgeText: {
    color: Colors.white,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
});
