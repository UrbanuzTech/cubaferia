import {AppLoading} from 'expo';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import React, {useState, Component} from 'react';
import {Platform, StatusBar, StyleSheet, View, Text} from 'react-native';
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import {Button, ScrollView, SafeAreaView} from "react-native-web";
import constant from './constants/Colors'

import {
    createAppContainer,
    createSwitchNavigator,
    createDrawerNavigator,
    DrawerItems,
} from "react-navigation";

import MainTabNavigator from './navigation/MainTabNavigator';

export default function App(props) {
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    if (!isLoadingComplete && !props.skipLoadingScreen) {
        return (
            <AppLoading
                startAsync={loadResourcesAsync}
                onError={handleLoadingError}
                onFinish={() => handleFinishLoading(setLoadingComplete)}
            />
        );
    } else {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                <AppContainer/>
            </View>
        );
    }
}

class WelcomeScreen extends Component {
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1c1c1c'}}>
                <Button onPress={() => this.props.navigation.navigate('AppNavigator')} title={'CubaFeria'}/>
            </View>
        );
    }
}

const CustomDrawerComponent = props => (
    <ScrollView style={{flex: 1}}>
        <SafeAreaView>
            <DrawerItems {...props}/>
        </SafeAreaView>
    </ScrollView>
);


const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: MainTabNavigator,
        navigationOptions: {
            title: 'Inicio',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'home'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },
    SignUpFacebook: {
        screen: MainTabNavigator,
        navigationOptions: {
            title: 'Continuar Facebook',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'facebook-square'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },
    SignUpGoogle: {
        screen: MainTabNavigator,
        navigationOptions: {
            title: 'Continuar Google',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'google'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },
    SignUp: {
        screen: MainTabNavigator,
        navigationOptions: {
            title: 'Registrate Gratis',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'sign-in'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },

}, {
    drawerPosition: "right",
    drawerBackgroundColor: "white",
    contentComponent: CustomDrawerComponent
});

const AppSwitchNavigator = createSwitchNavigator({
    WelcomeScreen: WelcomeScreen,
    AppNavigator: AppDrawerNavigator,
});

const AppContainer = createAppContainer(AppSwitchNavigator);

async function loadResourcesAsync() {
    await Promise.all([
        Asset.loadAsync([
            require('./assets/images/robot-dev.png'),
            require('./assets/images/robot-prod.png'),
        ]),
        Font.loadAsync({
            // This is the font that we are using for our tab bar
            ...Ionicons.font,
            // We include SpaceMono because we use it in HomeScreen.js. Feel free to
            // remove this if you are not using it in your app
            'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        }),
    ]);
}

function handleLoadingError(error) {
    // In this case, you might want to report the error to your error reporting
    // service, for example Sentry
    console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
    setLoadingComplete(true);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});


