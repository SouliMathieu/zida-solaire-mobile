// src/components/home/StatsCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface StatsCardProps {
  icon: string;
  title: string;
  value: string;
  color: string;
}

export default function StatsCard({ icon, title, value, color }: StatsCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: `${color}15` }]}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color={Colors.white} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
