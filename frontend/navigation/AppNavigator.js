import React from 'react';
import {createAppContainer, createDrawerNavigator, createSwitchNavigator} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import SettingsScreen from "../screens/SettingsScreen";

export default createAppContainer(
    createSwitchNavigator({
        // You could add another route here for authentication.
        // Read more at https://reactnavigation.org/docs/en/auth-flow.html
        Main: MainTabNavigator,
    }),
    createDrawerNavigator({
        Settings: SettingsScreen
    }, {
        drawerPosition: "right"
    })
);
