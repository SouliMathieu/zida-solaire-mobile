import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, RefreshControl, ActivityIndicator, Linking } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotificationPreferences, useNotifications, useUpdateNotificationPreferences } from '../../hooks/useNotifications';
import { CustomerNotification, NotificationPreferences } from '../../services/api';

const ICONS: Record<string, string> = { order: 'receipt-outline', installation: 'construct-outline', sav: 'headset-outline', system: 'notifications-outline' };

export default function NotificationsScreen() {
  const feed = useNotifications();
  const prefs = useNotificationPreferences();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const updatePrefs = useUpdateNotificationPreferences();
  const notifications = feed.data?.notifications || [];
  const unreadCount = feed.data?.unreadCount || 0;
  const refreshing = feed.isRefetching || prefs.isRefetching;

  const toggle = (key: keyof NotificationPreferences, value: boolean) => updatePrefs.mutate({ [key]: value });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { feed.refetch(); prefs.refetch(); }} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroIcon}><Ionicons name="notifications-outline" size={28} color={Colors.primary} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>CENTRE D’ACTIVITÉ</Text>
          <Text style={styles.title}>Restez au courant</Text>
          <Text style={styles.subtitle}>Commandes, installations et SAV au même endroit.</Text>
        </View>
        {unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text></View>}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Activité récente</Text>
        {unreadCount > 0 && <TouchableOpacity onPress={() => markAll.mutate()}><Text style={styles.markAll}>Tout marquer comme lu</Text></TouchableOpacity>}
      </View>

      {feed.isLoading ? (
        <View style={styles.loadingCard}><ActivityIndicator color={Colors.primary} /></View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="checkmark-circle-outline" size={36} color={Colors.success} />
          <Text style={styles.emptyTitle}>Tout est calme</Text>
          <Text style={styles.emptyText}>Les prochains changements de commande, installation ou SAV apparaîtront ici.</Text>
        </View>
      ) : (
        <View style={styles.card}>
          {notifications.map((item, index) => <ActivityRow key={item.id} item={item} last={index === notifications.length - 1} onPress={() => !item.readAt && markRead.mutate(item.id)} />)}
        </View>
      )}

      <Text style={styles.preferencesTitle}>Mes préférences</Text>
      <View style={styles.card}>
        <PreferenceRow icon="receipt-outline" title="Commandes" subtitle="Confirmation, préparation, expédition et livraison" value={prefs.data?.orderUpdates ?? true} onValueChange={(v) => toggle('orderUpdates', v)} />
        <PreferenceRow icon="construct-outline" title="Installations" subtitle="Devis, planification et fin de chantier" value={prefs.data?.installationUpdates ?? true} onValueChange={(v) => toggle('installationUpdates', v)} />
        <PreferenceRow icon="headset-outline" title="Assistance / SAV" subtitle="Prise en charge et clôture de vos tickets" value={prefs.data?.savUpdates ?? true} onValueChange={(v) => toggle('savUpdates', v)} />
        <PreferenceRow icon="bulb-outline" title="Conseils solaires" subtitle="Astuces utiles pour votre installation" value={prefs.data?.solarTips ?? true} onValueChange={(v) => toggle('solarTips', v)} />
        <PreferenceRow icon="pricetag-outline" title="Offres commerciales" subtitle="Promotions et offres ZIDA" value={prefs.data?.promotions ?? false} onValueChange={(v) => toggle('promotions', v)} last />
      </View>

      <TouchableOpacity style={styles.systemButton} onPress={() => Linking.openSettings()}>
        <Ionicons name="settings-outline" size={19} color={Colors.secondary} />
        <Text style={styles.systemButtonText}>Ouvrir les paramètres système</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ActivityRow({ item, last, onPress }: { item: CustomerNotification; last?: boolean; onPress: () => void }) {
  const unread = !item.readAt;
  const date = new Date(item.createdAt);
  const time = Number.isNaN(date.getTime()) ? '' : date.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  return (
    <TouchableOpacity style={[styles.row, last && styles.rowLast, unread && styles.unreadRow]} onPress={onPress}>
      <View style={[styles.rowIcon, unread && styles.rowIconUnread]}><Ionicons name={(ICONS[item.type] || 'notifications-outline') as any} size={21} color={unread ? Colors.primary : Colors.secondary} /></View>
      <View style={{ flex: 1 }}>
        <View style={styles.rowTitleLine}><Text style={[styles.rowTitle, unread && styles.rowTitleUnread]}>{item.title}</Text>{unread && <View style={styles.dot} />}</View>
        <Text style={styles.rowMessage}>{item.message}</Text>
        {!!time && <Text style={styles.rowTime}>{time}</Text>}
      </View>
    </TouchableOpacity>
  );
}

function PreferenceRow({ icon, title, subtitle, value, onValueChange, last }: { icon: string; title: string; subtitle: string; value: boolean; onValueChange: (value: boolean) => void; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.rowIcon}><Ionicons name={icon as any} size={20} color={Colors.secondary} /></View>
      <View style={{ flex: 1 }}><Text style={styles.preferenceTitle}>{title}</Text><Text style={styles.preferenceSubtitle}>{subtitle}</Text></View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: Colors.light, true: '#FFD8C8' }} thumbColor={value ? Colors.primary : Colors.gray} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { padding: Spacing.lg, paddingBottom: 80 },
  hero: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  heroIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  eyebrow: { color: Colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  title: { color: Colors.text, fontSize: Typography.h1, fontWeight: '900', marginTop: 3 },
  subtitle: { color: Colors.textSecondary, fontSize: 12, marginTop: 4 },
  badge: { minWidth: 30, height: 30, borderRadius: 15, paddingHorizontal: 8, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: Colors.white, fontWeight: '900', fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  sectionTitle: { color: Colors.text, fontWeight: '900', fontSize: Typography.h2 },
  markAll: { color: Colors.secondary, fontWeight: '800', fontSize: 12 },
  loadingCard: { minHeight: 100, backgroundColor: Colors.white, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  emptyCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, alignItems: 'center', padding: 28, ...Shadow.card },
  emptyTitle: { color: Colors.text, fontWeight: '900', marginTop: 10 },
  emptyText: { color: Colors.textSecondary, textAlign: 'center', lineHeight: 18, marginTop: 5, fontSize: 12 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  row: { minHeight: 72, flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEF1F4' },
  rowLast: { borderBottomWidth: 0 },
  unreadRow: { backgroundColor: '#FFFCFA' },
  rowIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#EDF4FA', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowIconUnread: { backgroundColor: '#FFF1EA' },
  rowTitleLine: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { color: Colors.text, fontWeight: '700', fontSize: 14 },
  rowTitleUnread: { fontWeight: '900' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.primary, marginLeft: 7 },
  rowMessage: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 4 },
  rowTime: { color: Colors.gray, fontSize: 10, marginTop: 6 },
  preferencesTitle: { color: Colors.text, fontWeight: '900', fontSize: Typography.h2, marginTop: 28, marginBottom: 11 },
  preferenceTitle: { color: Colors.text, fontWeight: '800', fontSize: 13 },
  preferenceSubtitle: { color: Colors.textSecondary, fontSize: 11, marginTop: 3, paddingRight: 8 },
  systemButton: { height: 50, borderRadius: Radius.md, borderWidth: 1, borderColor: '#D6E1EB', backgroundColor: Colors.white, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  systemButtonText: { color: Colors.secondary, fontWeight: '800', marginLeft: 8, fontSize: 13 },
});
