// src/screens/profile/ContactScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
// @ts-expect-error - Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import Button from '../../components/common/Button';

export default function ContactScreen() {
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
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre numéro de téléphone');
      return false;
    }
    if (!formData.message.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre message');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // TODO: Connecter à l'API /api/contact
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Message envoyé !',
        'Nous avons bien reçu votre message. Nous vous répondrons dans les plus brefs délais.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Réinitialiser le formulaire
              setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+22625506464');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:contact@zidasolaire.bf');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/22625506464');
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
        <View style={styles.header}>
          <Ionicons name="mail" size={60} color={Colors.primary} />
          <Text style={styles.title}>Contactez-nous</Text>
          <Text style={styles.subtitle}>
            Nous sommes là pour répondre à toutes vos questions
          </Text>
        </View>

        {/* Contact rapide */}
        <View style={styles.quickContactSection}>
          <Text style={styles.sectionTitle}>Contact rapide</Text>

          <View style={styles.quickContactButtons}>
            <TouchableOpacity style={styles.quickButton} onPress={handleCall}>
              <View style={styles.quickButtonIcon}>
                <Ionicons name="call" size={24} color={Colors.white} />
              </View>
              <Text style={styles.quickButtonText}>Appeler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickButton} onPress={handleWhatsApp}>
              <View style={[styles.quickButtonIcon, { backgroundColor: '#25D366' }]}>
                <Ionicons name="logo-whatsapp" size={24} color={Colors.white} />
              </View>
              <Text style={styles.quickButtonText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickButton} onPress={handleEmail}>
              <View style={[styles.quickButtonIcon, { backgroundColor: Colors.info }]}>
                <Ionicons name="mail" size={24} color={Colors.white} />
              </View>
              <Text style={styles.quickButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Formulaire */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Envoyez-nous un message</Text>

          {/* Nom */}
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

          {/* Téléphone */}
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

          {/* Email */}
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

          {/* Sujet */}
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

          {/* Message */}
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

          <Button
            title={isSubmitting ? 'Envoi...' : 'Envoyer le message'}
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.submitButton}
          />
        </View>

        {/* Informations */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Nos coordonnées</Text>

          <View style={styles.infoCard}>
            <Ionicons name="location" size={24} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Adresse</Text>
              <Text style={styles.infoValue}>Ouagadougou, Burkina Faso</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="call" size={24} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Téléphone</Text>
              <Text style={styles.infoValue}>+226 25 50 64 64</Text>
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
    backgroundColor: Colors.primary,
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
  quickContactSection: {
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
  quickContactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickButton: {
    alignItems: 'center',
  },
  quickButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickButtonText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '600',
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
  submitButton: {
    marginTop: 8,
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
    height: 32,
  },
});