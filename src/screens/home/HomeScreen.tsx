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
} from 'react-native';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import ProductCard from '../../components/product/ProductCard';
import CategoryCard from '../../components/product/CategoryCard';
import QuickActionCard from '../../components/home/QuickActionCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import CategoryCardSkeleton from '../../components/product/CategoryCardSkeleton';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import { Product, Category } from '../../types';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: products = [],
    isLoading: productsLoading,
    refetch: refetchProducts,
    error: productsError,
  } = useProducts({ search: searchQuery });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchProducts(), refetchCategories()]);
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
    // @ts-ignore nested tab navigation
    navigation.getParent()?.navigate(tab, screen ? { screen } : undefined);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
      }
    >
      <LinearGradient
        colors={['#082B52', '#0C4B79']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>ZIDA</Text>
            <Text style={styles.brandAccent}>SOLAIRE</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.roundButton} onPress={() => goToTab('Profil')}>
              <Ionicons name="notifications-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundButton} onPress={() => goToTab('Panier')}>
              <Ionicons name="cart-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.eyebrow}>L'énergie d'un meilleur demain</Text>
          <Text style={styles.heroTitle}>Des solutions solaires pour un avenir plus sûr</Text>
          <Text style={styles.heroSubtitle}>
            Maisons, entreprises, commerces et projets agricoles : trouvez la solution adaptée à vos besoins.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SolarAssistant')}
          >
            <Text style={styles.heroButtonText}>Demander une étude gratuite</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit ou une solution..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textSecondary}
        />
      </View>

      <View style={styles.quickActions}>
        <QuickActionCard icon="grid-outline" label="Solutions" onPress={() => goToTab('Catégories')} />
        <QuickActionCard icon="calculator-outline" label="Assistant" onPress={() => navigation.navigate('SolarAssistant')} />
        <QuickActionCard icon="construct-outline" label="Installation" onPress={() => goToTab('Profil', 'InstallationRequest')} />
        <QuickActionCard icon="headset-outline" label="SAV" onPress={() => goToTab('Profil', 'RepairRequest')} />
      </View>

      <TouchableOpacity
        style={styles.assistantCard}
        activeOpacity={0.86}
        onPress={() => navigation.navigate('SolarAssistant')}
      >
        <View style={styles.assistantIcon}>
          <Ionicons name="sunny-outline" size={28} color={Colors.primary} />
        </View>
        <View style={styles.assistantCopy}>
          <Text style={styles.assistantTitle}>Assistant solaire</Text>
          <Text style={styles.assistantText}>Décrivez vos besoins et recevez une recommandation personnalisée.</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={Colors.secondary} />
      </TouchableOpacity>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Solutions populaires</Text>
            <Text style={styles.sectionSubtitle}>Explorez les principales catégories ZIDA</Text>
          </View>
          <TouchableOpacity onPress={() => goToTab('Catégories')}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {categoriesError ? (
          <ErrorMessage message="Impossible de charger les catégories" onRetry={refetchCategories} />
        ) : categoriesLoading ? (
          <FlatList
            data={[1, 2, 3, 4]}
            horizontal
            keyExtractor={(item) => `cat-${item}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={() => (
              <View style={styles.categoryItem}><CategoryCardSkeleton /></View>
            )}
          />
        ) : (
          <FlatList
            data={categories.slice(0, 6)}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <View style={styles.categoryItem}>
                <CategoryCard category={item} onPress={() => handleCategoryPress(item)} />
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.trustRow}>
        <View style={styles.trustItem}>
          <Ionicons name="shield-checkmark" size={22} color={Colors.success} />
          <Text style={styles.trustValue}>Solutions fiables</Text>
          <Text style={styles.trustLabel}>Matériel de qualité</Text>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="people" size={22} color={Colors.secondary} />
          <Text style={styles.trustValue}>Accompagnement</Text>
          <Text style={styles.trustLabel}>De l'étude au SAV</Text>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="location" size={22} color={Colors.primary} />
          <Text style={styles.trustValue}>Burkina Faso</Text>
          <Text style={styles.trustLabel}>Cissin, Saaba et plus</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{searchQuery ? 'Résultats' : 'Produits recommandés'}</Text>
            <Text style={styles.sectionSubtitle}>
              {searchQuery ? `Recherche : “${searchQuery}”` : 'Des équipements sélectionnés pour vous'}
            </Text>
          </View>
          {!searchQuery && (
            <TouchableOpacity onPress={() => goToTab('Catégories')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          )}
        </View>

        {productsError ? (
          <ErrorMessage message="Impossible de charger les produits" onRetry={refetchProducts} />
        ) : productsLoading ? (
          <View style={styles.productsGrid}>
            {[1, 2, 3, 4].map((item) => <ProductCardSkeleton key={item} />)}
          </View>
        ) : products.length === 0 ? (
          <EmptyState
            icon="cube-outline"
            title="Aucun produit"
            message={searchQuery ? 'Aucun produit ne correspond à votre recherche' : 'Aucun produit disponible'}
          />
        ) : (
          <View style={styles.productsGrid}>
            {products.slice(0, searchQuery ? 8 : 4).map((product: Product) => (
              <ProductCard key={product.id} product={product} onPress={() => handleProductPress(product)} />
            ))}
          </View>
        )}
      </View>

      <LinearGradient colors={['#0A365D', '#0B654D']} style={styles.closingBanner}>
        <View style={styles.closingIcon}>
          <Ionicons name="leaf" size={24} color={Colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.closingTitle}>Aujourd'hui solaire, demain plus fort.</Text>
          <Text style={styles.closingText}>Passez de l'idée à une solution dimensionnée par ZIDA SOLAIRE.</Text>
        </View>
      </LinearGradient>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  hero: { paddingHorizontal: Spacing.lg, paddingTop: 20, paddingBottom: 42, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: Colors.white, fontSize: 22, fontWeight: '900', lineHeight: 23 },
  brandAccent: { color: Colors.primary, fontSize: 15, fontWeight: '900', letterSpacing: 1.4 },
  topActions: { flexDirection: 'row' },
  roundButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.sm },
  heroContent: { marginTop: 32 },
  eyebrow: { color: '#BBD4E9', fontSize: Typography.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  heroTitle: { color: Colors.white, fontSize: Typography.hero, fontWeight: '900', lineHeight: 36, marginTop: Spacing.sm, maxWidth: '95%' },
  heroSubtitle: { color: '#E7F0F7', fontSize: Typography.body, lineHeight: 22, marginTop: Spacing.md, maxWidth: '94%' },
  heroButton: { alignSelf: 'flex-start', marginTop: Spacing.xl, backgroundColor: Colors.primary, height: 52, borderRadius: Radius.md, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', ...Shadow.floating },
  heroButtonText: { color: Colors.white, fontSize: 15, fontWeight: '800', marginRight: Spacing.sm },
  searchWrap: { marginHorizontal: Spacing.lg, marginTop: -24, minHeight: 52, borderRadius: Radius.lg, paddingHorizontal: Spacing.lg, backgroundColor: Colors.white, flexDirection: 'row', alignItems: 'center', ...Shadow.floating },
  searchInput: { flex: 1, marginLeft: Spacing.sm, fontSize: 15, color: Colors.text, paddingVertical: 14 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, marginTop: Spacing.xl },
  assistantCard: { marginHorizontal: Spacing.lg, marginTop: Spacing.xl, backgroundColor: '#FFF7F1', borderRadius: Radius.lg, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FFE1CF' },
  assistantIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  assistantCopy: { flex: 1 },
  assistantTitle: { color: Colors.text, fontSize: Typography.h3, fontWeight: '800' },
  assistantText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18, marginTop: 3 },
  section: { marginTop: 30 },
  sectionHeader: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: { fontSize: Typography.h2, fontWeight: '900', color: Colors.text },
  sectionSubtitle: { marginTop: 4, fontSize: 13, color: Colors.textSecondary },
  seeAll: { color: Colors.primary, fontSize: 13, fontWeight: '800' },
  horizontalList: { paddingHorizontal: Spacing.lg },
  categoryItem: { marginRight: Spacing.md },
  trustRow: { marginHorizontal: Spacing.lg, marginTop: 30, backgroundColor: Colors.white, borderRadius: Radius.lg, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', ...Shadow.card },
  trustItem: { width: '32%', alignItems: 'center' },
  trustValue: { color: Colors.text, fontSize: 12, fontWeight: '800', textAlign: 'center', marginTop: Spacing.sm },
  trustLabel: { color: Colors.textSecondary, fontSize: 10, textAlign: 'center', marginTop: 3, lineHeight: 14 },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.lg, justifyContent: 'space-between' },
  closingBanner: { marginHorizontal: Spacing.lg, marginTop: 30, borderRadius: Radius.lg, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center' },
  closingIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  closingTitle: { color: Colors.white, fontSize: Typography.h3, fontWeight: '900' },
  closingText: { color: '#DDEAE7', fontSize: 12, lineHeight: 17, marginTop: 4 },
  bottomSpacing: { height: 120 },
});
