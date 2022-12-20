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
    ActivityIndicator,
} from 'react-native';
import {
    login,
    isFetching as isFetching_state,
    userInfo as userInfo_state,
} from '../../redux/auth/authSlice';

import s from './LoginScreen.module.css';

const initState = { email: '', password: '' };

export default function LoginScreen({ navigation }) {
    const [formData, setFormData] = useState(initState);
    const [onFocusInput, setOnFocusInput] = useState({
        email: false,
        password: false,
    });
    const [showPassord, setShowPassord] = useState(true);
    const [isShowKeybord, setIsShowKeybord] = useState(false);

    const dispatch = useDispatch();

    const isFetching = useSelector(isFetching_state);
    const userInfo = useSelector(userInfo_state);

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

    const onLogin = () => {
        console.log(formData);
        setFormData(initState);
        Keyboard.dismiss();
        dispatch(login({ data: formData }));
        setIsShowKeybord(false);
    };

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
                    {isFetching && userInfo.userStateChange === null ? (
                        <ActivityIndicator
                            size="large"
                            color="#fff"
                            style={{ marginBottom: 350 }}
                        />
                    ) : (
                        <KeyboardAvoidingView
                            style={s.keyboardCont}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            <View
                                style={{
                                    ...s.login_menu,
                                    marginBottom: isShowKeybord ? 80 : 10,
                                }}
                            >
                                <Text style={s.head_text}>Войти</Text>

                                <View style={s.form}>
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
                                        style={s.loginBtn}
                                        onPress={onLogin}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={s.loginBtnText}>Войти</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Registration')}
                                    >
                                        <Text style={s.registrationText}>
                                            Нет аккаунта?{' '}
                                            <Text style={s.registerWord}>Зарегистрироваться</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    )}
                    <StatusBar style="auto" />
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
}
