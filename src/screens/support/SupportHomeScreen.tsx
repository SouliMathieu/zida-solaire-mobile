import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { SupportStackParamList } from '../../navigation/SupportStackNavigator';
import { useUserStore } from '../../store/userStore';

type Nav = NativeStackNavigationProp<SupportStackParamList, 'SupportHome'>;

const phone = '+22625506464';
const whatsapp = '22674339977';

export default function SupportHomeScreen() {
  const navigation = useNavigation<Nav>();
  const authenticated = useUserStore((state) => state.isAuthenticated());

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.iconWrap}><Ionicons name="headset" size={30} color={Colors.primary} /></View>
        <Text style={styles.eyebrow}>ASSISTANCE ZIDA</Text>
        <Text style={styles.title}>Une aide simple quand vous en avez besoin</Text>
        <Text style={styles.subtitle}>Dépannage, question, installation ou suivi : choisissez le canal le plus rapide pour votre situation.</Text>
      </View>

      <Text style={styles.sectionTitle}>Que souhaitez-vous faire ?</Text>
      <SupportCard
        icon="build-outline"
        title="Signaler un problème"
        text="Onduleur, batterie, panneaux, pompe ou installation électrique."
        onPress={() => navigation.navigate('RepairRequest')}
      />
      <SupportCard
        icon="receipt-outline"
        title="Mes tickets SAV"
        text={authenticated ? 'Consultez les demandes liées à votre compte et leur statut.' : 'Connectez-vous pour suivre vos demandes SAV.'}
        onPress={() => navigation.navigate('RepairTickets')}
      />
      <SupportCard
        icon="construct-outline"
        title="Demander une installation"
        text="Planifiez une étude ou une intervention avec l'équipe technique."
        onPress={() => navigation.navigate('InstallationRequest')}
      />
      <SupportCard
        icon="chatbubble-ellipses-outline"
        title="Écrire à ZIDA"
        text="Posez une question générale ou commerciale."
        onPress={() => navigation.navigate('Contact')}
      />

      <View style={styles.contactRow}>
        <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL(`tel:${phone}`)}>
          <Ionicons name="call" size={21} color={Colors.white} />
          <Text style={styles.contactText}>Appeler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.contactButton, styles.whatsappButton]} onPress={() => Linking.openURL(`https://wa.me/${whatsapp}`)}>
          <Ionicons name="logo-whatsapp" size={22} color={Colors.white} />
          <Text style={styles.contactText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="time-outline" size={23} color={Colors.secondary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.infoTitle}>Votre demande reste traçable</Text>
          <Text style={styles.infoText}>Les tickets SAV et demandes d'installation envoyés depuis l'application sont enregistrés dans le même système que ceux du site ZIDA.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SupportCard({ icon, title, text, onPress }: { icon: string; title: string; text: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.cardIcon}><Ionicons name={icon as any} size={24} color={Colors.primary} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardText}>{text}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { padding: Spacing.lg, paddingBottom: 120 },
  hero: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, ...Shadow.card },
  iconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: Colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1, marginTop: 18 },
  title: { fontSize: Typography.h1, lineHeight: 31, fontWeight: '900', color: Colors.text, marginTop: 7 },
  subtitle: { color: Colors.textSecondary, lineHeight: 21, marginTop: 9 },
  sectionTitle: { fontSize: Typography.h2, fontWeight: '900', color: Colors.text, marginTop: 26, marginBottom: 12 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: 12, flexDirection: 'row', alignItems: 'center', ...Shadow.card },
  cardIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFF4EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: Colors.text },
  cardText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, marginTop: 4, paddingRight: 6 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  contactButton: { width: '48%', height: 52, borderRadius: Radius.md, backgroundColor: Colors.secondary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  whatsappButton: { backgroundColor: '#1FA855' },
  contactText: { color: Colors.white, fontWeight: '900', marginLeft: 8 },
  infoCard: { flexDirection: 'row', backgroundColor: '#EEF4FA', borderRadius: Radius.lg, padding: Spacing.lg, marginTop: 18 },
  infoTitle: { fontWeight: '900', color: Colors.text },
  infoText: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 4 },
});
