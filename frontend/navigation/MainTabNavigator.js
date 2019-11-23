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
    tabBarLabel: 'Anuncios',
    tabBarIcon: ({focused}) => (
        <TabBarIcon focused={focused} name={
            Platform.OS === 'ios'
                ? `list-ol${focused ? '' : '-outline'}`
                : 'list-ol'
        }
        />
    ),
};

HomeStack.path = '';

const MyAnnouncementStacks = createStackNavigator(
    {
        Links: {
            screen: HomeScreen,
            navigationOptions: navigation_config
        },
    },
    config
);

MyAnnouncementStacks.navigationOptions = {
    tabBarLabel: 'Mis anuncios',
    tabBarIcon: ({focused}) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'bullhorn' : 'bullhorn'}/>
    ),
};

MyAnnouncementStacks.path = '';

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
    MyAnnouncementStacks,
    ProfileStack,
});

tabNavigator.path = '';

export default tabNavigator;
