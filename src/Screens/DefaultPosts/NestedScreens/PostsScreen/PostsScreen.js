import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

import { userInfo as userInfo_state } from '../../../../redux/auth/authSlice';
import { db } from '../../../../../firebase/config';

import s from './PostsScreen.module.css';

import { SimpleLineIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const PostsScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    console.log('PostsScreen ~ posts', posts);

    const userInfo = useSelector(userInfo_state);

    const getAllPosts = async () => {
        const q = await query(collection(db, 'posts'), orderBy('date', 'desc'));
        await onSnapshot(q, querySnapshot => {
            const arr = [];
            querySnapshot.forEach(doc => {
                arr.push({ ...doc.data(), id: doc.id });
            });
            setPosts(arr);
        });
    };

    useEffect(() => {
        getAllPosts();
    }, []);

    const uri = userInfo.userPhoto;
    return (
        <View style={{ marginHorizontal: 16, marginBottom: 250 }}>
            <View style={s.userBox}>
                {uri ? (
                    <Image source={{ uri }} style={{ width: 100, height: 100, borderRadius: 16 }} />
                ) : (
                    <Ionicons name="ios-person-outline" size={94} color="white" />
                )}
                <View style={s.userInfo}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{userInfo.userName}</Text>
                    <Text style={{ fontSize: 11 }}>{userInfo.userEmail}</Text>
                </View>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={posts}
                keyExtractor={(i, idx) => idx.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 30 }}>
                        <Image source={{ uri: item?.photo }} style={s.photoPost} />
                        <Text style={s.textPost}>{item?.description}</Text>
                        <View style={s.postsDescriptionBox}>
                            <TouchableOpacity
                                style={s.commentsBox}
                                onPress={() =>
                                    navigation.navigate('Comments', {
                                        photo: item?.photo,
                                        postId: item.id,
                                    })
                                }
                            >
                                <Feather
                                    name="message-circle"
                                    size={20}
                                    color={item.ammountComments === 0 ? 'lightgray' : 'orange'}
                                    style={s.commentsIcon}
                                />
                                <Text
                                    style={{
                                        ...s.commentsCount,
                                        color: item.ammountComments === 0 ? 'lightgray' : 'orange',
                                    }}
                                >
                                    {item.ammountComments}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.locationBox}
                                onPress={() =>
                                    navigation.navigate('Map', {
                                        location: item?.location,
                                        locationName: item?.locationName,
                                        description: item?.description,
                                    })
                                }
                            >
                                <SimpleLineIcons name="location-pin" size={20} color="lightgray" />
                                <Text style={s.locationName}>{item?.locationName}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default PostsScreen;
