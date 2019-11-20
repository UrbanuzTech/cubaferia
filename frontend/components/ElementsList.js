import React from 'react';
import Constants from 'expo-constants';
import {FontAwesome} from '@expo/vector-icons';
import * as Provider from '../misc/Provider'
import constant from '../constants/Colors'
import Touchable from 'react-native-platform-touchable';

import {
    Text,
    View,
    ActivityIndicator,
    StyleSheet,
    Image
} from "react-native-web";

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
            <View style={styles.container}>
                {console.log(this.state.dataSource)}
                {
                    !this.state.isLoading ?
                        this.state.dataSource.results.map(element => (
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
                                                <FontAwesome name="photo" size={40} color={constant.tintColor}/>
                                                :
                                                <Image style={{width: 40}} source={element.main_image}/>
                                        }
                                    </View>
                                    <View style={{marginLeft: 20}}>
                                        <Text style={styles.optionText}>{element.title}</Text>
                                        <Text style={styles.optionSubText}>$ {element.price}</Text>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
    },
    listActivityIndicator: {
        flex: 1,
        marginTop: 100
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
    optionSubText: {
        fontSize: 15,
        marginTop: 1,
        color: '#a8a8a8',
    },
    optionIconContainer: {
        marginRight: 9,
    },
    optionsTitleText: {
        fontSize: 16,
        marginLeft: 15,
        marginTop: 9,
        marginBottom: 12,
    },
});
