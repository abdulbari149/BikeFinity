import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import Axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';

import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Input from '../components/Input';
import Button from '../components/Button';
import { BASE_URL } from '../config';

const PostAd = () => {

  const { token } = useSelector(state => state.auth);

  const navigation = useNavigation();

  const [adTitle, setAdTitle] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("2022");
  const [make, setMake] = useState("");
  const [engine, setEngine] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [condition, setCondition] = useState("New");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState();
  const [imageData, setImageData] = useState();
  const [selectedImage, setSelectedImage] = React.useState(false);

  //errors state
  const [emptyAdTitle, setEmptyAdTitle] = useState();
  const [emptyPrice, setEmptyPrice] = useState();
  const [emptyEngine, setEmptyEngine] = useState();
  const [emptyKilometers, setEmptyKilometers] = useState();
  const [emptyLocation, setEmptyLocation] = useState();
  const [emptyDescription, setEmptyDescription] = useState();

  const [loading, setLoading] = useState(false);

  const currentYear = (new Date()).getFullYear();
  const years = Array.from(new Array(43), (val, index) => currentYear - index);

  const postImages = () => {
    const data = new FormData();
    data.append('file', imageData);
    data.append('upload_preset', 'bikefinity');
    data.append('cloud_name', 'dl28pe0lw');

    fetch('https://api.cloudinary.com/v1_1/dl28pe0lw/image/upload', {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const url = data.url
        postAd(url)
      })
      .catch((err) => {
        console.log('An error has occured while uploading the image.', err);
      });
  }

  const postAd = (url) => {
    console.log("post", url)
    console.log("token", token)
    Axios.post(`${BASE_URL}/bikefinity/user/postAd`,
      {
        title: adTitle,
        price: price,
        year: year,
        engine: engine,
        kilometers: kilometers,
        condition: condition,
        location: location,
        description: description,
        image: url
      }, {
      headers: {
        'x-access-token': token
      }
    })
      .then((res) => {
        if (res.status === 200) {
          Alert.alert(
            'Success!',
            'Ad Posted Successfully'
          )
          navigation.navigate('MyTabs')
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
      })
  }

  const onClickPost = () => {
    checkInputField('adTitle');
    checkInputField('price');
    checkInputField('year');
    checkInputField('engine');
    checkInputField('kilometers');
    checkInputField('location');
    checkInputField('description');
    if (emptyAdTitle === false && emptyPrice === false && emptyEngine === false
      && emptyKilometers === false && emptyDescription === false && emptyLocation === false) {
      setLoading(true);
      postImages();
    }
  }

  const checkInputField = (fieldName) => {
    if (fieldName === 'adTitle') {
      if (adTitle.length === 0) {
        setEmptyAdTitle(true)
      }
    }
    else if (fieldName === 'price') {
      if (price.length === 0) {
        setEmptyPrice(true)
      }
    }
    else if (fieldName === 'year') {
      if (year.length === 0) {
        setEmptyYear(true)
      }
    }
    else if (fieldName === 'engine') {
      if (engine.length === 0) {
        setEmptyEngine(true)
      }
    }
    else if (fieldName === 'kilometers') {
      if (kilometers.length === 0) {
        setEmptyKilometers(true)
      }
    }
    else if (fieldName === 'location') {
      if (location.length === 0) {
        setEmptyLocation(true)
      }
    }
    else if (fieldName === 'description') {
      if (description.length === 0) {
        setEmptyDescription(true)
      }
    }
  }

  return (
    <KeyboardAwareScrollView style={{ flex: 1, padding: 15, backgroundColor: 'white' }} enableOnAndroid extraHeight={150}>
      <View>
        <Text style={{ fontSize: 30, color: 'black', fontWeight: 'bold' }}>Post your Ad</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ color: 'black' }}>Make sure the information your are providing must be valid.</Text>
      </View>
      <View style={{ marginTop: 30 }}>
        <Text style={{ color: 'black' }}>Ad Title</Text>
        <View style={{ marginTop: 5 }}>
          <Input
            name="Enter Title of Ad"
            value={adTitle}
            onChange={
              (value) => {
                setEmptyAdTitle(false);
                setAdTitle(value)
              }
            }
            onBlur={
              () => {
                checkInputField('adTitle')
              }
            }
          />
        </View>
        <View style={styles.errorContainer}>
          {emptyAdTitle ? <Text style={styles.errorLabel}>Title cannot be empty!</Text> : null}
          {adTitle.length > 55 ? <Text style={styles.errorLabel}>Title could not exceed 55 characters.</Text> : null}
        </View>
      </View>
      <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 0.45 }}>
          <Text style={{ color: 'black' }}>Price</Text>
          <View style={{ marginTop: 5 }}>
            <Input
              name="Enter price"
              value={price}
              type="numeric"
              onChange={
                (value) => {
                  setEmptyPrice(false);
                  setPrice(value)
                }
              }
              onBlur={
                () => {
                  checkInputField('price')
                }
              }
            />
          </View>
          <View style={styles.errorContainer}>
            {emptyPrice ? <Text style={styles.errorLabel}>Price cannot be empty!</Text> : null}
          </View>
        </View>
        <View style={{ flex: 0.45 }}>
          <Text style={{ color: 'black' }}>Year</Text>
          <View style={{ marginTop: 5 }}>
            <Picker
              mode="dropdown"
              selectedValue={year}
              onValueChange={(itemValue, itemIndex) =>
                setYear(itemValue)
              }>
              {
                years.map((year, index) => {
                  return (<Picker.Item label={year.toString()} value={year} key={index} />);
                })
              }
            </Picker>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 0.45 }}>
          <Text style={{ color: 'black' }}>Engine</Text>
          <View style={{ marginTop: 5 }}>
            <Input
              name="Enter CC"
              value={engine}
              type="numeric"
              onChange={
                (value) => {
                  setEmptyEngine(false);
                  setEngine(value)
                }
              }
              onBlur={
                () => {
                  checkInputField('engine')
                }
              }
            />
          </View>
          <View style={styles.errorContainer}>
            {emptyEngine ? <Text style={styles.errorLabel}>Engine cannot be empty!</Text> : null}
            {isNaN(engine) ? <Text style={styles.errorLabel}>Only numbers will accept</Text> : null}
          </View>
        </View>
        <View style={{ flex: 0.45 }}>
          <Text style={{ color: 'black' }}>Kilometers</Text>
          <View style={{ marginTop: 5 }}>
            <Input
              name="Enter kilometers"
              value={kilometers}
              type="numeric"
              onChange={
                (value) => {
                  setEmptyKilometers(false);
                  setKilometers(value)
                }
              }
              onBlur={
                () => {
                  checkInputField('kilometers')
                }
              }
            />
          </View>
          <View style={styles.errorContainer}>
            {emptyKilometers ? <Text style={styles.errorLabel}>Kms cannot be empty!</Text> : null}
            {isNaN(kilometers) ? <Text style={styles.errorLabel}>Only numbers will accept</Text> : null}
          </View>
        </View>
      </View>
      <View style={{ marginTop: 5 }}>
        <Text style={{ color: 'black' }}>Condition</Text>
        <View style={{ marginTop: 5 }}>
          <RadioButton.Group onValueChange={newValue => setCondition(newValue)} value={condition}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 0.45, flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ color: 'black' }}>New</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <RadioButton value="New" color='#CA054D' uncheckedColor='black' />
                </View>
              </View>
              <View style={{ flex: 0.45, flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ color: 'black' }}>Used</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <RadioButton value="Used" color='#CA054D' uncheckedColor='black' />
                </View>
              </View>
            </View>
          </RadioButton.Group>
        </View>
      </View>
      <View style={{ marginTop: 25 }}>
        <Text style={{ color: 'black' }}>Location</Text>
        <View style={{ marginTop: 5 }}>
          <Input
            name="Enter Location"
            value={location}
            onChange={
              (value) => {
                setEmptyLocation(false);
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
      <View style={{ marginTop: 5 }}>
        <Text style={{ color: 'black' }}>Description</Text>
        <View style={{ marginTop: 5 }}>
          <Input
            name="Write description of your ad"
            value={description}
            multiline={true}
            numberOfLines={6}
            onChange={
              (value) => {
                setEmptyDescription(false);
                setDescription(value)
              }
            }
            onBlur={
              () => {
                checkInputField('description')
              }
            }
          />
        </View>
        <View style={styles.errorContainer}>
          {emptyDescription ? <Text style={styles.errorLabel}>Description cannot be empty!</Text> : null}
        </View>
      </View>
      <View style={{ marginTop: 5 }}>
        <Text style={{ color: 'black' }}>Choose Image</Text>
        <View style={{ alignItems: 'center' }}>
          <View style={{ marginTop: 15, height: 300, width: 300, borderRadius: 10 }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => {
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true,
                  multiple: false
                }).then(data => {
                  const uri = data.path;
                  const type = data.mime;
                  const name = "bikefinity/ads/" + data.modificationDate;
                  const image = {
                    uri,
                    type,
                    name,
                  };
                  setImage(uri)
                  setImageData(image)
                  setSelectedImage(true)
                }).catch(error => {
                  console.log(error)
                })
              }}
            >
              <View>
                {
                  selectedImage ?
                    <Image source={{ uri: image }} style={{ width: 300, height: 300, borderRadius: 0 }} resizeMode='contain' /> :
                    <Text>Choose Images</Text>
                }
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
      <View style={{ marginTop: 10, height: 60, alignItems: 'flex-end', justifyContent: 'center' }}>
        <View style={{ width: '40%' }}>
          <TouchableOpacity onPress={onClickPost} disabled={loading ? true : false}>
            <Button name="Post" loading={loading} />
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
    fontSize: 11,
  },
});

export default PostAd;