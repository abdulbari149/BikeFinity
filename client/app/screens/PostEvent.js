import React, { useState } from 'react';
import { View, Text, Image, useWindowDimensions, FlatList, TouchableOpacity, StyleSheet, PermissionsAndroid, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import Axios from 'axios';
import DatePicker from 'react-native-date-picker'

import Input from '../components/Input';
import { BASE_URL, SECONDARY_COLOR, SECTEXT_COLOR } from '../config';
import Button from '../components/Button';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const DATA = [
    {
        id: 1,
        title: "Drag Racing",
        icon: require('../assets/events/bike-reveal.png')
    },
    {
        id: 2,
        title: "Night Ride",
        icon: require('../assets/events/night-ride.png')
    },
    {
        id: 3,
        title: "Auto Show",
        icon: require('../assets/events/calendar.png')
    },
    {
        id: 4,
        title: "DGR",
        icon: require('../assets/events/awareness.png')
    },
    {
        id: 5,
        title: "Bike Reveal",
        icon: require('../assets/events/bike-reveal.png')
    },
    {
        id: 6,
        title: "Awareness Campaign",
        icon: require('../assets/events/night-ride.png')
    },
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <View style={{ flex: 0.6, flexDirection: 'row' }}>
            <View style={{ flex: 0.1 }} />
            <View style={{ flex: 0.8, alignItems: 'center' }}>
                <Image source={item.icon} style={{ flex: 1 }} resizeMode='center' />
            </View>
            <View style={{ flex: 0.1 }} />
        </View>
        <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.title, textColor]}>{item.title}</Text>
        </View>
    </TouchableOpacity>
);

const PostEvent = () => {

    const { width, height } = useWindowDimensions()

    const { token } = useSelector(state => state.auth);

    const navigation = useNavigation();

    const [type, setType] = useState('')
    const [title, setTitle] = useState('')
    const [venue, setVenue] = useState('')
    const [description, setDescription] = useState('')
    const [picture, setPicture] = useState('');
    const [imageData, setImageData] = useState();
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);

    //error states
    const [emptyType, setEmptyType] = useState()
    const [emptyTitle, setEmptyTitle] = useState()
    const [emptyVenue, setEmptyVenue] = useState()
    const [emptyDescription, setEmptyDescription] = useState()

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs to access photo gallery permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    const pickFromGallery = async () => {

        const isGranted = await requestExternalWritePermission();
        if (isGranted) {
            ImagePicker.openPicker({
                width: 820,
                height: 462,
                cropping: true,
                multiple: false
            }).then(data => {
                const uri = data.path;
                const type = data.mime;
                const name = "bikefinity/" + data.modificationDate;
                const image = {
                    uri,
                    type,
                    name,
                };
                console.log(uri, image)
                setPicture(uri);
                setImageData(image);
            }).catch(error => {
                console.log(error)
            })
        }
    };

    const checkInputField = (fieldName) => {
        if (fieldName === 'title') {
            if (title.length === 0) {
                setEmptyTitle(true)
            }
        }
        else if (fieldName === 'venue') {
            if (venue.length === 0) {
                setEmptyVenue(true)
            }
        }
        else if (fieldName === 'description') {
            if (description.length === 0) {
                setEmptyDescription(true)
            }
        }
    }

    const postImage = () => {
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
                postEvent(url)
            })
            .catch((err) => {
                console.log('An error has occured while uploading the image.', err);
                setLoading(false)
            });
    }

    const postEvent = (url) => {
        console.log("here", url)
        Axios.post(`${BASE_URL}/bikefinity/event/postEvent`,
            {
                type: type,
                title: title,
                venue: venue,
                date: date,
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
                        'Event Posted Successfully'
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
        checkInputField('title');
        checkInputField('venue');
        // checkInputField('year');
        checkInputField('description');
        if (emptyTitle === false && emptyVenue === false && emptyDescription === false) {
            setLoading(true);
            postImage();
        }
    }

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? SECONDARY_COLOR : "#FFFFFF";
        const color = item.id === selectedId ? 'white' : SECONDARY_COLOR;

        return (
            <Item
                item={item}
                onPress={() => { setSelectedId(item.id), setType(item.title) }}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    return (
        <KeyboardAwareScrollView style={{ padding: 15, backgroundColor: 'white' }} enableOnAndroid extraHeight={150}>
            <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
            <View style={{ height: height * 0.1 }}>
                <Text style={{ fontSize: 24, color: 'black', fontWeight: '600' }}>Post your Event</Text>
                <Text style={{ color: SECTEXT_COLOR }}>Host your event with us</Text>
            </View>
            <View style={{ height: height * 0.2 }}>
                <View style={{ flex: 0.2 }}>
                    <Text style={{ color: 'black' }}>Choose Event Type</Text>
                </View>
                <View style={{ flex: 0.8 }}>
                    <FlatList
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        extraData={selectedId}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
            <View style={{ height: height * 0.12 }}>
                <View style={{ flex: 0.4, justifyContent: 'center' }}>
                    <Text style={{ color: 'black' }}>Title</Text>
                </View>
                <View style={{ flex: 0.4 }}>
                    <Input
                        name="Enter Title"
                        value={title}
                        onChange={
                            (value) => {
                                setEmptyTitle(false);
                                setTitle(value)
                            }
                        }
                        onBlur={
                            () => {
                                checkInputField('title')
                            }
                        }
                    />
                </View>
                <View style={{ flex: 0.2, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    {emptyTitle ? <Text style={styles.errorLabel}>Title cannot be empty!</Text> : null}
                </View>
            </View>
            <View style={{ height: height * 0.12 }}>
                <View style={{ flex: 0.4, justifyContent: 'center' }}>
                    <Text style={{ color: 'black' }}>Venue</Text>
                </View>
                <View style={{ flex: 0.4 }}>
                    <Input
                        name="Enter Venue"
                        value={venue}
                        onChange={
                            (value) => {
                                setEmptyVenue(false);
                                setVenue(value)
                            }
                        }
                        onBlur={
                            () => {
                                checkInputField('venue')
                            }
                        }
                    />
                </View>
                <View style={{ flex: 0.2, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    {emptyVenue ? <Text style={styles.errorLabel}>Venue cannot be empty!</Text> : null}
                </View>
            </View>
            <View style={{ height: height * 0.12 }}>
                <View style={{ flex: 0.2, justifyContent: 'center' }}>
                    <Text style={{ color: 'black' }}>Date and Time</Text>
                </View>
                <View style={{ flex: 0.6 }}>
                    <TouchableOpacity style={{ flex: 1, borderBottomWidth: 1, justifyContent: 'center' }} onPress={() => setOpen(true)}>
                        <Text style={{ color: 'black' }}>{moment(date).format('MMMM Do YYYY,\t hh:mm a')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.2 }}>

                </View>
            </View>
            <View style={{ height: height * 0.32 }}>
                <View style={{ flex: 0.15, justifyContent: 'center' }}>
                    <Text style={{ color: 'black' }}>Description</Text>
                </View>
                <View style={{ flex: 0.61 }}>
                    <Input
                        name="Enter Description"
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
                <View style={{ flex: 0.24, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                    {emptyDescription ? <Text style={styles.errorLabel}>Description cannot be empty!</Text> : null}
                </View>
            </View>
            <View style={{ height: height * 0.3 }}>
                <View style={{ flex: 0.2 }}>
                    <Text style={{ color: 'black' }}>Image ( Poster / Banner )</Text>
                </View>
                {
                    picture !== '' ? (
                        <View style={{ flex: 0.8, backgroundColor: '#FFFFFF', borderRadius: 12, justifyContent: 'center' }}>
                            <Image source={{ uri: picture }} style={{ flex: 1, borderRadius: 12 }} resizeMode='center' />
                        </View>
                    ) : (
                        <View style={{ flex: 0.8, backgroundColor: '#F6F6F6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ flex: 0.2, backgroundColor: '#0096FF', width: '50%', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }} onPress={pickFromGallery}>
                                <Text style={{ color: 'white' }}>Upload Image</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>

            <View style={{ height: height * 0.15, justifyContent: 'center' }}>
                <TouchableOpacity onPress={onClickPost}>
                    <Button name={"Post"} loading={loading} />
                </TouchableOpacity>
            </View>

        </KeyboardAwareScrollView >
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 5,
        marginVertical: 8,
        marginHorizontal: 12,
        borderRadius: 15,
        width: 90,
        height: 90,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 4,
    },
    title: {
        fontSize: 10,
        textAlign: 'center'
    },
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

export default PostEvent;