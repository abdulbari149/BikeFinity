import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import Button from '../components/Button';
import Input from '../components/Input';
import { UpdateUser } from '../redux/actions/authAction';
import Axios from 'axios';
import { BASE_URL } from '../config';

const EditProfile = () => {

    const dispatch = useDispatch()
    const { user, token } = useSelector(state => state.auth)
    const { width, height } = useWindowDimensions()
    const navigation = useNavigation()

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [location, setLocation] = useState("");

    //error states
    const [emptyName, setEmptyName] = useState(false);
    const [emptyEmail, setEmptyEmail] = useState(false);
    const [emptyNumber, setEmptyNumber] = useState(false);
    const [emptyLocation, setEmptyLocation] = useState(false);
    const [isEmail, setIsEmail] = useState(true);

    const [loading, setLoading] = useState();

    useEffect(() => {
        setName(user.name)
        setEmail(user.email)
        setContactNumber('0' + user.contactNumber.toString())
        setLocation(user.location)
    }, [])

    const onClickSave = () => {
        checkInputField('name');
        checkInputField('email');
        checkInputField('number');
        checkInputField('location');

        if (emptyName === false && emptyEmail === false && emptyNumber === false && emptyLocation === false && isEmail) {
            setLoading(true);
            Axios.post(`${BASE_URL}/bikefinity/user/updateProfile`,
                {
                    name: name,
                    email: email,
                    contactNumber: contactNumber,
                    location: location,
                    // image: url
                }, {
                headers: {
                    'x-access-token': token
                }
            })
                .then((res) => {
                    dispatch(UpdateUser(res.data))
                    setLoading(false)
                    navigation.goBack()
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const checkInputField = (fieldName) => {
        if (fieldName === 'name') {
            if (name.length === 0) {
                setEmptyName(true)
            }
        }
        else if (fieldName === 'email') {
            if (email.length === 0) {
                setIsEmail()
                setEmptyEmail(true)
            }
        }
        else if (fieldName === 'number') {
            if (contactNumber.length === 0) {
                setEmptyNumber(true)
            }
        }
        else if (fieldName === 'location') {
            if (location.length === 0) {
                setEmptyLocation(true)
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

    return (
        <KeyboardAwareScrollView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: 'white', minHeight: height }} enableOnAndroid extraHeight={150}>
            <View style={{ height: height * 0.2, justifyContent: 'center', alignItems: 'center' }}>
                <Avatar
                    rounded
                    size={120}
                    source={{ uri: user.profilePicture }}
                />
            </View>
            <View style={{ height: height * 0.15 }}>
                <Text style={{ color: 'black' }}>Name</Text>
                <View style={{ marginTop: 5 }}>
                    <Input
                        name="Enter your Name"
                        icon="person"
                        value={name}
                        onChange={
                            (value) => {
                                setEmptyName(false);
                                setName(value)
                            }
                        }
                        onBlur={
                            () => {
                                checkInputField('name')
                            }
                        }
                    />
                </View>
                <View style={styles.errorContainer}>
                    {emptyName ? <Text style={styles.errorLabel}>Name cannot be empty!</Text> : null}
                </View>
            </View>
            <View style={{ height: height * 0.15 }}>
                <Text style={{ color: 'black' }}>Email</Text>
                <View style={{ marginTop: 5 }}>
                    <Input
                        name="Enter your Email"
                        icon="alternate-email"
                        type="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChange={
                            (value) => {
                                setEmail(value)
                                checkEmail(value)
                            }
                        }
                        onBlur={
                            () => {
                                // setIsEmail()
                                checkInputField('email')
                            }
                        }
                    />
                </View>
                <View style={styles.errorContainer}>
                    {isEmail === false ? <Text style={styles.errorLabel}>Enter valid email address.</Text> : null}
                    {emptyEmail ? <Text style={styles.errorLabel}>Email cannot be empty!</Text> : null}
                </View>
            </View>
            <View style={{ height: height * 0.15 }}>
                <Text style={{ color: 'black' }}>Number</Text>
                <View style={{ marginTop: 5 }}>
                    <Input
                        name="Enter your Number"
                        icon="phone"
                        type="numeric"
                        defaultValue="+92"
                        value={contactNumber}
                        onChange={
                            (value) => {
                                setEmptyNumber(false)
                                setNumber(value)
                            }
                        }
                        onBlur={
                            () => {
                                checkInputField('number')
                            }
                        }
                    />
                </View>
                <View style={styles.errorContainer}>
                    {emptyNumber ? <Text style={styles.errorLabel}>Number cannot be empty!</Text> : null}
                </View>
            </View>
            <View style={{ height: height * 0.15 }}>
                <View>
                    <Text style={{ color: 'black' }}>Location</Text>
                </View>
                <View style={{ marginTop: 5 }}>
                    <Input
                        name="Enter your Location"
                        icon="my-location"
                        value={location}
                        onChange={
                            (value) => {
                                setEmptyLocation(false)
                                setLocation(value)
                            }
                        }
                        onBlur={
                            () => {
                                checkInputField('location')
                            }
                        }
                    />
                </View>
                <View style={styles.errorContainer}>
                    {emptyLocation ? <Text style={styles.errorLabel}>Location cannot be empty!</Text> : null}
                </View>
            </View>
            <View style={{ height: height * 0.15, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <View style={{ flex: 0.4 }}>
                    <TouchableOpacity onPress={onClickSave}>
                        <Button name={'Save'} loading={loading} />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

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

export default EditProfile;
