import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import constant from "../constants/Colors";
import {FontAwesome} from "@expo/vector-icons";

export default function SettingsScreen() {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return <ExpoConfigView />;
}

SettingsScreen.navigationOptions = {
      title: 'Cubaferia',
    headerStyle: {
        backgroundColor: constant.primaryColor
    },
    headerTintColor: '#fff',
    headerRight: (
        <FontAwesome style={{marginRight: 20}} name={'bars'} size={21} color={'white'}
                     onPress={() => this.props.navigation.openDrawer()}/>
    ),
};
