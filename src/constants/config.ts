// src/constants/config.ts

export const API_URL = 'https://site-de-l-entreprise-zida-solaire-a-snowy.vercel.app/api';

// Mettre à false pour utiliser l'API réelle
export const USE_MOCK_DATA = false; // ← Changé à false pour utiliser l'API réelle

export const CONFIG = {
  apiTimeout: 60000, // 30 secondes
  retryAttempts: 3,
};