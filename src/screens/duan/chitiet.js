import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, StatusBar, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Text, Icon, Divider, Button } from '@ui-kitten/components';
import { default as appTheme } from '../../custom-theme.json';
import { default as appContain } from '../../contain.json';
import axios from 'axios';
const cheerio = require('react-native-cheerio');
import Modal from 'react-native-modal';

const windowWidth = Dimensions.get('window').width;

const ROOT_URL = 'https://odt.vn'

export default class DuanScreen extends Component {
    constructor(props) {
        super(props);
        const Dulieu = props.route.params;
        this.state = {
            isVisible: false,
            isLoading: false,
            title: Dulieu.Title,
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
            thongtin: null,
            Lienquan: { items: [], isLoading: false }
        }
    }
    componentDidMount() {
        this.setState({ isLoading: true, isVisible: true, Lienquan: { items: [], isLoading: true } });
        axios.get(this.props.route.params.Link).then(resp => {
            const $ = cheerio.load(resp.data);
            const hinhanh = $('.images-slide').find('img');
            let slides = [];
            for (let i = 0; i < hinhanh.length; i++) {
                slides.push({
                    img: $(hinhanh[i]).attr('src')
                })
            }
            const thuoctinh = $('.attrs').find('p');
            let thuoctinhObjs = {};
            for (let i = 0; i < thuoctinh.length; i++) {
                const thuoctinhItem = thuoctinh[i];
                thuoctinhObjs[$(thuoctinhItem).attr('class')] = $(thuoctinhItem).text().trim();
            }
            const dulieu = $('.post-content');
            let noidung = [];
            for (let i = 0; i < dulieu['0'].children.length; i++) {
                const item = dulieu['0'].children[i];
                if ($(item).find('img').length) {
                    noidung.push({ tagName: 'img', value: ROOT_URL + $(item).find('img').attr('src') });
                }
                if ($(item).text().trim() != '') {
                    if ($(item).attr('class') != 'map-places') {
                        noidung.push({ tagName: $(item).get(0).tagName, value: $(item).text().trim() });
                    }
                }
            }
            const tinraoduan = $('.list-properties').find('.property-item');
            let lienquanArr = [];
            for (let i = 0; i < tinraoduan.length; i++) {
                const lienquanItem = $(tinraoduan[i]);
                const thongtinList = lienquanItem.find('.row').find('p');
                let diadiemItem = $(thongtinList[2]).text().trim().split(':');
                diadiemItem = diadiemItem[1].trim();
                let tmp2 = {
                    Img: lienquanItem.find('.thumb').children().first().children().first().attr('src')[0] == '/' ? ROOT_URL + '/images/nophoto.jpg' : lienquanItem.find('.thumb').children().first().children().first().attr('src'),
                    Title: lienquanItem.find('.thumb').children().first().children().first().attr('alt'),
                    Dientich: $(thongtinList[1]).text().trim(),
                    Price: $(thongtinList[0]).text().trim(),
                    Diadiem: diadiemItem,
                    Link: lienquanItem.find('.thumb').children().first().attr('href')
                };
                lienquanArr.push(tmp2);
            }
            this.setState({ isLoading: false, isVisible: false, sliders: slides, thongtin: thuoctinhObjs, mota: noidung, Lienquan: { items: lienquanArr, isLoading: false } });
        })
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
                                            {this.state.thongtin ? <>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ marginRight: 10, fontFamily: 'MavenPro-Medium', color: appTheme['color-danger-500'] }}>{this.state.thongtin['area']}</Text>
                                                    <Text style={{ fontFamily: 'MavenPro-Regular', color: 'gray' }}>{this.state.thongtin['type']}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                                    <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 16, height: 16, marginRight: 5, marginTop: 3 }} />
                                                    <Text style={{ fontFamily: 'MavenPro-Regular' }}>{this.state.thongtin['address']}</Text>
                                                </View>
                                            </> : null}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {this.state.mota.length ? <>
                            <Divider style={{ marginBottom: 20, marginHorizontal: 20 }} />
                            {this.state.mota.map((item, key) =>
                                (item.tagName != 'img') ?
                                    <View style={{ paddingHorizontal: 20 }}>
                                        <Text key={key} style={{ fontFamily: item.tagName == 'h2' ? 'MavenPro-Medium' : 'MavenPro-Regular', paddingBottom: 10, fontSize: item.tagName == 'h2' ? 17 : 15, textAlign: 'justify' }}>{item.value}</Text>
                                    </View>
                                    :
                                    <FastImage source={{ uri: item.value }} style={{ width: windowWidth, height: windowWidth / 2, marginBottom: 10 }} resizeMode={FastImage.resizeMode.cover} />
                            )}
                            <View style={{ margin: 20 }} />
                        </> : null}
                        <View style={{ paddingBottom: 20, marginHorizontal: 20 }}>
                            <Button onPress={() => this.props.navigation.goBack()}>Trở về</Button>
                        </View>
                        <View>
                            <View style={{ padding: 20 }}>
                                <View style={{ paddingBottom: 15 }}>
                                    <Text category="h5" style={{ fontFamily: 'MavenPro-Medium' }}>Tin rao thuộc dự án</Text>
                                </View>
                                <View>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {this.state.Lienquan.items.map((item, key) => (
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
                <Modal isVisible={this.state.isVisible} style={styles.loadingModal}>
                    <StatusBar barStyle="dark-content" backgroundColor={'#4A4B4D'} />
                    <View style={styles.mainModal}>
                        <ActivityIndicator size='large' style={styles.pb20} color={appTheme['color-primary-500']} />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                </Modal>
            </>
        )
    }
}
const styles = StyleSheet.create({
    loadingText: { fontFamily: appContain['fontMedium'], textAlign: 'center' },
    pb20: { paddingBottom: 20 },
    loadingModal: { padding: 20, margin: 20 },
    mainModal: { backgroundColor: appContain['whiteColor'], padding: 20, borderRadius: 10 }
});