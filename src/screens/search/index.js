import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, StatusBar, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Icon, Input } from '@ui-kitten/components';
import { default as appTheme } from '../../custom-theme.json';

export default class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translucent: 0.2,
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
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: StatusBar.currentHeight }}>
                <View style={{
                    backgroundColor: '#fff', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: StyleSheet.hairlineWidth
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 56 }}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="arrow-back-outline" fill={'gray'} style={{ width: 24, height: 24 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, marginRight: 20, alignItems: 'center' }}>
                            <Input style={{ marginBottom: -5 }} placeholder="Tìm kiếm" placeholderTextColor='grey' textStyle={{ fontSize: 15, fontFamily: 'MavenPro-Regular' }} accessoryRight={() => <Icon name="search" fill="grey" style={{ width: 20, height: 20 }} />} />
                        </View>
                    </View>
                </View>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}></ScrollView>
            </SafeAreaView>
        )
    }
}