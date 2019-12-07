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
import {Label, Item, Input, Icon, Toast, Textarea, Form} from "native-base";
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
                                                      this.props.navigation.navigate('AnnouncementFormCreateScreen', {
                                                          'category': element.name
                                                      })
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
    cityList = [];

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            phoneValues: ['', '', ''],
            phoneVisibility: [true, false, false],
            emailValues: ['', '', ''],
            emailVisibility: [true, false, false],
            name: '',
            address: '',
            main_image: null,
            image1: null,
            image2: null,
            image3: null,
            price: '',
            category: this.props.navigation.getParam('category'),
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
                    if (elem.active && elem.nomenclature_type === 'city')
                        this.cityList.push(elem);
                this.setState({
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
        let emails = [];
        this.state.emailValues.map((value) => {
            if (value)
                emails.push(value);
        });
        let phones = [];
        this.state.phoneValues.map((value) => {
            if (value)
                phones.push(value);
        });
        let newAnnouncement = {
            title: this.state.title,
            description: this.state.description,
            phones: phones,
            emails: emails,
            contact_name: this.state.name,
            address: this.state.address,
            main_image: this.state.main_image,
            image1: this.state.image1,
            image2: this.state.image2,
            image3: this.state.image3,
            price: this.state.price,
            category: this.state.category,
            city: this.state.city,
            visit_count: this.state.visit_count,
            created_by: this.state.created_by,
        };
        Provider.createValue('announcement', newAnnouncement).then((data) => {
                console.log(data);
                this.props.navigation.navigate('HomeScreen', {'newAnnouncement': data});
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
                    <TouchableOpacity style={{marginLeft: 10}}
                                      onPress={() => this.props.navigation.goBack()}>
                        <FontAwesome name={'arrow-left'} size={21} color={'gray'}/>
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 24, textAlign: 'center', color: 'black', marginTop: 20}}>Creando
                        anuncio</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                    <Item floatingLabel style={styles.inputs}>
                        <Label>Título<Text style={{color: 'red'}}> *</Text></Label>
                        <Input onChangeText={title => this.setState({title})}/>
                    </Item>

                    <Item floatingLabel style={styles.inputs}>
                        <Label>Descripción</Label>
                        <Input multiline={true} style={{height: 150}} rowSpan={5}
                               onChangeText={description => this.setState({description})}/>
                    </Item>

                    <View style={{
                        width: '90%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <Item floatingLabel style={{
                            flex: 20,
                            paddingTop: 15,
                            marginTop: 20,
                        }}>
                            <Label>Teléfono<Text style={{color: 'red'}}> *</Text></Label>
                            <Input keyboardType={"phone-pad"}
                                   onChangeText={phone => this.setState({'phoneValues': [phone, this.state.phoneValues[1], this.state.phoneValues[2]]})}/>
                        </Item>
                        {
                            !this.state.phoneVisibility[2] ?
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50}}
                                    onPress={() => {
                                        if (!this.state.phoneVisibility[1])
                                            this.setState({'phoneVisibility': [true, true, false]});
                                        else
                                            this.setState({'phoneVisibility': [true, true, true]});
                                    }}>
                                    <FontAwesome name={'plus'} size={21} color={'green'}/>
                                </TouchableOpacity>
                                : null
                        }
                        {
                            this.state.phoneVisibility[1] ?
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 50,
                                        marginLeft: 10
                                    }}
                                    onPress={() => {
                                        if (this.state.phoneVisibility[2]) {
                                            this.setState({'phoneVisibility': [true, true, false]});
                                            this.setState({'phoneValues': [this.state.phoneValues[0], this.state.phoneValues[1], '']});
                                        } else {
                                            this.setState({'phoneVisibility': [true, false, false]});
                                            this.setState({'phoneValues': [this.state.phoneValues[0], '', '']});
                                        }
                                    }}>
                                    <FontAwesome name={'minus'} size={21} color={'red'}/>
                                </TouchableOpacity>
                                : null
                        }
                    </View>

                    <Item floatingLabel style={{
                        paddingTop: 15,
                        marginTop: 20,
                        width: '90%',
                        display: this.state.phoneVisibility[1] ? 'block' : 'none'
                    }}>
                        <Label>Teléfono 2</Label>
                        <Input keyboardType={"phone-pad"} style={{width: '100%'}}
                               onChangeText={phone => this.setState({'phoneValues': [this.state.phoneValues[0], phone, this.state.phoneValues[2]]})}/>
                    </Item>

                    <Item floatingLabel style={{
                        paddingTop: 15,
                        marginTop: 20,
                        width: '90%',
                        display: this.state.phoneVisibility[2] ? 'block' : 'none'
                    }}>
                        <Label>Teléfono 3</Label>
                        <Input keyboardType={"phone-pad"} style={{width: '100%'}}
                               onChangeText={phone => this.setState({'phoneValues': [this.state.phoneValues[0], this.state.phoneValues[1], phone]})}/>
                    </Item>

                    <View style={{
                        width: '90%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <Item floatingLabel style={{
                            flex: 20,
                            paddingTop: 15,
                            marginTop: 20,
                        }}>
                            <Label>Correo Electrónico<Text style={{color: 'red'}}> *</Text></Label>
                            <Input keyboardType={"email-address"}
                                   onChangeText={email => this.setState({'emailValues': [email, this.state.emailValues[1], this.state.emailValues[2]]})}/>
                        </Item>
                        {
                            !this.state.emailVisibility[2] ?
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50}}
                                    onPress={() => {
                                        if (!this.state.emailVisibility[1])
                                            this.setState({'emailVisibility': [true, true, false]});
                                        else
                                            this.setState({'emailVisibility': [true, true, true]});
                                    }}>
                                    <FontAwesome name={'plus'} size={21} color={'green'}/>
                                </TouchableOpacity>
                                : null
                        }
                        {
                            this.state.emailVisibility[1] ?
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 50,
                                        marginLeft: 10
                                    }}
                                    onPress={() => {
                                        if (this.state.emailVisibility[2]) {
                                            this.setState({'emailVisibility': [true, true, false]});
                                            this.setState({'emailValues': [this.state.emailValues[0], this.state.emailValues[1], '']});
                                        } else {
                                            this.setState({'emailVisibility': [true, false, false]});
                                            this.setState({'emailValues': [this.state.emailValues[0], '', '']});
                                        }
                                    }}>
                                    <FontAwesome name={'minus'} size={21} color={'red'}/>
                                </TouchableOpacity>
                                : null
                        }
                    </View>

                    <Item floatingLabel style={{
                        paddingTop: 15,
                        marginTop: 20,
                        width: '90%',
                        display: this.state.emailVisibility[1] ? 'block' : 'none'
                    }}>
                        <Label>Correo electrónico 2</Label>
                        <Input keyboardType={"email-address"} style={{width: '100%'}}
                               onChangeText={email => this.setState({'emailValues': [this.state.emailValues[0], email, this.state.emailValues[2]]})}/>
                    </Item>

                    <Item floatingLabel style={{
                        paddingTop: 15,
                        marginTop: 20,
                        width: '90%',
                        display: this.state.emailVisibility[2] ? 'block' : 'none'
                    }}>
                        <Label>Correo electrónico 3</Label>
                        <Input keyboardType={"email-address"} style={{width: '100%'}}
                               onChangeText={email => this.setState({'emailValues': [this.state.emailValues[0], this.state.emailValues[1], email]})}/>
                    </Item>

                    <Item floatingLabel style={styles.inputs}>
                        <Label>Nombre de contacto</Label>
                        <Input onChangeText={name => this.setState({name})}/>
                    </Item>

                    <Item floatingLabel style={styles.inputs}>
                        <Label>Dirección</Label>
                        <Input multiline={true} style={{height: 150}} rowSpan={5}
                               onChangeText={description => this.setState({description})}/>
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
                        <Label>Precio en CUC<Text style={{color: 'red'}}> *</Text></Label>
                        <Input keyboardType={"numeric"}
                               onChangeText={price => this.setState({price})}/>
                    </Item>

                    {!this.state.isLoading ?
                        <Picker style={styles.inputsPicker} onValueChange={city => this.setState({city})}>
                            <Picker.Item key={0} value={0} label={'- Provincia -'}/>
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
    },
    inputs: {
        paddingTop: 15,
        marginTop: 20,
        width: '90%'
    },
    inputsPicker: {
        marginTop: 40,
        width: '90%',
        height: 40,
        borderRadius: 30,
        paddingLeft: 10,
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
        marginTop: 10
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
