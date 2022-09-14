import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, useWindowDimensions, Keyboard } from 'react-native';

const OTPText = (props) => {

    const [pin1, setPin1] = useState('');
    const [pin2, setPin2] = useState('');
    const [pin3, setPin3] = useState('');
    const [pin4, setPin4] = useState('');
    const [pin5, setPin5] = useState('');

    const [otp, setOtp] = useState('');

    const pin1Ref = useRef();
    const pin2Ref = useRef();
    const pin3Ref = useRef();
    const pin4Ref = useRef();
    const pin5Ref = useRef();

    const { height, width } = useWindowDimensions();

    return (
        <View style={{ height: height * 0.07, flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TextInput
                style={styles.textBox}
                maxLength={1}
                onChangeText={(value) => {
                    setPin1(value);
                    if (value != "") {
                        pin2Ref.current.focus();
                    }
                }}
                ref={pin1Ref}
            />
            <TextInput
                style={styles.textBox}
                maxLength={1}
                onChangeText={(value) => {
                    setPin2(value);
                    if (value != "") {
                        pin3Ref.current.focus();
                    }
                }}
                ref={pin2Ref}
            />
            <TextInput
                style={styles.textBox}
                maxLength={1}
                onChangeText={(value) => {
                    setPin3(value);
                    if (value != "") {
                        pin4Ref.current.focus();
                    }
                }}
                ref={pin3Ref}
            />
            <TextInput
                style={styles.textBox}
                maxLength={1}
                onChangeText={(value) => {
                    setPin4(value);
                    if (value != "") {
                        pin5Ref.current.focus();
                    }
                }}
                ref={pin4Ref}
            />
            <TextInput
                style={styles.textBox}
                maxLength={1}
                onChangeText={(value) => {
                    setPin5(value);
                    if (value != "") {
                        let string = "";
                        let res = string.concat(pin1, pin2, pin3, pin4, value);
                        props.resetCode(res);
                        Keyboard.dismiss()
                    }
                }}
                ref={pin5Ref}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    textBox: {
        flex: 0.15,
        borderRadius: 8,
        backgroundColor: '#F2F1F7',
        fontSize: 22,
        alignItems: 'center',
        textAlign: 'center'
    }
})

export default OTPText;