import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Keyboard,
    Picker,
    Text,
    TouchableOpacity,
} from "react-native-web";
import constant from "../constants/Colors";
import * as Provider from "../misc/Provider";
import {Label, Item, Input} from "native-base";


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
                    category: this.categoryList[0].name,
                    city: this.cityList[0].name,
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
        Provider.createValue('announcement', this.state).then(() => {
            },
            (err) => {
                console.log(err);
            });
        Keyboard.dismiss();
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Título</Label>
                    <Input onChangeText={title => this.setState({title})}/>
                </Item>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Descripción</Label>
                    <Input onChangeText={description => this.setState({description})}/>
                </Item>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Teléfono</Label>
                    <Input keyboardType={"phone-pad"}
                           onChangeText={phone => this.setState({phone})}/>
                </Item>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Email</Label>
                    <Input keyboardType={"email-address"}
                           onChangeText={email => this.setState({email})}/>
                </Item>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Nombre de contacto</Label>
                    <Input onChangeText={name => this.setState({name})}/>
                </Item>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Dirección</Label>
                    <Input onChangeText={address => this.setState({address})}/>
                </Item>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Imagen principal</Label>
                    <Input onChangeText={main_image => this.setState({main_image})}/>
                </Item>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Imagen 1</Label>
                    <Input onChangeText={image1 => this.setState({image1})}/>
                </Item>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Imagen 2</Label>
                    <Input onChangeText={image2 => this.setState({image2})}/>
                </Item>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Imagen 3</Label>
                    <Input onChangeText={image3 => this.setState({image3})}/>
                </Item>
                <Item floatingLabel style={styles.inputs}>
                    <Label>Precio</Label>
                    <Input keyboardType={"numeric"}
                           onChangeText={price => this.setState({price})}/>
                </Item>

                {!this.state.isLoading ?
                    <Picker style={styles.inputsPicker} onValueChange={category => this.setState({category})}>
                        {this.categoryList.map(element => (
                            <Picker.Item key={element.id} value={element.name} label={element.name}/>
                        ))}
                    </Picker>
                    : null
                }
                {!this.state.isLoading ?
                    <Picker style={styles.inputsPicker} onValueChange={city => this.setState({city})}>
                        {this.cityList.map(element => (
                            <Picker.Item key={element.id} value={element.name} label={element.name}/>
                        ))}
                    </Picker>
                    : null
                }
                <View style={{alignItems: 'center', margin: 10}}>
                    <TouchableOpacity
                        style={styles.createButton} onPress={() => this.createData()}>
                        <Text style={{textAlign: 'center', color: 'white'}}>Crear</Text>
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
        padding: 30
    },
    inputs: {
        paddingTop: 15,
        marginTop: 20
    },
    inputsPicker: {
        marginBottom: 20
    },
    createButton: {
        marginTop: 20,
        backgroundColor: constant.tintColor,
        padding: 10,
        width: 150,
        borderRadius: 30
    }
});
