import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import Axios from 'axios';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import Input from '../components/Input';
import Button from '../components/Button';
import { BASE_URL } from '../config';

const Signup = () => {

  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [location, setLocation] = useState("");
  const [emptyName, setEmptyName] = useState();
  const [emptyEmail, setEmptyEmail] = useState();
  const [emptyNumber, setEmptyNumber] = useState();
  const [emptyLocation, setEmptyLocation] = useState();
  const [isEmail, setIsEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setNumber("");
    setLocation("");
    setEmptyName();
    setEmptyEmail();
    setEmptyNumber();
    setEmptyLocation();
    setIsEmail();
    setLoading(false);
}

  //this function will check if the user exist or not using email.
  const checkUser = () => {
    Axios.get(`${BASE_URL}/bikefinity/auth/checkUser/${email}`)
      .then((res) => {
        setLoading(false);
        if (res.data.status === true) {
          Alert.alert(
            'Error!',
            'Email already exists. Try to login or try another email.'
          )
        }
        else {
          navigation.navigate("Password", {
            name: name,
            email: email,
            number: number,
            location: location
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const onClickNext = () => {
    if (testing) {
      navigation.navigate("Password", {
        name: name,
        email: email,
        number: number,
        location: location
      });
    } else {
      checkInputField('name');
      checkInputField('email');
      checkInputField('number');
      checkInputField('location');
      if (emptyName === false && emptyEmail === false && emptyNumber === false && emptyLocation === false && isEmail) {
        setLoading(true);
        checkUser();
      }
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
      if (number.length === 0) {
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
    <KeyboardAwareScrollView style={{ flex: 1, padding: 20, backgroundColor: 'white' }} enableOnAndroid extraHeight={150}>
      <View style={{ height: 130, alignItems: 'center', justifyContent: 'center' }}>
        <View>
          <Image source={require('../assets/logos/black-logo-1x.png')} />
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 30, color: 'black', fontWeight: 'bold' }}>Sign up</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ color: 'black' }}>If you already have an account register.</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <Text style={{ color: 'black' }}>You can </Text>
        <TouchableOpacity
          onPress={() => navigation.pop()}>
          <Text style={{ color: '#CA054D' }}>Login here !</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 40 }}>
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
      <View>
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
      <View>
        <Text style={{ color: 'black' }}>Number</Text>
        <View style={{ marginTop: 5 }}>
          <Input
            name="Enter your Number"
            icon="phone"
            type="numeric"
            defaultValue="+92"
            value={number}
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
      <View>
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
      <View style={{ marginTop: 10, height: 60, alignItems: 'flex-end', justifyContent: 'center' }}>
        <View style={{ width: '40%' }}>
          <TouchableOpacity onPress={onClickNext} disabled={loading ? true : false}>
            <Button name="Next" loading={loading} />
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

export default Signup;