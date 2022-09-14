import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import Axios from 'axios';
import Button from '../components/Button';
import Input from '../components/Input';
import { BASE_URL, SECTEXT_COLOR } from '../config';

const UpdatePassword = () => {

    const { width, height } = useWindowDimensions()

    const navigation = useNavigation()
    const route = useRoute()

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [emptyPassword, setEmptyPassword] = useState();
    const [emptyConfirmPassword, setEmptyConfirmPassword] = useState();
    const [isMatched, setIsMatched] = useState();

    const onChangePassword = (value) => {
        setEmptyPassword(false);
        setPassword(value);
    };

    const onChangeConfirmPassword = (value) => {
        setEmptyConfirmPassword(false);
        setConfirmPassword(value);
        checkPasswordMatch(value);
    };

    const checkInputField = (fieldName) => {
        if (fieldName === "password") {
            if (password.length === 0) {
                setEmptyPassword(true)
            }
        }
        else if (fieldName === "confirmPassword") {
            if (confirmPassword.length === 0) {
                setIsMatched()
                setEmptyConfirmPassword(true)
            }
        }
    }

    const checkPasswordMatch = (confirmPassword) => {
        if (password.length > 0) {
            if (confirmPassword === password) {
                setIsMatched(true);
            }
            else {
                setIsMatched(false);
            }
        } else {
            setIsMatched();
        }
    }

    const onClickResetPassword = () => {
        checkInputField('password');
        checkInputField('confirmPassword');
        if (emptyPassword === false && emptyConfirmPassword === false && isMatched) {
            setLoading(true);
            updatePassword();
        }
    }

    const updatePassword = () => {
        Axios.post(`${BASE_URL}/bikefinity/auth/updatePassword`, {
            email: route.params.email,
            password: password
        }).then((res) => {
            if (res.status === 200) {
                if (res.data.statusCode === 1) {
                    console.log(res.data)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    })
                } else {

                }
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }

    return (
        <KeyboardAwareScrollView style={{ padding: 20, backgroundColor: 'white', minHeight: height }} enableOnAndroid extraHeight={150}>
            <View style={{ height: height * 0.1 }}>
                <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>Reset Password</Text>
                <Text style={{ color: SECTEXT_COLOR }}>Choose strong password</Text>
            </View>
            <View style={{ height: height * 0.3, justifyContent: 'space-evenly' }}>
                <View>
                    <Text style={{ color: 'black' }}>Password</Text>
                    <View style={{ marginTop: 5 }}>
                        <Input
                            name="Enter your Password"
                            icon="lock"
                            secureTextEntry={true}
                            value={password}
                            onChange={onChangePassword}
                            onBlur={
                                () => {
                                    checkInputField('password')
                                }
                            }
                        />
                    </View>
                    <View style={styles.errorContainer}>
                        {emptyPassword ? <Text style={styles.errorLabel}>Password cannot be empty!</Text> : null}
                    </View>
                </View>
                <View>
                    <Text style={{ color: 'black' }}>Confirm Password</Text>
                    <View style={{ marginTop: 5 }}>
                        <Input
                            name="Confirm your Password"
                            icon="lock-clock"
                            secureTextEntry={true}
                            value={confirmPassword}
                            onChange={onChangeConfirmPassword}
                            onBlur={
                                () => {
                                    checkInputField('confirmPassword')
                                }
                            }
                        />
                    </View>
                    <View style={styles.errorContainer}>
                        {
                            isMatched === true ?
                                <Text style={[styles.errorLabel, { color: '#28a745' }]}>Password matched.</Text>
                                :
                                isMatched === false ?
                                    <Text style={styles.errorLabel}>Password doesn't match.</Text>
                                    : null
                        }
                        {emptyConfirmPassword ? <Text style={styles.errorLabel}>Password cannot be empty!</Text> : null}
                    </View>
                </View>
            </View>
            <View style={{ height: height * 0.1 }} />
            <View style={{ height: height * 0.4 }}>
                <TouchableOpacity onPress={onClickResetPassword}>
                    <Button name="Reset Password" loading={loading} />
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

export default UpdatePassword;