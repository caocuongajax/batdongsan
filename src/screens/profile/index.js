import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, Dimensions, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Divider, Icon, Button } from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import { default as appTheme } from '../../custom-theme.json';
import axios from 'axios';
//import Moment from 'moment';
const cheerio = require('react-native-cheerio');

const windowWidth = Dimensions.get('window').width;

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            items: []
        };
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        axios.get('https://odt.vn/nha-moi-gioi-bds/1').then(resp => {
            const data = resp.data;
            const $ = cheerio.load(data);
            let items = [];
            const dulieu = $('.property-item');
            for (let i = 0; i < dulieu.length; i++) {
                let el = dulieu[i];
                let hinhanh = $(el)[0].children[0]['children'][0]['children'][0]['attribs']['src'][0] == '/' ? 'https://odt.vn/images/nophoto.jpg' : $(el)[0].children[0]['children'][0]['children'][0]['attribs']['src'];
                let tmp2 = {
                    Img: hinhanh,
                    Title: $(el)[0].children[0]['children'][0]['children'][0]['attribs']['alt'],
                    Dientich: $($(el)[0].children[2].children[3]).text().trim(),
                    Price: $($(el)[0].children[2].children[2]).text().trim(),
                    Diadiem: ($($(el)[0].children[2].children[4]).text().trim().split(':')[1]).trim(),
                    Link: $(el)[0].children[0]['children'][0]['attribs']['href']
                };
                items.push(tmp2);
            }
            this.setState({ items: items, isLoading: false });
        })
    }
    _dangxuat = () => {
        /*this.setState({ isLoading: true })
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 10000)*/
    }
    render() {
        return (
            <>
                <StatusBar translucent backgroundColor={'transparent'} />
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View>
                            <FastImage style={{ width: windowWidth, height: windowWidth - windowWidth / 3 }} source={{ uri: 'https://images.readwrite.com/wp-content/uploads/2019/06/Where-Will-AI-Take-the-Real-Estate-Market-in-10-Years-825x500.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                        </View>
                        <View style={{
                            padding: 20, margin: 20, marginTop: -50, backgroundColor: '#fff', borderRadius: 10,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 1,
                        }}>
                            <View style={{ marginTop: -80, width: windowWidth / 3.5, height: windowWidth / 3.5, borderRadius: windowWidth / 3.5 / 2, alignSelf: 'center', borderColor: '#fff', borderWidth: 3 }}>
                                <FastImage style={{ width: windowWidth / 3.5 - 6, height: windowWidth / 3.5 - 6, borderRadius: (windowWidth / 3.5 - 6) / 2 }} source={{ uri: 'https://images.readwrite.com/wp-content/uploads/2019/06/Where-Will-AI-Take-the-Real-Estate-Market-in-10-Years-825x500.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                            </View>
                            <View style={{ paddingTop: 20 }}>
                                <Text category='h4' style={{ fontFamily: 'MavenPro-Medium', textAlign: 'center' }}>bui cao cuong</Text>
                                <Text category='h6' style={{ fontFamily: 'MavenPro-Regular', textAlign: 'center' }}>Ninh Thuan</Text>
                            </View>
                            <View style={{ paddingBottom: 20, paddingTop: 10 }}>
                                <Text category='h5' style={{ fontFamily: 'MavenPro-Regular', textAlign: 'center' }}>0902.855.377</Text>
                            </View>
                            <Divider />
                            <View style={{ paddingVertical: 20 }}>
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <View>
                                            <Text style={{ fontFamily: 'MavenPro-Medium', textAlign: 'center' }}>50</Text>
                                            <Text style={{ fontFamily: 'MavenPro-Regular', textAlign: 'center' }}>tin đăng</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontFamily: 'MavenPro-Medium', textAlign: 'center' }}>50</Text>
                                            <Text style={{ fontFamily: 'MavenPro-Regular', textAlign: 'center' }}>theo</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontFamily: 'MavenPro-Medium', textAlign: 'center' }}>50</Text>
                                            <Text style={{ fontFamily: 'MavenPro-Regular', textAlign: 'center' }}>đã theo</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{ padding: 20, paddingBottom: 40 }}>
                                <View style={{ paddingBottom: 15 }}>
                                    <Text category="h5" style={{ fontFamily: 'MavenPro-Medium' }}>Mới đăng</Text>
                                </View>
                                <View>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {this.state.isLoading ?
                                            <View style={{ justifyContent: 'center', alignContent: 'center', width: windowWidth - 40, paddingTop: 40 }}><ActivityIndicator size="large" /></View>
                                            :
                                            this.state.items.length ?
                                                this.state.items.map((item, key) => (
                                                    <View key={key} style={{ paddingRight: 20, width: windowWidth / 2 + 20 }}>
                                                        <TouchableOpacity onPress={ev => this.props.navigation.push('Detail', item)}>
                                                            <View>
                                                                <FastImage style={{ width: windowWidth / 2, height: windowWidth / 3, borderRadius: 10 }} source={{ uri: item.Img }} resizeMode={FastImage.resizeMode.cover} />
                                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginLeft: 5, marginTop: 10 }} numberOfLines={1}>{item.Title}</Text>
                                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray', marginLeft: 5 }} numberOfLines={1}>{item.Price}, {item.Dientich}</Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                                                                    <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                                                    <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray' }} numberOfLines={1}>{item.Diadiem}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                )) : <View style={{ width: windowWidth - 40 }}><Text style={{ fontFamily: 'MavenPro-Medium', textAlign: 'center' }}>Không có nội dung</Text></View>
                                        }
                                        {/*<View style={{ paddingRight: 20, width: windowWidth / 2 + 20 }}>
                                            <TouchableOpacity onPress={ev => this.props.navigation.push('Detail')}>
                                                <View>
                                                    <FastImage style={{ width: windowWidth / 2, height: windowWidth / 3, borderRadius: 10 }} source={{ uri: 'https://images.readwrite.com/wp-content/uploads/2019/06/Where-Will-AI-Take-the-Real-Estate-Market-in-10-Years-825x500.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                                                    <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginLeft: 5, marginTop: 10 }} numberOfLines={1}>Bán lô góc 3MT 341m2 đất ninh chữ mặt tiền đường an dương vương đối diện khách sạn thủy tiên , sơn ca,... thổ cư 100%</Text>
                                                    <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray', marginLeft: 5 }} numberOfLines={1}>1-4 Beds, 1-2 Baths</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                                                        <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray' }} numberOfLines={1}>20 Dong Dau, Phuoc My, Phan Rang - Thap Cham, Ninh Thuan</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ paddingRight: 20, width: windowWidth / 2 + 20 }}>
                                            <FastImage style={{ width: windowWidth / 2, height: windowWidth / 3, borderRadius: 10 }} source={{ uri: 'https://images.readwrite.com/wp-content/uploads/2019/06/Where-Will-AI-Take-the-Real-Estate-Market-in-10-Years-825x500.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginLeft: 5, marginTop: 10 }} numberOfLines={1}>$1,290 - 3,640</Text>
                                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray', marginLeft: 5 }} numberOfLines={1}>1-4 Beds, 1-2 Baths</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                                                <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray' }} numberOfLines={1}>20 Dong Dau, Phuoc My, Phan Rang - Thap Cham, Ninh Thuan</Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingRight: 20, width: windowWidth / 2 + 20 }}>
                                            <FastImage style={{ width: windowWidth / 2, height: windowWidth / 3, borderRadius: 10 }} source={{ uri: 'https://images.readwrite.com/wp-content/uploads/2019/06/Where-Will-AI-Take-the-Real-Estate-Market-in-10-Years-825x500.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginLeft: 5, marginTop: 10 }} numberOfLines={1}>$1,290 - 3,640</Text>
                                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray', marginLeft: 5 }} numberOfLines={1}>1-4 Beds, 1-2 Baths</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                                                <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray' }} numberOfLines={1}>20 Dong Dau, Phuoc My, Phan Rang - Thap Cham, Ninh Thuan</Text>
                                            </View>
                                        </View>*/}
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{ paddingBottom: 40, padding: 20 }}><Button onPress={this._dangxuat}><Text style={{ fontFamily: 'MavenPro-Bold', color: '#fff' }}>Đăng xuất</Text></Button></View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        )
    }
}