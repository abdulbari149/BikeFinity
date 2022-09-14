import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Axios from 'axios';
const moment = require('moment');

import { BASE_URL, SECONDARY_COLOR, SECTEXT_COLOR } from '../config';

const EventList = () => {

    const route = useRoute();
    const navigation = useNavigation();

    const [events, setEvents] = useState([]);

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        console.log(route.params.title)
        getEventsByCategory()
    }, [])

    const getEventsByCategory = () => {
        Axios.get(`${BASE_URL}/bikefinity/event/getEventsByType?type=${route.params.title}`)
            .then((res) => {
                if (res.status === 200) {
                    setEvents(res.data)
                }
                setLoaded(true)
            })
            .catch((err) => {
                console.log(err)
                setLoaded(true)
            })
    }

    const renderItems = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginVertical: 8,
                    borderRadius: 15,
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    height: 80,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    elevation: 4,
                }}
                onPress={() => navigation.navigate('ViewEvent', {
                    id: item._id
                })}>
                <View style={{ flex: 0.5, flexDirection: 'row' }}>
                    <View style={{ flex: 0.7, justifyContent: 'center', paddingHorizontal: 10 }}>
                        <Text style={{ color: 'black', fontWeight: '500' }} numberOfLines={2}>{item.title}</Text>
                    </View>
                </View>
                <View style={{ flex: 0.5, justifyContent: 'center', flexDirection: 'row' }}>
                    <View style={{ flex: 0.6, flexDirection: 'row' }}>
                        <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../assets/events/location.png')} style={{ height: 15, width: 15 }} resizeMode='center' />
                        </View>
                        <View style={{ flex: 0.85, justifyContent: 'center' }}>
                            <Text style={{ color: SECTEXT_COLOR, fontSize: 12 }}>{item.venue}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.4, flexDirection: 'row' }}>
                        <View style={{ flex: 0.25, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../assets/events/calendar.png')} style={{ height: 15, width: 15 }} resizeMode='center' />
                        </View>
                        <View style={{ flex: 0.75, justifyContent: 'center' }}>
                            <Text style={{ color: SECTEXT_COLOR, fontSize: 12 }}>{moment(item.date).format('DD / MMM / YYYY')}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 15 }}>
            <View style={{ flex: 0.1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, color: 'black', fontWeight: '600' }}>Events</Text>
            </View>
            <View style={{ flex: 0.1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 26, color: SECONDARY_COLOR, fontWeight: 'bold' }}>{route.params.title}</Text>
            </View>
            <View style={{ flex: 0.8 }}>
                {
                    loaded ? (
                        events.length > 0 ? (
                            <FlatList
                                data={events}
                                renderItem={renderItems}
                                keyExtractor={(item) => item._id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ padding: 5 }}
                            />
                        ) : (
                            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Oops! No Events Found</Text>
                            </View>
                        )
                    ) : (
                        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color='#CA054D' />
                        </View>
                    )
                }

            </View>
        </View>
    )
}

export default EventList;