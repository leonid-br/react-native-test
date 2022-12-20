import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

import { userInfo as userInfo_state } from '../../redux/auth/authSlice';
import { storage, db } from '../../../firebase/config';

import s from './CreatePostsScreen.module.css';

const initState = { locationName: '', description: '', location: '' };

const CreatePostsSrceen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camerOn, setCamerOn] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [formData, setFormData] = useState(initState);

    const userInfo = useSelector(userInfo_state);
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            await MediaLibrary.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
            }
            let location = await Location.getCurrentPositionAsync({});
            const coords = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            setFormData({ ...formData, location: coords });
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text> No access to camera</Text>;
    }

    const takePhoto = async () => {
        const photo = await cameraRef.takePictureAsync();
        setPhoto(photo.uri);
        let location = await Location.getCurrentPositionAsync({});
        const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
        setFormData({ ...formData, location: coords });
    };

    const uploadPhotoToServer = async () => {
        const response = await fetch(photo);
        const file = await response.blob();
        const uniquePhotoId = Date.now().toString();

        const storageRef = ref(storage, `postsImages/${uniquePhotoId}`);
        await uploadBytes(storageRef, file);

        return await getDownloadURL(ref(storage, `postsImages/${uniquePhotoId}`));
    };

    const uploadPostToServer = async () => {
        const photo = await uploadPhotoToServer();
        const post = {
            ...formData,
            photo: photo,
            userId: userInfo.userId,
            userName: userInfo.userName,
            date: Date.now(),
            ammountComments: 0,
        };
        try {
            await addDoc(collection(db, 'posts'), post);
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };
    const formDataHandler = (formName, text) => {
        setFormData({ ...formData, [formName]: text });
    };
    console.log('CreatePostsSrceen ~ formData', formData);

    const submutInfo = () => {
        uploadPostToServer();
        setFormData(initState);
        setPhoto(null);
        setCamerOn(false);
        setType(Camera.Constants.Type.back);
        Keyboard.dismiss();
        navigation.navigate('Posts');
    };
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={s.container}>
                    <View style={s.box}>
                        <View style={s.cameraBox}>
                            {!camerOn && !photo && (
                                <TouchableOpacity
                                    style={s.snapBtnBox}
                                    onPress={() => setCamerOn(true)}
                                >
                                    <MaterialIcons name="photo-camera" size={30} color="gray" />
                                </TouchableOpacity>
                            )}
                            {camerOn && !photo && (
                                <Camera style={s.camera} type={type} ref={setCameraRef}>
                                    <TouchableOpacity style={s.snapBtnBox} onPress={takePhoto}>
                                        <MaterialIcons name="photo-camera" size={30} color="gray" />
                                    </TouchableOpacity>
                                    <View>
                                        <TouchableOpacity
                                            style={s.flipContainer}
                                            onPress={() => {
                                                setType(
                                                    type === Camera.Constants.Type.back
                                                        ? Camera.Constants.Type.front
                                                        : Camera.Constants.Type.back
                                                );
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    marginRight: 55,
                                                    marginTop: 30,
                                                    color: 'white',
                                                }}
                                            >
                                                <MaterialIcons
                                                    name="flip-camera-android"
                                                    size={34}
                                                    color="white"
                                                />
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Camera>
                            )}
                            {photo && (
                                <View style={s.photoBox}>
                                    <Image source={{ uri: photo }} style={{ height: 250 }} />
                                </View>
                            )}
                        </View>
                        {camerOn && (
                            <TouchableOpacity
                                style={s.loadPhotoTextBox}
                                onPress={() => {
                                    setCamerOn(setPhoto(null));
                                    setCamerOn(true);
                                }}
                            >
                                <Text style={s.loadPhotoText}>Редактировать фото</Text>
                            </TouchableOpacity>
                        )}
                        {!camerOn && (
                            <TouchableOpacity
                                style={s.loadPhotoTextBox}
                                onPress={() => setCamerOn(true)}
                            >
                                <Text style={s.loadPhotoText}>Загрузить фото</Text>
                            </TouchableOpacity>
                        )}

                        <View style={s.form}>
                            <View>
                                <TextInput
                                    value={formData.description}
                                    onChangeText={text => formDataHandler('description', text)}
                                    placeholder="Название"
                                    placeholderTextColor="#BDBDBD"
                                    style={s.input}
                                />
                            </View>
                            <View>
                                <SimpleLineIcons
                                    name="location-pin"
                                    size={24}
                                    color="lightgray"
                                    style={s.locationIcon}
                                />
                                <TextInput
                                    value={formData.locationName}
                                    onChangeText={text => formDataHandler('locationName', text)}
                                    placeholder="Местность"
                                    placeholderTextColor="#BDBDBD"
                                    style={{
                                        ...s.input,
                                        marginTop: 10,
                                        paddingLeft: 25,
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={{
                                    ...s.pablishedBtn,
                                    backgroundColor: photo ? 'lightgray' : '#F6F6F6',
                                }}
                                onPress={submutInfo}
                            >
                                <Text
                                    style={{
                                        color: photo ? 'black' : 'lightgray',
                                    }}
                                >
                                    Опубликовать
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default CreatePostsSrceen;
