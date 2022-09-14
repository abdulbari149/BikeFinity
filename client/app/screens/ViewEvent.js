import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import Axios from 'axios';
const moment = require('moment')

import { BASE_URL, PRIMARY_COLOR, SECTEXT_COLOR } from '../config';
import { useSelector } from 'react-redux';

const ViewEvent = () => {

    const route = useRoute()

    const { token, userId } = useSelector(state => state.auth);

    const [event, setEvent] = useState()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        getEvent()
    }, [])

    const getEvent = () => {
        Axios.get(`${BASE_URL}/bikefinity/event/getEventById/${route.params.id}`)
            .then((res) => {
                if (res.status === 200) {
                    setEvent(res.data)
                }
                setLoaded(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const interestedEvent = () => {
        Axios.post(`${BASE_URL}/bikefinity/event/interestedEvent`, {
            id: event._id
        }, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                getEvent()
            })
            .catch((error) => {
                let err = error.toJSON();
                if (err.status === 500) {
                    console.log("Token Expired. Login again.")
                } else if (err.status === 401) {
                    console.log("No Token Provided.")
                } else {
                    console.log(err);
                }
            })
    }

    const notInterestedEvent = () => {
        Axios.post(`${BASE_URL}/bikefinity/event/notInterestedEvent`, {
            id: event._id
        }, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                getEvent()
            })
            .catch((error) => {
                let err = error.toJSON();
                if (err.status === 500) {
                    console.log("Token Expired. Login again.")
                } else if (err.status === 401) {
                    console.log("No Token Provided.")
                } else {
                    console.log(err);
                }
            })
    }

    return (
        loaded ? (
            <View style={{ flex: 1, backgroundColor: 'white' }} >
                <StatusBar translucent={false} />
                <View style={{ flex: 0.3 }}>
                    <Image source={{ uri: event.image }} style={{ height: '100%', width: '100%' }} resizeMode='contain' />
                </View>
                <View style={{ flex: 0.7, paddingHorizontal: 15, paddingBottom: 15 }}>
                    <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: PRIMARY_COLOR, fontSize: 26, fontWeight: '600' }}>{event.title}</Text>
                    </View>
                    <View style={{ flex: 0.1, alignItems: "flex-end", justifyContent: 'center' }}>
                        {
                            event.interested.length > 0 ? (
                                event.interested.includes(userId) ? (
                                    <TouchableOpacity style={{ flex: 0.7, width: '40%', borderColor: '#007FFF', borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#007FFF' }} onPress={notInterestedEvent}>
                                        <Text style={{ color: '#FFFFFF' }}>Interested</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={{ flex: 0.7, width: '40%', borderColor: '#007FFF', borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={interestedEvent}>
                                        <Text style={{ color: '#007FFF' }}>Interested</Text>
                                    </TouchableOpacity>
                                )
                            ) :
                                (
                                    <TouchableOpacity style={{ flex: 0.7, width: '40%', borderColor: '#007FFF', borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={interestedEvent}>
                                        <Text style={{ color: '#007FFF' }}>Interested</Text>
                                    </TouchableOpacity>
                                )
                        }

                    </View>
                    <View style={{ flex: 0.2, justifyContent: 'center' }}>
                        <View style={{ flex: 0.5, flexDirection: 'row' }}>
                            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../assets/events/location.png')} style={{ height: 20, width: 20 }} resizeMode='center' />
                            </View>
                            <View style={{ flex: 0.8, justifyContent: 'center' }}>
                                <Text style={{ color: 'black', fontWeight: '500' }} ƒ>{event.venue}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 0.5, flexDirection: 'row' }}>
                            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../assets/events/calendar.png')} style={{ height: 20, width: 20 }} resizeMode='center' />
                            </View>
                            <View style={{ flex: 0.8, justifyContent: 'center' }}>
                                <Text style={{ color: 'black', fontWeight: '500' }}>{moment(event.date).calendar()}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 0.5 }}>
                        <View style={{ flex: 0.2, justifyContent: 'center' }}>
                            <Text style={{ color: 'black', fontWeight: '500' }}>Description</Text>
                        </View>
                        <View style={{ flex: 0.8 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={{ color: SECTEXT_COLOR, textAlign: 'justify', lineHeight: 22 }}>{event.description}</Text>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View >
        ) : (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color='#CA054D' />
            </View>
        )
    )
}

export default ViewEvent;