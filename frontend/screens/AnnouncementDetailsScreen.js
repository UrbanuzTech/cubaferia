import React, {Component} from "react";
import {StyleSheet, Text, View, ScrollView, Image, TouchableOpacity} from "react-native-web";
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";
import constant from "../constants/Colors";


export default class AnnouncementDetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            element: this.props.navigation.getParam('announcement'),
        }
    };

    render() {
        return (
            <ScrollView>
                <TouchableOpacity style={{margin: 10}}
                                  onPress={() => this.props.navigation.goBack()}>
                    <FontAwesome name={'arrow-left'} size={21} color={'gray'}/>
                </TouchableOpacity>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <ScrollView horizontal={true} style={styles.imageSlider}>
                        {
                            !this.state.element.main_image ?
                                <View style={{
                                    width: screen.width,
                                    height: 0.5 * screen.height,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <FontAwesome5 name="image" size={200}
                                                  color={constant.tintColor}/>
                                </View>
                                :
                                <Image style={styles.image} source={{uri: this.state.element.main_image}}/>
                        }
                        {
                            this.state.element.image1 ?
                                <Image style={styles.image}
                                       source={{uri: this.state.element.image1}}/>
                                : null
                        }
                        {
                            this.state.element.image2 ?
                                <Image style={styles.image}
                                       source={{uri: this.state.element.image2}}/>
                                : null
                        }
                        {
                            this.state.element.image3 ?
                                <Image style={styles.image}
                                       source={{uri: this.state.element.image3}}/>
                                : null
                        }
                    </ScrollView>
                    <View style={{marginTop: 15, alignItems: 'center'}}>
                        <Text style={{color: 'black', fontSize: 25}}>{this.state.element.title}</Text>
                        {
                            this.state.element.description ?
                                <Text style={{color: 'gray', marginTop: 10}}>{this.state.element.description}</Text>
                                : null
                        }
                        <Text style={{color: 'black', marginTop: 10}}>{this.state.element.price} CUC</Text>
                        {
                            this.state.element.contact_name ?
                                <Text style={{
                                    color: 'black',
                                    marginTop: 10
                                }}><b>Contacto:</b> {this.state.element.contact_name}</Text>
                                : null
                        }
                        <Text style={{color: 'black', marginTop: 10}}><b>Teléfonos:</b></Text>
                        <Text style={{color: 'black', marginTop: 10}}>{this.state.element.phones.map(value => (
                            <div key={'phone-' + value}>
                                {value}
                                <br/>
                            </div>
                        ))}
                        </Text>
                        <Text style={{color: 'black', marginTop: 10}}><b>Correos electrónicos:</b></Text>
                        <Text style={{color: 'black', marginTop: 10}}>{this.state.element.emails.map(value => (
                            <div key={'email-' + value}>
                                {value}
                                <br/>
                            </div>
                        ))}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    imageSlider: {
        maxHeight: 0.5 * screen.height,
        backgroundColor: '#fff',
        overflowX: 'auto',
        flexDirection: 'row',
        width: '100%'
    },
    image: {
        width: screen.width * 0.96,
        height: 0.5 * screen.height,
        margin: 10
    }

});


