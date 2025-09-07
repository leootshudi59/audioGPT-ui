import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ROUTES } from '../constants';
import LocationsScreen from '../views/LocationScreen';
import MapScreen from '../views/MapScreen';
import ProfileScreen from '../views/ProfileScreen';

const Tab = createBottomTabNavigator();


export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tab.Screen name={ROUTES.LOCATIONS} component={LocationsScreen} />
      <Tab.Screen name={ROUTES.EXPLORE} component={MapScreen} />
      <Tab.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
}