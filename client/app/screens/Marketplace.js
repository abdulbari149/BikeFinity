import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper';
import moment from 'moment';

import Axios from 'axios';

import { useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { BASE_URL, PRIMARY_COLOR, SECONDARY_COLOR } from "../config";

const Marketplace = () => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { token, userId } = useSelector(state => state.auth);

    const [refreshing, setRefreshing] = useState(false);
    const [onEndReached, setOnEndReached] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getAds();
    }, [page]);

    const getAds = () => {
        Axios.get(`${BASE_URL}/bikefinity/user/getAds?page=${page}`, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                const ads = res.data;
                setData(data.concat(ads));
                setOnEndReached(false);
                setRefreshing(false);
                setIsLoaded(true);
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

    const whileOnEndReached = () => {
        setOnEndReached(true);
        setPage(page + 1);
    }

    const whileOnRefreshing = () => {
        setRefreshing(true);
        getAds();
    }

    const onClickAd = (id) => {
        navigation.navigate('ViewAd', {
            id: id
        });
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={{ borderRadius: 8, flexDirection: 'column', width: '48%', backgroundColor: 'white', margin: 4, height: 350, padding: 5 }}
            onPress={() => {
                onClickAd(item._id)
            }}
            // delayPressIn={80}
            activeOpacity={1}
        >
            <View style={{ flex: 0.5 }}>
                <Image source={{ uri: item.image }} style={{ height: '100%', width: '100%' }} resizeMode='stretch' />
            </View>
            <View style={{ flex: 0.5, padding: 5 }}>
                <View style={{ flex: 0.2, flexDirection: 'row' }}>
                    <View style={{ flex: 0.8 }}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>Rs. {item.price}</Text>
                    </View>
                    <View style={{ flex: 0.2, alignItems: 'center' }}>
                        {
                            item.likedBy ?
                                (
                                    item.likedBy.includes(userId) ? (
                                        <Icon name='heart' size={20} color={SECONDARY_COLOR} />
                                    ) : (
                                        <Icon name='heart-outline' size={20} color='black' />
                                    )
                                ) :
                                (
                                    <Icon name='heart-outline' size={20} color='black' />
                                )
                        }
                    </View>
                </View>
                <View style={{ flex: 0.5, }}>
                    <Text style={{ color: 'black', fontSize: 16 }}>{item.title}</Text>
                </View>
                <View style={{ flex: 0.15, justifyContent: 'center' }}>
                    <Text style={{ color: 'grey', fontSize: 12 }}>{item.year} | {item.location}</Text>
                </View>
                <View style={{ flex: 0.15, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Text style={{ color: 'grey', fontSize: 12 }}>{moment(item.postDate).format('DD/MM/YYYY')}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        return (
            <View style={styles.footer}>
                {onEndReached ? (
                    <ActivityIndicator
                        size={30}
                        color='#CA054D'
                        style={{ marginLeft: 8 }} />
                ) : null}
            </View>
        );
    };

    return (
        isLoaded ?
            <View style={{ flex: 1, alignItems: 'space-around' }}>
                <FlatList
                    keyExtractor={(item) => item._id}
                    data={data}
                    renderItem={renderItem}
                    numColumns={2}
                    refreshing={refreshing}
                    onRefresh={whileOnRefreshing}
                    ListFooterComponent={renderFooter}
                    onEndReached={whileOnEndReached}
                    onEndReachedThreshold={0.5}
                />
                <FAB
                    style={styles.fab}
                    small
                    label="Post Ad"
                    icon="pen"
                    color="white"
                    onPress={() => {
                        navigation.navigate("PostAd");
                    }}
                />
            </View> :
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color='#CA054D' />
            </View>
    );
};

const styles = new StyleSheet.create({
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
        backgroundColor: '#011627',
    },
})

export default Marketplace;