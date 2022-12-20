import { createSlice } from '@reduxjs/toolkit';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
} from 'firebase/auth';
import { authUser } from '../../../firebase/config';

export const authSlice = createSlice({
    name: 'auth',

    initialState: {
        userName: null,
        userEmail: null,
        userId: null,
        userPhoto: null,
        userStateChange: null,

        isFetching: null,
    },

    reducers: {
        set_user: (state, action) => {
            state.userName = action.payload.userName;
            state.userEmail = action.payload.userEmail;
            state.userId = action.payload.userId;
            state.userPhoto = action.payload.userPhoto;
            state.userStateChange = action.payload.userStateChange;
        },
        set_logout: state => {
            state.userName = null;
            state.userEmail = null;
            state.userId = null;
            state.userPhoto = null;
            state.userStateChange = null;
        },

        set_fetching: (state, action) => {
            state.isFetching = action.payload;
        },
    },
});

export const { set_user, set_logout, set_fetching } = authSlice.actions;

export const createUser =
    ({ data }) =>
    async dispatch => {
        try {
            await dispatch(set_fetching(true));
            await createUserWithEmailAndPassword(authUser, data.email, data.password);
            const user = await authUser.currentUser;
            await updateProfile(user, { displayName: data.login, photoURL: data.image });
            const { displayName, uid, email, photoURL } = await authUser.currentUser;
            await dispatch(
                set_user({
                    userName: displayName,
                    userId: uid,
                    userEmail: email,
                    userStateChange: true,
                    userPhoto: photoURL,
                })
            );
        } catch (e) {
            console.log('errorCreateUser', e);
        } finally {
            await dispatch(set_fetching(false));
        }
    };

export const login =
    ({ data }) =>
    async dispatch => {
        try {
            await dispatch(set_fetching(true));
            const { user } = await signInWithEmailAndPassword(authUser, data.email, data.password);
            const currentUser = {
                userName: user.displayName,
                userId: user.uid,
                userEmail: user.email,
                userPhoto: user.photoURL,
                userStateChange: true,
            };
            await dispatch(set_user(currentUser));
        } catch (e) {
            console.log('errorLogin', e);
        } finally {
        }
        await dispatch(set_fetching(false));
    };

export const logout = () => async dispatch => {
    try {
        await signOut(authUser);
        await dispatch(set_logout());
    } catch (e) {
        console.log('error Logout', e);
    }
};

export const stateChange = () => async dispatch => {
    try {
        await dispatch(set_fetching(true));

        await onAuthStateChanged(authUser, user => {
            if (user) {
                dispatch(
                    set_user({
                        userName: user.displayName,
                        userId: user.uid,
                        userEmail: user.email,
                        userStateChange: true,
                        userPhoto: user.photoURL,
                    })
                );
            }
        });
    } catch (e) {
        console.log('errorStateChange', e);
    } finally {
        await dispatch(set_fetching(false));
    }
};

export const userState = state => state.auth.userStateChange;
export const userInfo = state => state.auth;
export const isFetching = state => state.auth.isFetching;

export default authSlice.reducer;
