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
    ActivityIndicator
} from 'react-native-web';
import {Header, Item, Icon, Button} from "native-base";

import constant from "../constants/Colors";
import {FontAwesome5} from "@expo/vector-icons";
import * as Provider from "../misc/Provider";
import Touchable from 'react-native-platform-touchable';


export default class HomeScreen extends Component {
    categoryList = [];
    announcementsList = [];

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            showButton: true,
            dataSource: [],
            announcementsList: []
        };
    }

    getNomenclatures() {
        Provider.getValueList('nomenclature').then(
            (data) => {
                for (const elem of data)
                    if (elem.active && elem.nomenclature_type === 'announcement_category')
                        this.categoryList.push(elem);
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
            this.setState({dataSource: this.announcementsList});
        else {
            let filteredList = [];
            this.announcementsList.filter((item) => {
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

    render() {
        return (

            <View style={styles.container}>
                <Header searchBar style={styles.header}>
                    <Icon style={styles.drawerButton}
                          name="menu"
                          onPress={() => this.props.navigation.openDrawer()}/>
                    <Item style={styles.searchBar}>
                        <TextInput returnKeyType={'search'} style={{width: '100%', marginTop: 2}}
                                   placeholder={"Buscar producto en Cubaferia"}
                                   onChangeText={(value) => this.filterElements(value)}/>
                        <Icon name="ios-search"/>
                    </Item>
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
                {
                    !this.state.isLoading ?
                        <ScrollView style={styles.categoriesFilterMenu} horizontal={true}
                                    keyboardDismissMode={'on-drag'}>
                            {
                                this.categoryList.map((element) => (
                                    <View key={element.id} style={styles.categoriesFilterMenuElements}>
                                        <TouchableOpacity onPress={() => {
                                            let filteredList = [];
                                            for (const elem of this.announcementsList)
                                                if (elem.category === element.name)
                                                    filteredList.push(elem);
                                            this.setState({dataSource: filteredList});
                                        }}>
                                            <FontAwesome5 style={{textAlign: 'center'}}
                                                          name={element.logo ? element.logo : "image"} size={21}
                                                          color={constant.tintColor}/>
                                            <Text center style={{textAlign: 'center ', marginTop: 5}}
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
                                        key={element.id}
                                        style={styles.option}
                                        background={Touchable.Ripple('#ccc', false)}
                                        onPress={() => {
                                        }}>
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
                                            <View style={{marginLeft: 20, justifyContent: 'center'}}>
                                                <Text style={styles.optionTitle}>{element.title}</Text>
                                                <Text style={styles.optionDescription}>{element.description}</Text>
                                                <Text style={styles.optionPrice}>$ {element.price}</Text>
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
                        marginBottom: 20
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
        boxShadow: '0px 0px 2px 0px #000'
    },
    drawerButton: {
        marginTop: 17,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
    },
    searchBar: {
        borderRadius: 5,
        paddingLeft: 20,
        paddingRight: 10,
        marginLeft: 15,
        flex: 5,
        flexDirection: 'row',
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
    optionIconContainer: {
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
