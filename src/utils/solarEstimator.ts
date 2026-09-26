export type SolarPropertyType = 'home' | 'shop' | 'business' | 'farm';

export type SolarObjective =
  | 'economy'
  | 'backup'
  | 'autonomy';

export type SolarApplianceId =
  | 'lights'
  | 'tv'
  | 'fridge'
  | 'ac'
  | 'pump'
  | 'freezer'
  | 'fan'
  | 'computer';

export interface SolarLocation {
  city?: string;
  latitude?: number;
  longitude?: number;
  pvoutKwhPerKwpYear?: number;
}

export interface SolarProjectDetails {
  occupants?: number;
  employees?: number;
  activity?: string;
  openingHour?: number;
  closingHour?: number;
  dailyWaterM3?: number;
  pumpHeadM?: number;
}

export interface SolarApplianceSelection {
  id: SolarApplianceId;
  quantity: number;
  hoursPerDay: number;
}

export interface SolarAnswers {
  propertyType: SolarPropertyType;

  // Conservé pour compatibilité avec l'écran actuel.
  // Il sera utilisé principalement pour "home" après la refonte UX.
  rooms: number;

  appliances: SolarApplianceSelection[];

  autonomyHours: number;
  monthlyBill: string;

  // Nouveaux paramètres du moteur V2.
  objective?: SolarObjective;
  location?: SolarLocation;
  projectDetails?: SolarProjectDetails;

  // Charges que le client veut absolument maintenir pendant une coupure.
  backupAppliances?: SolarApplianceSelection[];
}

export interface SolarApplianceSpec {
  label: string;
  watts: number;
  defaultHours: number;
  startupFactor: number;
  criticalDefault: boolean;
}

export interface SolarProjectProfile {
  label: string;
  description: string;
  requiresRooms: boolean;
  defaultLightingQuantity: number;
  recommendedAutonomyHours: number;
  applianceIds: SolarApplianceId[];
}

export interface SolarEstimate {
  peakPowerKw: number;
  solarArrayKw: number;
  batteryKwh: number;
  dailyEnergyKwh: number;
  criticalDailyEnergyKwh: number;
  autonomyHours: number;

  budgetLow: number;
  budgetHigh: number;

  // Informations supplémentaires pour le futur écran de résultat.
  inverterKva: number;
  pvYieldKwhPerKwpDay: number;
  confidence: 'indicative';
  calculationNotes: string[];
}

/**
 * Bibliothèque de départ.
 *
 * IMPORTANT :
 * Ces valeurs servent au pré-dimensionnement.
 * Elles devront ensuite être enrichies avec les équipements
 * réellement vendus/posés par ZIDA et validées par l'équipe technique.
 */
export const SOLAR_APPLIANCES: Record<SolarApplianceId, SolarApplianceSpec> = {
  lights: {
    label: 'Éclairage',
    watts: 12,
    defaultHours: 6,
    startupFactor: 1,
    criticalDefault: true,
  },

  tv: {
    label: 'Télévision',
    watts: 100,
    defaultHours: 5,
    startupFactor: 1,
    criticalDefault: false,
  },

  fridge: {
    label: 'Réfrigérateur',
    watts: 150,
    defaultHours: 10,
    startupFactor: 2,
    criticalDefault: true,
  },

  freezer: {
    label: 'Congélateur',
    watts: 220,
    defaultHours: 10,
    startupFactor: 2,
    criticalDefault: true,
  },

  fan: {
    label: 'Ventilateur',
    watts: 70,
    defaultHours: 8,
    startupFactor: 1.3,
    criticalDefault: true,
  },

  computer: {
    label: 'Ordinateur',
    watts: 120,
    defaultHours: 6,
    startupFactor: 1.2,
    criticalDefault: false,
  },

  ac: {
    label: 'Climatiseur',
    watts: 1200,
    defaultHours: 6,
    startupFactor: 2,
    criticalDefault: false,
  },

  pump: {
    label: 'Pompe à eau',
    watts: 750,
    defaultHours: 2,
    startupFactor: 3,
    criticalDefault: false,
  },
};

/**
 * Les catégories restent les mêmes dans l'application,
 * mais leur logique métier devient différente.
 */
export const SOLAR_PROJECT_PROFILES: Record<
  SolarPropertyType,
  SolarProjectProfile
> = {
  home: {
    label: 'Maison',
    description: 'Logement familial',
    requiresRooms: true,
    defaultLightingQuantity: 4,
    recommendedAutonomyHours: 8,
    applianceIds: [
      'lights',
      'tv',
      'fridge',
      'freezer',
      'fan',
      'computer',
      'ac',
      'pump',
    ],
  },

  shop: {
    label: 'Commerce',
    description: 'Boutique, alimentation, restaurant ou activité commerciale',
    requiresRooms: false,
    defaultLightingQuantity: 6,
    recommendedAutonomyHours: 6,
    applianceIds: [
      'lights',
      'fridge',
      'freezer',
      'fan',
      'ac',
      'tv',
      'pump',
    ],
  },

  business: {
    label: 'Entreprise',
    description: 'Bureau, atelier, établissement ou activité professionnelle',
    requiresRooms: false,
    defaultLightingQuantity: 8,
    recommendedAutonomyHours: 6,
    applianceIds: [
      'lights',
      'computer',
      'fan',
      'ac',
      'fridge',
      'pump',
    ],
  },

  farm: {
    label: 'Agriculture',
    description: 'Exploitation agricole et besoins de pompage',
    requiresRooms: false,
    defaultLightingQuantity: 4,
    recommendedAutonomyHours: 4,
    applianceIds: [
      'pump',
      'lights',
      'fridge',
      'freezer',
      'fan',
    ],
  },
};

export function getSolarProjectProfile(
  propertyType: SolarPropertyType,
): SolarProjectProfile {
  return SOLAR_PROJECT_PROFILES[propertyType];
}

const roundHalf = (value: number) => Math.ceil(value * 2) / 2;
const roundTenth = (value: number) => Math.ceil(value * 10) / 10;

/**
 * Rendement PV journalier de secours.
 *
 * Ce n'est PAS encore la valeur définitive pour tout le Burkina.
 * Dès que location.pvoutKwhPerKwpYear sera disponible, cette donnée
 * localisée prendra automatiquement le dessus.
 */
const FALLBACK_PV_YIELD_KWH_PER_KWP_DAY = 4.3;

/**
 * Batterie LiFePO4 : hypothèse de pré-dimensionnement.
 * La valeur sera rendue configurable avec le futur catalogue batteries.
 */
const BATTERY_USABLE_FRACTION = 0.90;

/**
 * Prix provisoires de pré-dimensionnement.
 *
 * Ils doivent être remplacés par le catalogue/prix ZIDA réel.
 */
const FALLBACK_PRICING = {
  panelPerKwp: 330000,
  batteryPerKwh: 240000,
  inverterPerKw: 180000,
  installationAndProtection: 300000,
};

function getPvYieldKwhPerKwpDay(
  location?: SolarLocation,
): number {
  if (
    location?.pvoutKwhPerKwpYear &&
    location.pvoutKwhPerKwpYear > 0
  ) {
    return location.pvoutKwhPerKwpYear / 365.25;
  }

  return FALLBACK_PV_YIELD_KWH_PER_KWP_DAY;
}

function getBaselineLightingQuantity(
  answers: SolarAnswers,
): number {
  const profile = getSolarProjectProfile(answers.propertyType);

  if (profile.requiresRooms) {
    return Math.max(answers.rooms * 2, profile.defaultLightingQuantity);
  }

  return profile.defaultLightingQuantity;
}

function calculateEnergyKwh(
  selections: SolarApplianceSelection[],
): number {
  return selections.reduce((total, item) => {
    const spec = SOLAR_APPLIANCES[item.id];

    const quantity = Math.max(0, item.quantity);
    const hours = Math.min(24, Math.max(0, item.hoursPerDay));

    return (
      total +
      (spec.watts * quantity * hours) / 1000
    );
  }, 0);
}

function calculatePeakWatts(
  selections: SolarApplianceSelection[],
): number {
  return selections.reduce((total, item) => {
    const spec = SOLAR_APPLIANCES[item.id];

    const quantity = Math.max(0, item.quantity);

    return total + spec.watts * quantity;
  }, 0);
}

function normalizeSelections(
  answers: SolarAnswers,
): SolarApplianceSelection[] {
  const selections = answers.appliances.filter(
    (item) => item.quantity > 0,
  );

  const lightingQuantity = getBaselineLightingQuantity(answers);

  const existingLighting = selections.find(
    (item) => item.id === 'lights',
  );

  if (existingLighting) {
    return selections.map((item) =>
      item.id === 'lights'
        ? {
            ...item,
            quantity: Math.max(
              item.quantity,
              lightingQuantity,
            ),
          }
        : item,
    );
  }

  return [
    {
      id: 'lights',
      quantity: lightingQuantity,
      hoursPerDay: SOLAR_APPLIANCES.lights.defaultHours,
    },
    ...selections,
  ];
}

function getCriticalLoads(
  answers: SolarAnswers,
  allLoads: SolarApplianceSelection[],
): SolarApplianceSelection[] {
  if (answers.backupAppliances?.length) {
    return answers.backupAppliances.filter(
      (item) => item.quantity > 0,
    );
  }

  return allLoads.filter((item) => {
    const spec = SOLAR_APPLIANCES[item.id];
    return spec.criticalDefault;
  });
}

export function estimateSolarSystem(
  answers: SolarAnswers,
): SolarEstimate {
  const loads = normalizeSelections(answers);

  const dailyEnergyKwh = roundTenth(
    calculateEnergyKwh(loads),
  );

  const criticalLoads = getCriticalLoads(
    answers,
    loads,
  );

  const criticalDailyEnergyKwh = roundTenth(
    calculateEnergyKwh(criticalLoads),
  );

  /**
   * Pour l'onduleur, on considère la puissance nominale
   * des charges connectées comme base de pré-dimensionnement.
   * La marge de 20 % reste volontairement explicite.
   */
  const connectedPeakWatts = calculatePeakWatts(loads);

  const peakPowerKw = Math.max(
    1,
    roundHalf((connectedPeakWatts * 1.20) / 1000),
  );

  const inverterKva = Math.max(
    1,
    roundHalf(peakPowerKw),
  );

  const pvYieldKwhPerKwpDay =
    getPvYieldKwhPerKwpDay(answers.location);

  /**
   * Le PV est calculé à partir de la production spécifique.
   * On évite donc l'ancien double modèle :
   * 5.5 h × 0.78.
   */
  const solarArrayKw = Math.max(
    1,
    roundTenth(
      dailyEnergyKwh / pvYieldKwhPerKwpDay,
    ),
  );

  /**
   * La batterie est basée sur les charges critiques.
   * C'est préférable à une batterie calculée automatiquement
   * sur 100 % de la consommation si le client veut seulement
   * maintenir certains équipements pendant les coupures.
   */
  const autonomyFraction = Math.min(
    1,
    Math.max(0, answers.autonomyHours / 24),
  );

  const batteryKwh = Math.max(
    2,
    Math.ceil(
      (
        criticalDailyEnergyKwh *
        autonomyFraction
      ) / BATTERY_USABLE_FRACTION,
    ),
  );

  /**
   * Budget provisoire.
   * À remplacer ensuite par la sélection de vrais produits ZIDA.
   */
  const equipmentEstimate =
    solarArrayKw *
      FALLBACK_PRICING.panelPerKwp +
    batteryKwh *
      FALLBACK_PRICING.batteryPerKwh +
    peakPowerKw *
      FALLBACK_PRICING.inverterPerKw +
    FALLBACK_PRICING.installationAndProtection;

  const budgetLow =
    Math.round(equipmentEstimate / 50000) *
    50000;

  const budgetHigh =
    Math.round(
      (equipmentEstimate * 1.20) / 50000,
    ) * 50000;

  const calculationNotes: string[] = [
    'Pré-dimensionnement indicatif.',
    'La production PV définitive devra utiliser une ressource solaire localisée.',
    'Le choix final de batterie et d’onduleur doit être confirmé techniquement.',
    'Le budget affiché utilise encore des coefficients provisoires.',
  ];

  if (!answers.location?.pvoutKwhPerKwpYear) {
    calculationNotes.push(
      'Aucune donnée PVOUT localisée fournie pour ce calcul.',
    );
  }

  if (!answers.backupAppliances?.length) {
    calculationNotes.push(
      'Les charges critiques sont déterminées automatiquement.',
    );
  }

  return {
    peakPowerKw,
    solarArrayKw,
    batteryKwh,
    dailyEnergyKwh,
    criticalDailyEnergyKwh,
    autonomyHours: answers.autonomyHours,
    budgetLow,
    budgetHigh,
    inverterKva,
    pvYieldKwhPerKwpDay,
    confidence: 'indicative',
    calculationNotes,
  };
}

export function buildSolarStudyDescription(
  answers: SolarAnswers,
  result: SolarEstimate,
) {
  const devices = answers.appliances
    .filter((item) => item.quantity > 0)
    .map(
      (item) =>
        `${SOLAR_APPLIANCES[item.id].label}: ${item.quantity} × ${item.hoursPerDay}h/j`,
    )
    .join(', ');

  const profile =
    getSolarProjectProfile(
      answers.propertyType,
    );

  return [
    'Simulation réalisée depuis l’application mobile ZIDA SOLAIRE.',
    `Projet: ${profile.label}.`,
    profile.requiresRooms
      ? `Pièces/chambres: ${answers.rooms}.`
      : 'Questionnaire spécifique au type de projet.',
    `Équipements: ${devices || 'éclairage uniquement'}.`,
    `Autonomie souhaitée: ${answers.autonomyHours}h.`,
    `Facture mensuelle déclarée: ${answers.monthlyBill}.`,
    answers.location?.city
      ? `Localisation: ${answers.location.city}.`
      : 'Localisation: non renseignée.',
    `Estimation indicative: panneaux ${result.solarArrayKw} kWc; onduleur ${result.inverterKva} kVA; batterie ${result.batteryKwh} kWh; énergie ${result.dailyEnergyKwh} kWh/j.`,
    `Charges critiques estimées: ${result.criticalDailyEnergyKwh} kWh/j.`,
    `Budget indicatif: ${result.budgetLow} - ${result.budgetHigh} FCFA.`,
    'Résultat à confirmer après étude technique du site.',
  ].join('\n');
}
