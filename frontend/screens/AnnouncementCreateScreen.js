import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Keyboard,
    Picker,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    TextInput
} from "react-native-web";
import constant from "../constants/Colors";
import * as Provider from "../misc/Provider";
import {Label, Item, Input, Icon} from "native-base";
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";


export default class AnnouncementCreateScreen extends Component {
    categoryList = [];

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            categoryList: []
        };
    };

    getNomenclatures() {
        Provider.getValueList('nomenclature').then(
            (data) => {
                for (const elem of data)
                    if (elem.active && elem.nomenclature_type === 'announcement_category')
                        this.categoryList.push(elem);
                this.setState({categoryList: this.categoryList});
                this.setState({isLoading: false});
            },
            (err) => {
                console.log(err);
            });
    }

    filterElements(value) {
        if (value === '')
            this.setState({categoryList: this.categoryList});
        else {
            let filteredList = [];
            this.categoryList.filter((item) => {
                if (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
                    filteredList.push(item);
            });
            this.setState({categoryList: filteredList});
        }
    }

    componentDidMount() {
        this.getNomenclatures();
    }

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <View>
                    <TouchableOpacity style={{margin: 10}}
                                      onPress={() => this.props.navigation.goBack()}>
                        <FontAwesome name={'arrow-left'} size={21} color={'gray'}/>
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 24, textAlign: 'center', color: 'black', margin: 20}}>Seleccione la
                        Categoría</Text>
                    <Item style={styles.searchBar}>
                        <TextInput returnKeyType={'search'} style={{width: '100%', marginTop: 2, marginRight: 5}}
                                   placeholder={"Buscar Categoría"}
                                   onChangeText={(value) => this.filterElements(value)}/>
                        <Icon name="ios-search"/>
                    </Item>
                </View>
                <View style={styles.categoriesSelect}>
                    {
                        !this.state.isLoading ?
                            this.state.categoryList.map(element => (
                                <TouchableOpacity key={element.id} style={{margin: 20, width: 90}}
                                                  onPress={() => {
                                                  }}>
                                    {
                                        <FontAwesome5 style={{textAlign: 'center'}} name={element.logo} size={60}
                                                      color={constant.tintColor}/>
                                    }
                                    <Text style={{textAlign: 'center', marginTop: 5}}
                                          allowFontScaling={true}>{element.name}</Text>
                                </TouchableOpacity>
                            ))
                            :
                            <ActivityIndicator style={styles.listActivityIndicator} color={constant.primaryColor}
                                               size='large'/>
                    }
                </View>
            </ScrollView>

        );
    }
}


export class AnnouncementFormCreateScreen extends Component {
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
            category: this.props,
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
                <View>
                    <TouchableOpacity style={{margin: 10}}
                                      onPress={() => this.props.navigation.goBack()}>
                        <FontAwesome name={'arrow-left'} size={21} color={'gray'}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
                        <Picker style={styles.inputsPicker} onValueChange={city => this.setState({city})}>
                            {this.cityList.map(element => (
                                <Picker.Item key={element.id} value={element.name} label={element.name}/>
                            ))}
                        </Picker>
                        : null
                    }
                </View>
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
        // padding: 30
    },
    inputs: {
        paddingTop: 15,
        marginTop: 20,
        width: '90%'
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
    },
    categoriesSelect: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    listActivityIndicator: {
        flex: 1,
        marginTop: 100
    },
    searchBar: {
        width: '80%',
        borderRadius: 30,
        paddingLeft: 20,
        paddingRight: 10,
    },
});
