import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {ExpoLinksView} from '@expo/samples';
import constant from "../constants/Colors";
import {FontAwesome} from "@expo/vector-icons";

export default function LinksScreen() {
    return (
        <ScrollView style={styles.container}>

        </ScrollView>
    );
}

LinksScreen.navigationOptions = {
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
});
