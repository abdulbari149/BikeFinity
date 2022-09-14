import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';

import Axios from 'axios';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Input from '../components/Input';
import Button from '../components/Button';
import { LogIn } from '../redux/actions/authAction';
import { BASE_URL, SECONDARY_COLOR } from '../config';

const Login = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emptyEmail, setEmptyEmail] = useState();
  const [emptyPassword, setEmptyPassword] = useState();
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [isEmail, setIsEmail] = useState();
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail("");
    setPassword("");
    setEmptyEmail();
    setEmptyPassword();
    setIsEmail();
    setLoading(false);
  }

  const loginUser = () => {
    Axios.post(`${BASE_URL}/bikefinity/auth/login`,
      {
        email: email,
        password: password
      })
      .then((res) => {
        if (res.data.status === 404) {
          setLoading(false);
          Alert.alert(
            'Error!',
            'User doesnot exists. Signup to continue.'
          )
        }
        else if (res.data.status === 401) {
          setIncorrectPassword(true);
          setLoading(false);
          setPassword("");
        }
        else if (res.status === 200) {
          setLoading(false);
          const token = res.data.token;
          const expiry = res.data.expiry;
          const userId = res.data.userId;
          const user = res.data.user;
          dispatch(LogIn(token, expiry, userId, user));
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
  }

  const onClickLogin = () => {
    setIncorrectPassword(false);
    checkInputField('email');
    checkInputField('password');
    if (emptyEmail === false && emptyPassword === false && isEmail && incorrectPassword === false) {
      setLoading(true);
      loginUser();
    }
  }

  const onChangeEmail = (value) => {
    setEmptyEmail(false);
    setEmail(value);
    checkEmail(value);
  };

  const onChangePassword = (value) => {
    setEmptyPassword(false);
    setIncorrectPassword(false);
    setPassword(value);
  };

  const checkInputField = (fieldName) => {
    if (fieldName === 'email') {
      if (email.length === 0) {
        setIsEmail()
        setEmptyEmail(true)
      }
    }
    else if (fieldName === 'password') {
      if (password.length === 0) {
        setIncorrectPassword(false)
        setEmptyPassword(true)
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
    <KeyboardAwareScrollView style={{ flex: 1, padding: 20, backgroundColor: 'white' }} enableOnAndroid extraHeight={150}>
      <View style={{ height: 130, alignItems: 'center', justifyContent: 'center' }}>
        <View>
          <Image source={require('../assets/logos/black-logo-1x.png')} />
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 30, color: 'black', fontWeight: 'bold' }}>Login</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ color: 'black' }}>If you don't have an account register.</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <Text style={{ color: 'black' }}>You can </Text>
        <TouchableOpacity
          onPress={
            () => {
              navigation.navigate('Signup')
              reset()
            }
          }>
          <Text style={{ color: '#CA054D' }}>Register here !</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 40 }}>
        <Text style={{ color: 'black' }}>Email</Text>
        <View style={{ marginTop: 5 }}>
          <Input
            name="Enter your Email"
            icon="alternate-email"
            type="email-address"
            autoCapitalize="none"
            value={email}
            onChange={onChangeEmail}
            onBlur={
              () => {
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
          {incorrectPassword ? <Text style={[styles.errorLabel, { color: '#dc3545' }]}>Incorrect Password</Text> : null}
        </View>
      </View>
      <View style={{ marginTop: 5, alignItems: 'flex-end', justifyContent: 'center' }}>
        <Text style={{ fontSize: 12, color: SECONDARY_COLOR }} onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password?</Text>
      </View>
      <View style={{ marginTop: 20, height: 60, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: '80%' }}>
          <TouchableOpacity onPress={onClickLogin} disabled={loading ? true : false}>
            <Button name="Login" loading={loading} />
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

export default Login;