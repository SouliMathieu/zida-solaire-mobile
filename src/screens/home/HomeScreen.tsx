import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';

// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../../constants/colors';
import ProductCard from '../../components/product/ProductCard';
import CategoryCard from '../../components/product/CategoryCard';
import CategoryCardSkeleton from '../../components/product/CategoryCardSkeleton';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import HeaderActions from '../../components/common/HeaderActions';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import { Product, Category } from '../../types';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeMain'
>;

type ActionItem = {
  icon: string;
  label: string;
  onPress: () => void;
};

const getCategoryIcon = (name: string): string => {
  const value = name.toLowerCase();

  if (value.includes('panneau') || value.includes('solaire')) {
    return 'sunny-outline';
  }

  if (value.includes('batter')) {
    return 'battery-charging-outline';
  }

  if (value.includes('ondul')) {
    return 'flash-outline';
  }

  if (value.includes('éclair') || value.includes('eclair')) {
    return 'bulb-outline';
  }

  if (value.includes('pompage') || value.includes('pompe')) {
    return 'water-outline';
  }

  if (value.includes('kit')) {
    return 'layers-outline';
  }

  return 'grid-outline';
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: products = [],
    isLoading: productsLoading,
    refetch: refetchProducts,
    error: productsError,
  } = useProducts({
    search: searchQuery.trim(),
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const horizontalPadding = Spacing.lg;
  const actionGap = Spacing.sm;

  const actionWidth = Math.max(
    132,
    (width - horizontalPadding * 2 - actionGap) / 2,
  );

  const heroTitleSize = width < 380 ? 31 : Typography.hero;
  const heroTitleLineHeight = width < 380 ? 36 : 38;

  const displayedCategories = categories.slice(0, 6);
  const displayedProducts = products.slice(
    0,
    searchQuery.trim() ? 8 : 4,
  );

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([
        refetchProducts(),
        refetchCategories(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryProducts', { category });
  };

  const goToTab = (tab: string, screen?: string) => {
    // @ts-ignore React Navigation nested route typing
    navigation.getParent()?.navigate(
      tab,
      screen ? { screen } : undefined,
    );
  };

  const actions: ActionItem[] = [
    {
      icon: 'grid-outline',
      label: 'Nos produits',
      onPress: () => goToTab('Boutique'),
    },
    {
      icon: 'calculator-outline',
      label: 'Simulateur solaire',
      onPress: () =>
        goToTab('Simulateur'),
    },
    {
      icon: 'home-outline',
      label: 'Demander une installation',
      onPress: () =>
        goToTab('Assistance', 'InstallationRequest'),
    },
    {
      icon: 'construct-outline',
      label: 'Demander un dépannage',
      onPress: () =>
        goToTab('Assistance', 'RepairRequest'),
    },
  ];

  const heroTopPadding = Math.max(18, insets.top + 6);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingBottom: Math.max(
            48,
            insets.bottom + 36,
          ),
        },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      {/* =========================================================
          HERO
         ========================================================= */}

      <ImageBackground
        source={require('../../../assets/images/solar-family.jpg')}
        style={[
          styles.hero,
          {
            paddingTop: heroTopPadding,
          },
        ]}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay} />

        <View style={styles.topBar}>
          <View style={styles.brandBlock}>
            <Text style={styles.brand}>ZIDA</Text>
            <Text style={styles.brandAccent}>SOLAIRE</Text>
          </View>

          <View style={styles.topActions}>
            <HeaderActions
              overlay
              onNotifications={() =>
                goToTab('Profil', 'Notifications')
              }
              onCart={() =>
                goToTab('Profil', 'CartArea')
              }
            />
          </View>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.eyebrow}>
            PASSEZ AU SOLAIRE SIMPLEMENT
          </Text>

          <Text
            style={[
              styles.heroTitle,
              {
                fontSize: heroTitleSize,
                lineHeight: heroTitleLineHeight,
              },
            ]}
          >
            Trouvez votre solution solaire
          </Text>

          <Text style={styles.heroSubtitle}>
            Pour votre maison, votre commerce, votre entreprise ou votre
            activité agricole.
          </Text>

          <TouchableOpacity
            style={styles.heroButton}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Demander un devis gratuit"
            onPress={() => goToTab('Profil', 'Devis')}
          >
            <Text style={styles.heroButtonText}>
              Demander un devis gratuit
            </Text>

            <Ionicons
              name="arrow-forward"
              size={19}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* =========================================================
          RECHERCHE
         ========================================================= */}

      <View style={styles.searchWrap}>
        <Ionicons
          name="search"
          size={21}
          color={Colors.textSecondary}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit ou une solution..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textSecondary}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* =========================================================
          ACTIONS RAPIDES
         ========================================================= */}

      <View style={styles.quickActions}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={[
              styles.actionCard,
              {
                width: actionWidth,
              },
            ]}
            activeOpacity={0.84}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={action.onPress}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name={action.icon}
                size={27}
                color={Colors.secondary}
              />
            </View>

            <Text
              style={styles.actionLabel}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* =========================================================
          ESTIMATION DES BESOINS
         ========================================================= */}

      <TouchableOpacity
        style={styles.estimationCard}
        activeOpacity={0.86}
        accessibilityRole="button"
        accessibilityLabel="Ouvrir le simulateur solaire"
        onPress={() =>
          goToTab('Simulateur')
        }
      >
        <View style={styles.estimationIcon}>
          <Ionicons
            name="sunny-outline"
            size={29}
            color={Colors.primary}
          />
        </View>

        <View style={styles.estimationCopy}>
          <Text style={styles.estimationTitle}>
            Simulateur solaire
          </Text>

          <Text style={styles.estimationText}>
            Découvrez le matériel solaire adapté à vos appareils et à
            vos besoins en quelques étapes.
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={25}
          color={Colors.secondary}
        />
      </TouchableOpacity>

      {/* =========================================================
          PRODUITS
         ========================================================= */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeadingCopy}>
            <Text style={styles.sectionTitle}>
              {searchQuery.trim()
                ? 'Résultats'
                : 'Produits recommandés'}
            </Text>

            <Text
              style={styles.sectionSubtitle}
              numberOfLines={2}
            >
              {searchQuery.trim()
                ? `Produits correspondant à « ${searchQuery.trim()} »`
                : 'Des produits de qualité'}
            </Text>
          </View>

          {!searchQuery.trim() && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => goToTab('Boutique')}
              accessibilityRole="button"
              accessibilityLabel="Voir tous les produits"
            >
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          )}
        </View>

        {productsError ? (
          <ErrorMessage
            message="Impossible de charger les produits"
            onRetry={refetchProducts}
          />
        ) : productsLoading ? (
          <View style={styles.productsGrid}>
            {[1, 2, 3, 4].map((item) => (
              <ProductCardSkeleton
                key={`product-skeleton-${item}`}
              />
            ))}
          </View>
        ) : displayedProducts.length === 0 ? (
          <EmptyState
            icon="cube-outline"
            title="Aucun produit"
            message={
              searchQuery.trim()
                ? 'Aucun produit ne correspond à votre recherche.'
                : 'Aucun produit disponible pour le moment.'
            }
          />
        ) : (
          <View style={styles.productsGrid}>
            {displayedProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product)}
              />
            ))}
          </View>
        )}
      </View>

      {/* =========================================================
          SOLUTIONS / CATÉGORIES
         ========================================================= */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeadingCopy}>
            <Text style={styles.sectionTitle}>
              Nos solutions solaires
            </Text>

            <Text style={styles.sectionSubtitle}>
              Découvrez nos solutions
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => goToTab('Boutique')}
            accessibilityRole="button"
            accessibilityLabel="Voir toutes les solutions"
          >
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {categoriesError ? (
          <ErrorMessage
            message="Impossible de charger les catégories"
            onRetry={refetchCategories}
          />
        ) : categoriesLoading ? (
          <FlatList
            data={[1, 2, 3, 4]}
            horizontal
            keyExtractor={(item) => `category-skeleton-${item}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => (
              <View style={styles.categorySeparator} />
            )}
            renderItem={() => (
              <CategoryCardSkeleton />
            )}
          />
        ) : displayedCategories.length === 0 ? (
          <EmptyState
            icon="grid-outline"
            title="Aucune solution"
            message="Aucune solution disponible pour le moment."
          />
        ) : (
          <FlatList
            data={displayedCategories}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => (
              <View style={styles.categorySeparator} />
            )}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => handleCategoryPress(item)}
              />
            )}
          />
        )}
      </View>

      {/* =========================================================
          RÉASSURANCE
         ========================================================= */}

      <View style={styles.trustRow}>
        <View style={styles.trustItem}>
          <View style={styles.trustIconWrap}>
            <Ionicons
              name="shield-checkmark"
              size={25}
              color={Colors.success}
            />
          </View>

          <Text style={styles.trustValue}>
            Solutions fiables
          </Text>

          <Text style={styles.trustLabel}>
            Matériel de qualité
          </Text>
        </View>

        <View style={styles.trustDivider} />

        <View style={styles.trustItem}>
          <View style={styles.trustIconWrap}>
            <Ionicons
              name="people"
              size={25}
              color={Colors.secondary}
            />
          </View>

          <Text style={styles.trustValue}>
            Accompagnement
          </Text>

          <Text style={styles.trustLabel}>
            Du conseil à l'entretien
          </Text>
        </View>

        <View style={styles.trustDivider} />

        <View style={styles.trustItem}>
          <View style={styles.trustIconWrap}>
            <Ionicons
              name="location"
              size={25}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.trustValue}>
            Burkina Faso
          </Text>

          <Text style={styles.trustLabel}>
            Cissin, Saaba et plus
          </Text>
        </View>
      </View>

      {/* =========================================================
          BANNIÈRE FINALE
         ========================================================= */}

      <LinearGradient
        colors={['#0A365D', '#0B654D']}
        style={styles.closingBanner}
      >
        <View style={styles.closingIcon}>
          <Ionicons
            name="leaf"
            size={25}
            color={Colors.white}
          />
        </View>

        <View style={styles.closingCopy}>
          <Text style={styles.closingTitle}>
            Votre projet solaire commence ici.
          </Text>

          <Text style={styles.closingText}>
            Trouvez une solution solaire adaptée à vos besoins.
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },

  contentContainer: {
    paddingBottom: 20,
  },

  /* HERO */

  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 36,
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  heroImage: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,35,70,0.56)',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brandBlock: {
    justifyContent: 'center',
  },

  brand: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 23,
    letterSpacing: 0.2,
  },

  brandAccent: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginTop: 1,
  },

  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },

  heroContent: {
    marginTop: 30,
    maxWidth: '96%',
  },

  eyebrow: {
    color: '#D4E4F0',
    fontSize: Typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  heroTitle: {
    color: Colors.white,
    fontWeight: '900',
    marginTop: Spacing.sm,
    maxWidth: '94%',
  },

  heroSubtitle: {
    color: '#EEF5FA',
    fontSize: Typography.body,
    lineHeight: 23,
    marginTop: Spacing.md,
    maxWidth: '96%',
  },

  heroButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xl,
    minHeight: 52,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.floating,
  },

  heroButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '800',
    marginRight: Spacing.sm,
  },

  /* RECHERCHE */

  searchWrap: {
    marginHorizontal: Spacing.lg,
    marginTop: -23,
    minHeight: 54,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.floating,
  },

  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 14,
  },

  /* ACTIONS */

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    justifyContent: 'space-between',
    rowGap: Spacing.md,
  },

  actionCard: {
    minHeight: 152,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#E9EDF2',
    ...Shadow.card,
  },

  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionLabel: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 13,
    flexShrink: 1,
  },

  /* ESTIMATION */

  estimationCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    backgroundColor: '#FFF8F3',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },

  estimationIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  estimationCopy: {
    flex: 1,
    paddingRight: Spacing.sm,
  },

  estimationTitle: {
    color: Colors.text,
    fontSize: Typography.h3,
    lineHeight: 23,
    fontWeight: '900',
  },

  estimationText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  /* SECTIONS */

  section: {
    marginTop: 30,
  },

  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  sectionHeadingCopy: {
    flex: 1,
    paddingRight: Spacing.md,
  },

  sectionTitle: {
    fontSize: Typography.h2,
    lineHeight: 31,
    fontWeight: '900',
    color: Colors.text,
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
  },

  seeAll: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },

  /* PRODUITS */

  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },

  /* CATÉGORIES */

  horizontalList: {
    paddingHorizontal: Spacing.lg,
  },

  categorySeparator: {
    width: Spacing.sm,
  },

  /* RÉASSURANCE */

  trustRow: {
    marginHorizontal: Spacing.lg,
    marginTop: 30,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    ...Shadow.card,
  },

  trustItem: {
    width: '31%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  trustDivider: {
    width: 1,
    backgroundColor: '#E8EDF1',
    marginVertical: 8,
  },

  trustIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  trustValue: {
    color: Colors.text,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  trustLabel: {
    color: Colors.textSecondary,
    fontSize: 9.8,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 4,
  },

  /* BANNIÈRE FINALE */

  closingBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: 30,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },

  closingIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  closingCopy: {
    flex: 1,
  },

  closingTitle: {
    color: Colors.white,
    fontSize: Typography.h3,
    lineHeight: 23,
    fontWeight: '900',
  },

  closingText: {
    color: '#DDEAE7',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
});
