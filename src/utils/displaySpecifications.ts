export type DisplaySpecification = { key: string; label: string; value: string };

const LABELS: Record<string, { label: string; unit?: string }> = {
  panelPowerW: { label: 'Puissance du panneau', unit: 'W' },
  solarPowerKw: { label: 'Puissance des panneaux du kit', unit: 'kWc' },
  batteryCapacityKwh: { label: 'Capacité de stockage des batteries', unit: 'kWh' },
  inverterPowerKw: { label: 'Puissance nominale de l’onduleur', unit: 'kW' },
  inverterSurgePowerKw: { label: 'Puissance maximale de démarrage de l’onduleur', unit: 'kW' },
};

function humanizeKey(key: string): string {
  const words = key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Autre caractéristique';
}

export function displaySpecifications(input?: Record<string, unknown> | null): DisplaySpecification[] {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return [];
  return Object.entries(input).flatMap(([key, raw]) => {
    if (raw === null || raw === undefined || raw === '') return [];
    if (typeof raw === 'object') return [];
    const spec = LABELS[key];
    const value = typeof raw === 'boolean' ? (raw ? 'Oui' : 'Non')
      : typeof raw === 'number' ? raw.toLocaleString('fr-FR', { maximumFractionDigits: 3 })
      : String(raw).trim();
    if (!value) return [];
    return [{ key, label: spec?.label || humanizeKey(key), value: spec?.unit ? `${value} ${spec.unit}` : value }];
  });
}
