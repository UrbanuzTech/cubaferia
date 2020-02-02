import React, {Component} from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    Text,
    Image,
    ActivityIndicator,
    Picker
} from 'react-native-web';
import {Header, Item, Icon, Button} from "native-base";

import constant from "../constants/Colors";
import {FontAwesome5} from "@expo/vector-icons";
import * as Provider from "../misc/Provider";
import Touchable from 'react-native-platform-touchable';


export default class HomeScreen extends Component {
    categoryList = [];
    announcementsList = []; /* Store announcements and change when city is selected  */
    savedAnnouncementsList = []; /* Store announcements retrieved and dont change */
    filteredSavedAnnouncementsList = []; /* Store announcements and change when exist a search criteria  */
    eventCategoriesList = [];
    citiesList = [];
    selectedCity = '';

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            showButton: true,
            dataSource: [],
            selectedFilter: ''
        };
    }

    getNomenclatures() {
        Provider.getValueList('nomenclature').then(
            (data) => {
                for (const elem of data)
                    if (elem.active && elem.nomenclature_type === 'announcement_category' && elem.parent === null)
                        this.categoryList.push(elem);
                    else if (elem.active && elem.nomenclature_type === 'event_category')
                        this.eventCategoriesList.push(elem.name);
                    else if (elem.active && elem.nomenclature_type === 'city')
                        this.citiesList.push(elem);
                this.setState({isLoading: false})
            },
            (err) => {
                console.log(err);
            });
    }

    getAnnouncements() {
        Provider.getValueList('announcement').then(
            (announcements) => {
                Provider.getValueList('event').then(
                    (events) => {
                        this.announcementsList = announcements.concat(events);
                        this.setState({
                            dataSource: this.announcementsList,
                        });
                        this.savedAnnouncementsList = this.announcementsList;
                        this.filteredSavedAnnouncementsList = this.announcementsList;
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            },
            (err) => {
                console.log(err);
            });
    }

    filterElements(value) {
        if (value === '')
            this.setState({dataSource: this.filteredSavedAnnouncementsList});
        else {
            let filteredList = [];
            this.filteredSavedAnnouncementsList.filter((item) => {
                if (item.title.toLowerCase().indexOf(value.toLowerCase()) > -1)
                    filteredList.push(item);
            });
            this.setState({dataSource: filteredList});
        }
    }

    componentDidMount() {
        this.getNomenclatures();
        this.getAnnouncements();
    }

    componentWillReceiveProps(nextProps) {
        this.getAnnouncements();
    }

    render() {
        return (
            <View style={styles.container}>
                <Header searchBar style={styles.header}>
                    <Icon style={styles.drawerButton}
                          name="menu"
                          onPress={() => this.props.navigation.openDrawer()}/>
                    <Picker style={styles.citiesFilterMenu} onValueChange={city => {
                        if (city === '') {
                            this.announcementsList = this.savedAnnouncementsList;
                            this.setState({'dataSource': this.savedAnnouncementsList});
                        } else {
                            let announcementsList = [];
                            for (const elem of this.savedAnnouncementsList)
                                if (elem.city === city)
                                    announcementsList.push(elem);
                            this.filteredSavedAnnouncementsList = announcementsList;
                            this.announcementsList = announcementsList;
                            this.setState({dataSource: this.announcementsList});
                        }
                        this.selectedCity = city;
                        this.setState({'selectedFilter': ''});
                    }}>
                        <Picker.Item key={''} value={''} label={'Seleccione la provincia'}/>
                        {this.citiesList.map(element => (
                            <Picker.Item key={element.id} value={element.name} label={element.name}/>
                        ))}
                    </Picker>
                    <Button style={{
                        flex: 1,
                        justifyContent: 'center',
                        marginLeft: 10,
                        height: 40,
                        backgroundColor: 'white',
                        boxShadow: '0px 1px 5px 0px #000',
                        borderRadius: 5
                    }}>
                        <Text style={{fontSize: 15, color: '#1c1c1c'}}>Filtrar</Text>
                    </Button>
                </Header>
                <View style={styles.subHeader}>
                    <Item style={styles.searchBar}>
                        <TextInput returnKeyType={'search'} style={{width: '100%', marginTop: 2, marginRight: 10}}
                                   placeholder={'Buscar producto en ' + (this.selectedCity !== '' ? this.selectedCity : 'Cubaferia')}
                                   onChangeText={(value) => this.filterElements(value)}/>
                        <Icon name="ios-search"/>
                    </Item>
                </View>
                {
                    !this.state.isLoading ?
                        <ScrollView style={styles.categoriesFilterMenu} horizontal={true}
                                    keyboardDismissMode={'on-drag'}>
                            <View style={styles.categoriesFilterMenuElements}>
                                <TouchableOpacity onPress={() => {
                                    this.filteredSavedAnnouncementsList = this.announcementsList;
                                    this.setState({dataSource: this.announcementsList});
                                    this.setState({selectedFilter: ''})
                                }}>
                                    <FontAwesome5 style={{textAlign: 'center'}}
                                                  name={"list"} size={21}
                                                  color={!this.state.selectedFilter ?
                                                      constant.filterIconSelected : constant.filterIconDefault}/>
                                    <Text style={{
                                        textAlign: 'center',
                                        marginTop: 5,
                                        color: !this.state.selectedFilter ? constant.filterIconSelected : 'black',
                                        fontWeight: !this.state.selectedFilter ? 'bold' : 'normal'
                                    }}
                                          allowFontScaling={true}>Todos</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.categoryList.map((element) => (
                                    <View key={element.name + '-' + element.id}
                                          style={styles.categoriesFilterMenuElements}>
                                        <TouchableOpacity onPress={() => {
                                            let filteredList = [];
                                            for (const elem of this.announcementsList) {
                                                if (element.name === 'Eventos')
                                                    for (const event of this.eventCategoriesList) {
                                                        if (elem.category === event)
                                                            filteredList.push(elem);
                                                    }
                                                else if (elem.category === element.name)
                                                    filteredList.push(elem);
                                            }
                                            this.filteredSavedAnnouncementsList = filteredList;
                                            this.setState({dataSource: filteredList});
                                            this.setState({selectedFilter: element.id});
                                        }}>
                                            <FontAwesome5 style={{textAlign: 'center'}}
                                                          name={element.logo ? element.logo : "image"} size={21}
                                                          color={this.state.selectedFilter === element.id ?
                                                              constant.filterIconSelected : constant.filterIconDefault}/>
                                            <Text center style={{
                                                textAlign: 'center',
                                                marginTop: 5,
                                                color: this.state.selectedFilter === element.id ? constant.filterIconSelected : 'black',
                                                fontWeight: this.state.selectedFilter === element.id ? 'bold' : 'normal'
                                            }}
                                                  allowFontScaling={true}>{element.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }
                        </ScrollView> : null
                }
                <ScrollView
                    style={styles.container} scrollEventThrottle={16} onTouchMove={() => {
                    this.setState({showButton: false});
                }} onTouchEnd={() => {
                    this.setState({showButton: true})
                }}>
                    <View style={{flex: 1, marginLeft: 10}}>
                        {console.log(this.state.dataSource)}
                        {
                            !this.state.isLoading ?
                                this.state.dataSource.map(element => (
                                    <Touchable
                                        key={element.title + '-' + element.id}
                                        style={styles.option}
                                        background={Touchable.Ripple('#ccc', false)}
                                        onPress={() => this.props.navigation.navigate('AnnouncementDetailsScreen', {'announcement': element})}>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={styles.optionIconContainer}>
                                                {
                                                    !element.main_image ?
                                                        <FontAwesome5 name="image" size={60}
                                                                      color={constant.tintColor}/>
                                                        :
                                                        <Image style={{width: 60, height: 60}}
                                                               source={{uri: element.main_image}}/>
                                                }
                                            </View>
                                            <View
                                                style={{flex: 8, marginLeft: 20, justifyContent: 'center'}}>
                                                <Text style={styles.optionTitle}>{element.title}</Text>
                                                <Text style={styles.optionDescription}>{element.description}</Text>
                                                {
                                                    element.price ?
                                                        <Text style={styles.optionPrice}>$ {element.price}</Text>
                                                        : null
                                                }
                                                <View style={styles.optionCity}>
                                                    <FontAwesome5 name="map-marker-alt" size={15}
                                                                  color={constant.tintColor}/>
                                                    <Text
                                                        style={styles.optionPrice}> {(element.address ? element.address + ', ' : '') + element.city}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </Touchable>
                                ))
                                :
                                <ActivityIndicator style={styles.listActivityIndicator} color={constant.primaryColor}
                                                   size='large'/>
                        }
                    </View>
                </ScrollView>
                <View style={{alignItems: 'center', backgroundColor: 'transparent'}}>
                    <TouchableOpacity style={{
                        visibility: this.state.showButton ? 'visible' : 'hidden',
                        backgroundColor: constant.tintColor,
                        padding: 10,
                        width: 230,
                        borderRadius: 30,
                        boxShadow: '0px 2px 10px 0px #000',
                        marginBottom: 20,
                    }} onPress={() => this.props.navigation.navigate('AnnouncementCreateScreen')}>
                        <Text style={{textAlign: 'center', color: 'white'}}
                              allowFontScaling={true}>Insertar Anuncio</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

HomeScreen.navigationOptions = {
    header: null
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: constant.primaryColor,
        height: 64,
        boxShadow: '0px 0px 2px 0px #000',
        alignItems: 'center'
    },
    drawerButton: {
        marginLeft: 5,
        color: 'white'
    },
    citiesFilterMenu: {
        height: 40,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 15,
        flex: 5,
    },
    subHeader: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        padding: 10,
    },
    searchBar: {
        borderRadius: 30,
        height: 40,
        paddingLeft: 20,
        paddingRight: 10,
        flexDirection: 'row',
        flex: 5
    },
    categoriesFilterMenu: {
        marginTop: 5,
        maxHeight: 90,
        backgroundColor: '#fff',
        overflowX: 'auto',
    },
    categoriesFilterMenuElements: {
        margin: 10,
        width: 80,
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {width: 0, height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    option: {
        backgroundColor: '#fdfdfd',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EDEDED',
    },
    optionTitle: {
        fontSize: 15,
        marginTop: 1,
    },
    optionDescription: {
        fontSize: 11,
        marginTop: 1,
    },
    optionPrice: {
        fontSize: 15,
        marginTop: 1,
        color: '#a8a8a8',
    },
    optionCity: {
        marginTop: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionIconContainer: {
        flex: 1,
        marginRight: 9,
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionsTitleText: {
        fontSize: 16,
        marginLeft: 15,
        marginTop: 9,
        marginBottom: 12,
    },
    listActivityIndicator: {
        flex: 1,
        marginTop: 100
    },
});
