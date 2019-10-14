import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
    web: {headerMode: 'screen'},
    default: {},
});

const HomeStack = createStackNavigator(
    {
        Home: HomeScreen,
    },
    config
);

HomeStack.navigationOptions = {
    tabBarLabel: 'Inicio',
    tabBarIcon: ({focused}) => (
        <TabBarIcon focused={focused} name={
            Platform.OS === 'ios'
                ? `home${focused ? '' : '-outline'}`
                : 'home'
        }
        />
    ),
};

HomeStack.path = '';

const AnnouncementCreateStack = createStackNavigator(
    {
        Links: LinksScreen,
    },
    config
);

AnnouncementCreateStack.navigationOptions = {
    tabBarLabel: 'Nuevo Anuncio',
    tabBarIcon: ({focused}) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'plus' : 'plus'}/>
    ),
};

AnnouncementCreateStack.path = '';

const ProfileStack = createStackNavigator(
    {
        Settings: SettingsScreen,
    },
    config
);

ProfileStack.navigationOptions = {
    tabBarLabel: 'Perfil',
    tabBarIcon: ({focused}) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'user' : 'user'}/>
    ),
};

ProfileStack.path = '';

const tabNavigator = createBottomTabNavigator({
    HomeStack,
    AnnouncementCreateStack,
    ProfileStack,
});

tabNavigator.path = '';

export default tabNavigator;
