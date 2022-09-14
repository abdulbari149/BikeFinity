import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';
import moment from 'moment';
import { BASE_URL, SECTEXT_COLOR } from '../config';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';

const Search = () => {

    const { token, userId } = useSelector(state => state.auth);
    const navigation = useNavigation();

    const [data, setData] = useState([]);

    const onChange = (value) => {
        Axios.post(`${BASE_URL}/bikefinity/user/search`, {
            title: value
        })
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
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

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 8 }}>
            <View style={{ flex: 0.1, justifyContent: 'center', backgroundColor: 'white' }}>
                <Input
                    name="Enter your text..."
                    icon="search"
                    onChange={onChange}
                />
            </View>
            <View style={{ flex: 0.9, paddingHorizontal: 5 }}>
                <FlatList
                    keyExtractor={(item) => item._id}
                    data={data}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={{flexGrow: 1, backgroundColor: '#F6F6F6'}}
                />
            </View>
        </View>
    )
}

export default Search;