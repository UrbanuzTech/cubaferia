import React, {Component} from 'react';
import {
    ScrollView,
    TextInput,
    StyleSheet,
    View,
    Keyboard,
    Picker,
    Text,
    TouchableOpacity,
} from "react-native-web";
import constant from "../constants/Colors";
import * as Provider from "../misc/Provider";

export default class AnnouncementCreateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            username: '',
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
            <ScrollView style={styles.container}>
                <TextInput style={styles.inputs} placeholder={"Nombre"}
                           onChangeText={first_name => this.setState({first_name})}/>
                <TextInput style={styles.inputs} placeholder={"Apellidos"}
                           onChangeText={last_name => this.setState({last_name})}/>
                <TextInput style={styles.inputs} placeholder={"Nombre de usuario"}
                           onChangeText={username => this.setState({username})}/>
                <TextInput style={styles.inputs} placeholder={"Correo electronico"}
                           onChangeText={email => this.setState({email})}/>
                <TextInput style={styles.inputs} placeholder={"Contrasenna"}
                           onChangeText={password => this.setState({password})}/>
                <View style={{alignItems: 'center', margin: 10}}>
                    <TouchableOpacity
                        style={styles.createButton} onPress={() => this.createData()}>
                        <Text style={{textAlign: 'center', color: 'white'}}>Registrar</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
    inputs: {
        margin: 20,
        width: '90%',
        borderWidth: 0,
        paddingLeft: 10,
    },
    createButton: {
        marginTop: 20,
        backgroundColor: constant.tintColor,
        padding: 10,
        width: 150,
        borderRadius: 30
    }
});
