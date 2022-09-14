import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';

import Input from '../components/Input';
import Button from '../components/Button';
import { BASE_URL, PRIMARY_COLOR, SECONDARY_COLOR } from '../config';

const Calculator = () => {

    const navigation = useNavigation();
    const { height, width } = useWindowDimensions();

    const [make, setMake] = useState([]);
    const [selectedMake, setSelectedMake] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [bikeDetails, setBikeDetails] = useState([]);
    const [engine, setEngine] = useState();
    const [year, setYear] = useState("2022");
    const [kilometers, setKilometers] = useState("");
    const [predictedPrice, setPredictedPrice] = useState("");
    const [predictedModal, setPredictedModal] = useState(false);

    //errors state
    const [emptyMake, setEmptyMake] = useState();
    const [emptyModel, setEmptyModel] = useState();
    const [emptyKilometers, setEmptyKilometers] = useState();

    const [loading, setLoading] = useState(false);

    const currentYear = (new Date()).getFullYear();
    const years = Array.from(new Array(43), (val, index) => currentYear - index);

    useEffect(() => {
        Axios.get(`${BASE_URL}/bikefinity/bike/make?type=Street Bike`)
            .then((res) => {
                setMake(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    //getting bike details according to make
    const getBikeDetails = (value) => {
        Axios.get(`${BASE_URL}/bikefinity/bike/model/${value}?type=Street Bike`)
            .then((res) => {
                setBikeDetails(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const onClickCalculate = () => {
        setLoading(true)
        checkInputField('make')
        checkInputField('model')
        checkInputField('year')
        checkInputField('kilometers')
        if (emptyMake === false && emptyModel === false && emptyKilometers === false) {
            calculate();
        }
    }

    const calculate = () => {

        const formData = new FormData();
        formData.append('make', selectedMake);
        formData.append('model', selectedModel);
        formData.append('year', year);
        formData.append('kms_driven', kilometers);

        Axios.post(`https://model-deploy-bikefinity.herokuapp.com/prediction`,
            formData)
            .then((res) => {
                if (res.status === 200) {
                    let price = res.data;
                    price = price.toString();
                    setPredictedPrice(price);
                    setPredictedModal(true);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }

    const checkInputField = (fieldName) => {
        if (fieldName === 'make') {
            if (selectedMake.length === 0) {
                setEmptyMake(true)
            }
        }
        else if (fieldName === 'model') {
            if (selectedModel.length === 0) {
                setEmptyModel(true)
            }
        }
        else if (fieldName === 'year') {
            if (year.length === 0) {
                setEmptyYear(true)
            }
        }
        else if (fieldName === 'kilometers') {
            if (kilometers.length === 0) {
                setEmptyKilometers(true)
            }
        }
    }

    return (
        <KeyboardAwareScrollView style={{ flex: 1, padding: 15, backgroundColor: 'white' }} enableOnAndroid extraHeight={150}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={predictedModal}
            // onRequestClose={props.handleProfilePictureModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
                                    Estimated Bike Price
                                </Text>
                            </View>
                            <View style={{ flex: 0.5, justifyContent: 'center' }}>
                                <LottieView source={require('../assets/money-tick.json')} autoPlay loop />
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}>
                                <Animatable.Text style={{ fontSize: 30, fontWeight: 'bold', color: PRIMARY_COLOR }} animation="bounce">Rs. {predictedPrice}</Animatable.Text>
                            </View>
                            <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ flex: 0.4, justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => setPredictedModal(false)}>
                                        <Button name="OK" color="blue" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal >



            <View style={{ height: height * 0.05 }}>
                <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>Calculate your Bike Price</Text>
            </View>
            <View style={{ marginTop: 0, height: height * 0.08 }}>
                <Text style={{ fontSize: 12 }}>You can estimate your current bike price. Note that once you will fill all the parameters then tap on calculates</Text>
            </View>
            <View style={{ height: height * 0.14 }}>
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
                                setEngine();
                            } else {
                                setBikeDetails([]);
                                setEngine();
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
            <View style={{ height: height * 0.14 }}>
                <Text style={{ color: 'black' }}>Model</Text>
                <View style={{ marginTop: 5, borderBottomWidth: 1 }}>
                    <Picker
                        mode="dialog"
                        selectedValue={selectedModel}
                        onValueChange={(itemValue, itemIndex) => {
                            if (itemIndex === 0) {
                                setEmptyModel(true);
                                setSelectedModel("");
                                setEngine();
                            } else {
                                setSelectedModel(itemValue);
                                setEngine(bikeDetails[itemIndex - 1].engine);
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
            <View style={{ height: height * 0.12, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 0.45 }}>
                    <Text style={{ color: 'black' }}>Engine</Text>
                    <View style={{ marginTop: 5, borderBottomWidth: 1, height: 40, justifyContent: 'center' }}>
                        {
                            engine ? <Text style={{ fontSize: 16, color: 'black' }}>{engine}</Text> : <Text>Engine CC</Text>
                        }
                    </View>
                    <View style={styles.errorContainer}>
                    </View>
                </View>
                <View style={{ flex: 0.45 }}>
                    <Text style={{ color: 'black' }}>Year</Text>
                    <View style={{ marginTop: 5 }}>
                        <Picker
                            mode="dropdown"
                            selectedValue={year}
                            onValueChange={(itemValue, itemIndex) =>
                                setYear(itemValue)
                            }
                        >
                            {
                                years.map((year, index) => {
                                    return (<Picker.Item label={year.toString()} value={year} key={index} />);
                                })
                            }
                        </Picker>
                    </View>
                </View>
            </View>
            <View style={{ height: height * 0.12 }}>
                <Text style={{ color: 'black' }}>Kilometers</Text>
                <View style={{ marginTop: 5 }}>
                    <Input
                        name="Enter kilometers"
                        value={kilometers}
                        type="numeric"
                        onChange={
                            (value) => {
                                setEmptyKilometers(false);
                                setKilometers(value)
                            }
                        }
                        onBlur={
                            () => {
                                checkInputField('kilometers')
                            }
                        }
                    />
                </View>
                <View style={styles.errorContainer}>
                    {emptyKilometers ? <Text style={styles.errorLabel}>Kms cannot be empty!</Text> : null}
                </View>
            </View>
            <View style={{ height: height * 0.17, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: '80%' }}>
                    <TouchableOpacity onPress={onClickCalculate} disabled={loading ? true : false}>
                        <Button name="Calculate" color="blue" loading={loading} outlined/>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
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

export default Calculator;