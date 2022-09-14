import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image, FlatList, Modal } from 'react-native';
import { Avatar } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { FAB } from 'react-native-paper';
import moment from 'moment';

import { useNavigation, useRoute } from '@react-navigation/native';
import Axios from "axios";
import { useSelector } from "react-redux";
import { useIsFocused } from '@react-navigation/native';

import { BASE_URL, STAR_COLOR } from "../config";
import Input from '../components/Input';
import Button from '../components/Button';
import SubmitReview from "./SubmitReview";

//need to loading app loader on start then ad fetched set to false
const ViewReview = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();

    const { token } = useSelector(state => state.auth);

    const [bike, setBike] = useState({});
    const [page, setPage] = useState(1);

    //errors states
    const [emptyReview, setEmptyReview] = useState();

    const [isLoaded, setIsLoaded] = useState(false);
    const [onEndReached, setOnEndReached] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    const [data, setData] = useState([]);

    useEffect(() => {
        getBike();
        getReviews();
    }, [page]);

    // useEffect(() => {
    //     getReviews();
    // }, [page]);

    const getBike = () => {
        Axios.get(`${BASE_URL}/bikefinity/bike/bike/${route.params.id}`)
            .then((res) => {
                setBike(res.data);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const getReviews = () => {
        Axios.get(`${BASE_URL}/bikefinity/user/getReviews/${route.params.id}?page=${page}`)
            .then((res) => {
                const reviews = res.data;
                if (reviews.length > 0) {
                    setData(data.concat(reviews));
                    setOnEndReached(false);
                    setIsLoaded(true);
                } else {
                    setOnEndReached(false);
                    setIsLoaded(true);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const whileOnEndReached = () => {
        setOnEndReached(true);
        setPage(page + 1);
    }

    const handleSubmitReview = () => {
        setReviewModalOpen(!reviewModalOpen);
        if (reviewModalOpen === true) {
            setIsLoaded(false);
            setData([]);
            setPage(1);
            getReviews();
        }
    }

    const renderItem = ({ item }) => (
        <View style={{ height: 150, marginBottom: 5, padding: 10, backgroundColor: 'white' }}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.4, flexDirection: 'row' }}>
                    <View style={{ flex: 0.15 }}>
                        <Avatar
                            rounded
                            size={40}
                            source={{ uri: item.user[0].profilePicture }}
                        />
                    </View>
                    <View style={{ flex: 0.45 }}>
                        <View>
                            <Text style={{ color: 'black', fontSize: 15 }}>{item.user[0].name}</Text>
                        </View>
                        <View style={{ width: '45%', marginTop: 6 }}>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={item.rating}
                                starSize={13}
                                emptyStarColor={STAR_COLOR}
                                fullStarColor={STAR_COLOR}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.45, alignItems: 'flex-end' }}>
                        <View style={{ marginTop: 5 }}>
                            <Text style={{ color: 'grey', fontSize: 12 }}>{moment(item.postDate).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 0.6 }}>
                    <Text style={{ color: 'black' }}>{item.review}</Text>
                </View>
            </View>
        </View>
    );

    const renderFooter = () => {
        return (
            onEndReached ?
                (
                    <View style={styles.footer} >
                        <ActivityIndicator
                            size={30}
                            color='#CA054D'
                            style={{ marginLeft: 8 }} />
                    </View >
                ) : null

        );
    };

    return (
        isLoaded ?
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {
                    reviewModalOpen && (
                        <SubmitReview open={reviewModalOpen} bikeId={route.params.id} handleSubmitReview={() => {
                            handleSubmitReview();
                        }} />
                    )
                }
                <View style={{ flex: 0.3, backgroundColor: 'red' }}>
                    <Image source={{ uri: `${bike.image}` }} style={{ width: '100%', flex: 1 }} />
                </View>
                <View style={{ flex: 0.1, padding: 10, backgroundColor: 'white', justifyContent: 'space-around', flexDirection: 'row' }}>
                    <View style={{ flex: 0.5, backgroundColor: 'white' }}>
                        <View>
                            <Text style={{ color: 'black', fontSize: 18 }}>{bike.make}</Text>
                        </View>
                        <View>
                            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{bike.model}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.5, backgroundColor: 'white', alignItems: 'flex-end', }}>
                        <View style={{ width: '60%', marginTop: 6 }}>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={bike.averageRating}
                                starSize={20}
                                emptyStarColor={STAR_COLOR}
                                fullStarColor={STAR_COLOR}
                            />
                        </View>
                        <View style={{ marginTop: 2 }}>
                            <Text style={{ color: 'grey', fontSize: 16, fontWeight: 'bold' }}>{bike.averageRating}/5</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 0.6, backgroundColor: '#F7F7F7' }}>
                    <FlatList
                        keyExtractor={(item) => item._id}
                        data={data}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={onEndReached ? renderFooter : null}
                        onEndReached={!onEndReached ? whileOnEndReached : null}
                        onEndReachedThreshold={0.5}
                    />
                    <FAB
                        style={styles.fab}
                        icon="message"
                        color="white"
                        onPress={handleSubmitReview}
                    />
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
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
        backgroundColor: '#011627',
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40
    },
});

export default ViewReview;