import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import BaseScreen from './base';
import DetailScreen from './screens/detail';
import ChitietScreen from './screens/tintuc/chitiet';
import DuanScreen from './screens/duan/chitiet';
import SearchScreen from './screens/search/index';
//import LoginScreen from '../screens/login';
//import DetailScreen from '../screens/detail';
//import NguoidungScreen from '../screens/nguoidung';
//import SearchScreen from '../screens/search';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Base" component={BaseScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
          <Stack.Screen name="Chitiet" component={ChitietScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
          <Stack.Screen name="Duan" component={DuanScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
          {/*<Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Nguoidung" component={NguoidungScreen} options={{ headerShown: false }} />
  <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />*/}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};
export default AppNavigation;