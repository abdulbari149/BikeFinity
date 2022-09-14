import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import { LogOut } from '../redux/actions/authAction';

const Profile = () => {

    const dispatch = useDispatch()

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: 'white' }}>
            <View style={{ flex: 0.3, marginTop: 20, flexDirection: 'row' }}>
                <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <Avatar rounded icon={{ name: 'home' }} size="xlarge" /> */}
                    <Avatar
                        rounded
                        size={100}
                        overlayContainerStyle={{ backgroundColor: '#011627' }}
                        icon={{ name: 'person', color: 'white', type: 'materialicons' }}
                    />
                </View>
                <View style={{ flex: 0.6, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>Alishan Nadeem</Text>
                </View>
            </View>
            <View style={{ flex: 0.5 }}>

            </View>
            <View style={{ flex: 0.2, justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => dispatch(LogOut())}>
                    <Button name={'Logout'} outlined />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Profile;
