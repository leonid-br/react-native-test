import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { StatusBar } from 'expo-status-bar';
import {
    Text,
    View,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';

import { createUser, isFetching as isFetching_state } from '../../redux/auth/authSlice';

import { AddSvg } from '../../svg/AddSvg';

import s from './RegistrationScreen.module.css';

const initState = {
    login: '',
    email: '',
    password: '',
    image: null,
};

export default function RegistrationScreen({ navigation }) {
    const [formData, setFormData] = useState(initState);
    const [onFocusInput, setOnFocusInput] = useState({
        login: false,
        email: false,
        password: false,
    });
    const [showPassord, setShowPassord] = useState(true);
    const [isShowKeybord, setIsShowKeybord] = useState(false);

    const dispatch = useDispatch();

    const isFetching = useSelector(isFetching_state);

    const formDataHandler = (formName, text) => {
        setFormData({ ...formData, [formName]: text });
    };

    const showPassordHandler = () => setShowPassord(!showPassord);

    const handleInputFocus = textinput => {
        setOnFocusInput({
            [textinput]: true,
        });
    };

    const handleInputBlur = textinput => {
        setOnFocusInput({
            [textinput]: false,
        });
    };

    const onRegistration = () => {
        setFormData(initState);
        Keyboard.dismiss();
        dispatch(createUser({ data: formData }));
        setIsShowKeybord(false);
        setShowPassord(false);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            formDataHandler('image', result.uri);
        }
    };

    const dellImage = () => formDataHandler('image', null);

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
                setIsShowKeybord(false);
            }}
        >
            <View style={s.container}>
                <ImageBackground
                    source={require('../../../assets/img/bg_photo.jpg')}
                    style={s.bg_photo}
                >
                    <KeyboardAvoidingView
                        style={s.keyboardCont}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View
                            style={{
                                ...s.login_menu,
                                marginBottom: isShowKeybord ? 130 : 10,
                            }}
                        >
                            <View style={s.login_avatar}>
                                {formData.image ? (
                                    <Image source={{ uri: formData.image }} style={s.photo_box} />
                                ) : (
                                    <Ionicons
                                        name="ios-person-outline"
                                        size={94}
                                        color="white"
                                        style={{ marginLeft: 'auto', marginRight: 'auto' }}
                                    />
                                )}
                                {formData.image ? (
                                    <AddSvg onPress={dellImage} style={s.dell_svg} />
                                ) : (
                                    <AddSvg onPress={pickImage} style={s.add_svg} />
                                )}
                            </View>

                            <Text style={s.head_text}>Регистрация</Text>
                            {isFetching ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#fff"
                                    style={{ marginTop: 150 }}
                                />
                            ) : (
                                <View style={s.form}>
                                    <TextInput
                                        value={formData.login}
                                        onChangeText={text => formDataHandler('login', text)}
                                        placeholder="Логин"
                                        placeholderTextColor="#BDBDBD"
                                        style={{
                                            ...s.formInput,
                                            borderColor: onFocusInput.login ? 'white' : '#BDBDBD',
                                        }}
                                        onFocus={() => {
                                            setIsShowKeybord(true);
                                            handleInputFocus('login');
                                        }}
                                        onBlur={() => handleInputBlur('login')}
                                    />
                                    <TextInput
                                        value={formData.email}
                                        onChangeText={text => formDataHandler('email', text)}
                                        keyboardType="email-address"
                                        placeholder="Адрес электронной почты"
                                        placeholderTextColor="#BDBDBD"
                                        style={{
                                            ...s.formInput,
                                            borderColor: onFocusInput.email ? 'white' : '#BDBDBD',
                                        }}
                                        onFocus={() => {
                                            setIsShowKeybord(true);
                                            handleInputFocus('email');
                                        }}
                                        onBlur={() => handleInputBlur('email')}
                                    />
                                    <View>
                                        <TextInput
                                            value={formData.password}
                                            onChangeText={text => formDataHandler('password', text)}
                                            placeholder="Пароль"
                                            placeholderTextColor="#BDBDBD"
                                            secureTextEntry={showPassord}
                                            style={{
                                                ...s.formInput,
                                                borderColor: onFocusInput.password
                                                    ? 'white'
                                                    : '#BDBDBD',
                                                marginBottom: 0,
                                            }}
                                            onFocus={e => {
                                                setIsShowKeybord(true);
                                                handleInputFocus('password');
                                            }}
                                            onBlur={() => handleInputBlur('password')}
                                        />
                                        <Text onPress={showPassordHandler} style={s.showPassord}>
                                            Показать
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={s.registrationBtn}
                                        onPress={onRegistration}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={s.registrationBtnText}>
                                            Зарегистрироваться
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={s.loginText}>
                                            Уже есть аккаунт? <Text style={s.loginWord}>Войти</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </KeyboardAvoidingView>
                    <StatusBar style="auto" />
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
}
