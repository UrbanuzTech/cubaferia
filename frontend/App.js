import {AppLoading} from 'expo';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import React, {useState, Component} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import {ScrollView, SafeAreaView, Text, View, TouchableOpacity, Image} from "react-native-web";
import constant from './constants/Colors'

import {
    createAppContainer,
    createSwitchNavigator,
    createDrawerNavigator,
    createStackNavigator,
    DrawerItems,
} from "react-navigation";

import MainTabNavigator from './navigation/MainTabNavigator';
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AnnouncementCreateScreen, {
    AnnouncementFormCreateScreen,
    AnnouncementSubcategoryCreateScreen
} from "./screens/AnnouncementCreateScreen";
import AnnouncementDetailsScreen from "./screens/AnnouncementDetailsScreen";

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
                                      onPress={() => this.props.navigation.goBack()}>
                        <FontAwesome name={'close'} size={21} color={'gray'}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff'}}>
                    <Image style={{width: 200, height: 200, marginBottom: 40}}
                           source={require('./assets/images/logo-y.png')}/>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => this.props.navigation.navigate('AppLoggedNavigator')}>
                        <FontAwesome style={{flex: 1, textAlign: 'center'}} name={'facebook'} size={21}
                                     color={'white'}/>
                        <Text style={{flex: 4, textAlign: 'center', color: 'white'}}>Continúa con Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => this.props.navigation.navigate('AppLoggedNavigator')}>
                        <FontAwesome style={{flex: 1, textAlign: 'center'}} name={'google'} size={21}
                                     color={'white'}/>
                        <Text style={{flex: 4, textAlign: 'center', color: 'white'}}>Continúa con Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginButton} onPress={() => this.props.navigation.navigate('RegisterScreen')}>
                        <FontAwesome style={{flex: 1, textAlign: 'center'}} name={'sign-in'} size={21}
                                     color={'white'}/>
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

// Normal session components

const StackNavigator = createStackNavigator({
    HomeScreen: {
        screen: HomeScreen,
        navigationOptions: {
            header: null,
        }
    },
    AnnouncementCreateScreen: {
        screen: AnnouncementCreateScreen,
        navigationOptions: {
            header: null
        }
    },
    AnnouncementSubcategoryCreateScreen: {
        screen: AnnouncementSubcategoryCreateScreen,
        navigationOptions: {
            header: null
        }
    },
    AnnouncementFormCreateScreen: {
        screen: AnnouncementFormCreateScreen,
        navigationOptions: {
            header: null
        }
    },
    AnnouncementDetailsScreen: {
        screen: AnnouncementDetailsScreen,
        navigationOptions: {
            header: null
        }
    },
    WelcomeScreen: {
        screen: WelcomeScreen,
        navigationOptions: {
            header: null
        }
    },
    RegisterScreen: {
        screen: RegisterScreen,
        navigationOptions: {
            header: null
        }
    },
    LoginScreen: {
        screen: LoginScreen,
        navigationOptions: {
            header: null
        }
    },
});

const CustomDrawerComponent = props => (
    <ScrollView style={{flex: 1}}>
        <View style={{
            background: 'linear-gradient(#fff,' + constant.primaryColor + ')',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Image style={{width: 200, height: 60, marginBottom: 10}}
                   source={require('./assets/images/logo-x.png')}/>
            <TouchableOpacity onPress={() => props.navigation.navigate('WelcomeScreen')}>
                <Text style={{fontSize: 15, color: '#000', textShadow: '0px 1px 5px #fff',}}>INICIA SESIÓN O
                    REGÍSTRATE</Text>
            </TouchableOpacity>
        </View>
        <SafeAreaView>
            <DrawerItems {...props} activeTintColor={constant.tintColor}/>
        </SafeAreaView>
    </ScrollView>
);

const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: StackNavigator,
        navigationOptions: {
            title: 'Inicio',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'home'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },
    AnnouncementCreate: {
        screen: AnnouncementCreateScreen,
        navigationOptions: {
            title: 'Insertar Anuncio',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'plus'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },
    Terms: {
        screen: HomeScreen,
        navigationOptions: {
            title: 'Términos y condiciones',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'print'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },
    Help: {
        screen: HomeScreen,
        navigationOptions: {
            title: 'Ayuda',
            drawerIcon: ({focused}) => (
                <FontAwesome style={{marginRight: 20}} name={'question-circle'} size={21}
                             color={focused ? constant.tintColor : 'black'}/>
            ),
        }
    },
    AboutUs: {
        screen: HomeScreen,
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

// Logged session components

const LoggedCustomDrawerComponent = props => (
    <ScrollView style={{flex: 1}}>
        <View style={{
            background: 'linear-gradient(#fff,' + constant.primaryColor + ')',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Image style={{width: 200, height: 60, marginBottom: 10}}
                   source={require('./assets/images/logo-x.png')}/>
            <Text style={{fontSize: 15, color: '#000', textShadow: '0px 1px 5px #fff',}}>Fulano</Text>
        </View>
        <SafeAreaView>
            <DrawerItems {...props} activeTintColor={constant.tintColor}/>
        </SafeAreaView>
    </ScrollView>
);

const AppLoggedDrawerNavigator = createDrawerNavigator({
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
        screen: AnnouncementCreateScreen,
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
    contentComponent: LoggedCustomDrawerComponent
});

const AppSwitchNavigator = createSwitchNavigator({
    AppNavigator: AppDrawerNavigator,
    AppLoggedNavigator: AppLoggedDrawerNavigator,
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
        backgroundColor: constant.primaryColor,
        padding: 10,
        width: 230,
        borderRadius: 30
    }
});


