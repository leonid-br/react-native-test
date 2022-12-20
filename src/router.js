import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import LoginScreen from '../src/Screens/Login/LoginScreen';
import RegistrationScreen from '../src/Screens/Registration/RegistrationScreen';
import ProfileScreen from '../src/Screens/Profile/ProfileScreen';
import DefaultPostsScreen from '../src/Screens/DefaultPosts/DefaultPostsScreen';
import CreatePostsScreen from '../src/Screens/CreatePosts/CreatePostsScreen';

// icons
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import s from './router.module.css';

const AuthStack = createNativeStackNavigator();
const MainStack = createBottomTabNavigator();

const useRoute = isAuth => {
    if (!isAuth) {
        return (
            <AuthStack.Navigator initialRouteName="Login">
                <AuthStack.Screen
                    options={{ headerShown: false }}
                    name="Login"
                    component={LoginScreen}
                />
                <AuthStack.Screen
                    options={{ headerShown: false }}
                    name="Registration"
                    component={RegistrationScreen}
                />
            </AuthStack.Navigator>
        );
    }
    return (
        <MainStack.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    ...s.tabBarMenu,
                    ...st.shadow,
                },
            }}
            initialRouteName="Posts"
        >
            <MainStack.Screen
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, size, color }) => (
                        <View
                            style={{
                                ...s.tabBarIconBox,
                                backgroundColor: focused ? 'gray' : 'white',
                            }}
                        >
                            <Ionicons
                                name="grid-outline"
                                size={size}
                                color={focused ? 'white' : 'gray'}
                            />
                        </View>
                    ),
                }}
                name="DefaultPosts"
                component={DefaultPostsScreen}
            />
            <MainStack.Screen
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        <View
                            style={{
                                ...s.tabBarIconBox,
                                backgroundColor: focused ? 'gray' : 'white',
                            }}
                        >
                            <AntDesign name="plus" size={size} color={focused ? 'white' : 'gray'} />
                        </View>
                    ),
                    title: 'Создать публикацию',
                    headerStyle: {
                        backgroundColor: '#fff',
                        borderBottomWidth: '1',
                    },
                    headerTintColor: '#000',
                    headerTitleStyle: {
                        fontWeight: '500',
                        fontSize: 20,
                    },
                    // headerLeft: () => (
                    //     <AntDesign
                    //         style={{ marginLeft: 20 }}
                    //         name="arrowleft"
                    //         size={24}
                    //         color="gray"
                    //         onPress={() => setContext({ login: true })}
                    //     />
                    // ),
                }}
                name="CreatePosts"
                component={CreatePostsScreen}
            />
            <MainStack.Screen
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, size, color }) => (
                        <View
                            style={{
                                ...s.tabBarIconBox,
                                backgroundColor: focused ? 'gray' : 'white',
                            }}
                        >
                            <AntDesign name="user" size={size} color={focused ? 'white' : 'gray'} />
                        </View>
                    ),
                }}
                name="Profile"
                component={ProfileScreen}
            />
        </MainStack.Navigator>
    );
};
const st = StyleSheet.create({
    shadow: {
        shadowColor: '#a4a2ab',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
});
export default useRoute;
