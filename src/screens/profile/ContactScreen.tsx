// src/screens/profile/ContactScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import GradientButton from '../../components/common/GradientButton';
import Toast from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';
import { useSubmitContact } from '../../hooks/useForms';

const CONTACTS = [
  {
    name: 'Zida Boubacar',
    role: 'PDG',
    phone: '+22674339977',
    location: 'Siège de Cissin',
  },
  {
    name: 'Kientega Mathieu',
    role: 'DG',
    phone: '+22655220303',
    location: 'Siège de Cissin',
  },
  {
    name: 'Kientega Prosper',
    role: 'Responsable',
    phone: '+22667448282',
    location: 'Siège de Cissin',
  },
  {
    name: 'Zida Abdoulaye',
    role: 'Responsable',
    phone: '+22665033700',
    location: 'Siège de Saaba',
  },
];

export default function ContactScreen() {
  const { toast, showToast, hideToast } = useToast();
  const submitContact = useSubmitContact();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Veuillez entrer votre nom', 'error');
      return false;
    }
    if (!formData.phone.trim()) {
      showToast('Veuillez entrer votre numéro de téléphone', 'error');
      return false;
    }
    if (!formData.message.trim()) {
      showToast('Veuillez entrer votre message', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await submitContact.mutateAsync({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        subject: formData.subject || undefined,
        message: formData.message,
      });

      showToast('Message envoyé avec succès !', 'success');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Une erreur s'est produite",
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = (phone: string) => {
    Linking.openURL(`https://wa.me/${phone.replace(/\+/g, '')}`);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[Colors.teal, Colors.info]}
          style={styles.header}
        >
          <Ionicons name="mail" size={60} color={Colors.white} />
          <Text style={styles.title}>Contactez-nous</Text>
          <Text style={styles.subtitle}>
            Nous sommes là pour répondre à toutes vos questions
          </Text>
        </LinearGradient>

        {/* Contacts WhatsApp */}
        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>Nos contacts WhatsApp</Text>
          
          {CONTACTS.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRole}>{contact.role}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color={Colors.textSecondary} />
                  <Text style={styles.contactLocation}>{contact.location}</Text>
                </View>
              </View>
              
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.whatsappButton}
                  onPress={() => handleWhatsApp(contact.phone)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-whatsapp" size={20} color={Colors.white} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCall(contact.phone)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="call" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Formulaire */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Envoyez-nous un message</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Jean Dupont"
                value={formData.name}
                onChangeText={(text) => updateField('name', text)}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="+226 70 00 00 00"
                value={formData.phone}
                onChangeText={(text) => updateField('phone', text)}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="exemple@email.com"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sujet</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="chatbubble-outline" size={20} color={Colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="Sujet de votre message"
                value={formData.subject}
                onChangeText={(text) => updateField('subject', text)}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message *</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons
                name="create-outline"
                size={20}
                color={Colors.gray}
                style={styles.textAreaIcon}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Décrivez votre demande..."
                value={formData.message}
                onChangeText={(text) => updateField('message', text)}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <GradientButton
            title={isSubmitting ? 'Envoi...' : 'Envoyer le message'}
            onPress={handleSubmit}
            loading={isSubmitting}
            colors={[Colors.teal, Colors.info]}
          />
        </View>

        {/* Informations générales */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations générales</Text>

          <View style={styles.infoCard}>
            <Ionicons name="location" size={24} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Sièges</Text>
              <Text style={styles.infoValue}>Cissin & Saaba, Ouagadougou</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="mail" size={24} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>contact@zidasolaire.bf</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="time" size={24} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Horaires</Text>
              <Text style={styles.infoValue}>Lun - Sam : 8h - 18h</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  contactsSection: {
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#25D366',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  contactRole: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  contactLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  whatsappButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.info,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 20,
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
    borderRadius: 12,
    paddingHorizontal: 16,
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
    paddingVertical: 16,
    paddingLeft: 12,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 0,
  },
  infoSection: {
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  bottomSpacing: {
    height: 140,
  },
});