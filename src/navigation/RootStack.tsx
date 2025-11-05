import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChatScreen from '../screens/ChatScreen';
import ModelsScreen from '../screens/ModelsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
    Splash: undefined;
    Welcome: undefined;
    Dashboard: undefined;
    Chat: undefined;
    Models: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => (
    <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            // statusBarBackgroundColor: '#4E1D02',
        }}
    >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Models" component={ModelsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
);

export default RootStack;
