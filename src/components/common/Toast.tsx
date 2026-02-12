// src/components/common/Toast.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
}

export default function Toast({ message, type, visible, onHide }: ToastProps) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const iconName = {
    success: 'checkmark-circle',
    error: 'close-circle',
    info: 'information-circle',
  }[type];

  const backgroundColor = {
    success: Colors.success,
    error: Colors.error,
    info: Colors.info,
  }[type];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor, opacity },
      ]}
    >
      <Ionicons name={iconName as any} size={24} color={Colors.white} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 9999,
  },
  message: {
    flex: 1,
    fontSize: 16,
    color: Colors.white,
    marginLeft: 12,
    fontWeight: '600',
  },
});
