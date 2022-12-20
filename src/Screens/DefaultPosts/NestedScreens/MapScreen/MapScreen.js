import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = ({ route }) => {
    const location = route.params;
    const checkLocaton =
        location.location === ''
            ? { latitude: 41.63888726004966, longitude: 41.613377714002574 }
            : location.location;
    return (
        <View style={styles.container}>
            <MapView
                style={styles.mapStyle}
                region={{
                    ...checkLocaton,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
            >
                {location && (
                    <Marker
                        title={location.locationName}
                        coordinate={location.location}
                        description={location.description}
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default MapScreen;
