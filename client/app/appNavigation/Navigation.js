import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import StackNavigation from './StackNavigation';
import AuthNavigation from './AuthNavigation';
import RNBootSplash from "react-native-bootsplash";
import { LogOut } from '../redux/actions/authAction';

import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import DrawerNavigation from './DrawerNavigation';

const Navigation = () => {

    const dispatch = useDispatch();
    const { loggedIn, expiry } = useSelector(state => state.auth);

    useEffect(() => {
        if (expiry !== null) {
            if (expiry * 1000 < Date.now()) {
                Alert.alert("Token Expired", "Please Login again to continue.",
                    [
                        {
                            text: "OK",
                            onPress: () => { dispatch(LogOut()) }
                        }
                    ]);
            }
        }
    }, [])

    return (
        <NavigationContainer onReady={() => RNBootSplash.hide()}>
            {
                // loggedIn === true ? <StackNavigation /> : loggedIn === false ? <AuthNavigation /> : null
                loggedIn === true ? <DrawerNavigation /> : loggedIn === false ? <AuthNavigation /> : null

                // <AuthNavigation />   
            }
        </NavigationContainer>
    );
};

export default Navigation;