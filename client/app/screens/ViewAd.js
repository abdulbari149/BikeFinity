import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons'; // have to change the name of object
import Button from "../components/Button";

import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from "react-redux";
import Axios from "axios";

import { BASE_URL, PRIMARY_COLOR, SECONDARY_COLOR } from "../config";
import DetailCard from "../components/DetailCard";
import { StatusBar } from "react-native";

//need to loading app loader on start then ad fetched set to false
const ViewAd = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const { token, userId } = useSelector(state => state.auth);

    const [ad, setAd] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        getAd()
    }, [])

    const getAd = () => {
        Axios.get(`${BASE_URL}/bikefinity/user/getAd/${route.params.id}`)
            .then((res) => {
                setAd(res.data);
                setIsLoaded(true);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const likeAd = () => {
        Axios.post(`${BASE_URL}/bikefinity/user/likeAd`, {
            id: ad._id
        }, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                getAd()
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

    const unlikeAd = () => {
        Axios.post(`${BASE_URL}/bikefinity/user/unlikeAd`, {
            id: ad._id
        }, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                getAd()
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
        isLoaded ?
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar translucent={false} />
                <View style={{ flex: 0.3 }}>
                    <Image source={{ uri: ad.image }} style={{ height: '100%', width: '100%' }} resizeMode='contain' />
                </View>
                <View style={{ flex: 0.15, margin: 10 }}>
                    <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0.8 }}>
                            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Rs. {ad.price}</Text>
                        </View>
                        <View style={{ flex: 0.2, alignItems: 'flex-end', }}>
                            {
                                ad.likedBy.length > 0 ? (
                                    ad.likedBy.includes(userId) ? (
                                        <Icon name='heart' size={24} color={SECONDARY_COLOR} onPress={unlikeAd} />
                                    ) : (
                                        <Icon name='heart-outline' size={24} color='black' onPress={likeAd} />
                                    )
                                ) :
                                    (
                                        <Icon name='heart-outline' size={24} color='black' onPress={likeAd} />
                                    )
                            }

                        </View>
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 18 }}>{ad.title}</Text>
                    </View>
                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.08, alignItems: 'center' }}>
                                <MIcon name="location-pin" size={16} />
                            </View>
                            <View style={{ flex: 0.7 }}>
                                <Text>{ad.location}</Text>
                            </View>
                            <View style={{ flex: 0.22, alignItems: 'center' }}>
                                <Text>10/12/2021</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 0.48, padding: 10 }}>
                    <View style={{ flex: 0.25 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ backgroundColor: "#FFFFFF", padding: 5 }}>
                            <DetailCard title={"Year"} value={ad.year} />
                            <DetailCard title={"Model"} value={ad.model} />
                            <DetailCard title={"Make"} value={ad.make} />
                            <DetailCard title={"Engine"} value={ad.engine + ' CC'} />
                            <DetailCard title={"Kilometers"} value={ad.kilometers} />
                            <DetailCard title={"Condition"} value={ad.condition} />
                        </ScrollView>
                    </View>
                    <View style={{ flex: 0.7 }}>
                        <View style={{ flex: 0.2, justifyContent: 'center' }}>
                            <Text style={{ color: 'black', fontSize: 15, fontWeight: '600' }}>Description</Text>
                        </View>
                        <View style={{ flex: 0.8 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={{ color: 'black', textAlign: 'justify' }}>{ad.description}</Text>
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 0.07, flexDirection: 'row' }}>
                    <View style={{ flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#011627', width: '90%', height: 40, borderRadius: 5 }} onPress={() => Linking.openURL(`tel:${'0' + ad.postedBy.contactNumber}`)}>
                            <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name="phone" color='white' size={22} />
                            </View>
                            <View style={{ flex: 0.75, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>Call</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ flex: 0.5, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#011627', width: '90%', height: 40, borderRadius: 5, justifyContent: 'center' }}>
                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                <Icon name="message" color='white' size={22} />
                            </View>
                            <View style={{ flex: 0.7, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>SMS</Text>
                            </View>
                        </View>
                    </View> */}
                </View>
            </View> :
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color='#CA054D' />
            </View>
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        marginVertical: 15
    },
    label: {
        color: 'black',
        fontSize: 15,
    }
})

export default ViewAd;