import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Keyboard,
    Text,
    TouchableOpacity,
} from "react-native-web";
import constant from "../constants/Colors";
import * as Provider from "../misc/Provider";
import {Input, Item, Label} from "native-base";
import {FontAwesome} from "@expo/vector-icons";

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: true
        };
    }

    login = () => {
        Provider.login(this.state.username, this.state.password).then({},
            (err) => {
                console.log(err);
            });
        Keyboard.dismiss();
    };

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <TouchableOpacity style={{margin: 10}}
                                      onPress={() => this.props.navigation.navigate('WelcomeScreen')}>
                        <FontAwesome name={'arrow-left'} size={21} color={'gray'}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.header}>Bienvenido a <b>Cuba</b>feria</Text>
                    <Item floatingLabel style={styles.inputs}>
                        <Label>Correo electrónico o teléfono</Label>
                        <Input returnKeyType={'next'} onChangeText={username => this.setState({username})}/>
                    </Item>
                    <Item floatingLabel style={styles.inputs}>
                        <Label>Contraseña</Label>
                        <Input secureTextEntry returnKeyType={'send'}
                               onChangeText={password => this.setState({password})}/>
                    </Item>
                    <View style={{alignItems: 'center', margin: 10}}>
                        <TouchableOpacity
                            style={styles.createButton} onPress={() => this.login()}>
                            <Text style={{textAlign: 'center', color: 'white'}}>Acceder</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.footer}>Al registrarte o iniciar sesión aceptas nuestros </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')}>
                        <Text style={styles.footerUnderline}>Términos y Condiciones</Text>
                    </TouchableOpacity>
                    <Text style={styles.footer}>y la </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')}>
                        <Text style={styles.footerUnderline}>Política de Privacidad</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputs: {
        paddingTop: 15,
        marginTop: 20,
        width: '90%'
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        color: 'black',
        marginBottom: 50
    },
    createButton: {
        marginTop: 20,
        backgroundColor: constant.tintColor,
        padding: 10,
        width: 150,
        borderRadius: 30
    },
    footer: {
        fontSize: 10,
        color: 'black'
    },
    footerUnderline: {
        fontSize: 10,
        color: 'black',
        textDecorationLine: 'underline'
    }
});
