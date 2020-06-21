import React from 'react';
import { Text, SafeAreaView, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@ui-kitten/components';
import ExploreScreen from './screens/explore/index';
import SavedScreen from './screens/saved/index';
import AlertsScreen from './screens/alerts/index';
import ProfileScreen from './screens/profile/index';
import AddScreen from './screens/add/index';
import { default as appTheme } from './custom-theme.json';

const Tab = createBottomTabNavigator();

const BaseScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        let colorIcon = color;
                        let sizeIcon = size;

                        if (focused) {
                            colorIcon = appTheme['color-primary-500'];
                        }

                        if (route.name === 'Explore') {
                            iconName = focused ? 'search' : 'search-outline';
                        } else if (route.name === 'Saved') {
                            iconName = focused ? 'heart' : 'heart-outline';
                        } else if (route.name === 'Alerts') {
                            iconName = focused ? 'bell' : 'bell-outline';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person-outline';
                        } else if (route.name === 'Add') {
                            iconName = focused ? 'plus-circle' : 'plus-circle-outline';
                            sizeIcon = 64;
                        }

                        return <Icon name={iconName} width={sizeIcon} height={sizeIcon} fill={colorIcon} style={{ backgroundColor: '#fff', borderRadius: sizeIcon / 2 }} />;
                    },
                    tabBarLabel: ({ focused, color }) => {
                        let iconName;
                        let colorIcon = color;
                        if (focused) {
                            colorIcon = appTheme['color-primary-500'];
                        }

                        if (route.name === 'Explore') {
                            iconName = 'Khám phá';
                        } else if (route.name === 'Saved') {
                            iconName = 'Đã lưu';
                        } else if (route.name === 'Alerts') {
                            iconName = 'Thông báo';
                        } else if (route.name === 'Profile') {
                            iconName = 'Cá nhân';
                        }

                        return <Text style={{ color: colorIcon, fontSize: 12, fontFamily: 'MavenPro-Regular' }}>{iconName}</Text>;
                    }
                })}
                tabBarOptions={{
                    style: {
                        //paddingVertical: 5,
                        //height: 60,
                        borderTopColor: "transparent"
                    },
                    tabStyle: {
                        paddingVertical: 5
                    },
                    keyboardHidesTabBar: true
                }}
            >
                <Tab.Screen name="Explore" component={ExploreScreen} />
                <Tab.Screen name="Saved" component={SavedScreen} options={{ title: 'Saved' }} />
                <Tab.Screen name="Add" component={AddScreen} options={{ title: 'Add' }} />
                <Tab.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Alerts' }} />
                <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
            </Tab.Navigator>
        </SafeAreaView>
    )
}
export default BaseScreen;