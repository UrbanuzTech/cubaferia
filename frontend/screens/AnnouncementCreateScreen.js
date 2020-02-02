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
    TextInput,
    Switch
} from "react-native-web";
import constant from "../constants/Colors";
import * as Provider from "../misc/Provider";
import {Label, Item, Input, Icon} from "native-base";
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";


export default class AnnouncementCreateScreen extends Component {
    categoryList = [];
    eventCategoryList = [];
    nomenclaturesList = [];

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
                this.nomenclaturesList = data;
                for (const elem of this.nomenclaturesList) {
                    if (elem.active && elem.nomenclature_type === 'announcement_category' && elem.parent === null)
                        this.categoryList.push(elem);
                    else if (elem.active && elem.nomenclature_type === 'event_category')
                        this.eventCategoryList.push(elem);
                }
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
                                                      if (element.name === 'Eventos') {
                                                          this.props.navigation.navigate('AnnouncementSubcategoryCreateScreen', {
                                                              'category': {
                                                                  name: element.name,
                                                                  logo: element.logo,
                                                              },
                                                              'subCategoryList': this.eventCategoryList,
                                                              'nomenclaturesList': this.nomenclaturesList,
                                                              'isEvent': true
                                                          });
                                                      } else {
                                                          let subCategoryList = [];
                                                          for (const elem of this.nomenclaturesList)
                                                              if (elem.parent === element.id)
                                                                  subCategoryList.push(elem);
                                                          if (subCategoryList.length > 0)
                                                              this.props.navigation.navigate('AnnouncementSubcategoryCreateScreen', {
                                                                  'category': {
                                                                      name: element.name,
                                                                      logo: element.logo,
                                                                  },
                                                                  'subCategoryList': subCategoryList,
                                                                  'nomenclaturesList': this.nomenclaturesList,
                                                              });
                                                          else
                                                              this.props.navigation.navigate('AnnouncementFormCreateScreen', {
                                                                  'category': element.name,
                                                                  'nomenclaturesList': this.nomenclaturesList,
                                                              });
                                                      }
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

export class AnnouncementSubcategoryCreateScreen extends Component {
    subCategoryList = [];
    nomenclaturesList = [];

    constructor(props) {
        super(props);
        this.subCategoryList = this.props.navigation.getParam('subCategoryList');
        this.nomenclaturesList = this.props.navigation.getParam('nomenclaturesList');
        this.state = {
            category: this.props.navigation.getParam('category'),
            isEvent: this.props.navigation.getParam('isEvent'),
            subCategoryList: this.subCategoryList,
        };
    };

    filterElements(value) {
        if (value === '')
            this.setState({subCategoryList: this.subCategoryList});
        else {
            let filteredList = [];
            this.subCategoryList.filter((item) => {
                if (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
                    filteredList.push(item);
            });
            this.setState({subCategoryList: filteredList});
        }
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
                        Subcategoría de {this.state.category.name}</Text>
                    <Item style={styles.searchBar}>
                        <TextInput returnKeyType={'search'} style={{width: '100%', marginTop: 2, marginRight: 5}}
                                   placeholder={"Buscar Subcategoría de " + this.state.category.name}
                                   onChangeText={(value) => this.filterElements(value)}/>
                        <Icon name="ios-search"/>
                    </Item>
                </View>
                <View style={styles.categoriesSelect}>
                    {
                        !this.state.isLoading ?
                            this.state.subCategoryList.map(element => (
                                <TouchableOpacity key={element.id} style={{margin: 20, width: 90}}
                                                  onPress={() => {
                                                      let subCategoryList = [];
                                                      for (const elem of this.nomenclaturesList)
                                                          if (elem.parent === element.id)
                                                              subCategoryList.push(elem);
                                                      if (subCategoryList.length > 0)
                                                          this.props.navigation.push('AnnouncementSubcategoryCreateScreen', {
                                                              'category': {
                                                                  name: element.name,
                                                                  logo: element.logo ? element.logo : this.state.category.logo,
                                                              },
                                                              'subCategoryList': subCategoryList,
                                                              'nomenclaturesList': this.nomenclaturesList,
                                                              'isEvent': this.state.isEvent,
                                                          });
                                                      else {
                                                          this.props.navigation.navigate('AnnouncementFormCreateScreen', {
                                                              'category': element.name,
                                                              'nomenclaturesList': this.nomenclaturesList,
                                                              'isEvent': this.state.isEvent,
                                                          });
                                                      }
                                                  }}>

                                    <FontAwesome5 style={{textAlign: 'center'}}
                                                  name={element.logo ? element.logo : this.state.category.logo}
                                                  size={60}
                                                  color={constant.tintColor}/>
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
    isEvent = false;

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
            imageVisibility: [false, false, false],
            price: null,
            category: this.props.navigation.getParam('category'),
            city: '',
            visit_count: 0,
            created_by: 1,
            start_date: '',
            end_date: '',
            allow_children: false,
            price_for_children: null,
            price_for_adults: null,
            errors: [],
            isLoading: true,
        };
        this.isEvent = !!this.props.navigation.getParam('isEvent');
    }

    getNomenclatures() {
        let data = this.props.navigation.getParam('nomenclaturesList');
        this.cityList.push({id: '', name: '- Provincia -'});
        for (const elem of data)
            if (elem.active && elem.nomenclature_type === 'city')
                this.cityList.push(elem);
        this.setState({
            city: this.cityList[0].name,
            isLoading: false,
        })

    }

    componentDidMount() {
        this.getNomenclatures();
    }

    createData() {
        let errors = {};
        if (this.state.city === '- Provincia -')
            errors['province'] = 'Este campo es requerido.';
        if (this.state.title === '')
            errors['title'] = 'Este campo es requerido.';
        let emails = [];
        this.state.emailValues.map((value, index) => {
            if (this.state.emailVisibility[index]) {
                if (value)
                    emails.push(value);
                else
                    errors['email' + index] = 'Este campo es requerido.';
            }
        });
        let phones = [];
        this.state.phoneValues.map((value, index) => {
            if (this.state.phoneVisibility[index]) {
                if (value)
                    phones.push(value);
                else
                    errors['phone' + index] = 'Este campo es requerido.';
            }
        });
        if (errors !== {}) {
            this.setState({'errors': errors});
        } else {
            if (!this.isEvent) {
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
                console.log(newAnnouncement);
                Provider.createValue('announcement', newAnnouncement).then((data) => {
                        if (!data.id)
                            this.setState({'errors': data});
                        else
                            this.props.navigation.navigate('HomeScreen', {'newAnnouncement': data});
                    },
                    (err) => {
                        console.log(err);
                    });
            } else
                console.log(this.state);
        }
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
                        {this.isEvent ? ' Evento' : ' Anuncio'}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                    <Item floatingLabel error={'title' in this.state.errors} style={styles.inputs}>
                        <Label>Título<Text style={{color: 'red'}}> *</Text></Label>
                        <Input onChangeText={title => this.setState({title})}/>
                    </Item>
                    {
                        'title' in this.state.errors ?
                            <Text style={styles.errorsWarnings}>{this.state.errors['title']}</Text>
                            : null
                    }

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
                        <Item floatingLabel error={'phone0' in this.state.errors} style={{
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
                    {
                        'phone0' in this.state.errors ?
                            <Text style={styles.errorsWarnings}>{this.state.errors['phone0']}</Text>
                            : null
                    }

                    <Item floatingLabel error={'phone1' in this.state.errors} style={{
                        paddingTop: 15,
                        marginTop: 20,
                        width: '90%',
                        display: this.state.phoneVisibility[1] ? 'block' : 'none'
                    }}>
                        <Label>Teléfono 2<Text style={{color: 'red'}}> *</Text></Label>
                        <Input keyboardType={"phone-pad"} style={{width: '100%'}}
                               onChangeText={phone => this.setState({'phoneValues': [this.state.phoneValues[0], phone, this.state.phoneValues[2]]})}/>
                    </Item>
                    {
                        'phone1' in this.state.errors ?
                            <Text style={styles.errorsWarnings}>{this.state.errors['phone1']}</Text>
                            : null
                    }

                    <Item floatingLabel error={'phone2' in this.state.errors} style={{
                        paddingTop: 15,
                        marginTop: 20,
                        width: '90%',
                        display: this.state.phoneVisibility[2] ? 'block' : 'none'
                    }}>
                        <Label>Teléfono 3<Text style={{color: 'red'}}> *</Text></Label>
                        <Input keyboardType={"phone-pad"} style={{width: '100%'}}
                               onChangeText={phone => this.setState({'phoneValues': [this.state.phoneValues[0], this.state.phoneValues[1], phone]})}/>
                    </Item>
                    {
                        'phone2' in this.state.errors ?
                            <Text style={styles.errorsWarnings}>{this.state.errors['phone2']}</Text>
                            : null
                    }


                    <View style={{
                        width: '90%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <Item floatingLabel error={'email0' in this.state.errors} style={{
                            flex: 20,
                            paddingTop: 15,
                            marginTop: 20,
                        }}>
                            <Label>Correo electrónico<Text style={{color: 'red'}}> *</Text></Label>
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
                    {
                        'email0' in this.state.errors ?
                            <Text style={styles.errorsWarnings}>{this.state.errors['email0']}</Text>
                            : null
                    }

                    <Item floatingLabel error={'email1' in this.state.errors} style={{
                        paddingTop: 15,
                        marginTop: 20,
                        width: '90%',
                        display: this.state.emailVisibility[1] ? 'block' : 'none'
                    }}>
                        <Label>Correo electrónico 2<Text style={{color: 'red'}}> *</Text></Label>
                        <Input keyboardType={"email-address"} style={{width: '100%'}}
                               onChangeText={email => this.setState({'emailValues': [this.state.emailValues[0], email, this.state.emailValues[2]]})}/>
                    </Item>
                    {
                        'email1' in this.state.errors ?
                            <Text style={styles.errorsWarnings}>{this.state.errors['email1']}</Text>
                            : null
                    }

                    <Item floatingLabel error={'email2' in this.state.errors} style={{
                        paddingTop: 15,
                        marginTop: 20,
                        width: '90%',
                        display: this.state.emailVisibility[2] ? 'block' : 'none'
                    }}>
                        <Label>Correo electrónico 3<Text style={{color: 'red'}}> *</Text></Label>
                        <Input keyboardType={"email-address"} style={{width: '100%'}}
                               onChangeText={email => this.setState({'emailValues': [this.state.emailValues[0], this.state.emailValues[1], email]})}/>
                    </Item>
                    {
                        'email2' in this.state.errors ?
                            <Text style={styles.errorsWarnings}>{this.state.errors['email2']}</Text>
                            : null
                    }

                    <Item floatingLabel style={styles.inputs}>
                        <Label>Nombre de contacto</Label>
                        <Input onChangeText={name => this.setState({name})}/>
                    </Item>

                    <Item floatingLabel style={styles.inputs}>
                        <Label>Dirección</Label>
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
                            <Label>Imagen principal</Label>
                            <Input onChangeText={main_image => this.setState({main_image})}/>
                        </Item>
                        {
                            !this.state.imageVisibility[2] ?
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50}}
                                    onPress={() => {
                                        if (!this.state.imageVisibility[0])
                                            this.setState({'imageVisibility': [true, false, false]});
                                        else if (!this.state.imageVisibility[1])
                                            this.setState({'imageVisibility': [true, true, false]});
                                        else
                                            this.setState({'imageVisibility': [true, true, true]});
                                    }}>
                                    <FontAwesome name={'plus'} size={21} color={'green'}/>
                                </TouchableOpacity>
                                : null
                        }
                        {
                            this.state.imageVisibility[0] ?
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 50,
                                        marginLeft: 10
                                    }}
                                    onPress={() => {
                                        if (this.state.imageVisibility[2]) {
                                            this.setState({'imageVisibility': [true, true, false]});
                                            this.setState({'image3': null});
                                        } else if (this.state.imageVisibility[1]) {
                                            this.setState({'imageVisibility': [true, false, false]});
                                            this.setState({'image2': null});
                                        } else {
                                            this.setState({'imageVisibility': [false, false, false]});
                                            this.setState({'image1': null});
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
                        display: this.state.imageVisibility[0] ? 'block' : 'none'
                    }}>
                        <Label>Imagen 1</Label>
                        <Input style={{width: '100%'}} onChangeText={image1 => this.setState({image1})}/>
                    </Item>

                    <Item floatingLabel style={{
                        paddingTop: 15,
                        marginTop: 20,
                        width: '90%',
                        display: this.state.imageVisibility[1] ? 'block' : 'none'
                    }}>
                        <Label>Imagen 2</Label>
                        <Input style={{width: '100%'}} onChangeText={image2 => this.setState({image2})}/>
                    </Item>

                    <Item floatingLabel style={{
                        paddingTop: 15,
                        marginTop: 20,
                        width: '90%',
                        display: this.state.imageVisibility[2] ? 'block' : 'none'
                    }}>
                        <Label>Imagen 3</Label>
                        <Input style={{width: '100%'}} onChangeText={image3 => this.setState({image3})}/>
                    </Item>

                    {
                        !this.isEvent ?
                            <Item floatingLabel style={styles.inputs}>
                                <Label>Precio en CUC</Label>
                                <Input keyboardType={"numeric"}
                                       onChangeText={price => this.setState({price})}/>
                            </Item>
                            :
                            <View style={{width: '90%', marginTop: 20}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Item floatingLabel style={{
                                        paddingTop: 15,
                                        marginRight: 5,
                                        flex: 1
                                    }}>
                                        <Label>Fecha de inicio <Text style={{color: 'red'}}>*</Text></Label>
                                        <Input keyboardType={"numeric"}
                                               onChangeText={start_date => this.setState({start_date})}/>
                                    </Item>
                                    <Item floatingLabel style={{
                                        paddingTop: 15,
                                        marginLeft: 5,
                                        flex: 1
                                    }}>
                                        <Label>Fecha de fin <Text style={{color: 'red'}}>*</Text></Label>
                                        <Input keyboardType={"numeric"}
                                               onChangeText={end_date => this.setState({end_date})}/>
                                    </Item>
                                </View>
                                <Item floatingLabel style={styles.eventsInputs}>
                                    <Label>Precio para adultos en CUC <Text style={{color: 'red'}}>*</Text></Label>
                                    <Input keyboardType={"numeric"}
                                           onChangeText={price_for_adults => this.setState({price_for_adults})}/>
                                </Item>
                                <View style={{
                                    paddingTop: 15,
                                    marginTop: 20,
                                    width: '100%',
                                    flexDirection: 'row'
                                }}>
                                    <Label style={{color: '#575757'}}>Niños permitidos <Text
                                        style={{color: 'red'}}>*</Text></Label>
                                    <Switch style={{marginLeft: 15, marginTop: 3}} value={this.state.allow_children}
                                            onValueChange={allow_children => this.setState({allow_children})}/>
                                </View>

                                {
                                    this.state.allow_children ?
                                        <Item floatingLabel style={styles.eventsInputs}>
                                            <Label>Precio para niños en CUC <Text
                                                style={{color: 'red'}}>*</Text></Label>
                                            <Input keyboardType={"numeric"}
                                                   onChangeText={price_for_children => this.setState({price_for_children})}/>
                                        </Item> : null
                                }
                            </View>
                    }

                    <Picker style={{
                        marginTop: 40,
                        width: '90%',
                        height: 40,
                        borderRadius: 30,
                        paddingLeft: 10,
                        borderColor: 'province' in this.state.errors ? 'red' : '#a8a8a8'
                    }} selectedValue={this.state.city}
                            onValueChange={city => this.setState({city})}>
                        {this.cityList.map(element => (
                            <Picker.Item key={element.id} value={element.name} label={element.name}/>
                        ))}
                    </Picker>
                    {
                        'province' in this.state.errors ?
                            <Text style={styles.errorsWarnings}>{this.state.errors['province']}</Text>
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
        width: '90%',
    },
    eventsInputs: {
        paddingTop: 15,
        marginTop: 20,
        width: '100%'
    },
    inputsPicker: {
        marginTop: 40,
        width: '90%',
        height: 40,
        borderRadius: 30,
        paddingLeft: 10,
    },
    errorsWarnings: {
        color: 'red',
        marginTop: 5,
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
