// src/screens/checkout/CheckoutScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import GradientButton from '../../components/common/GradientButton';
import { useCartStore } from '../../store/cartStore';
import { useCreateOrder } from '../../hooks/useOrders';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { items, getTotalPrice } = useCartStore();
  const createOrder = useCreateOrder();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const totalPrice = getTotalPrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre numéro de téléphone');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse de livraison');
      return false;
    }
    return true;
  };

  const goToOrders = () => {
    // CartStack -> ProfileStack -> BottomTabs
    const profileStack = navigation.getParent();
    const tabs = profileStack?.getParent();
    // @ts-ignore nested navigator route
    tabs?.navigate('Compte', { screen: 'OrdersArea' });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createOrder.mutateAsync({
        deliveryAddress: address,
        phone,
        customerName: name,
        customerEmail: email || undefined,
        notes: notes || undefined,
      });

      Alert.alert(
        'Commande confirmée !',
        'Votre commande a été enregistrée avec succès. Nous vous contacterons bientôt.',
        [{ text: 'Voir ma commande', onPress: goToOrders }]
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la création de votre commande. Veuillez réessayer.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.section, styles.sectionAccent]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cart" size={24} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Résumé de la commande</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Articles</Text>
              <Text style={styles.summaryValue}>{items.length}</Text>
            </View>
            <View style={styles.divider} />
            {items.map((item) => (
              <View key={item.product.id} style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>{formatPrice(item.product.price * item.quantity)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.sectionSecondary]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={24} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Informations de livraison</Text>
          </View>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom complet *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={Colors.gray} />
                <TextInput style={styles.input} placeholder="Ex: Jean Dupont" value={name} onChangeText={setName} placeholderTextColor={Colors.textSecondary} />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={Colors.gray} />
                <TextInput style={styles.input} placeholder="Ex: jean@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.textSecondary} />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Numéro de téléphone *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color={Colors.gray} />
                <TextInput style={styles.input} placeholder="Ex: +226 70 00 00 00" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={Colors.textSecondary} />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adresse de livraison *</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Ionicons name="location-outline" size={20} color={Colors.gray} style={styles.textAreaIcon} />
                <TextInput style={[styles.input, styles.textArea]} placeholder="Ex: Ouagadougou, Secteur 15, Avenue..." value={address} onChangeText={setAddress} multiline numberOfLines={3} textAlignVertical="top" placeholderTextColor={Colors.textSecondary} />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (optionnel)</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Ionicons name="create-outline" size={20} color={Colors.gray} style={styles.textAreaIcon} />
                <TextInput style={[styles.input, styles.textArea]} placeholder="Informations utiles pour la livraison..." value={notes} onChangeText={setNotes} multiline numberOfLines={3} textAlignVertical="top" placeholderTextColor={Colors.textSecondary} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.paymentInfo}>
          <Ionicons name="cash-outline" size={22} color={Colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentTitle}>Paiement à la livraison</Text>
            <Text style={styles.paymentText}>Les moyens Mobile Money seront proposés dès leur activation côté backend.</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerPrice}>{formatPrice(totalPrice)}</Text>
        </View>
        <GradientButton title={createOrder.isPending ? 'Enregistrement...' : 'Confirmer la commande'} onPress={handleSubmit} disabled={createOrder.isPending || items.length === 0} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  section: { padding: 16 },
  sectionAccent: { backgroundColor: `${Colors.accent}08` },
  sectionSecondary: { backgroundColor: `${Colors.secondary}05` },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  summaryCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { color: Colors.textSecondary },
  summaryValue: { fontWeight: '700', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.light, marginVertical: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  itemName: { flex: 1, color: Colors.text },
  itemQuantity: { width: 40, textAlign: 'center', color: Colors.textSecondary },
  itemPrice: { minWidth: 100, textAlign: 'right', fontWeight: '600', color: Colors.text },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 17, fontWeight: '700', color: Colors.text },
  totalPrice: { fontSize: 20, fontWeight: '900', color: Colors.primary },
  formCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  inputContainer: { minHeight: 52, borderWidth: 1, borderColor: Colors.light, borderRadius: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white },
  input: { flex: 1, marginLeft: 10, color: Colors.text, paddingVertical: 12 },
  textAreaContainer: { alignItems: 'flex-start' },
  textAreaIcon: { marginTop: 14 },
  textArea: { minHeight: 90 },
  paymentInfo: { margin: 16, marginTop: 4, padding: 16, backgroundColor: '#EDF9F2', borderRadius: 14, flexDirection: 'row', gap: 12 },
  paymentTitle: { color: Colors.text, fontWeight: '800' },
  paymentText: { color: Colors.textSecondary, marginTop: 3, lineHeight: 18, fontSize: 12 },
  footer: { backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.light, padding: 16, paddingBottom: Platform.OS === 'ios' ? 28 : 16 },
  footerTotal: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  footerLabel: { fontSize: 15, color: Colors.textSecondary },
  footerPrice: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  bottomSpacing: { height: 30 },
});
