import {AppLoading} from 'expo';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import React, {useState, Component} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import {ScrollView, SafeAreaView, Text, View, TouchableOpacity} from "react-native-web";
import constant from './constants/Colors'

import {
    createAppContainer,
    createSwitchNavigator,
    createDrawerNavigator,
    DrawerItems,
} from "react-navigation";

import MainTabNavigator from './navigation/MainTabNavigator';
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";

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
            <View style={styles.container}>
                <View>
                    <TouchableOpacity style={{margin: 10}}
                                      onPress={() => this.props.navigation.navigate('AppNavigator')}>
                        <FontAwesome name={'close'} size={21} color={'gray'}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff'}}>
                    <Text style={{fontSize: 24, textAlign: 'center', color: 'black', marginBottom: 50}}><b>Cuba</b>feria</Text>
                    <TouchableOpacity
                        style={styles.loginButton} onPress={() => this.props.navigation.navigate('AppNavigator')}>
                        <FontAwesome style={{flex: 1, textAlign: 'center'}} name={'facebook'} size={21}
                                     color={'white'}/>
                        <Text style={{flex: 4, textAlign: 'center', color: 'white'}}>Continúa con Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginButton} onPress={() => this.props.navigation.navigate('AppNavigator')}>
                        <FontAwesome style={{flex: 1, textAlign: 'center'}} name={'google'} size={21} color={'white'}/>
                        <Text style={{flex: 4, textAlign: 'center', color: 'white'}}>Continúa con Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginButton} onPress={() => this.props.navigation.navigate('RegisterScreen')}>
                        <FontAwesome style={{flex: 1, textAlign: 'center'}} name={'sign-in'} size={21} color={'white'}/>
                        <Text style={{flex: 4, textAlign: 'center', color: 'white'}}>Regístrate Gratis</Text>
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 20
                    }}>
                        <Text style={{flex: 1, fontSize: 10, color: 'black'}}>Ya tienes una cuenta? </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')}>
                            <Text style={{flex: 1, fontSize: 10, color: 'black', textDecorationLine: 'underline'}}>Inicia
                                sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const CustomDrawerComponent = props => (
    <ScrollView style={{flex: 1}}>
        <View style={{
            background: 'linear-gradient(#4630EB, #000)',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text style={{fontSize: 24, textAlign: 'center', color: 'white', marginBottom: 10}}><b>Cuba</b>feria</Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('WelcomeScreen')}>
                <Text style={{fontSize: 20, color: 'white'}}>Inicia
                    sesión o regístrate</Text>
            </TouchableOpacity>
        </View>
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
    AnnouncementCreate: {
        screen: MainTabNavigator,
        navigationOptions: {
            title: 'Insertar Anuncio',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'plus'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },
    Terms: {
        screen: MainTabNavigator,
        navigationOptions: {
            title: 'Términos y condiciones',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'print'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },
    Help: {
        screen: MainTabNavigator,
        navigationOptions: {
            title: 'Ayuda',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'question-circle'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },
    AboutUs: {
        screen: MainTabNavigator,
        navigationOptions: {
            title: 'Contáctanos',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'envelope-o'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },


}, {
    drawerPosition: "left",
    drawerBackgroundColor: "white",
    contentComponent: CustomDrawerComponent
});

const AppSwitchNavigator = createSwitchNavigator({
    AppNavigator: AppDrawerNavigator,
    WelcomeScreen: WelcomeScreen,
    RegisterScreen: RegisterScreen,
    LoginScreen: LoginScreen,
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
    loginButton: {
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: constant.tintColor,
        padding: 10,
        width: 230,
        borderRadius: 30
    }
});


