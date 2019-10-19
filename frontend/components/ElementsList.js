import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import Constants from 'expo-constants';
import {StyleSheet, Image, Text, View, ActivityIndicator} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {Ionicons} from '@expo/vector-icons';
import * as Provider from '../misc/Provider'
import constant from '../constants/Colors'

export default class ElementsList extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {isLoading: true}
    }

    componentDidMount() {
        Provider.getValueList('announcement').then(
            (data) => {
                this.setState({
                    isLoading: false,
                    dataSource: data,
                }, function () {
                });
            },
            (err) => {
                console.log(err);
            });
    }

    render() {
        const {manifest = {}} = Constants;
        return (
            <View>
                <Text style={styles.optionsTitleText}>Anuncios</Text>
                {console.log(this.state.dataSource)}
                {
                    !this.state.isLoading ?
                        this.state.dataSource.map(element => (
                            <Touchable
                                key={element.id}
                                style={styles.option}
                                background={Touchable.Ripple('#ccc', false)}
                                onPress={this._handlePressDocs}>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={styles.optionIconContainer}>
                                        <Ionicons name="ios-chatboxes" size={22} color="#ccc"/>
                                    </View>
                                    <View style={styles.optionTextContainer}>
                                        <Text style={styles.optionText}>{element.title}</Text>
                                    </View>
                                </View>
                            </Touchable>
                        ))
                        :
                        <ActivityIndicator style={styles.listActivityIndicator} color={constant.primaryColor}
                                           size='large'/>
                }
            </View>
        );
    }

    _handlePressDocs = () => {
        WebBrowser.openBrowserAsync('http://docs.expo.io');
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
    },
    optionsTitleText: {
        fontSize: 16,
        marginLeft: 15,
        marginTop: 9,
        marginBottom: 12,
    },
    optionIconContainer: {
        marginRight: 9,
    },
    option: {
        backgroundColor: '#fdfdfd',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EDEDED',
    },
    optionText: {
        fontSize: 15,
        marginTop: 1,
    },
    listActivityIndicator: {
        flex: 1,
    },
});
