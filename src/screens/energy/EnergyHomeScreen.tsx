import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import {
  Radius,
  Shadow,
  Spacing,
  Typography,
} from '../../theme/tokens';
import { EnergyStackParamList } from '../../navigation/EnergyStackNavigator';

type Nav = NativeStackNavigationProp<
  EnergyStackParamList,
  'EnergyHome'
>;

export default function EnergyHomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons
            name="sunny"
            size={32}
            color={Colors.primary}
          />
        </View>

        <Text style={styles.eyebrow}>
          SIMULATEUR SOLAIRE
        </Text>

        <Text style={styles.title}>
          Trouvez la solution solaire adaptée à vos besoins
        </Text>

        <Text style={styles.subtitle}>
          Répondez à quelques questions sur vos appareils et vos
          habitudes. Nous vous donnerons une première estimation
          du matériel nécessaire.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate('SolarAssistant')
          }
          activeOpacity={0.86}
        >
          <Text style={styles.primaryText}>
            Commencer mon estimation
          </Text>

          <Ionicons
            name="arrow-forward"
            size={19}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Comment ça marche ?
      </Text>

      <View style={styles.stepsCard}>
        <Step
          number="1"
          title="Indiquez votre besoin"
          text="Maison, commerce, entreprise ou activité agricole."
        />

        <Step
          number="2"
          title="Choisissez vos appareils"
          text="Précisez ce que vous utilisez et pendant combien de temps."
        />

        <Step
          number="3"
          title="Découvrez votre estimation"
          text="Voyez le matériel conseillé et les solutions ZIDA disponibles."
          last
        />
      </View>

      <View style={styles.simulatorImageCard}>
        <Image
          source={require('../../../assets/images/simulateur_image.png')}
          style={styles.simulatorImage}
          resizeMode="contain"
        />

        <Text style={styles.simulatorImageCaption}>
          Voici simplement comment l'énergie passe du soleil
          jusqu'à vos appareils.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Ce que vous obtenez
      </Text>

      <View style={styles.benefitsCard}>
        <Benefit text="Le nombre de panneaux solaires conseillé" />
        <Benefit text="La batterie et l'onduleur adaptés à votre besoin" />
        <Benefit text="Les prix ZIDA lorsqu'ils sont disponibles" />
        <Benefit
          text="Une estimation que vous pouvez enregistrer"
          last
        />
      </View>

      <View style={styles.infoCard}>
        <Ionicons
          name="information-circle-outline"
          size={24}
          color={Colors.secondary}
        />

        <Text style={styles.infoText}>
          Cette estimation est gratuite et ne vous engage pas.
          L'équipe ZIDA pourra ensuite confirmer avec vous la
          solution la plus adaptée.
        </Text>
      </View>
    </ScrollView>
  );
}

function Step({
  number,
  title,
  text,
  last,
}: {
  number: string;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.stepRow,
        last && styles.stepRowLast,
      ]}
    >
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>
          {number}
        </Text>
      </View>

      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>
          {title}
        </Text>

        <Text style={styles.stepText}>
          {text}
        </Text>
      </View>
    </View>
  );
}

function Benefit({
  text,
  last,
}: {
  text: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.benefitRow,
        last && styles.benefitRowLast,
      ]}
    >
      <Ionicons
        name="checkmark-circle"
        size={22}
        color={Colors.success}
      />

      <Text style={styles.benefitText}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },

  content: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },

  hero: {
    backgroundColor: '#0A365D',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.card,
  },

  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  eyebrow: {
    color: '#BFD6E8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },

  title: {
    color: Colors.white,
    fontSize: Typography.h1,
    lineHeight: 32,
    fontWeight: '900',
    marginTop: 8,
  },

  subtitle: {
    color: '#DFEAF2',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },

  primaryButton: {
    minHeight: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    marginTop: 24,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '900',
    marginRight: 10,
  },

  simulatorImageCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 8,
    marginTop: 18,
    overflow: 'hidden',
    ...Shadow.card,
  },

  simulatorImage: {
    width: '100%',
    height: 215,
    borderRadius: Radius.md,
  },

  simulatorImageCaption: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
    marginBottom: 4,
  },

  sectionTitle: {
    fontSize: Typography.h2,
    fontWeight: '900',
    color: Colors.text,
    marginTop: 28,
    marginBottom: 14,
  },

  stepsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },

  stepRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F4',
  },

  stepRowLast: {
    borderBottomWidth: 0,
  },

  stepNumber: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  stepNumberText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '900',
  },

  stepText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  benefitsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    ...Shadow.card,
  },

  benefitRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F4',
  },

  benefitRowLast: {
    borderBottomWidth: 0,
  },

  benefitText: {
    flex: 1,
    marginLeft: 10,
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EDF4FA',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: 20,
  },

  infoText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 10,
  },
});
