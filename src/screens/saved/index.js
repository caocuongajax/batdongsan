import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Text, Icon } from '@ui-kitten/components';
import { default as appTheme } from '../../custom-theme.json';
//import axios from 'axios';
//import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

const windowWidth = Dimensions.get('window').width;

export default class SavedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            items: []
        };
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        AsyncStorage.getItem('@daluu').then(data => {
            if (data!=null) {
                const dulieudaluu = JSON.parse(data);
                console.log(dulieudaluu)
                this.setState({ items: dulieudaluu, isLoading: false });
            } else{
                this.setState({ isLoading: false });
            }
        }).catch(err => {
            this.setState({ isLoading: false });
        })
        /*axios.get('https://newsapi.org/v2/everything?q=iot&apiKey=42db6bdced5f4a51a4ce076fb9124207').then(resp => {
            //console.log(resp.data)
            if (resp.data.status == 'ok')
                this.setState({ items: resp.data.articles, isLoading: false });
        })*/
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: StatusBar.currentHeight }}>
                <View style={{
                    backgroundColor: '#fff', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: StyleSheet.hairlineWidth
                }}>{/**, shadowColor: "#000000",
                shadowOpacity: 0.8,
                shadowRadius: 2,
                shadowOffset: {
                    height: 1,
                    width: 0
                } */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', height: 56 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 17, marginLeft: 20 }}>Đã lưu</Text>
                        </View>
                        <View style={{ paddingRight: 20 }}>
                            <Icon name="options-2" fill={'gray'} style={{ width: 24, height: 24 }} />
                        </View>
                    </View>
                </View>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                        {this.state.isLoading ?
                            <View style={{ justifyContent: 'center', alignContent: 'center', width: windowWidth - 40, paddingTop: 40 }}><ActivityIndicator size="large" /></View>
                            :
                            this.state.items.map((item, key) => (
                                <View key={key} style={{ width: windowWidth - 40, paddingBottom: 20 }}>
                                    <TouchableOpacity onPress={ev => this.props.navigation.push('Detail', item)}>
                                        <View>
                                            <FastImage style={{ width: windowWidth - 40, height: windowWidth / 2, borderRadius: 10 }} source={{ uri: item.Img }} resizeMode={FastImage.resizeMode.cover} />
                                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginTop: 5 }} numberOfLines={1}>{item.Title}</Text>
                                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray' }} numberOfLines={1}>{item.Price}, {item.Dientich}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray', flex: 1 }} numberOfLines={1}>{item.Diadiem}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                        {/*<View style={{ width: windowWidth - 40, paddingBottom: 20 }}>
                            <TouchableOpacity onPress={ev => this.props.navigation.push('Detail')}>
                                <View>
                                    <FastImage style={{ width: windowWidth - 40, height: windowWidth / 2, borderRadius: 10 }} source={{ uri: 'https://media.remax-dev.booj.io/33bc3bcd-2ab4-322f-af04-9120fbedfd46/01_NewListings.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                                    <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginTop: 5 }} numberOfLines={1}>$1,290 - 3,640</Text>
                                    <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray' }} numberOfLines={1}>1-4 Beds, 1-2 Baths</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray', flex: 1 }} numberOfLines={1}>20 Đổng Dậu, Phước Mỹ, Phan Rang - Tháp Chàm, Ninh Thuận</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: windowWidth - 40, paddingBottom: 20 }}>
                            <FastImage style={{ width: windowWidth - 40, height: windowWidth / 2, borderRadius: 10 }} source={{ uri: 'https://media.remax-dev.booj.io/33bc3bcd-2ab4-322f-af04-9120fbedfd46/01_NewListings.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginTop: 5 }} numberOfLines={1}>$1,290 - 3,640</Text>
                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray' }} numberOfLines={1}>1-4 Beds, 1-2 Baths</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray', flex: 1 }} numberOfLines={1}>20 Dong Dau, Phuoc My, Phan Rang - Thap Cham, Ninh Thuan</Text>
                            </View>
                        </View>
                        <View style={{ width: windowWidth - 40, paddingBottom: 20 }}>
                            <FastImage style={{ width: windowWidth - 40, height: windowWidth / 2, borderRadius: 10 }} source={{ uri: 'https://media.remax-dev.booj.io/33bc3bcd-2ab4-322f-af04-9120fbedfd46/01_NewListings.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginTop: 5 }} numberOfLines={1}>$1,290 - 3,640</Text>
                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray' }} numberOfLines={1}>1-4 Beds, 1-2 Baths</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray', flex: 1 }} numberOfLines={1}>20 Dong Dau, Phuoc My, Phan Rang - Thap Cham, Ninh Thuan</Text>
                            </View>
                        </View>*/}
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}