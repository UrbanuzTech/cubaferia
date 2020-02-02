import React, {Component} from "react";
import {StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Linking} from "react-native-web";
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";
import constant from "../constants/Colors";


export default class AnnouncementDetailsScreen extends Component {
    date = '';

    constructor(props) {
        super(props);
        this.state = {
            element: this.props.navigation.getParam('announcement'),
        };
        let str = new Date(this.state.element.created_at);
        let h, meridian;
        if (str.getHours() > 12) {
            h = str.getHours() - 12;
            meridian = 'PM';
        } else {
            h = str.getHours();
            meridian = 'AM'
        }
        let m = str.getMinutes() < 10 ? 0 + str.getMinutes().toString() : str.getMinutes();
        this.date = str.getDate() + '-' + (str.getMonth() + 1) + '-' + str.getFullYear() + ' ' + h + ':' + m + ' ' + meridian;
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
                    <View style={{marginTop: 15, margin: 10, width: '90%'}}>
                        <Text style={{color: 'black', fontSize: 25}}>{this.state.element.title}</Text>
                        {
                            this.state.element.price ?
                                <View style={styles.detailsIcon}>
                                    <FontAwesome5 name="dollar-sign" size={25}
                                                  color={constant.tintColor}/>
                                    <Text style={{fontWeight: 'bold', fontSize: 18}}>  {this.state.element.price} CUC</Text>
                                </View> : null
                        }
                        <View style={styles.detailsIcon}>
                            <FontAwesome5 name="calendar-alt" size={25}
                                          color={constant.tintColor}/>
                            <Text>  {this.date}</Text>
                        </View>
                        {
                            this.state.element.contact_name ?
                                <View style={styles.detailsIcon}>
                                    <FontAwesome5 name="user" size={25}
                                                  color={constant.tintColor}/>
                                    <Text>  {this.state.element.contact_name}</Text>
                                </View>
                                : null
                        }
                        <View style={styles.detailsIcon}>
                            <FontAwesome5 name="map-marker-alt" size={25}
                                          color={constant.tintColor}/>
                            <Text>   {this.state.element.address ? this.state.element.address + ', ' + this.state.element.city :
                                this.state.element.city}</Text>
                        </View>
                        <Text style={styles.details}>{this.state.element.phones.map(value => (
                            <div key={'phone-' + value}>
                                <TouchableOpacity style={styles.option}
                                                  onPress={() => Linking.openURL('tel:' + value)}>
                                    <FontAwesome5 style={{transform: 'rotateY(0.5turn)'}} name="phone-square" size={25}
                                                  color={'green'}/>
                                    <Text>  {value}</Text>
                                </TouchableOpacity>
                                <br/>
                            </div>
                        ))}
                        </Text>
                        <Text style={styles.details}>{this.state.element.emails.map(value => (
                            <div key={'mail-' + value}>
                                <TouchableOpacity style={styles.option}
                                                  onPress={() => Linking.openURL('mailto:' + value)}>
                                    <FontAwesome5 name="envelope-square" size={25}
                                                  color={'orange'}/>
                                    <Text>  {value}</Text>
                                </TouchableOpacity>
                                <br/>
                            </div>
                        ))}
                        </Text>
                        {
                            this.state.element.description ?
                                <Text style={{
                                    marginTop: 10,
                                    width: '100%',
                                }}>
                                    <hr/>
                                    {this.state.element.description}</Text>
                                : null
                        }
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
    },
    details: {
        color: 'black',
        marginTop: 10
    },
    detailsIcon: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center'
    },
});


