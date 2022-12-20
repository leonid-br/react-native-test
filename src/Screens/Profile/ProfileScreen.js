import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { collection, addDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import { db } from '../../../firebase/config';
import { userInfo as userInfo_state } from '../../redux/auth/authSlice';
import s from './ProfileScreen.module.css';

const ProfileSrceen = () => {
    const [allUserPosts, setAllUserPosts] = useState([]);
    // const [allUserPostsAndComments, setAllUserPostsAndComments] = useState([]);
    console.log('ProfileSrceen ~ comments', allUserPosts);

    const userInfo = useSelector(userInfo_state);

    const getAllUserPosts = async () => {
        const arr = [];
        const postsRef = await collection(db, 'posts');
        const q = await query(postsRef, where('userId', '==', userInfo.userId));
        await onSnapshot(q, querySnapshot => {
            querySnapshot.forEach(doc => {
                arr.push({ ...doc.data(), id: doc.id });
            });
            setAllUserPosts(arr);
        });
    };

    // const getPostComments = async post => {
    //     const commentsCollection = await doc(db, 'posts', post.id);
    //     const q = await query(collection(commentsCollection, 'comments'));
    //     const arr = [];
    //     await onSnapshot(q, querySnapshot => {
    //         querySnapshot.forEach(doc => {
    //             arr.push(doc.data());
    //         });
    //     });
    //     const tmp = { ...post, comments: arr };
    //     return await tmp;
    // };

    useEffect(() => {
        getAllUserPosts();
    }, []);

    // useEffect(() => {
    //     let comments = [];
    //     (async () => {
    //         comments = await Promise.all(
    //             allUserPosts.map(async post => await getPostComments(post))
    //         );
    //         setAllUserPostsAndComments(comments);
    //     })();
    // }, [allUserPosts]);

    return <></>;
};

const styles = StyleSheet.create({});

export default ProfileSrceen;
