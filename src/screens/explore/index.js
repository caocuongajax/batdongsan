import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, StatusBar, ActivityIndicator, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Text, Icon, Input } from '@ui-kitten/components';
import { default as appTheme } from '../../custom-theme.json';
import { default as appContain } from '../../contain.json';
import DOMParser from 'react-native-html-parser';
import axios from 'axios';
const cheerio = require('react-native-cheerio');
import Modal from 'react-native-modal';

const windowWidth = Dimensions.get('window').width;

const ROOT_URL = 'https://odt.vn'

export default class ExploreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            provinces: [
                { id: 1, tag: 'gia-lai', name: 'Gia Lai' },
                { id: 2, tag: 'ninh-thuan', name: 'Ninh Thuận' },
            ],
            tinhchon: 2,
            tinhtag: 'ninh-thuan',
            Moinhat: {
                isLoading: false,
                items: []
            },
            Duan: {
                items: [],
                isLoading: false
            },
            Tintuc: {
                items: [],
                isLoading: false
            },
            Danhsach: {
                items: [],
                isLoading: false
            }
        }
    }
    gotoDetail = item => {
        this.props.navigation.push('Detail', item);
    }
    componentDidMount() {
        this.setState({ Moinhat: { isLoading: true, items: [] }, Duan: { items: [], isLoading: true }, Tintuc: { items: [], isLoading: true } })
        axios.get(ROOT_URL + '/').then(resp => {
            const data = resp.data;
            const parser = new DOMParser.DOMParser({
                errorHandler: {
                    warning: w => console.warn(w),
                    error: e => console.log(e),
                    fatalError: e => console.log(e),
                },
            });
            const parsed = parser.parseFromString(data, 'text/html');
            const items = parsed.getElementsByClassName('property-item', false);
            const projectData = parsed.getElementsByClassName('top-projects', false);
            const newsData = parsed.getElementsByClassName('post-item', false);
            let tmp = [];
            let projects = [];
            let news = [];
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
                        tmp2.Img = Tieude[0].firstChild.firstChild.attributes[key].value[0] == '/' ? ROOT_URL + '/images/nophoto.jpg' : Tieude[0].firstChild.firstChild.attributes[key].value;
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
            for (let i = 0; i < projectData[0].childNodes.length; i++) {
                let tmp2 = {
                    Title: '',
                    Img: '',
                    Link: ''
                };
                const projectItem = projectData[0].childNodes[i]
                tmp2.Link = projectItem.attributes['0']['nodeValue'];
                Object.keys(projectItem.firstChild.attributes).map((key, index) => {
                    if (projectItem.firstChild.attributes[key].nodeName == 'alt') {
                        tmp2.Title = projectItem.firstChild.attributes[key].value;
                    }
                    if (projectItem.firstChild.attributes[key].nodeName == 'src') {
                        tmp2.Img = projectItem.firstChild.attributes[key].value[0] == '/' ? ROOT_URL + '/images/nophoto.jpg' : projectItem.firstChild.attributes[key].value;
                    }
                });
                projects.push(tmp2);
            }
            for (let i = 0; i < newsData.length; i++) {
                let tmp2 = {
                    Title: '',
                    Img: '',
                    Desc: '',
                    Link: ''
                };
                const Thongtin = newsData[i].firstChild;
                tmp2.Link = Thongtin.firstChild.attributes['0']['nodeValue'];
                Object.keys(Thongtin.firstChild.firstChild.attributes).map((key, index) => {
                    if (Thongtin.firstChild.firstChild.attributes[key].nodeName == 'alt') {
                        tmp2.Title = Thongtin.firstChild.firstChild.attributes[key].value;
                    }
                    if (Thongtin.firstChild.firstChild.attributes[key].nodeName == 'src') {
                        tmp2.Img = Thongtin.firstChild.firstChild.attributes[key].value[0] == '/' ? ROOT_URL + '/images/nophoto.jpg' : Thongtin.firstChild.firstChild.attributes[key].value;
                    }
                });
                tmp2.Desc = newsData[i].lastChild.childNodes['0'].data;
                news.push(tmp2);
            }
            this.setState({ Moinhat: { items: tmp, isLoading: false }, Duan: { items: projects, isLoading: false }, Tintuc: { items: news, isLoading: false } })
        })
        /*axios.get('https://api.ipify.org').then(resp => {
            console.log(resp.data)
            axios.get('https://geo.ipify.org/api/v1?apiKey=at_IvNH24Lt4tpc6UtNCZ22HvyJutN7m&ipAddress='+resp.data).then(response => {
                console.log(response.data.location.lat, response.data.location.lng, response.data.location.region)
            })
        })*/
        this.getProvinceData(this.state.tinhtag);
    }
    getProvinceData = (province) => {
        this.setState({ Danhsach: { items: [], isLoading: true } });
        axios.get(ROOT_URL + '/nha-dat-ban-' + province).then(resp => {
            const $ = cheerio.load(resp.data);
            const danhsachrao = $('.property-item');
            let danhsach = [];
            for (let i = 0; i < danhsachrao.length; i++) {
                const lienquanItem = $(danhsachrao[i]);
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
                danhsach.push(tmp2);
            }
            this.setState({ Danhsach: { items: danhsach, isLoading: false } });
        })
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: StatusBar.currentHeight }}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingTop: 10, paddingBottom: 10 }}>
                            <View style={{ paddingLeft: 20, paddingRight: 10 }}>
                                <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 24, height: 24 }} />
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
                                    <View>
                                        <Text style={{ fontSize: 12, fontFamily: 'MavenPro-Regular' }}>Location</Text>
                                        <View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'MavenPro-Bold' }}>{this.state.provinces.map((item, key) => item.id == this.state.tinhchon ? item.name : '')}</Text>
                                                <Icon name="arrow-ios-downward" fill="grey" style={{ width: 16, height: 16 }} />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, paddingRight: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View />
                                    <Icon name="settings-2" fill="gray" style={{ width: 24, height: 24 }} />
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('Search')}>
                                <Input placeholder="Search by Location, Area" placeholderTextColor='grey' disabled textStyle={{ fontSize: 13, fontFamily: 'MavenPro-Regular' }} accessoryRight={() => <Icon name="search" fill="grey" style={{ width: 20, height: 20 }} />} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                            <View style={{ paddingBottom: 15 }}>
                                <Text category="h5" style={{ fontFamily: 'MavenPro-Medium' }}>Mới đăng</Text>
                            </View>
                            <View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {this.state.Moinhat.isLoading ? <View style={{ justifyContent: 'center', alignContent: 'center', width: windowWidth - 40, paddingTop: 30 }}><ActivityIndicator size="large" /></View> :
                                        this.state.Moinhat.items.map((item, key) => (
                                            <View key={key} style={{ paddingRight: 20, width: windowWidth / 2 + 20 }}>
                                                <TouchableOpacity onPress={ev => this.gotoDetail(item)}>
                                                    <View>
                                                        <FastImage style={{ width: windowWidth / 2, height: windowWidth / 3, borderRadius: 10 }} source={{ uri: item.Img }} resizeMode={FastImage.resizeMode.cover} />
                                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginLeft: 5, marginTop: 10 }} numberOfLines={1}>{item.Title}</Text>
                                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray', marginLeft: 5 }} numberOfLines={1}>{item.Price}, {item.Dientich}</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5, marginTop: 3 }}>
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
                    <View>
                        <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
                            <View style={{ paddingBottom: 15 }}>
                                <Text category="h5" style={{ fontFamily: 'MavenPro-Medium' }}>Tin tức bất động sản</Text>
                            </View>
                            <View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {this.state.Tintuc.isLoading ? <View style={{ justifyContent: 'center', alignContent: 'center', width: windowWidth - 40, paddingTop: 30 }}><ActivityIndicator size="large" /></View> :
                                        this.state.Tintuc.items.map((item, key) => (
                                            <TouchableOpacity key={key} onPress={() => this.props.navigation.push('Chitiet', item)}>
                                                <View style={{ paddingRight: 20, width: windowWidth - windowWidth / 3 + 20 }}>
                                                    <FastImage style={{ width: windowWidth - windowWidth / 3, height: windowWidth / 2.5, borderRadius: 10 }} source={{ uri: item.Img }} resizeMode={FastImage.resizeMode.cover} />
                                                    <View style={{ marginTop: 10 }}>
                                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13 }} numberOfLines={1}>{item.Title}</Text>
                                                        <Text style={{ fontFamily: 'MavenPro-Regular', fontSize: 12 }} numberOfLines={2}>{item.Desc}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                    {/*<View>
                        <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
                            <View style={{ paddingBottom: 15 }}>
                                <Text category="h5" style={{ fontFamily: 'MavenPro-Medium' }}>Thiết kế xây dựng</Text>
                            </View>
                            <View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={{ paddingRight: 20, width: windowWidth - windowWidth / 3 + 20 }}>
                                        <FastImage style={{ width: windowWidth - windowWidth / 3, height: windowWidth / 2.5, borderRadius: 10 }} source={{ uri: 'https://www.noithatvhome.com/wp-content/uploads/2018/10/a1.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                                        <View style={{ marginTop: -40, marginRight: 10 }}>
                                            <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 20, padding: 5, paddingHorizontal: 10, alignSelf: 'flex-end' }}>
                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13 }} numberOfLines={1}>Starts at </Text>
                                                <Text style={{ fontFamily: 'MavenPro-Bold', color: appTheme['color-primary-500'], fontSize: 13 }} numberOfLines={1}>$2,000/sq.ft</Text>
                                            </View>
                                        </View>
                                        <Text />
                                    </View>
                                    <View style={{ paddingRight: 20, width: windowWidth - windowWidth / 3 + 20 }}>
                                        <FastImage style={{ width: windowWidth - windowWidth / 3, height: windowWidth / 2.5, borderRadius: 10 }} source={{ uri: 'https://www.noithatvhome.com/wp-content/uploads/2018/10/a1.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                                        <View style={{ marginTop: -40, marginRight: 10 }}>
                                            <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 20, padding: 5, paddingHorizontal: 10, alignSelf: 'flex-end' }}>
                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13 }} numberOfLines={1}>Từ </Text>
                                                <Text style={{ fontFamily: 'MavenPro-Bold', color: appTheme['color-primary-500'], fontSize: 13 }} numberOfLines={1}>1tr/m2</Text>
                                            </View>
                                        </View>
                                        <Text />
                                    </View>
                                    <View style={{ paddingRight: 20, width: windowWidth - windowWidth / 3 + 20 }}>
                                        <FastImage style={{ width: windowWidth - windowWidth / 3, height: windowWidth / 2.5, borderRadius: 10 }} source={{ uri: 'https://www.noithatvhome.com/wp-content/uploads/2018/10/a1.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                                        <View style={{ marginTop: -40, marginRight: 10 }}>
                                            <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 20, padding: 5, paddingHorizontal: 10, alignSelf: 'flex-end' }}>
                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13 }} numberOfLines={1}>Chỉ với </Text>
                                                <Text style={{ fontFamily: 'MavenPro-Bold', color: appTheme['color-primary-500'], fontSize: 13 }} numberOfLines={1}>900k/m2</Text>
                                            </View>
                                        </View>
                                        <Text />
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </View>*/}
                    {this.state.Danhsach.isLoading ? null :
                        <View>
                            <View style={{ paddingTop: 40 }}>
                                <View style={{ paddingHorizontal: 20, paddingBottom: 15 }}>
                                    <Text category="h5" style={{ fontFamily: 'MavenPro-Medium' }}>Xung quanh {this.state.provinces.map((item, key) => item.id == this.state.tinhchon ? item.name : '')}</Text>
                                </View>
                                <View style={{ paddingHorizontal: 15 }}>
                                    <FlatList
                                        numColumns={2}
                                        data={this.state.Danhsach.items}
                                        renderItem={({ item }) =>
                                            <View style={{ width: (windowWidth - 30) / 2, paddingBottom: 20 }}>
                                                <TouchableOpacity onPress={() => this.props.navigation.push('Detail', item)}>
                                                    <View style={{ padding: 5 }}>
                                                        <FastImage style={{ width: null, flex: 1, height: windowWidth / 4, borderRadius: 5 }} source={{ uri: item.Img }} resizeMode={FastImage.resizeMode.cover} />
                                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginTop: 5 }} numberOfLines={1}>{item.Title}</Text>
                                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray' }} numberOfLines={1}>{item.Price}</Text>
                                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray' }} numberOfLines={1}>{item.Dientich}</Text>
                                                        {/*<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray', flex: 1 }} numberOfLines={1}>{item.Diadiem}</Text>
                                                        </View>*/}
                                                    </View>
                                                </TouchableOpacity>
                                            </View>}
                                        keyExtractor={item => item.Link}
                                    />
                                    {/*this.state.Danhsach.items.map((item, key) =>
                                        <TouchableOpacity key={key} onPress={() => this.props.navigation.push('Detail', item)}>
                                            <View style={{ width: windowWidth - 40, paddingBottom: 20 }}>
                                                <FastImage style={{ width: windowWidth - 40, height: windowWidth / 2, borderRadius: 10 }} source={{ uri: item.Img }} resizeMode={FastImage.resizeMode.cover} />
                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginTop: 5 }} numberOfLines={1}>{item.Title}</Text>
                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray' }} numberOfLines={1}>{item.Price}, {item.Dientich}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                                    <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray', flex: 1 }} numberOfLines={1}>{item.Diadiem}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )*/}
                                </View>
                            </View>
                        </View>
                    }
                    <View>
                        <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
                            <View style={{ paddingBottom: 15 }}>
                                <Text category="h5" style={{ fontFamily: 'MavenPro-Medium' }}>Dự án nổi bật</Text>
                            </View>
                            <View>
                                {this.state.Duan.isLoading ? <View style={{ justifyContent: 'center', alignContent: 'center', width: windowWidth - 40, paddingTop: 30 }}><ActivityIndicator size="large" /></View> :
                                    this.state.Duan.items.map((item, key) => (
                                        <TouchableOpacity key={key} onPress={() => this.props.navigation.push('Duan', item)}>
                                            <View style={{ width: windowWidth - 40, paddingBottom: 20 }}>
                                                <FastImage style={{ width: windowWidth - 40, height: windowWidth / 2, borderRadius: 10 }} source={{ uri: item.Img }} resizeMode={FastImage.resizeMode.cover} />
                                                <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginTop: 5 }} numberOfLines={1}>{item.Title}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                            </View>
                        </View>
                    </View>
                    {/*<View>
                        <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
                            <View style={{ paddingBottom: 15 }}>
                                <Text category="h5" style={{ fontFamily: 'MavenPro-Medium' }}>Xung quanh bạn đang đứng</Text>
                            </View>
                            <View>
                                <View style={{ width: windowWidth - 40, paddingBottom: 20 }}>
                                    <FastImage style={{ width: windowWidth - 40, height: windowWidth / 2, borderRadius: 10 }} source={{ uri: 'https://media.remax-dev.booj.io/33bc3bcd-2ab4-322f-af04-9120fbedfd46/01_NewListings.jpg' }} resizeMode={FastImage.resizeMode.cover} />
                                    <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15, marginTop: 5 }} numberOfLines={1}>$1,290 - 3,640</Text>
                                    <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 13, color: 'gray' }} numberOfLines={1}>1-4 Beds, 1-2 Baths</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name="pin" fill={appTheme['color-primary-500']} style={{ width: 14, height: 14 }} />
                                        <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 12, color: 'gray', flex: 1 }} numberOfLines={1}>20 Đổng Dậu, Phước Mỹ, Phan Rang - Tháp Chàm, Ninh Thuận</Text>
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
                            </View>
                        </View>
                    </View>*/}
                </ScrollView>
                <Modal isVisible={this.state.isVisible} style={styles.loadingModal} backdropOpacity={0}
                    animationIn="zoomIn" animationOut="zoomOut"
                    onBackButtonPress={() => this.setState({ isVisible: false })}
                    onBackdropPress={() => this.setState({ isVisible: false })}
                >
                    <View style={styles.mainModal}>
                        {this.state.provinces.map((item, key) => (
                            <View key={key}>
                                <TouchableOpacity onPress={() => this.setState({ isVisible: false, tinhchon: item.id, tinhtag: item.tag }, ()=>{this.getProvinceData(item.tag)})}>
                                    <View style={{
                                        flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 0, borderColor: 'red',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        //elevation: 1,
                                        backgroundColor: '#fff',
                                        padding: 10
                                    }}>
                                        <View style={{ paddingRight: 20 }}><Icon name={this.state.tinhchon == item.id ? "pin" : "pin-outline"} fill={appTheme['color-primary-500']} style={{ width: 24, height: 24 }} /></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: 'MavenPro-Medium', fontSize: 15 }} numberOfLines={1}>{item.name}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    loadingText: { fontFamily: appContain['fontMedium'], textAlign: 'center' },
    pb20: { paddingBottom: 20 },
    loadingModal: { padding: 20, margin: 20 },
    mainModal: { backgroundColor: appContain['whiteColor'], padding: 20, borderRadius: 10, borderWidth: 3, borderColor: appTheme['color-primary-600'] }
});