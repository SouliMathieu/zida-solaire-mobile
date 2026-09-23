import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EnergyHomeScreen from '../screens/energy/EnergyHomeScreen';
import SolarAssistantScreen from '../screens/energy/SolarAssistantScreen';
import SolarResultScreen from '../screens/energy/SolarResultScreen';
import InstallationsScreen, { CustomerInstallation } from '../screens/energy/InstallationsScreen';
import InstallationDetailScreen from '../screens/energy/InstallationDetailScreen';
import { Colors } from '../constants/colors';
import { SolarAnswers } from '../utils/solarEstimator';

export type EnergyStackParamList = {
  EnergyHome: undefined;
  SolarAssistant: undefined;
  SolarResult: { answers: SolarAnswers };
  Installations: undefined;
  InstallationDetail: { installation: CustomerInstallation };
};

const Stack = createNativeStackNavigator<EnergyStackParamList>();

export default function EnergyStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="EnergyHome" component={EnergyHomeScreen} options={{ title: 'Mon énergie' }} />
      <Stack.Screen name="SolarAssistant" component={SolarAssistantScreen} options={{ title: 'Assistant solaire' }} />
      <Stack.Screen name="SolarResult" component={SolarResultScreen} options={{ title: 'Votre solution' }} />
      <Stack.Screen name="Installations" component={InstallationsScreen} options={{ title: 'Mes installations' }} />
      <Stack.Screen name="InstallationDetail" component={InstallationDetailScreen} options={{ title: 'Suivi du projet' }} />
    </Stack.Navigator>
  );
}
