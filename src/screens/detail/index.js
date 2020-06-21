import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, StatusBar, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Text, Icon, Divider, Button } from '@ui-kitten/components';
import { default as appTheme } from '../../custom-theme.json';
import DOMParser from 'react-native-html-parser';
import axios from 'axios';
//const cheerio = require('react-native-cheerio');
const slug = require('slug');
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function URLToArray(url) {
    var request = {};
    var arr = [];
    var pairs = url.substring(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');

        //check we have an array here - add array numeric indexes so the key elem[] is not identical.
        if (endsWith(decodeURIComponent(pair[0]), '[]')) {
            var arrName = decodeURIComponent(pair[0]).substring(0, decodeURIComponent(pair[0]).length - 2);
            if (!(arrName in arr)) {
                arr.push(arrName);
                arr[arrName] = [];
            }

            arr[arrName].push(decodeURIComponent(pair[1]));
            request[arrName] = arr[arrName];
        } else {
            request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    }
    return request;
}
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export default class DetailScreen extends Component {
    constructor(props) {
        super(props);
        const Dulieu = props.route.params;
        this.state = {
            isVisible: false,
            isLoading: false,
            title: Dulieu.Title,
            diadiem: Dulieu.Diadiem,
            gia: Dulieu.Price,
            dientich: Dulieu.Dientich,
            link: Dulieu.Link,
            img: Dulieu.Img,
            activeSlide: 0,
            sliders: [
                {
                    img: Dulieu.Img
                }
            ],
            translucent: 0.2,
            mota: [],
            daluu: false,
            thongtin: null,
            Lienquan: { items: [], isLoading: false }
        }
    }
    formatPhoneNumber = (str) => {
        //Filter only numbers from the input
        let cleaned = ('' + str).replace(/\D/g, '');

        //Check if the input is of correct length
        let match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);

        if (match) {
            return match[1] + '.' + match[2] + '.' + match[3]
        };

        return null
    }
    yeuthich = async () => {
        try {
            let dulieudaluu = await AsyncStorage.getItem('@daluu');
            if (dulieudaluu != null) {
                dulieudaluu = JSON.parse(dulieudaluu);
            } else {
                dulieudaluu = [];
            }
            const daluu = dulieudaluu.find(x => x.Link == this.props.route.params.Link);
            if (daluu == undefined) {
                //chua luu
                dulieudaluu.push(this.props.route.params);
                this.setState({ daluu: true });
            } else {
                //da luu
                dulieudaluu = dulieudaluu.filter(x => x.Link != this.props.route.params.Link);
                this.setState({ daluu: false });
            }
            AsyncStorage.setItem('@daluu', JSON.stringify(dulieudaluu));
        } catch (e) {
            console.log(e)
        }
    }
    async componentDidMount() {
        try {
            let dulieudaluu = await AsyncStorage.getItem('@daluu');
            if (dulieudaluu != null) {
                dulieudaluu = JSON.parse(dulieudaluu);
                const daluu = dulieudaluu.find(x => x.Link == this.props.route.params.Link);
                if (daluu != undefined) {
                    this.setState({ daluu: true });
                }
            }

            this.setState({ isLoading: true, Lienquan: { items: [], isLoading: true } });
            axios.get(this.props.route.params.Link).then(resp => {
                const data = resp.data;
                const parser = new DOMParser.DOMParser({
                    errorHandler: {
                        warning: w => console.warn(w),
                        error: e => console.log(e),
                        fatalError: e => console.log(e),
                    },
                });
                const parsed = parser.parseFromString(data, 'text/html');
                const Hinhanh = parsed.getElementsByClassName('images-slide', false);
                let slides = [];
                for (let i = 0; i < Hinhanh[0].childNodes.length; i++) {
                    const hinhanhItem = Hinhanh[0].childNodes[i];
                    Object.keys(hinhanhItem.firstChild.attributes).map((key, index) => {
                        if (hinhanhItem.firstChild.attributes[key].nodeName == 'src') {
                            let tmpImg = hinhanhItem.firstChild.attributes[key].value[0] == '/' ? 'https://odt.vn/images/nophoto.jpg' : hinhanhItem.firstChild.attributes[key].value;
                            slides.push({ key: i, img: tmpImg });
                        }
                    });
                }
                const Mota = parsed.getElementsByClassName('post-content', false);
                let motaList = []
                for (let i = 0; i < Mota[0].childNodes.length; i++) {
                    if (Mota[0].childNodes[i].data) {
                        motaList.push((Mota[0].childNodes[i].data).trim());
                    }
                }
                const lineList = parsed.getElementsByClassName('line', false);
                let thongtinList = {};
                for (let i = 0; i < lineList.length; i++) {
                    thongtinList[slug(lineList[i].firstChild.childNodes[0].data)] = lineList[i].firstChild.nextSibling.textContent;
                }
                const items = parsed.getElementsByClassName('property-item', false);
                let tmp = [];
                for (let i = 0; i < items.length; i++) {
                    let tmp2 = {
                        Img: '',
                        Title: '',
                        Dientich: '',
                        Price: '',
                        Diadiem: '',
                        Link: ''
                    };

                    const Tieude = items[i].getElementsByClassName('thumb', false);
                    tmp2.Link = Tieude[0].firstChild.attributes['0']['nodeValue'];
                    Object.keys(Tieude[0].firstChild.firstChild.attributes).map((key, index) => {
                        if (Tieude[0].firstChild.firstChild.attributes[key].nodeName == 'alt') {
                            tmp2.Title = Tieude[0].firstChild.firstChild.attributes[key].value;
                        }
                        if (Tieude[0].firstChild.firstChild.attributes[key].nodeName == 'src') {
                            tmp2.Img = Tieude[0].firstChild.firstChild.attributes[key].value[0] == '/' ? 'https://odt.vn/images/nophoto.jpg' : Tieude[0].firstChild.firstChild.attributes[key].value;
                        }
                    });

                    const Price = items[i].getElementsByClassName('fa-money', false);
                    tmp2.Price = (Price[0].nextSibling.data).trim();

                    const Dientich = items[i].getElementsByClassName('fa-crop', false);
                    tmp2.Dientich = (Dientich[0].nextSibling.data).trim();

                    const Diadiem = items[i].getElementsByClassName('fa-map-marker', false);
                    tmp2.Diadiem = (Diadiem[0].nextSibling.nextSibling.firstChild.data).trim();//Diadiem[0].nextSibling.data + ' ' + 

                    tmp.push(tmp2);
                }
                const Bando = parsed.getElementById('submit-property-map').firstChild.attributes
                let latlng = '';
                Object.keys(Bando).map((key, index) => {
                    if (Bando[key].nodeName == 'src') {
                        latlng = Bando[key].value;
                    }
                });
                if (latlng != '') {
                    const urlparams = URLToArray(latlng);
                    thongtinList['latlng'] = urlparams['q'].split(',');
                }

                this.setState({ isLoading: false, sliders: slides, mota: motaList, thongtin: thongtinList, diadiem: thongtinList['dia-chi'], Lienquan: { items: tmp, isLoading: false } });
            })
        } catch (e) {
            console.log(e)
        }
    }
    onScroll = event => {
        const scrollOffsetY = event.nativeEvent.contentOffset.y;
        if (scrollOffsetY > windowWidth - 10) {
            this.setState({ translucent: 0.9 })
        } else {
            this.setState({ translucent: 0.2 })
        }
    }
    render() {
        return (
            <>
                <StatusBar backgroundColor={"rgba(247, 247, 247, " + this.state.translucent + ")"} />
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={this.onScroll}>

                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.sliders}
                            renderItem={({ item }) => (
                                <View style={{ width: windowWidth }}>
                                    <FastImage resizeMode={FastImage.resizeMode.cover} style={{ height: windowWidth, width: windowWidth }} source={{ uri: item.img }} />
                                </View>
                            )}
                            sliderWidth={windowWidth}
                            itemWidth={windowWidth}
                            inactiveSlideScale={1}
                            inactiveSlideOpacity={1}
                            firstItem={0}
                            loop={false}
                            autoplay={false}
                            autoplayDelay={500}
                            autoplayInterval={3000}
                            onSnapToItem={index => this.setState({ activeSlide: index })}
                        />
                        <Pagination
                            dotsLength={this.state.sliders.length}
                            activeDotIndex={this.state.activeSlide}
                            containerStyle={{
                                flex: 1,
                                position: 'absolute',
                                alignSelf: 'center',
                                paddingVertical: 8,
                                marginTop: windowWidth - 30
                            }}
                            dotColor="rgba(255, 255, 255, 0.92)"
                            dotStyle={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                marginHorizontal: 0
                            }}
                            inactiveDotColor="white"
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            carouselRef={this._carousel}
                        />
                        <View style={{ marginTop: -(windowWidth - 50), marginLeft: 20, marginBottom: windowWidth - 92, backgroundColor: 'rgba(255, 255, 255, 0.4)', alignItems: 'center', alignContent: 'center', borderRadius: 21, paddingTop: 5, width: 42, height: 42 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="chevron-left" fill="gray" style={{ width: 32, height: 32 }} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                                <View style={{ paddingBottom: 15, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text category="h6" style={{ fontFamily: 'MavenPro-Regular', color: appTheme['color-primary-500'] }}>{this.props.route.params.Title}</Text>
                                        <View style={{ marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ marginRight: 10, fontFamily: 'MavenPro-Medium', color: appTheme['color-danger-500'] }}>{this.props.route.params.Price}</Text>
                                                <Text style={{ fontFamily: 'MavenPro-Regular', color: 'gray' }}>{this.props.route.params.Dientich}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                                <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 16, height: 16, marginRight: 5, marginTop: 3 }} />
                                                <Text style={{ fontFamily: 'MavenPro-Regular' }}>{this.state.diadiem}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ paddingLeft: 10 }}>
                                        <TouchableOpacity onPress={this.yeuthich}>
                                            <Icon name={this.state.daluu ? "heart" : "heart-outline"} fill="gray" style={{ width: 32, height: 32 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Divider style={{ margin: 20 }} />
                        {this.state.thongtin ? <>
                            <View>
                                <View style={{ paddingBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }}>
                                        <Icon name="sync" fill={appTheme['color-primary-500']} style={{ width: 24, height: 24, marginRight: 20 }} />
                                        <Text style={{ fontFamily: 'MavenPro-Medium' }}>Loại: {this.state.thongtin['loai']}</Text>
                                    </View>
                                </View>
                                <View style={{ paddingBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }}>
                                        <Icon name="shopping-cart" fill={appTheme['color-primary-500']} style={{ width: 24, height: 24, marginRight: 20 }} />
                                        <Text style={{ fontFamily: 'MavenPro-Medium' }}>{this.state.thongtin['hinh-thuc']}</Text>
                                    </View>
                                </View>
                                <View style={{ paddingBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }}>
                                        <Icon name="move" fill={appTheme['color-primary-500']} style={{ width: 24, height: 24, marginRight: 20 }} />
                                        <Text style={{ fontFamily: 'MavenPro-Medium' }}>Hướng nhà: {this.state.thongtin['huong-nha']}</Text>
                                    </View>
                                </View>
                                <View style={{ paddingBottom: 10 }}>
                                    <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, alignItems: 'center' }}>
                                            <Icon name="map-outline" fill={appTheme['color-primary-500']} style={{ width: 24, height: 24, marginRight: 10 }} />
                                            <Text style={{ fontFamily: 'MavenPro-Medium' }}>Xem bản đồ</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Divider style={{ margin: 20 }} />
                        </> : null}
                        {this.state.mota.length ? <>
                            <View style={{ paddingHorizontal: 20 }}>
                                {this.state.mota.map((item, key) => <Text key={key} style={{ fontFamily: 'MavenPro-Regular', paddingBottom: 10 }}>{item}</Text>)}
                            </View>
                            <Divider style={{ margin: 20 }} />
                        </> : null}
                        {this.state.thongtin ?
                            <View style={{ paddingBottom: 20 }}>
                                <TouchableOpacity>
                                    <View>
                                        <Text category='h5' style={{ fontFamily: 'MavenPro-Medium', color: appTheme['color-primary-500'], textAlign: 'center' }}>Liên hệ</Text>
                                        <Text category='h5' style={{ fontFamily: 'MavenPro-Medium', textAlign: 'center' }}>{this.formatPhoneNumber(this.state.thongtin['sdt'])}</Text>
                                        <Text category='h5' style={{ fontFamily: 'MavenPro-Medium', color: appTheme['color-primary-500'], textAlign: 'center' }}>{this.state.thongtin['ten-lien-lac']}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            : null}
                        <View style={{ paddingBottom: 20, marginHorizontal: 20 }}>
                            <Button onPress={() => this.props.navigation.goBack()}>Trở về</Button>
                        </View>
                        <View>
                            <View style={{ padding: 20 }}>
                                <View style={{ paddingBottom: 15 }}>
                                    <Text category="h5" style={{ fontFamily: 'MavenPro-Medium' }}>Liên quan</Text>
                                </View>
                                <View>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {this.state.Lienquan.isLoading ? <View style={{ justifyContent: 'center', alignContent: 'center', width: windowWidth - 40, paddingTop: 30 }}><ActivityIndicator size="large" /></View> :
                                            this.state.Lienquan.items.map((item, key) => (
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
                                            ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
                <Modal isVisible={this.state.isVisible} deviceWidth={windowWidth} deviceHeight={windowHeight} style={{ margin: 0 }} onBackdropPress={() => this.setState({ isVisible: false })} onBackButtonPress={() => this.setState({ isVisible: false })}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                >
                    <View>
                        <View>
                            <StatusBar barStyle="dark-content" backgroundColor={'#4A4B4D'} />
                            {this.state.thongtin ?
                                <MapView
                                    initialRegion={{
                                        latitude: parseFloat(this.state.thongtin['latlng'][0]),
                                        longitude: parseFloat(this.state.thongtin['latlng'][1]),
                                        latitudeDelta: 0,
                                        longitudeDelta: 0.015,
                                    }}
                                    style={{ height: windowHeight }}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: parseFloat(this.state.thongtin['latlng'][0]),
                                            longitude: parseFloat(this.state.thongtin['latlng'][1]),
                                        }}
                                        flat={true}
                                        image={require('../../imgs/pin.png')}
                                    />
                                </MapView>
                                : null}
                        </View>
                        <View style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.2)', alignItems: 'center', alignContent: 'center', borderRadius: 21, paddingTop: 5, width: 42, height: 42 }}>
                            <TouchableOpacity onPress={() => this.setState({ isVisible: false })}>
                                <Icon name="close-outline" fill="white" style={{ width: 32, height: 32 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}