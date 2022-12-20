import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

import { userState as userState_state } from '../redux/auth/authSlice';
import useRoute from '../router';
import {
    stateChange,
    userInfo as userInfo_state,
    isFetching as isFetching_state,
} from '../redux/auth/authSlice';

export const Main = () => {
    const userState = useSelector(userState_state);
    const isFetching = useSelector(isFetching_state);
    const userInfo = useSelector(userInfo_state);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(stateChange());
    }, []);
    const routing = useRoute(userState);

    return <NavigationContainer>{routing}</NavigationContainer>;
};
