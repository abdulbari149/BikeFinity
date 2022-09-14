import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Password from '../screens/Password';
import ForgotPassword from '../screens/ForgotPassword';
import ConfirmationCode from '../screens/ConfirmationCode';
import UpdatePassword from '../screens/UpdatePassword';

const Stack = createStackNavigator();

const AuthNavigation = () => {

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
                    elevation: 5,
                },
            }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Password" component={Password} options={{ headerShown: true, headerTitle: "" }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true, headerTitle: "" }} />
            <Stack.Screen name="ConfirmationCode" component={ConfirmationCode} options={{ headerShown: true, headerTitle: "" }} />
            <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{
                headerShown: true, headerTitle: "", headerLeft: null, headerStyle: null
            }} />
        </Stack.Navigator>
    );
}

export default AuthNavigation;