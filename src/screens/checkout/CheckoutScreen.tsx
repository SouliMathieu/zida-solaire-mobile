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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createOrder.mutateAsync({
        deliveryAddress: address,
        phone: phone,
        customerName: name,
        customerEmail: email || undefined,
        notes: notes || undefined,
      });

      Alert.alert(
        'Commande confirmée !',
        'Votre commande a été enregistrée avec succès. Nous vous contacterons bientôt.',
        [
          {
            text: 'OK',
            onPress: () => {
              // @ts-ignore
              navigation.navigate('Commandes');
            },
          },
        ]
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
        {/* Résumé de la commande */}
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
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  {formatPrice(item.product.price * item.quantity)}
                </Text>
              </View>
            ))}
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
            </View>
          </View>
        </View>

        {/* Informations de livraison */}
        <View style={[styles.section, styles.sectionSecondary]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={24} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Informations de livraison</Text>
          </View>
          
          <View style={styles.formCard}>
            {/* Nom complet */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom complet *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={Colors.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Jean Dupont"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={Colors.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: jean@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            </View>

            {/* Téléphone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Numéro de téléphone *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color={Colors.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: +226 70 00 00 00"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            </View>

            {/* Adresse */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adresse de livraison *</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={Colors.gray}
                  style={styles.textAreaIcon}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ex: Ouagadougou, Secteur 15, Avenue..."
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (optionnel)</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={Colors.gray}
                  style={styles.textAreaIcon}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Instructions de livraison..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Mode de paiement */}
        <View style={[styles.section, styles.sectionPurple]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wallet" size={24} color={Colors.purple} />
            <Text style={styles.sectionTitle}>Mode de paiement</Text>
          </View>
          
          <View style={styles.paymentCard}>
            <View style={styles.paymentOption}>
              <Ionicons name="cash-outline" size={32} color={Colors.success} />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Paiement à la livraison</Text>
                <Text style={styles.paymentDescription}>
                  Payez en espèces ou par Mobile Money lors de la réception
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <GradientButton
          title={createOrder.isPending ? 'Confirmation...' : 'Confirmer la commande'}
          onPress={handleSubmit}
          loading={createOrder.isPending}
          colors={[Colors.success, Colors.teal]}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
  },
  sectionAccent: {
    borderLeftColor: Colors.accent,
  },
  sectionSecondary: {
    borderLeftColor: Colors.secondary,
  },
  sectionPurple: {
    borderLeftColor: Colors.purple,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light,
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  itemQuantity: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 12,
    paddingLeft: 8,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 0,
  },
  paymentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bottomSpacing: {
    height: 140,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});