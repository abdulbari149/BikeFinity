import React, { useState } from 'react';
import { View, Text, Image, useWindowDimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Axios from 'axios';
import Button from '../components/Button';
import Input from '../components/Input';
import OTPText from '../components/OTPText';
import { BASE_URL, SECTEXT_COLOR } from '../config';
import { useNavigation, useRoute } from '@react-navigation/native';

const ConfirmationCode = () => {

    const route = useRoute()
    const navigation = useNavigation()

    const { width, height } = useWindowDimensions();

    const [resetCode, setResetCode] = useState('');
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');
    const [emptyResetCode, setEmptyResetCode] = useState(false);

    const checkInputField = (fieldName) => {
        if (fieldName === 'resetCode') {
            if (resetCode.length === 0) {
                setError('')
                setEmptyResetCode(true)
            } else {
                setEmptyResetCode(false)
            }
        }
    }

    const onClickVerify = () => {
        checkInputField('resetCode')

        if (emptyResetCode === false) {
            setLoading(true)
            verifyCode()
        }
    }

    const verifyCode = () => {
        Axios.post(`${BASE_URL}/bikefinity/auth/verifyOTP`, {
            email: route.params.email,
            resetCode: resetCode
        })
            .then((res) => {
                if (res.data.statusCode === 1) {
                    setLoading(false)
                    navigation.navigate('UpdatePassword', {
                        email: route.params.email
                    })
                } else {
                    setError(res.data.message)
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    return (
        <KeyboardAwareScrollView style={{ padding: 20, backgroundColor: 'white', minHeight: height }} enableOnAndroid extraHeight={150}>
            <View style={{ height: height * 0.1 }}>
                <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>Verification</Text>
                <Text style={{ color: SECTEXT_COLOR }}>Enter OTP code sent to your email.</Text>
            </View>
            <View style={{ height: height * 0.4 }}>
                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.6, flexDirection: 'row' }} >
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }} >
                        <Image source={require('../assets/auth/forgot-password/Verify-Icon-3x.png')} style={{ flex: 1 }} resizeMode='center' />
                    </View>
                    <View style={{ flex: 0.2 }} />
                </View>
                <View style={{ flex: 0.2 }} />
            </View>
            <View style={{ height: height * 0.2 }}>
                <View style={{ flex: 0.4 }}>
                    <OTPText resetCode={(value) => setResetCode(value)} />
                </View>
                <View style={{ flex: 0.6 }}>
                    <View style={styles.errorContainer}>
                        {emptyResetCode ? <Text style={styles.errorLabel}>Please fill the reset code.</Text> : null}
                        {error !== '' ? <Text style={styles.errorLabel}>{error}</Text> : null}
                    </View>
                </View>
            </View>
            <View style={{ height: height * 0.3 }}>
                <TouchableOpacity onPress={onClickVerify}>
                    <Button name="Verify" loading={loading} />
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

export default ConfirmationCode