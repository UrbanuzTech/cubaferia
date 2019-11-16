import React from 'react';
import Constants from 'expo-constants';
import {FontAwesome} from '@expo/vector-icons';
import * as Provider from '../misc/Provider'
import constant from '../constants/Colors'
import {
    TouchableOpacity,
    Text,
    View,
    ActivityIndicator,
    Platform,
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
            <View style={Platform.OS === "web" ? styles.containerWeb : styles.container}>
                {console.log(this.state.dataSource)}
                {
                    !this.state.isLoading ?
                        this.state.dataSource.map(element => (
                            <TouchableOpacity key={element.id} style={{margin: 20}}>
                                {
                                    element.main_image === null ?
                                        <FontAwesome style={{textAlign: 'center'}} name={"photo"} size={140}
                                                     color={constant.tintColor}/>
                                        :
                                        <Image style={{width: 140}} source={element.main_image}/>
                                }
                                <Text style={{textAlign: 'center', marginTop: 5}}
                                      allowFontScaling={true}>{element.title}</Text>
                            </TouchableOpacity>
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: 400,
    },
    containerWeb: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    listActivityIndicator: {
        flex: 1,
        marginTop: 100
    },
});
