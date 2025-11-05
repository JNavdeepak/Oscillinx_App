import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';

const { width, height } = Dimensions.get('window');
const SplashScreen: React.FC = () => {
    const loaderAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        Animated.timing(loaderAnim, {
            toValue: width * 0.25,
            duration: 1800,
            useNativeDriver: false,
        }).start(() => {
            navigation.replace('Welcome');
        });
    }, []);

    return (
        <LinearGradient
            colors={['#4E1D02', '#6B2B0A', '#8B3F19', '#7C472B']}
            locations={[0, 0.25, 0.75, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <View style={styles.logoWrapper}>
                <Image
                    source={require('../assets/Oscillinx-1.png')}
                    style={styles.logo}
                />
            </View>
            <Text style={styles.appName}>Oscillinx</Text>
            <Text style={styles.subtitle}>Ready, Set, Go</Text>
            <Animated.View style={[
                styles.loader,
                { width: loaderAnim }
            ]} />
            <Text style={styles.version}>Version 1.0.0</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoWrapper: {
        marginBottom: height * 0.04,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
    },
    appName: {
        fontFamily: 'Griffy-Regular',
        color: '#C5A790',
        fontWeight: 'bold',
        fontSize: width * 0.09,
        letterSpacing: 2,
        marginBottom: height * 0.02,
        bottom: height * 0.05,
    },
    subtitle: {
        color: '#FFF',
        fontSize: width * 0.04,
        letterSpacing: 1,
        top: height * 0.18,
    },
    loader: {
        height: 2,
        backgroundColor: '#C5A790',
        marginVertical: height * 0.03,
        borderRadius: 2,
        top: height * 0.18,
        // no width here, animated width applied in render
    },
    version: {
        position: 'absolute',
        bottom: height * 0.045,
        color: '#FFF',
        fontSize: width * 0.025,
        opacity: 0.8,
        letterSpacing: 1,
    },
});

export default SplashScreen;
