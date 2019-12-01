import React, {Component} from 'react';
import {
    ScrollView,
    TextInput,
    StyleSheet,
    View,
    Keyboard,
    Picker,
    Text,
    TouchableOpacity, Image,
} from "react-native-web";
import constant from "../constants/Colors";
import * as Provider from "../misc/Provider";
import {FontAwesome} from "@expo/vector-icons";
import {Input, Item, Label} from "native-base";

export default class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            isLoading: true
        };
    }

    createData = () => {
        Provider.createValue('user', this.state).then({},
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
                                      onPress={() => this.props.navigation.goBack()}>
                        <FontAwesome name={'arrow-left'} size={21} color={'gray'}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image style={{width: 200, height: 60, margin: 10}}
                           source={require('../assets/images/logo-x.png')}/>
                    <Text style={styles.header}>Únete a nosotros</Text>
                    <Item floatingLabel style={styles.inputs}>
                        <Label>Nombre<Text style={{color: 'red'}}> *</Text></Label>
                        <Input returnKeyType={'next'} onChangeText={first_name => this.setState({first_name})}/>
                    </Item>
                    <Item floatingLabel style={styles.inputs}>
                        <Label>Apellidos<Text style={{color: 'red'}}> *</Text></Label>
                        <Input returnKeyType={'next'} onChangeText={last_name => this.setState({last_name})}/>
                    </Item>
                    <Item floatingLabel style={styles.inputs}>
                        <Label>Correo electrónico o teléfono<Text style={{color: 'red'}}> *</Text></Label>
                        <Input returnKeyType={'next'} keyboardType={'email-address'}
                               onChangeText={email => this.setState({email})}/>
                    </Item>
                    <Item floatingLabel style={styles.inputs}>
                        <Label>Contraseña<Text style={{color: 'red'}}> *</Text></Label>
                        <Input secureTextEntry returnKeyType={'send'}
                               onChangeText={password => this.setState({password})}/>
                    </Item>
                    <View style={{alignItems: 'center', margin: 10}}>
                        <TouchableOpacity
                            style={styles.createButton} onPress={() => this.createData()}>
                            <Text style={{textAlign: 'center', color: 'white'}}>Registrar</Text>
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
        backgroundColor: constant.primaryColor,
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
