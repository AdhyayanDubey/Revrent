// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../store';

// Importing Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import SplashScreen from '../screens/home/SplashScreen';
import HomeScreen from '../screens/home/HomeScreen';
import DetailsScreen from '../screens/vehicle/DetailsScreen';
import ReserveScreen from '../screens/booking/ReserveScreen';
import ConfirmationScreen from '../screens/booking/ConfirmationScreen';
import FeedbackScreen from '../screens/booking/FeedbackScreen';
import CompareScreen from '../screens/vehicle/CompareScreen';
import VendorDashboardScreen from '../screens/vendor/DashboardScreen';

const RootStack = createNativeStackNavigator();

export default function RootNavigation() {
  const isDarkMode = useAppStore(state => state.isDarkMode);

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        {/* Splash Flow */}
        <RootStack.Screen name="Splash" component={SplashScreen} />
        
        {/* Auth Flow */}
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="SignUp" component={SignUpScreen} />

        {/* Home Flow */}
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Details" component={DetailsScreen} />
        <RootStack.Screen name="Compare" component={CompareScreen} />

        {/* Booking Flow */}
        <RootStack.Screen name="Reserve" component={ReserveScreen} />
        <RootStack.Screen name="Confirmation" component={ConfirmationScreen} />
        <RootStack.Screen name="Feedback" component={FeedbackScreen} />

        {/* Vendor Flow */}
        <RootStack.Screen name="VendorDashboard" component={VendorDashboardScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
