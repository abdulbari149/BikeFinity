import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { FAB } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import Axios from 'axios';
const moment = require('moment')

import { BASE_URL, PRIMARY_COLOR, SECTEXT_COLOR } from "../config";

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

const Events = () => {

    const navigation = useNavigation();
    const isFocused = useIsFocused()

    const { width, height } = useWindowDimensions();

    const [events, setEvents] = useState([]);

    const [listEnded, setListEnded] = useState(false);

    useEffect(() => {
        getEvents()
    }, [isFocused])

    const getEvents = () => {
        Axios.get(`${BASE_URL}/bikefinity/event/getEvents`)
            .then((res) => {
                if (res.status === 200) {
                    setEvents(res.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const renderItems = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{
                    padding: 5,
                    marginVertical: 8,
                    marginHorizontal: 12,
                    borderRadius: 15,
                    backgroundColor: '#FFFFFF',
                    width: 80,
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
                onPress={() => navigation.navigate('EventList', {
                    title: item.title
                })}>
                <View style={{ flex: 0.6 }}>
                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={item.icon} style={{ flex: 1 }} resizeMode='center' />
                    </View>
                </View>
                <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{
                        fontSize: 10,
                        textAlign: 'center',
                        color: SECTEXT_COLOR
                    }}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderUpcomingEventsItems = ({ item, index }) => {
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
                        <Text style={{ color: 'black', fontWeight: '500' }} numberOfLines={1}>{item.title}</Text>
                    </View>
                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 12 }}>{item.type}</Text>
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

    const renderTrendingEventsItems = ({ item, index }) => {
        return (/*  */
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#ccd0d4', '#ffffff']} style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginHorizontal: 18,
                borderRadius: 15,
                backgroundColor: '#67737d',
                width: width * 0.7,
                height: '100%',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,
                elevation: 4,
            }}>

                <TouchableOpacity
                    activeOpacity={0.8} style={{ flex: 1 }}
                    onPress={() => navigation.navigate('ViewEvent', {
                        id: item._id
                    })}>
                    <View style={{ flex: 0.6, flexDirection: 'row' }}>
                        <Image source={{ uri: item.image }} style={{ height: '100%', width: '100%' }} resizeMode='contain' />
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{ flex: 0.7, justifyContent: 'center' }}>
                            <Text style={{ color: PRIMARY_COLOR, fontSize: 14, fontWeight: '500', lineHeight: 20 }} numberOfLines={2}>{item.title}</Text>
                        </View>
                        <View style={{ flex: 0.3 }}>
                            <View style={{ flex: 0.3, alignItems: 'center' }}>
                                <Text style={{ color: PRIMARY_COLOR, fontSize: 10 }}>Interested</Text>
                            </View>
                            <View style={{ flex: 0.7, alignItems: 'center' }}>
                                <Text style={{ color: PRIMARY_COLOR, fontSize: 22, fontWeight: '600' }}>{item.interested.length}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </LinearGradient >
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 10 }}>
            <View style={{ flex: 0.3 }}>
                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, color: PRIMARY_COLOR, fontWeight: '600' }}>Trending Events</Text>
                </View>
                <View style={{ flex: 0.7 }}>
                    <FlatList
                        data={events}
                        renderItem={renderTrendingEventsItems}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ padding: 5 }}
                    />
                </View>
            </View>
            <View style={{ flex: 0.2 }}>
                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, color: PRIMARY_COLOR, fontWeight: '600' }}>Event Category</Text>
                </View>
                <View style={{ flex: 0.7 }}>
                    <FlatList
                        data={DATA}
                        renderItem={renderItems}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

            </View>
            <View style={{ flex: 0.5 }}>
                <View style={{ flex: 0.2, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, color: PRIMARY_COLOR, fontWeight: '600' }}>Upcoming Events</Text>
                </View>
                <View style={{ flex: 0.8, flexDirection: 'row' }}>
                    <FlatList
                        data={
                            events.filter((item) => {
                                let one_week_later = moment().add(7, 'days')

                                let temp = new Date(one_week_later)
                                let temp1 = new Date(item.date)

                                return temp1 <= temp
                            })
                        }
                        renderItem={renderUpcomingEventsItems}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 5 }}
                        onEndReached={() => setListEnded(true)}
                        onScroll={() => setListEnded(false)}
                    />
                </View>
            </View>
            {
                listEnded ? null : (
                    <FAB
                        style={styles.fab}
                        small
                        label="Host Event"
                        icon="pen"
                        color="white"
                        onPress={() => {
                            navigation.navigate("PostEvent");
                        }}
                    />
                )
            }
        </View >
    );
};

const styles = new StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
        backgroundColor: '#011627',
    },
})

export default Events;