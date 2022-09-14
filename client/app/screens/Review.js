import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import StarRating from 'react-native-star-rating';

import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import Axios from 'axios';

import { BASE_URL, PRIMARY_COLOR, SECONDARY_COLOR, STAR_COLOR } from '../config';
import Button from '../components/Button';

const Review = () => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { height, width } = useWindowDimensions();

    const [make, setMake] = useState([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [bikeDetails, setBikeDetails] = useState([]);
    const [bikeId, setBikeId] = useState("");
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    //errors state
    const [emptyMake, setEmptyMake] = useState();
    const [emptyModel, setEmptyModel] = useState();

    useEffect(() => {
        getBikeMake();
        getTopRatedBikes();
    }, [isFocused]);

    const getBikeMake = () => {
        Axios.get(`${BASE_URL}/bikefinity/bike/make`)
            .then((res) => {
                setMake(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    //getting bike details according to make
    const getBikeDetails = (value) => {
        Axios.get(`${BASE_URL}/bikefinity/bike/model/${value}`)
            .then((res) => {
                // console.log(res.data)
                setBikeDetails(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const getTopRatedBikes = () => {
        Axios.get(`${BASE_URL}/bikefinity/bike/topRatedBikes`)
            .then((res) => {
                setData(res.data);
                setDataIsLoaded(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const onClickGo = (id) => {
        // setLoading(true);
        navigation.navigate('ViewReview', {
            id: id
        });
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={{ borderRadius: 8, flex: 1, flexDirection: 'column', width: width / 2.6, backgroundColor: 'white', margin: 4, padding: 5 }}
            onPress={() => {
                onClickGo(item._id)
            }}
            // delayPressIn={80}
            activeOpacity={1}
        >
            <View style={{ flex: 0.6 }}>
                <Image source={{ uri: `${item.image}` }} style={{ flex: 1, width: '100%' }} resizeMode='cover' />
            </View>
            <View style={{ flex: 0.4, padding: 5, justifyContent: 'space-evenly' }}>
                <Text style={{ color: 'black' }}>{item.make}</Text>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>{item.model}</Text>
                <View style={{ width: '70%' }}>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={item.averageRating}
                        starSize={18}
                        emptyStarColor={STAR_COLOR}
                        fullStarColor={STAR_COLOR}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 15 }}>
            <View style={{ flex: 0.1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 30, color: 'black', fontWeight: 'bold' }}>Reviews</Text>
            </View>
            <View style={{ flex: 0.5, justifyContent: 'space-evenly' }}>
                <View>
                    <Text style={{ color: 'black' }}>Make</Text>
                    <View style={{ marginTop: 5, borderBottomWidth: 1 }}>
                        <Picker
                            mode="dialog"
                            selectedValue={selectedMake}
                            onValueChange={(itemValue, itemIndex) => {
                                if (itemIndex === 0) {
                                    setEmptyMake(true);
                                    setSelectedMake("");
                                    setSelectedModel("");
                                    setBikeDetails([]);
                                    setBikeId("");
                                } else {
                                    setBikeDetails([]);
                                    setBikeId("");
                                    setSelectedMake(itemValue);
                                    getBikeDetails(itemValue);
                                    setEmptyMake(false);
                                }
                            }}
                        >
                            <Picker.Item label='Select Make' value="" />
                            {
                                make.map((make, index) => {
                                    return (<Picker.Item label={make} value={make} key={index} />);
                                })
                            }
                        </Picker>
                    </View>
                    <View style={styles.errorContainer}>
                        {emptyMake ? <Text style={styles.errorLabel}>Please select make!</Text> : null}
                    </View>
                </View>
                <View style={{ marginTop: 5 }}>
                    <Text style={{ color: 'black' }}>Model</Text>
                    <View style={{ marginTop: 5, borderBottomWidth: 1 }}>
                        <Picker
                            mode="dialog"
                            selectedValue={selectedModel}
                            onValueChange={(itemValue, itemIndex) => {
                                if (itemIndex === 0) {
                                    setEmptyModel(true);
                                    setSelectedModel("");
                                    setBikeId("");
                                } else {
                                    setSelectedModel(itemValue);
                                    setBikeId(bikeDetails[itemIndex - 1]._id)
                                    setEmptyModel(false);
                                }
                            }}
                        >
                            <Picker.Item label='Select Model' value="" />
                            {
                                bikeDetails.map((bike, index) => {
                                    return (<Picker.Item label={bike.model} value={bike.model} key={index} />);
                                })
                            }
                        </Picker>
                    </View>
                    <View style={styles.errorContainer}>
                        {emptyModel ? <Text style={styles.errorLabel}>Please select model!</Text> : null}
                    </View>
                </View>
                <View style={{ marginTop: 5, height: 60, alignItems: 'flex-end', justifyContent: 'center' }}>
                    <View style={{ width: '30%' }}>
                        <TouchableOpacity onPress={() => onClickGo(bikeId)} disabled={loading ? true : false}>
                            <Button name="Go" loading={loading} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ flex: 0.4, justifyContent: 'space-evenly' }}>
                <View style={{ flex: 0.2, justifyContent: 'center' }}>
                    <Text style={{ color: PRIMARY_COLOR, fontSize: 24 }}>Top Rated Bikes</Text>
                </View>
                <View style={{ flex: 0.1 }}>
                    <Text>Here are some of the most rated bikes.</Text>
                </View>
                <View style={{ backgroundColor: '#F7F7F7', flex: 0.7 }}>
                    {
                        dataIsLoaded ?
                            (
                                <FlatList
                                    keyExtractor={(item) => item._id}
                                    data={data}
                                    renderItem={renderItem}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                />
                            ) :
                            (
                                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color='#CA054D' />
                                </View>
                            )
                    }
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    errorContainer: {
        marginTop: 3,
        height: 17,
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    errorLabel: {
        color: '#f39c12', //danger color: #dc3545
        fontSize: 11,
    },
});

export default Review;