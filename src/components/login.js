import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, ImageBackground, ActivityIndicator } from 'react-native';
import { Text, Input, Button, Icon } from '@ui-kitten/components';
import Modal from 'react-native-modal';
import axios from 'axios';
import { default as appContain } from '../contain.json';
import { default as appTheme } from '../custom-theme.json';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

GoogleSignin.configure({
    //scopes: [], // what API you want to access on behalf of the user, default is email and profile
    webClientId: '147648914117-pckdq4vtidpk1b166u5554kd1sbjkie9.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //hostedDomain: '', // specifies a hosted domain restriction
    //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
    //forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
    //accountName: '', // [Android] specifies an account name on the device that should be used
    //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

export default class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isVisible: false,
            isSigninInProgress: false
        };
    }
    loginHandle = () => {
        //login button press
        this.setState({ isVisible: true });
        setTimeout(() => {
            this.setState({ isVisible: false });
        }, 3000)
    }
    facebookLoginHandle = () => {
        LoginManager.logInWithPermissions(['email']).then(
            function (result) {
                if (result.isCancelled) {
                    console.log('Login cancelled');
                } else {
                    console.log(
                        'Login success with permissions: ' +
                        result.grantedPermissions.toString(),
                    );
                    AccessToken.getCurrentAccessToken().then(data => {
                        console.log(data, data.accessToken.toString());
                        console.log('result-->', result);
                    });
                }
            },
            function (error) {
                console.log('Login fail with error: ' + error);
            },
        );
    }
    googleLoginHandle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('userInfo: ', userInfo)
            //this.setState({ userInfo });
        } catch (error) {
            console.log(error, error.code)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ImageBackground style={styles.bgImg} resizeMode={'cover'} source={require('../imgs/bgLogin.jpg')}>
                    <View style={styles.main}>
                        <View style={styles.submain}>
                            <View style={styles.fullWidth}>
                                <Text category='h4' style={styles.titleHeader}>Đăng nhập</Text>
                            </View>
                            <View style={styles.fullWidth}>
                                <Input textStyle={styles.inputForm} keyboardType="email-address" placeholder='Username' accessoryLeft={() => <Icon name="person-outline" fill="gray" style={styles.icon24} />} />
                            </View>
                            <View style={styles.fullWidth}>
                                <Input textStyle={styles.inputForm} placeholder='Password' secureTextEntry accessoryLeft={() => <Icon name="eye-off-outline" fill="gray" style={styles.icon24} />} />
                            </View>
                            <View style={styles.footerCard}>
                                <Button onPress={this.loginHandle}>
                                    <Text style={styles.loginText}>Đăng nhập</Text>
                                </Button>
                            </View>
                            <View style={styles.otherContainer}>
                                <Text style={styles.orText}>or</Text>
                            </View>
                            <View style={styles.otherContainer}>
                                <View style={styles.rowFlex}>
                                    <Button onPress={this.facebookLoginHandle} appearance='ghost' style={styles.facebookButton} accessoryLeft={() => (<Icon fill={appContain['facebookColor']} style={styles.icon24} name='facebook' />)}>
                                        <Text style={styles.facebookText}>Facebook</Text>
                                    </Button>
                                    <View style={{ width: 20 }} />
                                    <Button onPress={this.googleLoginHandle} appearance='ghost' style={styles.googleButton} accessoryLeft={() => (<Icon fill={appContain['googleColor']} style={styles.icon24} name='google' />)}>
                                        <Text style={styles.googleText}>Google</Text>
                                    </Button>
                                </View>
                                {/*<View>
                                    <GoogleSigninButton
                                        style={{ width: 192, height: 48 }}
                                        size={GoogleSigninButton.Size.Wide}
                                        color={GoogleSigninButton.Color.Dark}
                                        onPress={this._signIn}
                                        disabled={this.state.isSigninInProgress} />
                                </View>
                                <View>
                                    <LoginButton
                                        onLoginFinished={
                                            (error, result) => {
                                                if (error) {
                                                    console.log("login has error: " + result.error);
                                                } else if (result.isCancelled) {
                                                    console.log("login is cancelled.");
                                                } else {
                                                    AccessToken.getCurrentAccessToken().then(
                                                        (data) => {
                                                            console.log(data, data.accessToken.toString())
                                                        }
                                                    )
                                                }
                                            }
                                        }
                                        onLogoutFinished={() => console.log("logout.")} />
                                </View>*/}
                            </View>
                        </View>
                    </View>
                </ImageBackground>
                <Modal isVisible={this.state.isVisible} style={styles.loadingModal}>
                    <View style={styles.mainModal}>
                        <ActivityIndicator size='large' style={styles.pb20} color={appTheme['color-primary-500']} />
                        <Text style={styles.loadingText}>Loading...</Text>
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
    mainModal: { backgroundColor: appContain['whiteColor'], padding: 20, borderRadius: 10 },
    container: { flex: 1, backgroundColor: appContain['whiteColor'] },
    bgImg: { width: appContain['percent100'], height: appContain['percent100'] },
    main: {
        flex: 1,
        padding: 20,
        width: appContain['percent100'],
        alignSelf: appContain['center'],
        alignItems: appContain['center'],
        justifyContent: appContain['center']
    },
    submain: {
        width: appContain['percent100'], padding: 20, backgroundColor: appContain['whiteColor'], borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fullWidth: { width: appContain['percent100'] },
    titleHeader: { fontFamily: appContain['fontMedium'], textAlign: appContain['center'], marginBottom: 25 },
    inputForm: { fontSize: 13, fontFamily: appContain['fontRegular'] },
    icon24: { width: 24, height: 24 },
    footerCard: { width: appContain['percent100'], paddingVertical: 25 },
    loginText: { color: appContain['whiteColor'], fontFamily: appContain['fontBold'] },
    otherContainer: { width: appContain['percent100'], paddingTop: 25 },
    orText: { fontFamily: appContain['fontRegular'], textAlign: appContain['center'], fontStyle: 'italic' },
    rowFlex: { flexDirection: 'row' },
    facebookButton: { borderColor: appContain['facebookColor'], borderWidth: 0, flex: 1 },
    googleButton: { borderColor: appContain['googleColor'], borderWidth: 0, flex: 1 },
    facebookText: { color: appContain['facebookColor'], fontFamily: appContain['fontBold'] },
    googleText: { color: appContain['googleColor'], fontFamily: appContain['fontBold'] }
});