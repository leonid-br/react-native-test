import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    StyleSheet,
    FlatList,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    collection,
    addDoc,
    doc,
    query,
    onSnapshot,
    orderBy,
    updateDoc,
    increment,
} from 'firebase/firestore';

import { db } from '../../../../../firebase/config';
import s from './CommentsScreen.module.css';
import st from '../../../../../App.module.css';
import { userInfo as userInfo_state } from '../../../../redux/auth/authSlice';

import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const CommentsScreen = ({ route, navigation }) => {
    const [message, setMessage] = useState('');
    const [comments, setComments] = useState([]);
    console.log('CommentsScreen ~ comments', comments);
    const [isShowKeybord, setIsShowKeybord] = useState(false);

    const { photo, postId } = route.params;

    const userInfo = useSelector(userInfo_state);

    const addComment = async () => {
        const postsCollection = await doc(db, 'posts', postId);
        await addDoc(collection(postsCollection, 'comments'), {
            userName: userInfo.userName,
            comment: message,
            avatar: userInfo.userPhoto,
            date: Date.now(),
        });
        await updateDoc(postsCollection, {
            ammountComments: increment(1),
        });
        setMessage('');
        setIsShowKeybord(false);
        Keyboard.dismiss();
    };

    const getAllComments = async () => {
        const postsCollection = await doc(db, 'posts', postId);
        const q = await query(collection(postsCollection, 'comments'), orderBy('date'));
        await onSnapshot(q, querySnapshot => {
            const arr = [];
            querySnapshot.forEach(doc => {
                arr.push({ ...doc.data(), id: doc.id });
            });
            setComments(arr);
        });
    };

    useEffect(() => {
        getAllComments();
    }, []);

    useEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });

        return () => {
            navigation
                .getParent()
                ?.setOptions({ tabBarStyle: { ...st.tabBarMenu, ...style.shadow } });
        };
    }, []);

    const uri = photo;
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
                setIsShowKeybord(false);
            }}
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View
                    style={{
                        marginHorizontal: 16,
                        paddingTop: 30,
                        marginBottom: isShowKeybord ? 100 : 0,
                        justifyContent: 'flex-end',
                    }}
                >
                    <View style={s.imageBox}>
                        <Image source={{ uri }} style={s.photo} />
                    </View>

                    <View style={s.chatBox}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={comments}
                            keyExtractor={(i, idx) => idx.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <View
                                        style={index % 2 === 0 ? s.messageBox : s.messageBoxRevers}
                                    >
                                        <View
                                            style={
                                                index % 2 === 0 ? s.fakeAvatar : s.fakeAvatarRevers
                                            }
                                        >
                                            {item.avatar === null ? (
                                                <Ionicons
                                                    name="ios-person-outline"
                                                    size={40}
                                                    color="white"
                                                />
                                            ) : (
                                                <Image
                                                    source={{ uri: item.avatar }}
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 100,
                                                    }}
                                                />
                                            )}
                                        </View>
                                        <View
                                            style={{
                                                ...s.messageTextBox,
                                                backgroundColor:
                                                    index % 2 === 0 ? '#e2e2e2' : '#d3c8e3',
                                            }}
                                        >
                                            <Text style={s.messageText}>{item.comment}</Text>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                        <View style={s.inputBox}>
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Комментировать..."
                                placeholderTextColor="#BDBDBD"
                                style={s.messageInput}
                                onFocus={() => setIsShowKeybord(true)}
                            />
                            <SimpleLineIcons
                                onPress={addComment}
                                style={s.iconSend}
                                name="arrow-up-circle"
                                size={30}
                                color="#bdbdbd"
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const style = StyleSheet.create({
    shadow: {
        shadowColor: '#a4a2ab',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
});

export default CommentsScreen;
