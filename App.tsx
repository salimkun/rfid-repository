/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
import StockInScreen from './src/screens/StockInScreen';
import StockOutScreen from './src/screens/StockOutScreen';
import StockOpnameScreen from './src/screens/StockOpnameScreen';

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StockIn" component={StockInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StockOut" component={StockOutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StockOpname" component={StockOpnameScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
