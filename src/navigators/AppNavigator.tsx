import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomeScreen from '../views/HomeScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
    );
}