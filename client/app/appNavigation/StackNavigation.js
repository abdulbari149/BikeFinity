import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigation from './BottomTabNavigation';
import PostAd from '../screens/PostAd';
import ViewAd from '../screens/ViewAd';
import ViewReview from '../screens/ViewReview';
import { useNavigation } from '@react-navigation/native';
import EditProfile from '../screens/EditProfile';
import { SECONDARY_COLOR } from '../config';
import PostEvent from '../screens/PostEvent';
import EventList from '../screens/EventList';
import ViewEvent from '../screens/ViewEvent';
import Search from '../screens/Search';

const Stack = createStackNavigator();

const StackNavigation = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                }
            }}>
            <Stack.Screen name="MyTabs" component={BottomTabNavigation}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.toggleDrawer()}>
                            <Icon name='menu' size={28} color={SECONDARY_COLOR} />
                        </TouchableOpacity>
                    ),
                    headerTitle: () => (
                        <Image source={require('../assets/logos/text-logo-1x.png')} />
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate('Search')}>
                            <Icon name='search' size={28} color={SECONDARY_COLOR} />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: true, headerTitle: "Edit Profile" }} />
            <Stack.Screen name="PostAd" component={PostAd} options={{ headerShown: true, headerTitle: "Marketplace" }} />
            <Stack.Screen name="EventList" component={EventList} options={{ headerShown: true, headerTitle: "" }} />
            <Stack.Screen name="PostEvent" component={PostEvent} options={{ headerShown: true, headerTitle: "Events" }} />
            <Stack.Screen name="ViewEvent" component={ViewEvent} options={{ headerShown: true, headerTitle: "", headerTransparent: true }} />
            <Stack.Screen name="ViewAd" component={ViewAd} options={{ headerShown: true, headerTitle: "", headerTransparent: true }} />
            <Stack.Screen name="ViewReview" component={ViewReview} options={{ headerShown: true, headerTitle: "", headerTransparent: true }} />
            <Stack.Screen name="Search" component={Search} options={{ headerShown: true, headerTitle: "" }} />
        </Stack.Navigator>
    );
}

export default StackNavigation;