import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import AnnouncementCreateScreen from '../screens/AnnouncementCreateScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {FontAwesome} from "@expo/vector-icons";
import constant from "../constants/Colors";

const config = Platform.select({
    web: {headerMode: 'screen'},
    default: {},
});

const navigation_config = ({navigation}) => {
    return {
        headerLeft: (
            <FontAwesome style={{marginLeft: 20}} name={'bars'} size={21} color={'white'}
                         onPress={() => navigation.openDrawer()}/>
        ),
        title: 'Cubaferia',
        headerStyle: {
            backgroundColor: constant.primaryColor
        },
        headerTintColor: '#fff',
    }
};

const HomeStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
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
        Links: {
            screen: AnnouncementCreateScreen,
            navigationOptions: navigation_config
        },
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
        Settings: {
            screen: ProfileScreen,
            navigationOptions: navigation_config
        },
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
