import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SupportHomeScreen from '../screens/support/SupportHomeScreen';
import AboutZidaScreen from '../screens/support/AboutZidaScreen';
import RepairRequestV2Screen from '../screens/profile/RepairRequestV2Screen';
import InstallationRequestScreen from '../screens/profile/InstallationRequestScreen';
import ContactScreen from '../screens/profile/ContactScreen';
import RepairTicketsScreen from '../screens/support/RepairTicketsScreen';
import RepairTicketDetailScreen from '../screens/support/RepairTicketDetailScreen';
import { RepairTicket } from '../hooks/useRepairs';
import { Colors } from '../constants/colors';
import HeaderActions from '../components/common/HeaderActions';

export type SupportStackParamList = {
  SupportHome: undefined;
  RepairRequest: undefined;
  RepairTickets: undefined;
  RepairTicketDetail: { ticket: RepairTicket };
  InstallationRequest: undefined;
  Contact: undefined;
  AboutZida: undefined;
};

const Stack = createNativeStackNavigator<SupportStackParamList>();

export default function SupportStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false,

        headerRight: () => (
          <HeaderActions
            onNotifications={() =>
              (navigation.getParent() as any)?.navigate(
                'Profil',
                { screen: 'Notifications' }
              )
            }
            onCart={() =>
              (navigation.getParent() as any)?.navigate(
                'Profil',
                { screen: 'CartArea' }
              )
            }
          />
        ),
      })}
    >
      <Stack.Screen name="SupportHome" component={SupportHomeScreen} options={{ title: 'Assistance' }} />
      <Stack.Screen name="RepairRequest" component={RepairRequestV2Screen} options={{ title: 'Signaler un problème' }} />
      <Stack.Screen name="RepairTickets" component={RepairTicketsScreen} options={{ title: 'Mes demandes' }} />
      <Stack.Screen name="RepairTicketDetail" component={RepairTicketDetailScreen} options={{ title: 'Détail du ticket' }} />
      <Stack.Screen name="InstallationRequest" component={InstallationRequestScreen} options={{ title: "Nouvelle installation" }} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Nous contacter' }} />
      <Stack.Screen
        name="AboutZida"
        component={AboutZidaScreen}
        options={{ title: 'À propos de ZIDA' }}
      />
    </Stack.Navigator>
  );
}
