import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import LoginComponent from '../../components/login';
import axios from 'axios';

export default class AddScreen extends Component {
    constructor(props) {
        super(props);
    }
    /*componentDidMount() {
        axios.get('', {
            headers: {
                Authorization: 'Bearer ' + token //the token is a variable which holds the token
            }
        })
    }*/
    render() {
        return (
            <>
                <StatusBar translucent backgroundColor={'transparent'} />
                <LoginComponent />
            </>
        )
    }
}