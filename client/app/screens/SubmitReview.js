import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image, FlatList, Modal } from 'react-native';
import { Avatar } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useNavigation, useRoute } from '@react-navigation/native';
import Axios from "axios";
import { useSelector } from 'react-redux';

import { BASE_URL, PRIMARY_COLOR, SECONDARY_COLOR, STAR_COLOR } from "../config";
import Input from '../components/Input';
import Button from '../components/Button';

const SubmitReview = (props) => {

    const { token } = useSelector(state => state.auth);

    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);

    //errors states
    const [emptyReview, setEmptyReview] = useState();
    const [emptyRating, setEmptyRating] = useState();
    const [reviewId, setReviewId] = useState();

    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reviewAlreadyExist, setReviewAlreadyExist] = useState();

    const bikeId = props.bikeId;
    // let reviewId = '';

    useEffect(() => {
        getUserReview();
    }, [])

    const reset = () => {
        setReview('');
        setRating(0);
        setEmptyRating();
        setEmptyReview();
        setLoading(false);
        setReviewAlreadyExist();
    }

    const onPressSubmit = () => {
        checkInputField('rating');
        checkInputField('review');
        if (emptyRating === false && emptyReview === false) {
            setLoading(true);
            postReview();
        }
    }

    const onPressUpdate = () => {
        checkInputField('rating');
        checkInputField('review');
        if (emptyRating === false && emptyReview === false) {
            setLoading(true);
            updateReview();
        }
    }

    const postReview = () => {
        var data = {
            review: review,
            rating: rating,
            bikeId: bikeId
        }

        Axios.post(`${BASE_URL}/bikefinity/user/postReview`, data, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoading(false);
                    props.handleSubmitReview();
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const updateReview = () => {
        console.log(reviewId);
        var data = {
            review: review,
            rating: rating,
        }

        Axios.post(`${BASE_URL}/bikefinity/user/updateReview/${reviewId}`, data, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoading(false);
                    props.handleSubmitReview();
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const deleteReview = () => {

        Axios.post(`${BASE_URL}/bikefinity/user/deleteReview/${reviewId}`, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoading(false);
                    props.handleSubmitReview();
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const getUserReview = () => {
        Axios.get(`${BASE_URL}/bikefinity/user/getUserReview/${bikeId}`, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                if (res.data.status === 404) {
                    setReviewAlreadyExist(false);
                    setIsLoaded(true);
                } else {
                    setReviewId(res.data._id);
                    setReviewAlreadyExist(true);
                    setReview(res.data.review);
                    setRating(res.data.rating);
                    setIsLoaded(true);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const checkInputField = (fieldName) => {
        if (fieldName === 'review') {
            if (review.length === 0) {
                setEmptyReview(true)
            }
        }
        else if (fieldName === 'rating') {
            if (rating === 0) {
                setEmptyRating(true)
            }
        }
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.open}
            onRequestClose={props.handleSubmitReview}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {
                        isLoaded ?
                            (
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                        <View style={{ flex: 0.2, backgroundColor: 'red' }} />
                                        <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
                                                {
                                                    reviewAlreadyExist ? "Update Review" : "Submit Review"
                                                }
                                            </Text>
                                        </View>
                                        <View style={{ flex: 0.2, alignItems: 'center' }}>
                                            {
                                                reviewAlreadyExist ?
                                                    (
                                                        <Icon name="delete-outline" color={SECONDARY_COLOR} size={18} onPress={deleteReview} />
                                                    ) : null
                                            }
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                        <View style={{ width: '40%' }}>
                                            <StarRating
                                                disabled={false}
                                                maxStars={5}
                                                rating={rating}
                                                starSize={22}
                                                emptyStarColor={STAR_COLOR}
                                                fullStarColor={STAR_COLOR}
                                                selectedStar={(value) => {
                                                    setEmptyRating(false);
                                                    setRating(value);
                                                }}
                                            />
                                        </View>
                                        <View style={styles.errorContainer}>
                                            {emptyRating ? <Text style={styles.errorLabel}>Please mark atleast one star!</Text> : null}
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.55, justifyContent: 'space-evenly' }}>
                                        <View>
                                            <Input
                                                name="Write your honest review..."
                                                value={review}
                                                multiline={true}
                                                numberOfLines={6}
                                                onChange={
                                                    (value) => {
                                                        setEmptyReview(false);
                                                        setReview(value)
                                                    }
                                                }
                                                onBlur={
                                                    () => {
                                                        // checkInputField('kilometers')
                                                    }
                                                }
                                            />
                                        </View>
                                        <View style={styles.errorContainer}>
                                            {emptyReview ? <Text style={styles.errorLabel}>Review cannot be empty!</Text> : null}
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.15, justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                            <View style={{ width: '30%' }}>
                                                <TouchableOpacity onPress={props.handleSubmitReview}>
                                                    <Button name="Cancel" color="blue" outlined={true} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ width: '30%' }}>
                                                <TouchableOpacity onPress={reviewAlreadyExist ? onPressUpdate : onPressSubmit} disabled={loading ? true : false}>
                                                    <Button name={reviewAlreadyExist ? "Update" : "Submit"} color="blue" loading={loading} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ) :
                            (
                                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color='#CA054D' />
                                </View>
                            )
                    }
                </View>
            </View>
        </Modal >
    );
}

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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        height: 350,
        width: '90%',
        backgroundColor: "white",
        borderRadius: 15,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
});

export default SubmitReview;