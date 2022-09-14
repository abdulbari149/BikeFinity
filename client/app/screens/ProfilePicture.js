import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';

import { PRIMARY_COLOR } from '../config';
import Button from '../components/Button';

const ProfilePicture = (props) => {

    const [picture, setPicture] = useState('');
    const [imageData, setImageData] = useState();

    const [loading, setLoading] = useState(false);

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs to access photo gallery permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    const pickFromGallery = async () => {

        const isGranted = await requestExternalWritePermission();
        if (isGranted) {
            ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true,
                multiple: false
            }).then(data => {
                const uri = data.path;
                const type = data.mime;
                const name = "bikefinity/" + data.modificationDate;
                const image = {
                    uri,
                    type,
                    name,
                };
                setPicture(uri);
                setImageData(image);
            }).catch(error => {
                console.log(error)
            })
        }
    };

    const uploadImage = () => {
        setLoading(true);
        const data = new FormData();
        data.append('file', imageData);
        data.append('upload_preset', 'bikefinity');
        data.append('cloud_name', 'dl28pe0lw');

        fetch('https://api.cloudinary.com/v1_1/dl28pe0lw/image/upload', {
            method: 'POST',
            body: data,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                props.uploaded(true, data.url);
                setLoading(false);
                props.handleProfilePictureModal();
            })
            .catch((err) => {
                console.log('An error has occured while uploading the image.', err);
            });
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.open}
            onRequestClose={props.handleProfilePictureModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
                                Add Profile Picture
                            </Text>
                        </View>
                        <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                            <View>
                                {
                                    picture != '' ?
                                        (
                                            <Avatar
                                                rounded
                                                size={200}
                                                containerStyle={{ backgroundColor: '#F7F7F7', borderColor: PRIMARY_COLOR, borderWidth: 1 }}
                                                onPress={pickFromGallery}
                                                source={{ uri: picture }}
                                            />
                                        ) :
                                        (
                                            <Avatar
                                                rounded
                                                size={200}
                                                containerStyle={{ backgroundColor: '#F7F7F7', borderColor: PRIMARY_COLOR, borderWidth: 1 }}
                                                icon={{ name: 'camera-enhance', color: PRIMARY_COLOR, type: 'materialicons' }}
                                                onPress={pickFromGallery}
                                            />
                                        )
                                }

                            </View>
                        </View>
                        <View style={{ flex: 0.2, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <View style={{ width: '30%' }}>
                                    <TouchableOpacity onPress={props.handleProfilePictureModal}>
                                        <Button name="Cancel" color="blue" outlined={true} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '30%' }}>
                                    <TouchableOpacity onPress={uploadImage} disabled={loading || picture === '' ? true : false}>
                                        <Button name="Done" color="blue" loading={loading} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal >
    );
}

const styles = StyleSheet.create({
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

export default ProfilePicture;