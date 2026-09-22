import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { useUserStore } from '../../store/userStore';
import { EnergyStackParamList } from '../../navigation/EnergyStackNavigator';

type Nav = NativeStackNavigationProp<EnergyStackParamList, 'EnergyHome'>;

export default function EnergyHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { isAuthenticated } = useUserStore();

  const goToAccount = () => {
    // @ts-ignore nested tab navigation
    navigation.getParent()?.navigate('Compte');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="sunny" size={30} color={Colors.primary} />
        </View>
        <Text style={styles.eyebrow}>MON ÉNERGIE</Text>
        <Text style={styles.title}>Comprenez vos besoins avant d'investir</Text>
        <Text style={styles.subtitle}>
          Estimez votre système, préparez votre étude technique et retrouvez bientôt ici tout le suivi de votre installation ZIDA.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('SolarAssistant')} activeOpacity={0.86}>
          <Text style={styles.primaryText}>Estimer mes besoins</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Vos outils énergie</Text>
      <View style={styles.grid}>
        <ActionCard icon="calculator-outline" title="Assistant solaire" text="Dimensionnez une première solution selon vos usages." onPress={() => navigation.navigate('SolarAssistant')} />
        <ActionCard icon="document-text-outline" title="Étude technique" text="Transformez votre estimation en demande auprès de ZIDA." onPress={() => navigation.navigate('SolarAssistant')} />
      </View>

      <View style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View style={styles.projectIcon}>
            <Ionicons name="home-outline" size={24} color={Colors.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.projectTitle}>Mes installations</Text>
            <Text style={styles.projectText}>
              {isAuthenticated()
                ? 'Le suivi de vos projets, garanties et équipements sera regroupé ici.'
                : 'Connectez-vous pour retrouver vos projets, garanties et interventions.'}
            </Text>
          </View>
        </View>
        {!isAuthenticated() && (
          <TouchableOpacity style={styles.secondaryButton} onPress={goToAccount}>
            <Text style={styles.secondaryText}>Accéder à mon compte</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tipCard}>
        <Ionicons name="shield-checkmark-outline" size={25} color={Colors.success} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.tipTitle}>Une estimation, pas un devis définitif</Text>
          <Text style={styles.tipText}>Le dimensionnement final dépend d'une étude du site, de vos usages réels et du matériel disponible chez ZIDA.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ActionCard({ icon, title, text, onPress }: { icon: string; title: string; text: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.actionIcon}><Ionicons name={icon as any} size={24} color={Colors.primary} /></View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionText}>{text}</Text>
      <Ionicons name="arrow-forward" size={18} color={Colors.secondary} style={{ marginTop: 12 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { padding: Spacing.lg, paddingBottom: 120 },
  hero: { backgroundColor: '#0A365D', borderRadius: Radius.xl, padding: Spacing.xl, ...Shadow.card },
  heroIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  eyebrow: { color: '#BFD6E8', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  title: { color: Colors.white, fontSize: Typography.h1, lineHeight: 31, fontWeight: '900', marginTop: 7 },
  subtitle: { color: '#DFEAF2', lineHeight: 21, marginTop: 10 },
  primaryButton: { height: 52, borderRadius: Radius.md, backgroundColor: Colors.primary, marginTop: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: Colors.white, fontWeight: '900', marginRight: 8 },
  sectionTitle: { fontSize: Typography.h2, fontWeight: '900', color: Colors.text, marginTop: 28, marginBottom: 14 },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionCard: { width: '48%', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 15, fontWeight: '900', color: Colors.text, marginTop: 14 },
  actionText: { color: Colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 5 },
  projectCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginTop: 18, ...Shadow.card },
  projectHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  projectIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#EDF4FA', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  projectTitle: { fontSize: Typography.h3, fontWeight: '900', color: Colors.text },
  projectText: { color: Colors.textSecondary, lineHeight: 19, marginTop: 5 },
  secondaryButton: { height: 48, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  secondaryText: { color: Colors.secondary, fontWeight: '800' },
  tipCard: { flexDirection: 'row', backgroundColor: '#EDF9F2', borderRadius: Radius.lg, padding: Spacing.lg, marginTop: 18 },
  tipTitle: { color: Colors.text, fontWeight: '900' },
  tipText: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 4 },
});
