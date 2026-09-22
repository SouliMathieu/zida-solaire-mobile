export type SolarPropertyType = 'home' | 'shop' | 'business' | 'farm';
export type SolarApplianceId = 'lights' | 'tv' | 'fridge' | 'ac' | 'pump' | 'freezer' | 'fan' | 'computer';

export interface SolarApplianceSelection {
  id: SolarApplianceId;
  quantity: number;
  hoursPerDay: number;
}

export interface SolarAnswers {
  propertyType: SolarPropertyType;
  rooms: number;
  appliances: SolarApplianceSelection[];
  autonomyHours: number;
  monthlyBill: string;
}

export interface SolarEstimate {
  peakPowerKw: number;
  solarArrayKw: number;
  batteryKwh: number;
  dailyEnergyKwh: number;
  autonomyHours: number;
  budgetLow: number;
  budgetHigh: number;
}

export const SOLAR_APPLIANCES: Record<SolarApplianceId, { label: string; watts: number; defaultHours: number }> = {
  lights: { label: 'Éclairage', watts: 12, defaultHours: 6 },
  tv: { label: 'Télévision', watts: 100, defaultHours: 5 },
  fridge: { label: 'Réfrigérateur', watts: 150, defaultHours: 10 },
  freezer: { label: 'Congélateur', watts: 220, defaultHours: 10 },
  fan: { label: 'Ventilateur', watts: 70, defaultHours: 8 },
  computer: { label: 'Ordinateur', watts: 120, defaultHours: 6 },
  ac: { label: 'Climatiseur', watts: 1200, defaultHours: 6 },
  pump: { label: 'Pompe à eau', watts: 750, defaultHours: 2 },
};

const roundHalf = (value: number) => Math.ceil(value * 2) / 2;
const roundTenth = (value: number) => Math.ceil(value * 10) / 10;

export function estimateSolarSystem(answers: SolarAnswers): SolarEstimate {
  const baseLightingQuantity = Math.max(answers.rooms * 2, 4);
  let peakWatts = baseLightingQuantity * SOLAR_APPLIANCES.lights.watts;
  let dailyWh = baseLightingQuantity * SOLAR_APPLIANCES.lights.watts * 6;

  answers.appliances.forEach((item) => {
    if (item.id === 'lights') return;
    const spec = SOLAR_APPLIANCES[item.id];
    peakWatts += spec.watts * item.quantity;
    dailyWh += spec.watts * item.quantity * item.hoursPerDay;
  });

  const propertyFactor = answers.propertyType === 'business' ? 1.25 : answers.propertyType === 'shop' ? 1.15 : answers.propertyType === 'farm' ? 1.2 : 1;
  peakWatts *= propertyFactor;
  dailyWh *= propertyFactor;

  const peakPowerKw = Math.max(1, roundHalf((peakWatts * 1.25) / 1000));
  const dailyEnergyKwh = roundTenth(dailyWh / 1000);
  const solarArrayKw = Math.max(1, roundTenth(dailyEnergyKwh / (5.5 * 0.78)));
  const batteryKwh = Math.max(2, Math.ceil((dailyEnergyKwh * (answers.autonomyHours / 24)) / 0.82));

  const equipmentEstimate = solarArrayKw * 330000 + batteryKwh * 240000 + peakPowerKw * 180000 + 300000;
  const budgetLow = Math.round(equipmentEstimate / 50000) * 50000;
  const budgetHigh = Math.round((equipmentEstimate * 1.2) / 50000) * 50000;

  return {
    peakPowerKw,
    solarArrayKw,
    batteryKwh,
    dailyEnergyKwh,
    autonomyHours: answers.autonomyHours,
    budgetLow,
    budgetHigh,
  };
}

export function buildSolarStudyDescription(answers: SolarAnswers, result: SolarEstimate) {
  const devices = answers.appliances
    .filter((item) => item.quantity > 0)
    .map((item) => `${SOLAR_APPLIANCES[item.id].label}: ${item.quantity} × ${item.hoursPerDay}h/j`)
    .join(', ');

  return [
    'Simulation réalisée depuis l’application mobile ZIDA SOLAIRE.',
    `Projet: ${answers.propertyType}; pièces/chambres: ${answers.rooms}.`,
    `Équipements: ${devices || 'éclairage uniquement'}.`,
    `Autonomie souhaitée: ${answers.autonomyHours}h; facture mensuelle: ${answers.monthlyBill}.`,
    `Estimation indicative: panneaux ${result.solarArrayKw} kWc; onduleur ${result.peakPowerKw} kW; batterie ${result.batteryKwh} kWh; énergie ${result.dailyEnergyKwh} kWh/j.`,
    `Budget indicatif: ${result.budgetLow} - ${result.budgetHigh} FCFA.`,
  ].join('\n');
}
