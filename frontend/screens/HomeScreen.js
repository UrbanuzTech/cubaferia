import React, {Component} from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    Text
} from 'react-native-web';
import {Header, Item, Icon, Button} from "native-base";

import ElementsList from "../components/ElementsList";
import constant from "../constants/Colors";
import {FontAwesome5} from "@expo/vector-icons";
import * as Provider from "../misc/Provider";

export default class HomeScreen extends Component {
    categoryList = [];

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            showButton: true
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


    componentDidMount() {
        this.getNomenclatures();
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
                                   onChangeText={() => {
                                   }}/>
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
                                        <TouchableOpacity>
                                            <FontAwesome5 style={{textAlign: 'center'}}
                                                          name={element.logo ? element.logo : "photo"} size={21}
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
                    <ElementsList/>
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
                    }}>
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
});
