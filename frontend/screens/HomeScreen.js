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
                        </ScrollView> : null
                }
                <ScrollView
                    style={styles.container}>
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
