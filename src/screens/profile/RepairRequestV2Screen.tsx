import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import { createRepairRequest } from '../../services/api';
import { useUserStore } from '../../store/userStore';

const TYPES = [
  { id: 'Onduleur', label: 'Onduleur', icon: 'flash-outline' },
  { id: 'Batterie', label: 'Batterie', icon: 'battery-charging-outline' },
  { id: 'Panneaux', label: 'Panneaux', icon: 'sunny-outline' },
  { id: 'Pompe', label: 'Pompe', icon: 'water-outline' },
  { id: 'Installation électrique', label: 'Électricité', icon: 'hardware-chip-outline' },
  { id: 'Autre', label: 'Autre', icon: 'ellipsis-horizontal' },
];

export default function RepairRequestV2Screen() {
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [type, setType] = useState('Onduleur');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'normal' | 'high'>('normal');
  const [installedByZida, setInstalledByZida] = useState<'yes' | 'no'>('yes');

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !description.trim()) {
      Alert.alert('Informations manquantes', 'Nom, téléphone et description du problème sont obligatoires.');
      return;
    }
    setSending(true);
    try {
      const result = await createRepairRequest({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim() || undefined,
        installationType: type,
        problemDescription: description.trim(),
        urgency,
        installedByZida,
      });
      const ticket = result?.repairRequest?.id ? `\nRéférence : ${result.repairRequest.id}` : '';
      Alert.alert('Demande SAV envoyée', `Votre demande a été enregistrée dans le système ZIDA SOLAIRE.${ticket}`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.error || "Impossible d'envoyer la demande SAV.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}><Ionicons name="build-outline" size={28} color={Colors.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Signaler un problème</Text>
            <Text style={styles.heroText}>Décrivez votre panne. Votre demande sera transmise directement au service technique ZIDA.</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quel équipement est concerné ?</Text>
        <View style={styles.typeGrid}>
          {TYPES.map((item) => {
            const active = type === item.id;
            return (
              <TouchableOpacity key={item.id} style={[styles.typeCard, active && styles.typeCardActive]} onPress={() => setType(item.id)}>
                <Ionicons name={item.icon as any} size={24} color={active ? Colors.primary : Colors.secondary} />
                <Text style={[styles.typeText, active && styles.typeTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Niveau d'urgence</Text>
        <View style={styles.segmented}>
          {[['low', 'Faible'], ['normal', 'Normal'], ['high', 'Urgent']].map(([id, label]) => (
            <TouchableOpacity key={id} style={[styles.segment, urgency === id && styles.segmentActive]} onPress={() => setUrgency(id as any)}>
              <Text style={[styles.segmentText, urgency === id && styles.segmentTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Installation réalisée par ZIDA ?</Text>
        <View style={styles.segmented}>
          {[['yes', 'Oui'], ['no', 'Non']].map(([id, label]) => (
            <TouchableOpacity key={id} style={[styles.segment, installedByZida === id && styles.segmentActive]} onPress={() => setInstalledByZida(id as 'yes' | 'no')}>
              <Text style={[styles.segmentText, installedByZida === id && styles.segmentTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Décrivez le problème *</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline numberOfLines={5} textAlignVertical="top" placeholder="Ex. : l'onduleur ne s'allume plus depuis ce matin..." />

        <Text style={styles.sectionTitle}>Vos coordonnées</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nom complet *" />
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Téléphone *" keyboardType="phone-pad" />
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Adresse / localisation" />

        <View style={styles.notice}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.success} />
          <Text style={styles.noticeText}>Votre demande est enregistrée dans le même système que les demandes du site ZIDA SOLAIRE.</Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.submit, sending && { opacity: 0.6 }]} onPress={submit} disabled={sending}>
          {sending ? <ActivityIndicator color={Colors.white} /> : <>
            <Text style={styles.submitText}>Envoyer ma demande SAV</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: Spacing.lg },
  hero: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  heroIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#FFF2E9', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  heroTitle: { fontSize: Typography.h2, fontWeight: '900', color: Colors.text },
  heroText: { color: Colors.textSecondary, lineHeight: 19, marginTop: 5 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: Colors.text, marginTop: Spacing.xl, marginBottom: Spacing.md },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  typeCard: { width: '31%', minHeight: 86, backgroundColor: Colors.white, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, borderWidth: 1.5, borderColor: '#E5EAF0', ...Shadow.card },
  typeCardActive: { backgroundColor: '#FFF6F1', borderColor: Colors.primary },
  typeText: { color: Colors.text, fontSize: 12, fontWeight: '700', marginTop: 6, textAlign: 'center' },
  typeTextActive: { color: Colors.primary },
  segmented: { flexDirection: 'row', backgroundColor: '#E9EDF2', padding: 4, borderRadius: Radius.md },
  segment: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  segmentActive: { backgroundColor: Colors.white, ...Shadow.card },
  segmentText: { color: Colors.textSecondary, fontWeight: '700' },
  segmentTextActive: { color: Colors.primary },
  input: { minHeight: 52, borderRadius: Radius.md, borderWidth: 1, borderColor: '#DCE2E8', backgroundColor: Colors.white, paddingHorizontal: 14, marginBottom: Spacing.md, color: Colors.text },
  textArea: { minHeight: 120, paddingTop: 14 },
  notice: { flexDirection: 'row', backgroundColor: '#ECF8F1', borderRadius: Radius.md, padding: Spacing.md, marginTop: Spacing.sm },
  noticeText: { flex: 1, marginLeft: Spacing.sm, color: Colors.text, lineHeight: 19 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#E9EDF2', padding: Spacing.lg },
  submit: { height: 54, borderRadius: Radius.md, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  submitText: { color: Colors.white, fontWeight: '900', marginRight: 8 },
});