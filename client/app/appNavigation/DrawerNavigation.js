import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import Axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Events from '../screens/Events';
import StackNavigation from './StackNavigation';
import { BASE_URL, PRIMARY_COLOR, SECONDARY_COLOR } from '../config';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from '../redux/actions/authAction';
import { Avatar } from 'react-native-elements';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false, drawerType: 'front', drawerActiveTintColor: SECONDARY_COLOR, unmountOnBlur: true
            }}
            defaultStatus="closed"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen name="Main" component={StackNavigation} />
        </Drawer.Navigator>
    );
};

const CustomDrawerContent = (props) => {

    const { height, width } = useWindowDimensions()
    const dispatch = useDispatch()
    const { user, token } = useSelector(state => state.auth)

    const [reviewCount, setReviewCount] = useState(0);
    const [adsCount, setAdsCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);
    const [likedAdsCount, setLikedAdsCount] = useState(0);
    const [interestedEventsCount, setInterestedEventsCount] = useState(0);

    useEffect(() => {
        Axios.get(`${BASE_URL}/bikefinity/user/stats`, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                setReviewCount(res.data.reviewCount)
                setAdsCount(res.data.adsCount)
                setEventsCount(res.data.eventsCount)
                setLikedAdsCount(res.data.likedAdsCount)
                setInterestedEventsCount(res.data.interestedEventsCount)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0, height: height }}>
            <View style={{ flex: 1, paddingHorizontal: 5 }}>
                <View style={{ flex: 0.4 }}>
                    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Avatar
                            rounded
                            size={120}
                            source={{ uri: user.profilePicture }}
                        />
                        <TouchableOpacity style={{ height: 20, width: 20, backgroundColor: '#e885a9', borderRadius: 10, position: 'absolute', left: 160, bottom: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => props.navigation.navigate('EditProfile')}>
                            <Icon name='pencil' color={'#FFFFFF'} size={14} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>{user.name}</Text>
                        <Text style={{ fontSize: 12 }}>{user.email}</Text>
                    </View>
                </View>
                <View style={{ flex: 0.5 }}>
                    <View style={{ flex: 0.3, flexDirection: 'row' }}>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{reviewCount}</Text>
                            <Text style={{ fontSize: 12, color: 'black' }}>Total Reviews</Text>
                        </View>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{adsCount}</Text>
                            <Text style={{ fontSize: 12, color: 'black' }}>Total Ads</Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.3, flexDirection: 'row' }}>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{eventsCount}</Text>
                            <Text style={{ fontSize: 12, color: 'black' }}>Total Events</Text>
                        </View>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{likedAdsCount}</Text>
                            <Text style={{ fontSize: 12, color: 'black' }}>Total Liked Ads</Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.3, flexDirection: 'row' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{interestedEventsCount}</Text>
                            <Text style={{ fontSize: 12, color: 'black' }}>Interested Events</Text>
                        </View>
                    </View>

                </View>
                {/* <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}> */}
                {/* <Text style={{ fontSize: 16, color: SECONDARY_COLOR }}>CREATE YOUR COMMUNITY</Text> */}
                {/* </View> */}
                <View style={{ flex: 0.1, justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => dispatch(LogOut())}>
                        <Button name={'Logout'} outlined />
                    </TouchableOpacity>
                </View>
            </View>
        </DrawerContentScrollView>
    )
}

export default DrawerNavigation;