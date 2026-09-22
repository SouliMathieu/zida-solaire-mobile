import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';

type Props = {
  icon: string;
  label: string;
  onPress: () => void;
};

export default function QuickActionCard({ icon, label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon as any} size={22} color={Colors.secondary} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '23%',
    minHeight: 92,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    ...Shadow.card,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF4FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.caption,
    color: Colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
});
