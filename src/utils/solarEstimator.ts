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

export type SolarLoadProfile =
  | 'continuous'
  | 'business'
  | 'evening'
  | 'daytime'
  | 'flexible';

const SOLAR_LOAD_PROFILES: Record<
  SolarApplianceId,
  SolarLoadProfile
> = {
  lights: 'flexible',
  tv: 'evening',
  fridge: 'continuous',
  freezer: 'continuous',
  fan: 'flexible',
  computer: 'business',
  ac: 'business',
  pump: 'flexible',
};

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

export interface InverterCandidate {
  id: string;
  name: string;

  /*
   * Puissance nominale réellement disponible.
   */
  ratedPowerKw: number;

  /*
   * Puissance maximale de surcharge annoncée
   * par le fabricant.
   */
  surgePowerKw: number;

  /*
   * Durée pendant laquelle la surcharge est supportée,
   * si cette information est disponible.
   */
  surgeDurationSeconds?: number;
}

export interface InverterSizingCheck {
  compatible: boolean;

  nominalRequiredKw: number;
  surgeRequiredKw: number;

  nominalMarginKw: number;
  surgeMarginKw: number;

  reason: string;
}

export interface SolarEstimate {
  peakPowerKw: number;
  solarArrayKw: number;
  batteryKwh: number;
  dailyEnergyKwh: number;
  hourlyLoadKw: number[];

  simultaneousPeakKw: number;
  surgePeakKw: number;
  criticalDailyEnergyKwh: number;
  criticalHourlyLoadKw: number[];

  /*
   * Fenêtre réellement utilisée pour dimensionner
   * l'autonomie batterie.
   */
  batterySizingWindowHours: number;

  /*
   * Plus grande quantité d'énergie consommée par
   * les charges critiques pendant cette fenêtre.
   */
  batteryWorstCaseEnergyKwh: number;

  /*
   * Heure de début de la pire fenêtre.
   */
  batterySizingStartHour: number;
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

const SCHEDULED_APPLIANCE_IDS: SolarApplianceId[] = [
  'lights',
  'tv',
  'fan',
  'computer',
  'ac',
  'pump',
];

/**
 * Rendement électrique -> hydraulique utilisé uniquement
 * pour le pré-dimensionnement agricole lorsque les données
 * réelles de la pompe ne sont pas encore disponibles.
 *
 * Cette valeur est volontairement prudente et devra être
 * remplacée par les caractéristiques de la pompe ZIDA retenue.
 */
const FALLBACK_PUMP_WIRE_TO_WATER_EFFICIENCY = 0.35;

/**
 * Pour un premier screening, on majore la hauteur statique
 * renseignée afin d'approcher le total dynamic head.
 *
 * Cette marge représente notamment les pertes hydrauliques
 * qui devront être vérifiées lors de l'étude technique.
 */
const PUMP_HEAD_SCREENING_FACTOR = 1.25;

function clampHours(value: number): number {
  return Math.min(24, Math.max(0, value));
}

function getOperatingDuration(
  answers: SolarAnswers,
): number | undefined {
  if (
    answers.propertyType !== 'shop' &&
    answers.propertyType !== 'business'
  ) {
    return undefined;
  }

  const opening = answers.projectDetails?.openingHour;
  const closing = answers.projectDetails?.closingHour;

  if (
    typeof opening !== 'number' ||
    typeof closing !== 'number' ||
    !Number.isFinite(opening) ||
    !Number.isFinite(closing)
  ) {
    return undefined;
  }

  const normalizedOpening = Math.min(24, Math.max(0, opening));
  const normalizedClosing = Math.min(24, Math.max(0, closing));

  if (normalizedOpening === normalizedClosing) {
    return undefined;
  }

  const duration =
    normalizedClosing > normalizedOpening
      ? normalizedClosing - normalizedOpening
      : 24 - normalizedOpening + normalizedClosing;

  return Math.min(24, Math.max(0, duration));
}

function getEffectiveHoursPerDay(
  item: SolarApplianceSelection,
  answers: SolarAnswers,
): number {
  /*
   * hoursPerDay représente le temps réel d'utilisation
   * de l'équipement sur 24 h.
   *
   * IMPORTANT :
   * les horaires d'ouverture d'une entreprise/boutique
   * ne doivent PAS réduire cette durée.
   *
   * Exemple :
   * entreprise ouverte 08h-18h
   * réfrigérateur utilisé 10 h/j
   *
   * => 10 h restent 10 h.
   *
   * Le placement de ces heures dans la journée est traité
   * séparément par buildHourlyLoadProfile().
   */
  return clampHours(item.hoursPerDay);
}

interface AgriculturalPumpLoad {
  dailyEnergyKwh: number;
  peakPowerKw: number;
  totalDynamicHeadM: number;
}

function getAgriculturalPumpLoad(
  answers: SolarAnswers,
  pumpSelection?: SolarApplianceSelection,
): AgriculturalPumpLoad | undefined {
  if (answers.propertyType !== 'farm') {
    return undefined;
  }

  const dailyWaterM3 = answers.projectDetails?.dailyWaterM3;
  const staticHeadM = answers.projectDetails?.pumpHeadM;

  if (
    typeof dailyWaterM3 !== 'number' ||
    typeof staticHeadM !== 'number' ||
    !Number.isFinite(dailyWaterM3) ||
    !Number.isFinite(staticHeadM) ||
    dailyWaterM3 <= 0 ||
    staticHeadM <= 0
  ) {
    return undefined;
  }

  /*
   * Screening hydraulique :
   *
   * Ehyd = V × H / 367
   *
   * avec V en m³/jour et H en mètres.
   */
  const totalDynamicHeadM =
    staticHeadM * PUMP_HEAD_SCREENING_FACTOR;

  const hydraulicEnergyKwh =
    (dailyWaterM3 * totalDynamicHeadM) / 367;

  /*
   * On remonte de l'énergie hydraulique vers l'énergie
   * électrique en tenant compte du rendement provisoire
   * moteur + pompe + conversion.
   */
  const electricalEnergyKwh =
    hydraulicEnergyKwh /
    FALLBACK_PUMP_WIRE_TO_WATER_EFFICIENCY;

  const pumpHours = clampHours(
    pumpSelection?.hoursPerDay ??
      SOLAR_APPLIANCES.pump.defaultHours,
  );

  const effectivePumpHours = Math.max(1, pumpHours);

  const peakPowerKw =
    electricalEnergyKwh / effectivePumpHours;

  return {
    dailyEnergyKwh: electricalEnergyKwh,
    peakPowerKw,
    totalDynamicHeadM,
  };
}


function getBusinessActivityWindow(
  answers: SolarAnswers,
): {
  startHour: number;
  durationHours: number;
} {
  const opening =
    answers.projectDetails?.openingHour;

  const closing =
    answers.projectDetails?.closingHour;

  /*
   * Si les horaires ne sont pas renseignés,
   * on utilise uniquement un profil de jour
   * provisoire 08h-18h.
   *
   * Ce n'est PAS une réduction des hoursPerDay.
   */
  if (
    typeof opening !== 'number' ||
    typeof closing !== 'number' ||
    !Number.isFinite(opening) ||
    !Number.isFinite(closing)
  ) {
    return {
      startHour: 8,
      durationHours: 10,
    };
  }

  const startHour = Math.min(
    24,
    Math.max(0, opening),
  );

  const endHour = Math.min(
    24,
    Math.max(0, closing),
  );

  if (startHour === endHour) {
    return {
      startHour,
      durationHours: 24,
    };
  }

  const durationHours =
    endHour > startHour
      ? endHour - startHour
      : 24 - startHour + endHour;

  return {
    startHour,
    durationHours,
  };
}

function resolveLoadProfile(
  id: SolarApplianceId,
  propertyType: SolarPropertyType,
): SolarLoadProfile {
  /*
   * Le profil horaire dépend maintenant du couple
   * appareil + type de projet.
   *
   * IMPORTANT :
   * Ce profil sert uniquement à placer les heures
   * d'utilisation dans les 24 h.
   *
   * Il ne modifie jamais item.hoursPerDay.
   */

  switch (id) {
    case 'fridge':
    case 'freezer':
      /*
       * Les équipements frigorifiques peuvent fonctionner
       * à toute heure, y compris après fermeture.
       */
      return 'continuous';

    case 'tv':
      /*
       * Usage principalement en soirée.
       */
      return 'evening';

    case 'lights':
      if (propertyType === 'farm') {
        return 'daytime';
      }

      if (propertyType === 'home') {
        return 'evening';
      }

      return 'business';

    case 'fan':
      if (propertyType === 'farm') {
        return 'daytime';
      }

      if (propertyType === 'home') {
        return 'evening';
      }

      return 'business';

    case 'computer':
      if (propertyType === 'farm') {
        return 'daytime';
      }

      if (propertyType === 'home') {
        return 'evening';
      }

      return 'business';

    case 'ac':
      /*
       * Maison :
       * principalement soirée/nuit dans le scénario
       * de pré-dimensionnement.
       *
       * Boutique/entreprise :
       * lié à la fenêtre d'activité.
       *
       * Ferme :
       * principalement journée.
       */
      if (propertyType === 'farm') {
        return 'daytime';
      }

      if (propertyType === 'home') {
        return 'evening';
      }

      return 'business';

    case 'pump':
      /*
       * Agriculture :
       * pompage principalement pendant la journée.
       *
       * Autres projets :
       * la pompe est liée à l'activité mais peut être
       * utilisée indépendamment des horaires d'ouverture
       * lorsque hoursPerDay dépasse cette fenêtre.
       */
      return propertyType === 'farm'
        ? 'daytime'
        : 'business';

    default:
      return SOLAR_LOAD_PROFILES[id];
  }
}

/**
 * Répartit une durée d'utilisation dans une fenêtre horaire.
 *
 * IMPORTANT :
 * hoursPerDay reste la durée réelle déclarée par l'utilisateur.
 *
 * Les valeurs horaires produites ici représentent une
 * puissance moyenne équivalente par heure. Elles servent
 * au profil énergétique 24 h.
 *
 * Le dimensionnement instantané de l'onduleur sera traité
 * séparément avec la puissance nominale et le démarrage.
 */
function addHoursToWindow(
  hourlyLoadKw: number[],
  powerKw: number,
  startHour: number,
  windowHours: number,
  requestedHours: number,
): void {
  const requested =
    Math.min(
      24,
      Math.max(0, requestedHours),
    );

  if (
    requested <= 0 ||
    powerKw <= 0
  ) {
    return;
  }

  const window =
    Math.min(
      24,
      Math.max(0, windowHours),
    );

  if (window <= 0) {
    return;
  }

  const primaryHours =
    Math.min(
      requested,
      window,
    );

  const primaryDuty =
    primaryHours / window;

  const normalizedStart =
    ((startHour % 24) + 24) % 24;

  for (
    let hour = 0;
    hour < 24;
    hour += 1
  ) {
    const distance =
      (hour - normalizedStart + 24) % 24;

    if (distance < window) {
      hourlyLoadKw[hour] +=
        powerKw * primaryDuty;
    }
  }

  /*
   * Si l'appareil fonctionne plus longtemps que
   * la fenêtre d'activité, le surplus est placé
   * en dehors de cette fenêtre.
   *
   * Exemple :
   * activité 08h-18h = 10 h
   * appareil = 14 h/j
   *
   * → 10 h dans l'activité
   * → 4 h hors activité.
   */
  const remainingHours =
    requested - primaryHours;

  const outsideHours =
    24 - window;

  if (
    remainingHours <= 0 ||
    outsideHours <= 0
  ) {
    return;
  }

  const outsideDuty =
    remainingHours / outsideHours;

  for (
    let hour = 0;
    hour < 24;
    hour += 1
  ) {
    const distance =
      (hour - normalizedStart + 24) % 24;

    if (distance >= window) {
      hourlyLoadKw[hour] +=
        powerKw * outsideDuty;
    }
  }
}

function buildHourlyLoadProfile(
  selections: SolarApplianceSelection[],
  answers: SolarAnswers,
): number[] {
  const hourlyLoadKw =
    Array(24).fill(0);

  const pumpSelection =
    selections.find(
      (item) => item.id === 'pump',
    );

  const agriculturalPumpLoad =
    getAgriculturalPumpLoad(
      answers,
      pumpSelection,
    );

  selections.forEach((item) => {
    /*
     * La pompe agricole avec données hydrauliques
     * est calculée séparément.
     */
    if (
      item.id === 'pump' &&
      agriculturalPumpLoad
    ) {
      return;
    }

    const spec =
      SOLAR_APPLIANCES[item.id];

    const quantity =
      Math.max(
        0,
        item.quantity,
      );

    const hours =
      getEffectiveHoursPerDay(
        item,
        answers,
      );

    const powerKw =
      (spec.watts * quantity) /
      1000;

    const profile =
      resolveLoadProfile(
        item.id,
        answers.propertyType,
      );

    switch (profile) {
      case 'continuous':
        /*
         * Charge répartie sur les 24 h.
         * Cela représente une puissance moyenne
         * équivalente et conserve exactement l'énergie
         * quotidienne déclarée.
         */
        addHoursToWindow(
          hourlyLoadKw,
          powerKw,
          0,
          24,
          hours,
        );
        break;

      case 'business': {
        const activity =
          getBusinessActivityWindow(
            answers,
          );

        addHoursToWindow(
          hourlyLoadKw,
          powerKw,
          activity.startHour,
          activity.durationHours,
          hours,
        );

        break;
      }

      case 'daytime':
        addHoursToWindow(
          hourlyLoadKw,
          powerKw,
          6,
          12,
          hours,
        );
        break;

      case 'evening':
        addHoursToWindow(
          hourlyLoadKw,
          powerKw,
          18,
          6,
          hours,
        );
        break;

      case 'flexible':
      default:
        addHoursToWindow(
          hourlyLoadKw,
          powerKw,
          18,
          6,
          hours,
        );
        break;
    }
  });

  /*
   * Agriculture :
   * l'énergie de pompage est déterminée par le
   * besoin hydraulique. Ici nous déterminons seulement
   * quand cette énergie est consommée.
   *
   * Par défaut : période solaire 06h-18h.
   */
  if (agriculturalPumpLoad) {
    const pumpHours =
      Math.max(
        1,
        Math.min(
          24,
          pumpSelection?.hoursPerDay ??
            SOLAR_APPLIANCES.pump.defaultHours,
        ),
      );

    addHoursToWindow(
      hourlyLoadKw,
      agriculturalPumpLoad.peakPowerKw,
      6,
      12,
      pumpHours,
    );
  }

  return hourlyLoadKw.map(
    (value) =>
      Math.max(0, value),
  );
}

interface AutonomySizingResult {
  worstCaseEnergyKwh: number;
  startHour: number;
  windowHours: number;
  peakLoadKw: number;
}

/**
 * Cherche la fenêtre d'autonomie la plus exigeante
 * dans le profil horaire des charges critiques.
 *
 * Le calcul est circulaire : une coupure à 20h peut
 * donc être prolongée jusqu'à 04h le lendemain.
 *
 * Les valeurs hourlyLoadKw représentent une puissance
 * moyenne sur chaque heure. La somme sur une fenêtre
 * donne donc directement son énergie en kWh.
 */
function calculateWorstCaseAutonomyEnergy(
  hourlyLoadKw: number[],
  autonomyHours: number,
): AutonomySizingResult {
  const safeProfile =
    Array.from(
      { length: 24 },
      (_, hour) =>
        Math.max(
          0,
          hourlyLoadKw[hour] ?? 0,
        ),
    );

  const windowHours = Math.min(
    24,
    Math.max(
      1,
      Math.ceil(
        autonomyHours,
      ),
    ),
  );

  let worstCaseEnergyKwh = 0;
  let startHour = 0;

  for (
    let candidateStart = 0;
    candidateStart < 24;
    candidateStart += 1
  ) {
    let windowEnergyKwh = 0;

    for (
      let offset = 0;
      offset < windowHours;
      offset += 1
    ) {
      const hour =
        (candidateStart + offset) % 24;

      windowEnergyKwh +=
        safeProfile[hour];
    }

    if (
      windowEnergyKwh >
      worstCaseEnergyKwh
    ) {
      worstCaseEnergyKwh =
        windowEnergyKwh;

      startHour =
        candidateStart;
    }
  }

  return {
    worstCaseEnergyKwh,
    startHour,
    windowHours,
    peakLoadKw:
      Math.max(
        ...safeProfile,
      ),
  };
}

function calculateEnergyKwh(
  selections: SolarApplianceSelection[],
  answers: SolarAnswers,
): number {
  const pumpSelection = selections.find(
    (item) => item.id === 'pump',
  );

  const agriculturalPumpLoad =
    getAgriculturalPumpLoad(
      answers,
      pumpSelection,
    );

  const applianceEnergy = selections.reduce(
    (total, item) => {
      /*
       * Lorsque les données hydrauliques agricoles sont
       * disponibles, on ne double-compte pas la pompe
       * avec "750 W × heures".
       */
      if (
        item.id === 'pump' &&
        agriculturalPumpLoad
      ) {
        return total;
      }

      const spec = SOLAR_APPLIANCES[item.id];

      const quantity = Math.max(
        0,
        item.quantity,
      );

      const hours =
        getEffectiveHoursPerDay(
          item,
          answers,
        );

      return (
        total +
        (spec.watts * quantity * hours) / 1000
      );
    },
    0,
  );

  return (
    applianceEnergy +
    (agriculturalPumpLoad?.dailyEnergyKwh ?? 0)
  );
}

/**
 * Détermine si une charge peut être active à une heure donnée.
 *
 * Cette fonction sert uniquement au calcul de la puissance
 * simultanée possible.
 *
 * Elle ne modifie jamais hoursPerDay.
 */
function isPotentiallyActiveAtHour(
  item: SolarApplianceSelection,
  answers: SolarAnswers,
  hour: number,
): boolean {
  if (
    item.quantity <= 0 ||
    item.hoursPerDay <= 0
  ) {
    return false;
  }

  const profile = resolveLoadProfile(
    item.id,
    answers.propertyType,
  );

  switch (profile) {
    case 'continuous':
      /*
       * Frigo/congélateur :
       * possibilité de fonctionnement à n'importe
       * quelle heure.
       */
      return true;

    case 'business': {
      const activity =
        getBusinessActivityWindow(
          answers,
        );

      /*
       * Les heures d'utilisation de l'appareil
       * restent indépendantes des heures d'ouverture.
       */
      const requestedHours =
        Math.min(
          24,
          Math.max(
            0,
            item.hoursPerDay,
          ),
        );

      /*
       * Si l'appareil peut fonctionner pendant toute
       * la journée, il peut naturellement être actif
       * à n'importe quelle heure.
       */
      if (
        activity.durationHours >= 24
      ) {
        return true;
      }

      const distance =
        (hour - activity.startHour + 24) % 24;

      /*
       * Pendant les heures d'activité :
       * l'appareil peut être actif.
       */
      if (
        distance <
        activity.durationHours
      ) {
        return true;
      }

      /*
       * Après fermeture :
       *
       * Si l'appareil demande davantage d'heures
       * que la durée d'ouverture, une partie de son
       * fonctionnement doit nécessairement avoir lieu
       * hors activité.
       *
       * Nous ne connaissons pas encore les heures
       * exactes de cette utilisation supplémentaire.
       * Pour le pré-dimensionnement de l'onduleur,
       * on adopte donc une hypothèse conservatrice :
       * toute heure hors activité peut être concernée.
       */
      const remainingHours =
        Math.max(
          0,
          requestedHours -
            activity.durationHours,
        );

      return remainingHours > 0;
    }

    case 'daytime':
      return hour >= 6 && hour < 18;

    case 'evening':
      return hour >= 18 && hour < 24;

    case 'flexible':
    default:
      /*
       * Horaire exact inconnu :
       * on considère que la charge peut être active
       * à n'importe quelle heure pour le calcul
       * conservateur de l'onduleur.
       */
      return true;
  }
}

interface InverterDemand {
  simultaneousPeakKw: number;
  surgePeakKw: number;
}

/**
 * Calcule la puissance de l'onduleur séparément
 * de la consommation quotidienne.
 *
 * simultaneousPeakKw :
 * puissance nominale des charges pouvant être
 * simultanément actives.
 *
 * surgePeakKw :
 * puissance supplémentaire indicative nécessaire
 * lors du démarrage des charges motorisées.
 */
function calculateInverterDemand(
  selections: SolarApplianceSelection[],
  answers: SolarAnswers,
): InverterDemand {
  const hourlyNominalWatts =
    Array(24).fill(0) as number[];

  const hourlyStartupIncrements =
    Array.from(
      { length: 24 },
      () => [] as number[],
    );

  const pumpSelection =
    selections.find(
      (item) => item.id === 'pump',
    );

  const agriculturalPumpLoad =
    getAgriculturalPumpLoad(
      answers,
      pumpSelection,
    );

  selections.forEach((item) => {
    /*
     * La pompe agricole disposant de données
     * hydrauliques est traitée séparément.
     */
    if (
      item.id === 'pump' &&
      agriculturalPumpLoad
    ) {
      return;
    }

    const spec =
      SOLAR_APPLIANCES[item.id];

    const quantity =
      Math.max(
        0,
        item.quantity,
      );

    if (quantity <= 0) {
      return;
    }

    const nominalWatts =
      spec.watts * quantity;

    const startupIncrement =
      nominalWatts *
      Math.max(
        0,
        spec.startupFactor - 1,
      );

    for (
      let hour = 0;
      hour < 24;
      hour += 1
    ) {
      if (
        !isPotentiallyActiveAtHour(
          item,
          answers,
          hour,
        )
      ) {
        continue;
      }

      hourlyNominalWatts[hour] +=
        nominalWatts;

      if (startupIncrement > 0) {
        hourlyStartupIncrements[hour].push(
          startupIncrement,
        );
      }
    }
  });

  /*
   * Pompe agricole :
   * sa puissance est déterminée à partir du
   * calcul hydraulique déjà présent.
   *
   * Pour le pré-dimensionnement de l'onduleur,
   * on considère qu'elle peut fonctionner durant
   * la période solaire.
   */
  if (agriculturalPumpLoad) {
    const pumpSpec =
      SOLAR_APPLIANCES.pump;

    const pumpWatts =
      agriculturalPumpLoad.peakPowerKw *
      1000;

    const pumpStartupIncrement =
      pumpWatts *
      Math.max(
        0,
        pumpSpec.startupFactor - 1,
      );

    for (
      let hour = 6;
      hour < 18;
      hour += 1
    ) {
      hourlyNominalWatts[hour] +=
        pumpWatts;

      if (
        pumpStartupIncrement > 0
      ) {
        hourlyStartupIncrements[hour].push(
          pumpStartupIncrement,
        );
      }
    }
  }

  const simultaneousPeakWatts =
    Math.max(
      0,
      ...hourlyNominalWatts,
    );

  let surgePeakWatts =
    simultaneousPeakWatts;

  for (
    let hour = 0;
    hour < 24;
    hour += 1
  ) {
    /*
     * On retient les deux démarrages moteurs
     * les plus importants pouvant se produire
     * simultanément.
     */
    const increments =
      hourlyStartupIncrements[hour]
        .sort((a, b) => b - a);

    const startupReserve =
      (increments[0] ?? 0) +
      (increments[1] ?? 0);

    surgePeakWatts =
      Math.max(
        surgePeakWatts,
        hourlyNominalWatts[hour] +
          startupReserve,
      );
  }

  return {
    simultaneousPeakKw:
      simultaneousPeakWatts / 1000,

    surgePeakKw:
      surgePeakWatts / 1000,
  };
}

/**
 * Vérifie un onduleur réel par rapport au besoin calculé.
 *
 * IMPORTANT :
 * cette fonction ne choisit pas un onduleur.
 * Elle vérifie simplement si un modèle donné possède
 * suffisamment de puissance nominale et de surcharge.
 *
 * La sélection d'un produit réel pourra ensuite utiliser
 * le catalogue ZIDA / Supabase.
 */
export function validateInverterCandidate(
  candidate: InverterCandidate,
  estimate: SolarEstimate,
): InverterSizingCheck {
  const nominalRequiredKw =
    Math.max(
      0,
      estimate.peakPowerKw,
    );

  const surgeRequiredKw =
    Math.max(
      0,
      estimate.surgePeakKw,
    );

  const nominalMarginKw =
    candidate.ratedPowerKw -
    nominalRequiredKw;

  const surgeMarginKw =
    candidate.surgePowerKw -
    surgeRequiredKw;

  const nominalOk =
    candidate.ratedPowerKw >=
    nominalRequiredKw;

  const surgeOk =
    candidate.surgePowerKw >=
    surgeRequiredKw;

  let reason = '';

  if (nominalOk && surgeOk) {
    reason =
      'Onduleur compatible avec les exigences calculées de puissance nominale et de démarrage.';
  } else if (!nominalOk && !surgeOk) {
    reason =
      'Puissance nominale et capacité de surcharge insuffisantes.';
  } else if (!nominalOk) {
    reason =
      'Puissance nominale insuffisante.';
  } else {
    reason =
      'Capacité de surcharge insuffisante.';
  }

  return {
    compatible:
      nominalOk && surgeOk,

    nominalRequiredKw,
    surgeRequiredKw,

    nominalMarginKw,
    surgeMarginKw,

    reason,
  };
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
    calculateEnergyKwh(loads, answers),
  );

  const criticalLoads = getCriticalLoads(
    answers,
    loads,
  );

  /*
   * Profil horaire de consommation totale.
   *
   * Les heures d'utilisation individuelles restent
   * indépendantes des horaires d'ouverture.
   */
  const hourlyLoadKw =
    buildHourlyLoadProfile(
      loads,
      answers,
    );

  /*
   * Profil horaire des seules charges critiques.
   *
   * C'est ce profil qui sert au dimensionnement de
   * l'autonomie batterie.
   */
  const criticalHourlyLoadKw =
    buildHourlyLoadProfile(
      criticalLoads,
      answers,
    );

  const criticalDailyEnergyKwh =
    roundTenth(
      criticalHourlyLoadKw.reduce(
        (total, value) =>
          total + value,
        0,
      ),
    );

  const autonomySizing =
    calculateWorstCaseAutonomyEnergy(
      criticalHourlyLoadKw,
      answers.autonomyHours,
    );

  const batteryWorstCaseEnergyKwh =
    roundTenth(
      autonomySizing.worstCaseEnergyKwh,
    );

  /**
   * Pour l'onduleur, on considère la puissance nominale
   * des charges connectées comme base de pré-dimensionnement.
   * La marge de 20 % reste volontairement explicite.
   */
  const inverterDemand =
    calculateInverterDemand(
      loads,
      answers,
    );

  const simultaneousPeakKw =
    roundTenth(
      inverterDemand.simultaneousPeakKw,
    );

  const surgePeakKw =
    roundTenth(
      inverterDemand.surgePeakKw,
    );

  /*
   * Marge de 20 % sur la puissance simultanée.
   */
  const peakPowerKw = Math.max(
    1,
    roundHalf(
      simultaneousPeakKw * 1.20,
    ),
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
   * La batterie est dimensionnée sur la pire fenêtre
   * d'autonomie des charges critiques.
   *
   * Exemple :
   * autonomie = 8 h
   *
   * Le moteur recherche la période continue de 8 h
   * présentant la plus forte consommation critique.
   *
   * Cette méthode évite de diluer artificiellement
   * la consommation quotidienne avec "8 / 24".
   */
  const batteryKwh = Math.max(
    2,
    Math.ceil(
      batteryWorstCaseEnergyKwh /
        BATTERY_USABLE_FRACTION,
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

    'La capacité de surcharge de l’onduleur doit être compatible avec la pointe de démarrage calculée.',
    'La batterie est dimensionnée sur la pire fenêtre continue d’autonomie des charges critiques.',
    'Le calcul d’autonomie ne suppose pas de production solaire pendant la coupure : il constitue un dimensionnement conservateur.',
    'Le budget affiché utilise encore des coefficients provisoires.',

    'La puissance de pointe utilise les charges susceptibles de fonctionner simultanément selon leur profil.',
    'Le besoin de démarrage des moteurs est estimé séparément.',
    'La capacité réelle de surcharge de l’onduleur doit être vérifiée sur sa fiche technique.',
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
    hourlyLoadKw,
    simultaneousPeakKw,
    surgePeakKw,
    solarArrayKw,
    batteryKwh,
    dailyEnergyKwh,
    criticalDailyEnergyKwh,
    criticalHourlyLoadKw,
    batterySizingWindowHours:
      autonomySizing.windowHours,
    batteryWorstCaseEnergyKwh,
    batterySizingStartHour:
      autonomySizing.startHour,
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
    `Autonomie batterie dimensionnée sur ${result.batterySizingWindowHours}h; pire fenêtre: ${result.batteryWorstCaseEnergyKwh} kWh.`,
    `Budget indicatif: ${result.budgetLow} - ${result.budgetHigh} FCFA.`,
    'Résultat à confirmer après étude technique du site.',
  ].join('\n');
}
