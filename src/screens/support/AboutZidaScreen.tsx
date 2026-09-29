import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';

import { WebView } from 'react-native-webview';
// @ts-expect-error Expo vector icons types issue
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

const ABOUT_URL =
  'https://site-de-l-entreprise-zida-solaire-a-snowy.vercel.app/a-propos';

export default function AboutZidaScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color={Colors.textSecondary}
        />

        <Text style={styles.errorTitle}>
          Impossible de charger la page
        </Text>

        <Text style={styles.errorText}>
          Vérifiez votre connexion Internet puis réessayez.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(false);
            setLoading(true);
            setReloadKey((value) => value + 1);
          }}
        >
          <Text style={styles.retryText}>
            Réessayer
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        key={reloadKey}
        source={{ uri: ABOUT_URL }}
        style={styles.webview}
        startInLoadingState={false}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text style={styles.loadingText}>
            Chargement de ZIDA SOLAIRE...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  webview: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  loading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F8FB',
    padding: 32,
  },

  errorTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 16,
    textAlign: 'center',
  },

  errorText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 26,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryText: {
    color: Colors.white,
    fontWeight: '900',
  },
});
