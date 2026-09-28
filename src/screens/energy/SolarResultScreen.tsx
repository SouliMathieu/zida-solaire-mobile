import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing, Typography } from '../../theme/tokens';
import api from '../../services/api';
import { SolarAnswers, estimateSolarSystem, buildSolarStudyDescription } from '../../utils/solarEstimator';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';

type ResultRoute = RouteProp<HomeStackParamList, 'SolarResult'>;


type CatalogProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  shortDescription?: string;
  description?: string;

  /*
   * Caractéristiques techniques structurées du produit.
   *
   * L'API peut les fournir sous forme d'objet JSON
   * ou de chaîne JSON.
   *
   * Le moteur conserve un fallback texte pour les anciens
   * produits qui ne possèdent pas encore ces données.
   */
  specifications?:
    | Record<string, unknown>
    | string
    | null;

  category?: {
    name?: string;
    slug?: string;
  };
};

type CatalogRecommendation = {
  panelProduct?: CatalogProduct;
  panelWatts?: number;
  panelCount?: number;
  panelTotalKw?: number;
  kitProduct?: CatalogProduct;
  kitSolarKw?: number;
  kitBatteryKwh?: number;
};

const parseFirstNumber = (
  value: string,
  pattern: RegExp,
) => {
  const match = value.match(pattern);

  if (!match) {
    return undefined;
  }

  const n = Number(
    match[1].replace(',', '.'),
  );

  return Number.isFinite(n)
    ? n
    : undefined;
};

const productText = (
  product: CatalogProduct,
) =>
  [
    product.name,
    product.shortDescription,
    product.description,
    product.category?.name,
    product.category?.slug,
  ]
    .filter(Boolean)
    .join(' ');

const normalizeSpecificationKey = (
  key: string,
) =>
  key
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

const parseNumericValue = (
  value: unknown,
): number | undefined => {
  if (
    typeof value === 'number' &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const match = value
    .replace(',', '.')
    .match(/-?\d+(?:\.\d+)?/);

  if (!match) {
    return undefined;
  }

  const n = Number(match[0]);

  return Number.isFinite(n)
    ? n
    : undefined;
};

const getSpecificationNumber = (
  product: CatalogProduct,
  keys: string[],
): number | undefined => {
  const raw = product.specifications;

  if (!raw) {
    return undefined;
  }

  let specifications:
    | Record<string, unknown>
    | undefined;

  if (
    typeof raw === 'object' &&
    !Array.isArray(raw)
  ) {
    specifications =
      raw as Record<string, unknown>;
  } else if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);

      if (
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed)
      ) {
        specifications =
          parsed as Record<string, unknown>;
      }
    } catch {
      return undefined;
    }
  }

  if (!specifications) {
    return undefined;
  }

  const entries =
    Object.entries(specifications);

  for (const key of keys) {
    const wanted =
      normalizeSpecificationKey(key);

    const entry = entries.find(
      ([name]) =>
        normalizeSpecificationKey(name) ===
        wanted,
    );

    if (!entry) {
      continue;
    }

    const value =
      parseNumericValue(entry[1]);

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

const getPanelWatts = (
  product: CatalogProduct,
) =>
  getSpecificationNumber(
    product,
    [
      'powerW',
      'watts',
      'watt',
      'nominalPowerW',
      'pvPowerW',
      'puissanceW',
      'puissanceWp',
      'puissanceWc',
    ],
  ) ??
  parseFirstNumber(
    productText(product),
    /(\d+(?:[.,]\d+)?)\s*(?:Wc|Wp|W)\b/i,
  );

const getKitSolarKw = (
  product: CatalogProduct,
) =>
  getSpecificationNumber(
    product,
    [
      'solarPowerKw',
      'pvPowerKw',
      'solarKw',
      'pvKw',
      'powerKw',
      'puissanceSolaireKw',
      'puissancePvKw',
    ],
  ) ??
  parseFirstNumber(
    productText(product),
    /(\d+(?:[.,]\d+)?)\s*kW(?:c)?\b/i,
  );

const getKitBatteryKwh = (
  product: CatalogProduct,
) =>
  getSpecificationNumber(
    product,
    [
      'batteryKwh',
      'batteryCapacityKwh',
      'capacityKwh',
      'storageKwh',
      'energieBatterieKwh',
      'capaciteBatterieKwh',
    ],
  ) ??
  parseFirstNumber(
    productText(product),
    /(\d+(?:[.,]\d+)?)\s*kWh\b/i,
  );

const buildCatalogRecommendation = (
  products: CatalogProduct[],
  result: ReturnType<typeof estimateSolarSystem>,
): CatalogRecommendation => {
  /*
   * PANNEAU
   *
   * On utilise le panneau réel du catalogue.
   */
  const panelProduct = products
    .filter((product) => {
      const category =
        `${product.category?.name ?? ''} ${product.category?.slug ?? ''}`
          .toLowerCase();

      return (
        product.stock > 0 &&
        (
          /panneau|panel/.test(category) ||
          /panneau|panel/.test(
            product.name.toLowerCase(),
          )
        )
      );
    })
    .map((product) => ({
      product,
      watts: getPanelWatts(product),
    }))
    .filter(
      (
        item,
      ): item is {
        product: CatalogProduct;
        watts: number;
      } =>
        Boolean(
          item.watts &&
          item.watts > 0,
        ),
    )
    .sort(
      (a, b) => b.watts - a.watts,
    )[0];

  /*
   * Nombre de panneaux nécessaire.
   */
  const panelCount = panelProduct
    ? Math.ceil(
        (
          result.solarArrayKw *
          1000
        ) /
        panelProduct.watts,
      )
    : undefined;

  /*
   * Puissance réellement obtenue avec
   * le nombre entier de panneaux.
   */
  const panelTotalKw =
    panelProduct &&
    panelCount
      ? Number(
          (
            (
              panelProduct.watts *
              panelCount
            ) / 1000
          ).toFixed(2),
        )
      : undefined;

  /*
   * KITS SOLAIRES
   *
   * On recherche uniquement les kits qui :
   * - existent réellement dans le catalogue ;
   * - sont en stock ;
   * - couvrent le besoin PV ;
   * - couvrent la capacité batterie calculée.
   */
  const kitCandidates = products
    .filter((product) => {
      const category =
        `${product.category?.name ?? ''} ${product.category?.slug ?? ''}`
          .toLowerCase();

      return (
        product.stock > 0 &&
        (
          /kit/.test(category) ||
          /kit solaire/.test(
            product.name.toLowerCase(),
          )
        )
      );
    })
    .map((product) => ({
      product,
      solarKw:
        getKitSolarKw(product),
      batteryKwh:
        getKitBatteryKwh(product),
    }))
    .filter(
      (
        item,
      ): item is {
        product: CatalogProduct;
        solarKw: number;
        batteryKwh: number;
      } =>
        Boolean(
          item.solarKw &&
          item.batteryKwh,
        ),
    )
    .filter(
      (item) =>
        item.solarKw >=
          result.solarArrayKw &&
        item.batteryKwh >=
          result.batteryKwh,
    )
    .sort(
      (a, b) =>
        a.solarKw - b.solarKw,
    );

  const kit =
    kitCandidates[0];

  return {
    panelProduct:
      panelProduct?.product,

    panelWatts:
      panelProduct?.watts,

    panelCount,

    panelTotalKw,

    kitProduct:
      kit?.product,

    kitSolarKw:
      kit?.solarKw,

    kitBatteryKwh:
      kit?.batteryKwh,
  };
};

const formatPrice = (value: number) => new Intl.NumberFormat('fr-FR').format(value);

const formatHour = (hour: number) =>
  `${String(Math.floor(hour) % 24).padStart(2, '0')}h`;

const formatBatteryWindow = (
  startHour: number,
  windowHours: number,
) => {
  if (windowHours >= 24) {
    return '24 h';
  }

  const start = Math.floor(startHour) % 24;
  const end = (start + Math.ceil(windowHours)) % 24;

  return `${formatHour(start)} → ${formatHour(end)}`;
};

export default function SolarResultScreen() {
  const route = useRoute<ResultRoute>();
  const { answers } = route.params;
  const result = useMemo(() => estimateSolarSystem(answers), [answers]);
  const [sending, setSending] = useState(false);
  const [generatingQuote, setGeneratingQuote] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [catalogProducts, setCatalogProducts] =
    useState<CatalogProduct[]>([]);

  const [catalogLoading, setCatalogLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    const loadCatalog = async () => {
      try {
        const response =
          await api.get('/products');

        const products =
          Array.isArray(response.data)
            ? response.data
            : response.data?.products;

        if (
          active &&
          Array.isArray(products)
        ) {
          setCatalogProducts(
            products,
          );
        }
      } catch {
        if (active) {
          setCatalogProducts([]);
        }
      } finally {
        if (active) {
          setCatalogLoading(false);
        }
      }
    };

    loadCatalog();

    return () => {
      active = false;
    };
  }, []);

  const catalogRecommendation =
    useMemo(
      () =>
        buildCatalogRecommendation(
          catalogProducts,
          result,
        ),
      [
        catalogProducts,
        result,
      ],
    );


  const generateSimulatedQuote = async () => {
    setGeneratingQuote(true);

    try {
      const escapeHtml = (value: unknown) =>
        String(value ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');

      const generatedDate =
        new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(new Date());

      const panelCount =
        catalogRecommendation.panelCount;

      const panelWatts =
        catalogRecommendation.panelWatts;

      const panelProduct =
        catalogRecommendation.panelProduct;

      const panelUnitPrice =
        panelProduct?.price;

      const panelTotalPrice =
        panelCount &&
        panelUnitPrice
          ? panelCount * panelUnitPrice
          : undefined;

      const panelRow =
        panelCount && panelWatts
          ? `
            <tr>
              <td>Panneaux solaires</td>
              <td>${panelCount}</td>
              <td>${panelWatts} W / panneau</td>
              <td>
                ${
                  panelUnitPrice
                    ? `${formatPrice(panelUnitPrice)} FCFA`
                    : 'À confirmer'
                }
              </td>
              <td>
                ${
                  panelTotalPrice
                    ? `${formatPrice(panelTotalPrice)} FCFA`
                    : 'À confirmer'
                }
              </td>
            </tr>
          `
          : `
            <tr>
              <td>Panneaux solaires</td>
              <td>À confirmer</td>
              <td>
                Besoin PV : ${result.solarArrayKw} kWc
              </td>
              <td>À confirmer</td>
              <td>À confirmer</td>
            </tr>
          `;

      const kitOption =
        catalogRecommendation.kitProduct
          ? `
            <div class="option">
              <div class="option-title">
                OPTION CATALOGUE ZIDA
              </div>

              <div class="option-name">
                ${escapeHtml(
                  catalogRecommendation.kitProduct.name,
                )}
              </div>

              <div class="option-grid">
                <div>
                  <span>Quantité</span>
                  <strong>1 kit</strong>
                </div>

                <div>
                  <span>Solaire</span>
                  <strong>
                    ${
                      catalogRecommendation.kitSolarKw
                        ? `${catalogRecommendation.kitSolarKw} kW`
                        : '—'
                    }
                  </strong>
                </div>

                <div>
                  <span>Batterie</span>
                  <strong>
                    ${
                      catalogRecommendation.kitBatteryKwh
                        ? `${catalogRecommendation.kitBatteryKwh} kWh`
                        : '—'
                    }
                  </strong>
                </div>

                <div>
                  <span>Prix catalogue</span>
                  <strong>
                    ${formatPrice(
                      catalogRecommendation.kitProduct.price,
                    )} FCFA
                  </strong>
                </div>
              </div>

              <p>
                Cette option catalogue est séparée du besoin
                calculé. La configuration finale doit être
                confirmée par l'équipe technique ZIDA.
              </p>
            </div>
          `
          : `
            <div class="option">
              <div class="option-title">
                OPTION CATALOGUE ZIDA
              </div>
              <p>
                Aucun kit catalogue disponible ne couvre
                automatiquement le besoin calculé.
                La configuration finale sera confirmée
                lors de l'étude technique.
              </p>
            </div>
          `;

      const html = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />

            <style>
              @page {
                size: A4;
                margin: 18mm;
              }

              * {
                box-sizing: border-box;
              }

              body {
                font-family: Arial, Helvetica, sans-serif;
                color: #17212B;
                margin: 0;
                font-size: 12px;
                line-height: 1.5;
              }

              .header {
                border-bottom: 3px solid #0F783F;
                padding-bottom: 14px;
                margin-bottom: 24px;
              }

              .brand {
                color: #0F783F;
                font-size: 24px;
                font-weight: 800;
                margin-bottom: 4px;
              }

              .title {
                font-size: 20px;
                font-weight: 800;
                margin: 0;
              }

              .date {
                color: #68737D;
                margin-top: 5px;
              }

              .notice {
                background: #FFF7E6;
                border: 1px solid #F2D38A;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 22px;
              }

              .section-title {
                font-size: 16px;
                font-weight: 800;
                margin: 20px 0 10px;
                color: #17212B;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 8px;
              }

              th {
                background: #F1F5F3;
                text-align: left;
                font-size: 10px;
                padding: 9px 7px;
                border-bottom: 1px solid #D7DDE5;
              }

              td {
                padding: 10px 7px;
                border-bottom: 1px solid #E5E7EB;
                vertical-align: top;
              }

              .summary {
                margin-top: 18px;
                padding: 14px;
                background: #F5F8F6;
                border-radius: 8px;
              }

              .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 4px 0;
              }

              .summary-label {
                color: #68737D;
              }

              .summary-value {
                font-weight: 800;
              }

              .option {
                margin-top: 18px;
                padding: 14px;
                border: 1px solid #D7DDE5;
                border-radius: 8px;
              }

              .option-title {
                color: #0F783F;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.6px;
              }

              .option-name {
                font-size: 15px;
                font-weight: 800;
                margin-top: 5px;
                margin-bottom: 12px;
              }

              .option-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
              }

              .option-grid div {
                background: #F7F8F9;
                padding: 9px;
                border-radius: 6px;
              }

              .option-grid span {
                display: block;
                color: #68737D;
                font-size: 10px;
                margin-bottom: 2px;
              }

              .option-grid strong {
                font-size: 12px;
              }

              .footer {
                margin-top: 28px;
                padding-top: 12px;
                border-top: 1px solid #D7DDE5;
                color: #68737D;
                font-size: 10px;
              }

              .important {
                font-weight: 800;
              }
            </style>
          </head>

          <body>
            <div class="header">
              <div class="brand">ZIDA SOLAIRE</div>
              <h1 class="title">
                DEVIS SIMULÉ — ESTIMATION SOLAIRE
              </h1>
              <div class="date">
                Généré le ${generatedDate}
              </div>
            </div>

            <div class="notice">
              <span class="important">
                Document indicatif.
              </span>
              Ce devis simulé est généré automatiquement
              à partir des informations déclarées dans
              l'application. Il ne constitue pas un devis
              commercial définitif.
            </div>

            <div class="section-title">
              Matériel nécessaire
            </div>

            <table>
              <thead>
                <tr>
                  <th>Équipement</th>
                  <th>Quantité</th>
                  <th>Caractéristique</th>
                  <th>Prix unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                ${panelRow}

                <tr>
                  <td>Batterie solaire</td>
                  <td>1 besoin dimensionné</td>
                  <td>
                    ≥ ${result.batteryKwh} kWh
                  </td>
                  <td>À confirmer</td>
                  <td>À confirmer</td>
                </tr>

                <tr>
                  <td>Onduleur solaire</td>
                  <td>1 besoin dimensionné</td>
                  <td>
                    ≥ ${result.inverterKva} kVA
                  </td>
                  <td>À confirmer</td>
                  <td>À confirmer</td>
                </tr>
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-row">
                <span class="summary-label">
                  Besoin solaire estimé
                </span>
                <span class="summary-value">
                  ${result.solarArrayKw} kWc
                </span>
              </div>

              <div class="summary-row">
                <span class="summary-label">
                  Consommation quotidienne estimée
                </span>
                <span class="summary-value">
                  ${result.dailyEnergyKwh} kWh/jour
                </span>
              </div>

              <div class="summary-row">
                <span class="summary-label">
                  Budget indicatif
                </span>
                <span class="summary-value">
                  ${formatPrice(result.budgetLow)}
                  –
                  ${formatPrice(result.budgetHigh)}
                  FCFA
                </span>
              </div>
            </div>

            <div class="section-title">
              ${catalogRecommendation.kitProduct
                ? 'Option catalogue'
                : 'Catalogue'}
            </div>

            ${kitOption}

            <div class="footer">
              Les capacités de batterie et d'onduleur indiquées
              correspondent à un minimum de dimensionnement.
              Les produits, protections, installation, prix
              définitifs et la configuration finale doivent être
              confirmés par l'équipe technique ZIDA après étude
              du site.
            </div>
          </body>
        </html>
      `;

      const { uri } =
        await Print.printToFileAsync({
          html,
        });

      const sharingAvailable =
        await Sharing.isAvailableAsync();

      if (sharingAvailable) {
        await Sharing.shareAsync(
          uri,
          {
            mimeType: 'application/pdf',
            dialogTitle:
              'Devis simulé ZIDA Solaire',
          },
        );
      } else {
        await Print.printAsync({
          html,
        });
      }
    } catch (error) {
      console.error(
        'Erreur génération devis simulé:',
        error,
      );

      Alert.alert(
        'Devis simulé',
        'Impossible de générer le document pour le moment. Veuillez réessayer.',
      );
    } finally {
      setGeneratingQuote(false);
    }
  };

  const submitStudy = async () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      Alert.alert('Informations requises', 'Veuillez renseigner votre prénom, nom et téléphone.');
      return;
    }
    setSending(true);
    try {
      const response = await api.post('/installation-requests', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        type: 'SOLAR',
        address: address.trim(),
        description: buildSolarStudyDescription(answers, result),
      });
      Alert.alert(
        'Étude demandée',
        `Votre demande ${response.data?.requestNumber || ''} a bien été transmise à ZIDA SOLAIRE.`,
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.error || "Impossible d'envoyer votre demande pour le moment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.recommendedBadge}>
        <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
        <Text style={styles.recommendedText}>Solution indicative recommandée par ZIDA</Text>
      </View>

      <Text style={styles.eyebrow}>VOTRE SOLUTION SOLAIRE</Text>
      <Text style={styles.title}>Une base adaptée à vos besoins</Text>
      <Text style={styles.subtitle}>Cette estimation sert à préparer votre étude technique. Elle sera confirmée par un technicien ZIDA.</Text>


      <View style={styles.catalogCard}>
        <View style={styles.catalogHeader}>
          <Ionicons
            name="construct-outline"
            size={22}
            color={Colors.primary}
          />

          <View style={styles.catalogHeaderText}>
            <Text style={styles.catalogEyebrow}>
              CE QU'IL VOUS FAUT
            </Text>

            <Text style={styles.catalogTitle}>
              Matériel nécessaire
            </Text>
          </View>
        </View>

        <Text style={styles.catalogHint}>
          Voici les quantités estimées pour couvrir vos besoins.
        </Text>

        {catalogLoading ? (
          <Text style={styles.catalogHint}>
            Recherche des produits actuellement disponibles chez ZIDA...
          </Text>
        ) : (
          <>
            {catalogRecommendation.panelCount &&
              catalogRecommendation.panelWatts && (
                <SizingRow
                  icon="sunny-outline"
                  label={`${catalogRecommendation.panelCount} panneaux solaires`}
                  value={`${catalogRecommendation.panelWatts} W chacun`}
                />
              )}

            <SizingRow
              icon="battery-charging-outline"
              label="Batterie minimale"
              value={`≥ ${result.batteryKwh} kWh`}
            />

            <SizingRow
              icon="flash-outline"
              label="Onduleur minimal"
              value={`≥ ${result.inverterKva} kVA`}
            />

            <View style={styles.catalogOffer}>
              <Text style={styles.catalogOfferEyebrow}>
                OPTION CATALOGUE ZIDA
              </Text>

              {catalogRecommendation.kitProduct ? (
                <>
                  <Text style={styles.catalogOfferTitle}>
                    1 kit solaire
                  </Text>

                  <Text style={styles.catalogOfferName}>
                    {catalogRecommendation.kitProduct.name}
                  </Text>

                  <SizingRow
                    icon="sunny-outline"
                    label="Puissance solaire du kit"
                    value={
                      catalogRecommendation.kitSolarKw
                        ? `${catalogRecommendation.kitSolarKw} kW`
                        : "—"
                    }
                  />

                  <SizingRow
                    icon="battery-charging-outline"
                    label="Batterie du kit"
                    value={
                      catalogRecommendation.kitBatteryKwh
                        ? `${catalogRecommendation.kitBatteryKwh} kWh`
                        : "—"
                    }
                  />

                  <Text style={styles.catalogPriceLabel}>
                    Prix catalogue indicatif
                  </Text>

                  <Text style={styles.catalogPrice}>
                    {formatPrice(
                      catalogRecommendation.kitProduct.price,
                    )}{' '}
                    FCFA
                  </Text>

                  <Text style={styles.catalogHint}>
                    Ce kit est une option disponible au catalogue.
                    La configuration finale reste à confirmer par
                    l'équipe technique ZIDA.
                  </Text>
                </>
              ) : (
                <Text style={styles.catalogHint}>
                  Aucun kit catalogue disponible ne couvre
                  automatiquement le besoin calculé.
                  La batterie, l'onduleur et la configuration
                  finale seront confirmés dans l'étude technique.
                </Text>
              )}
            </View>
          </>
        )}
      </View>

      <View style={styles.sizingCard}>
        <Text style={styles.sizingTitle}>Détails du dimensionnement</Text>

        <SizingRow
          icon="analytics-outline"
          label="Consommation quotidienne"
          value={`${result.dailyEnergyKwh} kWh/j`}
        />

        <SizingRow
          icon="flash-outline"
          label="Puissance simultanée"
          value={`${result.simultaneousPeakKw} kW`}
        />

        <SizingRow
          icon="speedometer-outline"
          label="Pointe de démarrage"
          value={`${result.surgePeakKw} kW`}
        />

        <SizingRow
          icon="battery-half-outline"
          label="Énergie critique maximale"
          value={`${result.batteryWorstCaseEnergyKwh} kWh`}
        />

        <SizingRow
          icon="time-outline"
          label="Fenêtre critique batterie"
          value={formatBatteryWindow(
            result.batterySizingStartHour,
            result.batterySizingWindowHours,
          )}
        />

        <Text style={styles.sizingHint}>
          La batterie est dimensionnée sur la période continue la plus exigeante
          correspondant à l’autonomie demandée.
        </Text>
      </View>

      <View style={styles.budgetCard}>
        <Text style={styles.budgetLabel}>Budget indicatif</Text>
        <Text style={styles.budgetValue}>{formatPrice(result.budgetLow)} – {formatPrice(result.budgetHigh)} FCFA</Text>
        <Text style={styles.budgetHint}>Matériel + installation estimative, à confirmer après étude du site.</Text>
      </View>

      <View style={styles.benefitsCard}>
        <Benefit text="Dimensionnement basé sur vos usages déclarés" />
        <Benefit text="Solution ajustable selon votre budget" />
        <Benefit text="Validation finale par l’équipe technique ZIDA" />
      </View>

      <TouchableOpacity
        style={[
          styles.simulatedQuoteButton,
          generatingQuote && { opacity: 0.6 },
        ]}
        onPress={generateSimulatedQuote}
        disabled={generatingQuote}
        activeOpacity={0.85}
      >
        <Ionicons
          name={
            generatingQuote
              ? 'hourglass-outline'
              : 'document-text-outline'
          }
          size={21}
          color={Colors.primary}
        />

        <Text style={styles.simulatedQuoteButtonText}>
          {generatingQuote
            ? 'Génération du devis...'
            : 'Télécharger le devis simulé'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.simulatedQuoteHint}>
        Le document reprend les besoins calculés et le budget
        indicatif. Il ne remplace pas une étude technique ZIDA.
      </Text>

      <Text style={styles.sectionTitle}>Demander une étude technique</Text>
      <Text style={styles.sectionSubtitle}>Votre demande arrivera dans le même back-office que les demandes du site.</Text>
      <View style={styles.formCard}>
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.half]} placeholder="Prénom *" value={firstName} onChangeText={setFirstName} />
          <TextInput style={[styles.input, styles.half]} placeholder="Nom *" value={lastName} onChangeText={setLastName} />
        </View>
        <TextInput style={styles.input} placeholder="Téléphone *" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Adresse / quartier" value={address} onChangeText={setAddress} />
        <TouchableOpacity style={[styles.primaryButton, sending && { opacity: 0.6 }]} onPress={submitStudy} disabled={sending} activeOpacity={0.85}>
          <Text style={styles.primaryText}>{sending ? 'Envoi...' : 'Demander une étude gratuite'}</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Metric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Ionicons name={icon as any} size={24} color={Colors.primary} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <View style={styles.benefitRow}>
      <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

function SizingRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.sizingRow}>
      <View style={styles.sizingIcon}>
        <Ionicons name={icon as any} size={18} color={Colors.primary} />
      </View>

      <Text style={styles.sizingLabel}>{label}</Text>

      <Text style={styles.sizingValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: Spacing.lg },
  recommendedBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: '#EAF8F0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, marginBottom: Spacing.lg },
  recommendedText: { color: '#18794E', fontWeight: '700', marginLeft: 6, fontSize: 12 },
  eyebrow: { color: Colors.primary, fontWeight: '800', fontSize: 12, letterSpacing: 0.7 },
  title: { fontSize: Typography.h1, fontWeight: '900', color: Colors.text, marginTop: 6 },
  subtitle: { color: Colors.textSecondary, lineHeight: 21, marginTop: 8, marginBottom: Spacing.xl },

  catalogCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E7ECEF',
    ...Shadow.card,
  },

  catalogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  catalogHeaderText: {
    marginLeft: 10,
  },

  catalogEyebrow: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.7,
  },

  catalogTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },

  catalogMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  catalogIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E8',
  },

  catalogMainText: {
    flex: 1,
    marginLeft: 12,
  },

  catalogMainValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '900',
  },

  catalogMainLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },

  catalogPriceLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },

  catalogPrice: {
    color: Colors.primary,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 2,
  },

  catalogOffer: {
    marginTop: 18,
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  catalogOfferEyebrow: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  catalogOfferTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },

  catalogOfferName: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  catalogHint: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },

  simulatedQuoteButton: {
    marginTop: 18,
    minHeight: 54,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  simulatedQuoteButtonText: {
    marginLeft: 8,
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },

  simulatedQuoteHint: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { width: '48%', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadow.card },
  metricValue: { fontSize: 20, fontWeight: '900', color: Colors.text, marginTop: 8 },
  metricLabel: { color: Colors.textSecondary, marginTop: 2 },
  sizingCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    ...Shadow.card,
  },
  sizingTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 6,
  },
  sizingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F4',
  },
  sizingIcon: {
    width: 30,
    alignItems: 'flex-start',
  },
  sizingLabel: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  sizingValue: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 13,
    marginLeft: 8,
  },
  sizingHint: {
    color: Colors.textSecondary,
    lineHeight: 19,
    fontSize: 12,
    marginTop: 10,
  },
  budgetCard: { backgroundColor: '#FFF4EC', borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.lg },
  budgetLabel: { color: Colors.textSecondary, fontWeight: '700' },
  budgetValue: { color: Colors.primary, fontSize: 22, fontWeight: '900', marginTop: 5 },
  budgetHint: { color: Colors.textSecondary, lineHeight: 19, marginTop: 6, fontSize: 13 },
  benefitsCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.lg, ...Shadow.card },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  benefitText: { flex: 1, color: Colors.text, marginLeft: 8, lineHeight: 20 },
  sectionTitle: { fontSize: Typography.h2, fontWeight: '900', color: Colors.text, marginTop: Spacing.xl },
  sectionSubtitle: { color: Colors.textSecondary, lineHeight: 20, marginTop: 4, marginBottom: Spacing.md },
  formCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  input: { borderWidth: 1, borderColor: '#DCE2E8', borderRadius: Radius.md, paddingHorizontal: 14, minHeight: 50, marginBottom: 12, color: Colors.text, backgroundColor: '#FBFCFD' },
  primaryButton: { height: 54, backgroundColor: Colors.primary, borderRadius: Radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryText: { color: Colors.white, fontWeight: '900', marginRight: 8 },
});
