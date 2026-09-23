import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';
import { useCartStore } from '../../store/cartStore';
import { useOrdersStore } from '../../store/ordersStore';
import { useNotifications } from '../../hooks/useNotifications';
import { revokePushTokenOnLogout } from '../../services/pushNotifications';
import { ProfileStackParamList } from '../../navigation/ProfileStackNavigator';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, isAuthenticated, logout } = useUserStore();
  const cartCount = useCartStore((state) => state.getTotalItems());
  const orderCount = useOrdersStore((state) => state.getOrders().length);
  const notifications = useNotifications();
  const unreadCount = notifications.data?.unreadCount || 0;

  const handleLogout = async () => {
    await revokePushTokenOnLogout();
    logout();
  };

  if (!isAuthenticated()) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.guestContent}>
        <View style={styles.guestIcon}><Ionicons name="person-outline" size={40} color={Colors.primary} /></View>
        <Text style={styles.guestTitle}>Votre espace ZIDA</Text>
        <Text style={styles.guestText}>Connectez-vous pour gérer vos informations et suivre vos commandes, installations et interventions.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}><Text style={styles.primaryButtonText}>Se connecter</Text></TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}><Text style={styles.secondaryButtonText}>Créer un compte</Text></TouchableOpacity>

        <View style={styles.guestActions}>
          <QuickRow icon="cart-outline" title="Mon panier" subtitle={`${cartCount} article${cartCount > 1 ? 's' : ''}`} onPress={() => navigation.navigate('CartArea')} />
          <QuickRow icon="document-text-outline" title="Demander un devis" subtitle="Recevez une proposition personnalisée" onPress={() => navigation.navigate('Devis')} />
          <QuickRow icon="headset-outline" title="Assistance / SAV" subtitle="Signaler un problème technique" onPress={() => navigation.navigate('RepairRequest')} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}><Ionicons name="person" size={30} color={Colors.white} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{user?.name || 'Client ZIDA'}</Text>
          <Text style={styles.userMeta}>{user?.phone || user?.email || 'Compte client'}</Text>
          {!!user?.city && <Text style={styles.userMeta}>{user.city}</Text>}
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}><Ionicons name="create-outline" size={20} color={Colors.secondary} /></TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Mes activités</Text>
      <View style={styles.statsRow}>
        <StatCard icon="cart-outline" value={String(cartCount)} label="Panier" onPress={() => navigation.navigate('CartArea')} />
        <StatCard icon="receipt-outline" value={String(orderCount)} label="Commandes" onPress={() => navigation.navigate('OrdersArea')} />
        <StatCard icon="notifications-outline" value={String(unreadCount)} label="À lire" onPress={() => navigation.navigate('Notifications')} />
      </View>

      <Text style={styles.sectionTitle}>Services</Text>
      <View style={styles.cardGroup}>
        <MenuRow icon="notifications-outline" title="Activité & notifications" subtitle={unreadCount > 0 ? `${unreadCount} mise${unreadCount > 1 ? 's' : ''} à jour non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est à jour'} badge={unreadCount} onPress={() => navigation.navigate('Notifications')} />
        <MenuRow icon="receipt-outline" title="Mes commandes" subtitle="Suivre mes commandes" onPress={() => navigation.navigate('OrdersArea')} />
        <MenuRow icon="cart-outline" title="Mon panier" subtitle={`${cartCount} article${cartCount > 1 ? 's' : ''} en attente`} onPress={() => navigation.navigate('CartArea')} />
        <MenuRow icon="document-text-outline" title="Demander un devis" subtitle="Obtenir une proposition personnalisée" onPress={() => navigation.navigate('Devis')} />
        <MenuRow icon="construct-outline" title="Demande d'installation" subtitle="Planifier un nouveau projet" onPress={() => navigation.navigate('InstallationRequest')} />
        <MenuRow icon="headset-outline" title="Assistance / SAV" subtitle="Créer une demande de dépannage" onPress={() => navigation.navigate('RepairRequest')} last />
      </View>

      <Text style={styles.sectionTitle}>Mon compte</Text>
      <View style={styles.cardGroup}>
        <MenuRow icon="person-outline" title="Mes informations" subtitle="Modifier mes coordonnées" onPress={() => navigation.navigate('EditProfile')} />
        <MenuRow icon="mail-outline" title="Nous contacter" subtitle="Questions commerciales ou techniques" onPress={() => navigation.navigate('Contact')} />
        <MenuRow icon="information-circle-outline" title="À propos de ZIDA" subtitle="Entreprise, services et informations" onPress={() => navigation.navigate('About')} last />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatCard({ icon, value, label, onPress }: { icon: string; value: string; label: string; onPress: () => void }) {
  return <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.82}><Ionicons name={icon as any} size={22} color={Colors.primary} /><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></TouchableOpacity>;
}

function MenuRow({ icon, title, subtitle, onPress, last, badge = 0 }: { icon: string; title: string; subtitle: string; onPress: () => void; last?: boolean; badge?: number }) {
  return (
    <TouchableOpacity style={[styles.menuRow, last && styles.menuRowLast]} onPress={onPress} activeOpacity={0.78}>
      <View style={styles.menuIcon}><Ionicons name={icon as any} size={22} color={Colors.secondary} /></View>
      <View style={{ flex: 1 }}><Text style={styles.menuTitle}>{title}</Text><Text style={styles.menuSubtitle}>{subtitle}</Text></View>
      {badge > 0 && <View style={styles.menuBadge}><Text style={styles.menuBadgeText}>{badge > 99 ? '99+' : badge}</Text></View>}
      <Ionicons name="chevron-forward" size={19} color={Colors.gray} />
    </TouchableOpacity>
  );
}

function QuickRow({ icon, title, subtitle, onPress }: { icon: string; title: string; subtitle: string; onPress: () => void }) {
  return <TouchableOpacity style={styles.quickRow} onPress={onPress}><View style={styles.menuIcon}><Ionicons name={icon as any} size={22} color={Colors.secondary} /></View><View style={{ flex: 1 }}><Text style={styles.menuTitle}>{title}</Text><Text style={styles.menuSubtitle}>{subtitle}</Text></View><Ionicons name="chevron-forward" size={19} color={Colors.gray} /></TouchableOpacity>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { padding: Spacing.lg, paddingBottom: 120 },
  guestContent: { padding: Spacing.xl, paddingTop: 70, paddingBottom: 120 },
  guestIcon: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  guestTitle: { marginTop: 20, textAlign: 'center', fontSize: Typography.h1, fontWeight: '900', color: Colors.text },
  guestText: { marginTop: 9, textAlign: 'center', color: Colors.textSecondary, lineHeight: 21 },
  primaryButton: { height: 52, borderRadius: Radius.md, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 26 },
  primaryButtonText: { color: Colors.white, fontWeight: '900' },
  secondaryButton: { height: 52, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  secondaryButtonText: { color: Colors.secondary, fontWeight: '900' },
  guestActions: { marginTop: 28, backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  quickRow: { minHeight: 70, flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, borderBottomWidth: 1, borderBottomColor: '#EEF1F4' },
  headerCard: { backgroundColor: '#0A365D', borderRadius: Radius.xl, padding: Spacing.xl, flexDirection: 'row', alignItems: 'center', ...Shadow.card },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  userName: { color: Colors.white, fontSize: 20, fontWeight: '900' },
  userMeta: { color: '#DCE7F0', marginTop: 3, fontSize: 13 },
  editButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: Typography.h2, fontWeight: '900', color: Colors.text, marginTop: 28, marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { width: '31.5%', backgroundColor: Colors.white, borderRadius: Radius.lg, paddingVertical: 16, alignItems: 'center', ...Shadow.card },
  statValue: { color: Colors.text, fontSize: 20, fontWeight: '900', marginTop: 7 },
  statLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 2, textAlign: 'center' },
  cardGroup: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  menuRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, borderBottomWidth: 1, borderBottomColor: '#EEF1F4' },
  menuRowLast: { borderBottomWidth: 0 },
  menuIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#EDF4FA', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuTitle: { color: Colors.text, fontWeight: '800', fontSize: 14 },
  menuSubtitle: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  menuBadge: { minWidth: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  menuBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '900' },
  logoutButton: { height: 52, borderRadius: Radius.md, borderWidth: 1, borderColor: '#F0C5C5', backgroundColor: '#FFF8F8', marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: Colors.error, fontWeight: '900', marginLeft: 8 },
});
