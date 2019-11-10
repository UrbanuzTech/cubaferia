import React, {Component} from 'react';
import {
    ScrollView,
    Button,
    TextInput,
    StyleSheet,
    View,
    Keyboard,
    Picker,
} from "react-native-web";
import constant from "../constants/Colors";
import * as Provider from "../misc/Provider";

export default class AnnouncementCreateScreen extends Component {
    categoryList = [];
    cityList = [];

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            phone: '',
            email: '',
            name: '',
            address: '',
            main_image: '',
            image1: '',
            image2: '',
            image3: '',
            price: '',
            category: '',
            city: '',
            visit_count: 0,
            created_by: 1,
            isLoading: true
        };
    }

    getNomenclatures() {
        Provider.getValueList('nomenclature').then(
            (data) => {
                for (const elem of data)
                    if (elem.active && elem.nomenclature_type === 'announcement_category')
                        this.categoryList.push(elem);
                    else if (elem.active && elem.nomenclature_type === 'city')
                        this.cityList.push(elem);
                this.setState({
                    category: this.categoryList[0].id,
                    city: this.cityList[0].id,
                    isLoading: false,
                })
            },
            (err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.getNomenclatures();
    }

    createData = () => {
        Provider.createValue('announcement', this.state).then({},
            (err) => {
                console.log(err);
            });
        Keyboard.dismiss();
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <TextInput style={styles.inputs} placeholder={"Título"}
                           onChangeText={title => this.setState({title})}/>
                <TextInput style={styles.inputs} placeholder={"Descripción"}
                           onChangeText={description => this.setState({description})}/>
                <TextInput style={styles.inputs} keyboardType={"phone-pad"} placeholder={"Teléfono"}
                           onChangeText={phone => this.setState({phone})}/>
                <TextInput style={styles.inputs} keyboardType={"email-address"} placeholder={"Email"}
                           onChangeText={email => this.setState({email})}/>
                <TextInput style={styles.inputs} placeholder={"Nombre de contacto"}
                           onChangeText={name => this.setState({name})}/>
                <TextInput style={styles.inputs} placeholder={"Dirección"}
                           onChangeText={address => this.setState({address})}/>
                <TextInput style={styles.inputs} placeholder={"Imagen principal"}
                           onChangeText={main_image => this.setState({main_image})}/>
                <TextInput style={styles.inputs} placeholder={"Imagen 1"}
                           onChangeText={image1 => this.setState({image1})}/>
                <TextInput style={styles.inputs} placeholder={"Imagen 2"}
                           onChangeText={image2 => this.setState({image2})}/>
                <TextInput style={styles.inputs} placeholder={"Imagen 3"}
                           onChangeText={image3 => this.setState({image3})}/>
                <TextInput style={styles.inputs} keyboardType={"numeric"} placeholder={"Precio"}
                           onChangeText={price => this.setState({price})}/>
                {!this.state.isLoading ?
                    <Picker style={styles.inputs} onValueChange={category => this.setState({category})}>
                        {this.categoryList.map(element => (
                            <Picker.Item key={element.id} value={element.id} label={element.name}/>
                        ))}
                    </Picker>
                    :
                    <Picker style={styles.inputs}>
                        <Picker.Item label=''/>
                    </Picker>
                }
                {!this.state.isLoading ?
                    <Picker style={styles.inputs} onValueChange={city => this.setState({city})}>
                        {this.cityList.map(element => (
                            <Picker.Item key={element.id} value={element.id} label={element.name}/>
                        ))}
                    </Picker>
                    :
                    <Picker style={styles.inputs}>
                        <Picker.Item label=''/>
                    </Picker>
                }
                <View style={{alignItems: 'center', margin: 10}}>
                    <Button style={{backgroundColor: constant.primaryColor}} onPress={this.createData}
                            title={'Crear Anuncio'}/>
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
    }
});
