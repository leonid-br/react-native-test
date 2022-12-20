import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { Main } from './src/Components/Main';
import { store } from './src/redux/store';

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await Font.loadAsync({
                    'base-text': require('./assets/fonts/Roboto-Light.ttf'),
                    'bold-text': require('./assets/fonts/Roboto-Bold.ttf'),
                });
            } catch (e) {
                Alert.alert(`Ошибка: ${e} `);
            } finally {
                setIsReady(true);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (isReady) {
                await SplashScreen.hideAsync();
            }
        })();
    }, [isReady]);

    if (!isReady) {
        return null;
    }
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    );
}
