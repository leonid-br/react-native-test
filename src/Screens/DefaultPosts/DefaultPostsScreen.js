import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import PostsScreen from './NestedScreens/PostsScreen/PostsScreen';
import MapScreen from './NestedScreens/MapScreen/MapScreen';
import CommentsScreen from './NestedScreens/CommentsScreen/CommentsScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { logout } from '../../redux/auth/authSlice';

import { AntDesign } from '@expo/vector-icons';

const NestedPostsStack = createStackNavigator();

const DefautPostsSrceen = ({ navigation }) => {
    const dispatch = useDispatch();
    return (
        <NestedPostsStack.Navigator initialRouteName="Posts">
            <NestedPostsStack.Screen
                options={{
                    title: 'Публикации',
                    headerStyle: {
                        backgroundColor: '#fff',
                        borderBottomWidth: '1',
                    },
                    headerTintColor: '#000',
                    headerTitleStyle: {
                        fontWeight: '500',
                        fontSize: 20,
                    },
                    headerRight: () => (
                        <MaterialIcons
                            style={{
                                marginRight: 15,
                            }}
                            name="logout"
                            size={24}
                            color="gray"
                            onPress={() => dispatch(logout())}
                        />
                    ),
                }}
                name="Posts"
                component={PostsScreen}
            />
            <NestedPostsStack.Screen
                options={{
                    title: 'Карта',
                    headerStyle: {
                        backgroundColor: '#fff',
                        borderBottomWidth: '1',
                    },
                    headerTintColor: '#000',
                    headerTitleStyle: {
                        fontWeight: '500',
                        fontSize: 20,
                    },
                    headerLeft: () => (
                        <AntDesign
                            style={{ marginLeft: 20 }}
                            name="arrowleft"
                            size={24}
                            color="gray"
                            onPress={() => {
                                navigation.navigate('Posts');
                            }}
                        />
                    ),
                }}
                name="Map"
                component={MapScreen}
            />
            <NestedPostsStack.Screen
                options={{
                    title: 'Комментарии',
                    headerStyle: {
                        backgroundColor: '#fff',
                        borderBottomWidth: '1',
                    },
                    headerTintColor: '#000',
                    headerTitleStyle: {
                        fontWeight: '500',
                        fontSize: 20,
                    },
                    headerLeft: () => (
                        <AntDesign
                            style={{ marginLeft: 20 }}
                            name="arrowleft"
                            size={24}
                            color="gray"
                            onPress={() => {
                                navigation.navigate('Posts');
                            }}
                        />
                    ),
                }}
                name="Comments"
                component={CommentsScreen}
            />
        </NestedPostsStack.Navigator>
    );
};

export default DefautPostsSrceen;
