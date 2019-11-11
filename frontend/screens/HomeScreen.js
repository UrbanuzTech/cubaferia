import React, {Component} from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet, Text,
    View,
    TouchableOpacity
} from 'react-native-web';

import ElementsList from "../components/ElementsList";
import constant from "../constants/Colors";
import {FontAwesome} from "@expo/vector-icons";
import * as Provider from "../misc/Provider";
import {ActivityIndicator} from "react-native";

export default class HomeScreen extends Component {
    categoryList = [];

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
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
                {
                    !this.state.isLoading ?
                        <ScrollView style={styles.categoriesFilterMenu} horizontal={true}
                                    keyboardDismissMode={'on-drag'}>
                            {
                                this.categoryList.map((element) => (
                                    <View key={element.id} style={styles.categoriesFilterMenuElements}>
                                        <TouchableOpacity>
                                            <FontAwesome style={{textAlign: 'center'}} name={"photo"} size={21}
                                                         color={constant.tintColor}/>
                                            <Text style={{textAlign: 'center', marginTop: 5}}
                                                  allowFontScaling={true}>{element.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }
                        </ScrollView>
                        :
                        <ActivityIndicator style={styles.listActivityIndicator} color={constant.primaryColor}
                                           size='small'/>
                }
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>
                    <ElementsList/>
                </ScrollView>
            </View>
        );
    }
}

HomeScreen.navigationOptions = {
    title: 'Cubaferia',
    headerStyle: {
        backgroundColor: constant.primaryColor
    },
    headerTintColor: '#fff',
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    categoriesFilterMenu: {
        maxHeight: 90,
        backgroundColor: '#fff',
        overflowX: 'auto',
    },
    categoriesFilterMenuElements: {
        margin: 10,
        width: 80,
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
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
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
