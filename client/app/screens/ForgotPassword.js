import { useNavigation } from "@react-navigation/native";
import Axios from "axios";
import React, { useState } from "react";
import { View, Text, useWindowDimensions, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../components/Button";
import Input from "../components/Input";
import { BASE_URL, SECTEXT_COLOR } from "../config";

const ForgotPassword = () => {

    const { width, height } = useWindowDimensions();

    const navigation = useNavigation()

    const [email, setEmail] = useState('');

    const [error, setError] = useState('');
    const [isEmail, setIsEmail] = useState();
    const [emptyEmail, setEmptyEmail] = useState();

    const [loading, setLoading] = useState(false);

    const onChangeEmail = (value) => {
        setEmptyEmail(false);
        setError('');
        setEmail(value);
        checkEmail(value);
    };

    const checkInputField = (fieldName) => {
        if (fieldName === 'email') {
            if (email.length === 0) {
                setIsEmail()
                setEmptyEmail(true)
            }
        }
    }

    const checkEmail = (email) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (email.length > 0) {
            if (reg.test(email) === false) {
                setEmptyEmail(false)
                setIsEmail(false)
            }
            else {
                setIsEmail(true)
            }
        }
    }

    const onClickContinue = () => {

        checkInputField('email');

        if (emptyEmail === false && isEmail) {
            setLoading(true);
            resetPassword();
        }
    }

    const resetPassword = () => {
        Axios.post(`${BASE_URL}/bikefinity/auth/resetPassword`, { email })
            .then((res) => {
                if (res.data.statusCode === 1) {
                    navigation.navigate('ConfirmationCode', {
                        email: email
                    })
                } else {
                    setError(res.data.message)
                }
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    return (
        <KeyboardAwareScrollView style={{ padding: 20, backgroundColor: 'white', minHeight: height }} enableOnAndroid extraHeight={150}>
            <View style={{ height: height * 0.1 }}>
                <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>Oops! Forgot Password?</Text>
                <Text style={{ color: SECTEXT_COLOR }}>No problem, we are here to assist you.</Text>
            </View>
            <View style={{ height: height * 0.4 }}>
                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.6, flexDirection: 'row' }} >
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }} >
                        <Image source={require('../assets/auth/forgot-password/Reset-Password-3x.png')} style={{ flex: 1 }} resizeMode='center' />
                    </View>
                    <View style={{ flex: 0.2 }} />
                </View>
                <View style={{ flex: 0.2 }} />
            </View>
            <View style={{ height: height * 0.2 }}>
                <Input
                    name="Enter your Email"
                    icon="alternate-email"
                    type="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChange={onChangeEmail}
                // onBlur={
                //     () => {
                //         // setIsEmail()
                //         checkInputField('email')
                //     }
                // }
                />
                <View style={styles.errorContainer}>
                    {isEmail === false ? <Text style={styles.errorLabel}>Enter valid email address.</Text> : null}
                    {emptyEmail ? <Text style={styles.errorLabel}>Email cannot be empty!</Text> : null}
                    {error !== '' ? <Text style={styles.errorLabel}>{error}</Text> : null}
                </View>
            </View>
            <View style={{ height: height * 0.3 }}>
                <TouchableOpacity onPress={onClickContinue}>
                    <Button name="Continue" loading={loading} />
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    errorContainer: {
        marginTop: 3,
        height: 17,
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    errorLabel: {
        color: '#f39c12', //danger color: #dc3545
        fontSize: 12.5,
    },
});

export default ForgotPassword;