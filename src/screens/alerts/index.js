import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';
import { default as appTheme } from '../../custom-theme.json';
import axios from 'axios';
import Moment from 'moment';

export default class AlertsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }
    componentDidMount() {
        axios.get('https://newsapi.org/v2/everything?q=iot&apiKey=42db6bdced5f4a51a4ce076fb9124207').then(resp => {
            //console.log(resp.data)
            if (resp.data.status == 'ok')
                this.setState({ items: resp.data.articles });
        })
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: StatusBar.currentHeight }}>
                <View style={{
                    backgroundColor: '#fff', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: StyleSheet.hairlineWidth
                }}>{/**, elevation: 1, shadowColor: "#000000",
                shadowOpacity: 0.8,
                shadowRadius: 2,
                shadowOffset: {
                    height: 1,
                    width: 0
                } */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', height: 56 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 17, marginLeft: 20 }}>Thông báo</Text>
                        </View>
                        <View style={{ paddingRight: 20 }}>
                            <Icon name="options" fill={'gray'} style={{ width: 24, height: 24 }} />
                        </View>
                    </View>
                </View>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                        {this.state.items.map((item, key) => (
                            <View key={key}>
                                <TouchableOpacity>
                                    <View style={{
                                        flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 0, borderColor: 'red',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 1,
                                        backgroundColor: '#fff',
                                        padding: 10
                                    }}>
                                        <View style={{ paddingRight: 20 }}><Icon name="bell-outline" fill={appTheme['color-primary-500']} style={{ width: 24, height: 24 }} /></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15 }} numberOfLines={1}>{item.title}</Text>
                                            <Text style={{ fontFamily: 'MavenPro-Regular', fontSize: 13 }} numberOfLines={2}>{item.description}</Text>
                                        </View>
                                        <View style={{ paddingLeft: 20 }}>
                                            <Text style={{ textAlign: 'center', fontFamily: 'MavenPro-Regular', fontSize: 11 }}>{Moment(item.publishedAt).format('HH:mm')}</Text>
                                            <Text style={{ textAlign: 'center', fontFamily: 'MavenPro-Regular', fontSize: 11 }}>{Moment(item.publishedAt).format('DD/MM/YYYY')}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {/*<View>
                            <TouchableOpacity>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 0, borderColor: 'red',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 1,
                                    backgroundColor: '#fff',
                                    padding: 10
                                }}>
                                    <View style={{ paddingRight: 20 }}><Icon name="bell-outline" fill={appTheme['color-primary-500']} style={{ width: 24, height: 24 }} /></View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15 }} numberOfLines={1}>Install the React Native for macOS packages.</Text>
                                        <Text style={{ fontFamily: 'MavenPro-Regular', fontSize: 13 }} numberOfLines={2}>Without using Xcode: In your React Native macOS project directory, run</Text>
                                    </View>
                                    <View style={{ paddingLeft: 20 }}>
                                        <Text style={{ textAlign: 'center', fontFamily: 'MavenPro-Regular', fontSize: 11 }}>20:00</Text>
                                        <Text style={{ textAlign: 'center', fontFamily: 'MavenPro-Regular', fontSize: 11 }}>16/06/2020</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 0, borderColor: 'red',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 1,
                                    backgroundColor: '#fff',
                                    padding: 10
                                }}>
                                    <View style={{ paddingRight: 20 }}><Icon name="bell-outline" fill={appTheme['color-danger-500']} style={{ width: 24, height: 24 }} /></View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15 }} numberOfLines={1}>Install the React Native for macOS packages.</Text>
                                        <Text style={{ fontFamily: 'MavenPro-Regular', fontSize: 13 }} numberOfLines={2}>Without using Xcode: In your React Native macOS project directory, run</Text>
                                    </View>
                                    <View style={{ paddingLeft: 20 }}>
                                        <Text style={{ textAlign: 'center', fontFamily: 'MavenPro-Regular', fontSize: 11 }}>20:00</Text>
                                        <Text style={{ textAlign: 'center', fontFamily: 'MavenPro-Regular', fontSize: 11 }}>16/06/2020</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 0, borderColor: 'red',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 1,
                                    backgroundColor: '#fff',
                                    padding: 10
                                }}>
                                    <View style={{ paddingRight: 20 }}><Icon name="bell-outline" fill={appTheme['color-info-500']} style={{ width: 24, height: 24 }} /></View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15 }} numberOfLines={1}>Install the React Native for macOS packages.</Text>
                                        <Text style={{ fontFamily: 'MavenPro-Regular', fontSize: 13 }} numberOfLines={2}>Without using Xcode: In your React Native macOS project directory, run</Text>
                                    </View>
                                    <View style={{ paddingLeft: 20 }}>
                                        <Text style={{ textAlign: 'center', fontFamily: 'MavenPro-Regular', fontSize: 11 }}>20:00</Text>
                                        <Text style={{ textAlign: 'center', fontFamily: 'MavenPro-Regular', fontSize: 11 }}>16/06/2020</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 0, borderColor: 'red',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 1,
                                    backgroundColor: '#fff',
                                    padding: 10
                                }}>
                                    <View style={{ paddingRight: 20 }}><Icon name="bell-outline" fill={appTheme['color-warning-500']} style={{ width: 24, height: 24 }} /></View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15 }} numberOfLines={1}>Install the React Native for macOS packages.</Text>
                                        <Text style={{ fontFamily: 'MavenPro-Regular', fontSize: 13 }} numberOfLines={2}>Without using Xcode: In your React Native macOS project directory, run</Text>
                                    </View>
                                    <View style={{ paddingLeft: 20 }}>
                                        <Text style={{ textAlign: 'center', fontFamily: 'MavenPro-Regular', fontSize: 11 }}>20:00</Text>
                                        <Text style={{ textAlign: 'center', fontFamily: 'MavenPro-Regular', fontSize: 11 }}>16/06/2020</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>*/}
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}