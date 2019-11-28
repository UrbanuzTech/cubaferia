import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Keyboard,
    Picker,
    Text,
    TouchableOpacity,
} from "react-native-web";
import constant from "../constants/Colors";
import * as Provider from "../misc/Provider";
import {Label, Item, Input, Icon} from "native-base";
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
        padding: 30
    },
    inputs: {
        paddingTop: 15,
        marginTop: 20
    },
    inputsPicker: {
        marginBottom: 20
    },
    createButton: {
        marginTop: 20,
        backgroundColor: constant.tintColor,
        padding: 10,
        width: 150,
        borderRadius: 30
    }
});
