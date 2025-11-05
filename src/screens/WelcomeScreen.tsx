import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const badgeData = [
    ['Smart AI', 'Analytics'],
    ['Secure', 'Fast', 'Mobile'],
];

const indicatorSize = width * 0.055;

const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Welcome'>>();

    return (
        <View style={styles.container}>
            {/* Main logo and golden sparkles (use RN svg or small yellow Views for sparkles if dynamic) */}
            <View style={styles.sparkleWrapper}>
                <Image source={require('../assets/Oscillinx-2.png')} style={styles.logo} />
            </View>
            <Text style={styles.title}>Welcome to</Text>
            <MaskedView maskElement={
                <Text style={styles.titleBold}>Oscillinx</Text>
            }>
                <LinearGradient
                    colors={['#4E1D02', '#4E1D02', '#C5A790']} // your gradient stops (adjust as per reference)
                    start={{ x: 0, y: 3 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: width * 0.75, height: width * 0.11 }}
                >
                    <Text style={[styles.titleBold, { opacity: 0 }]}>Oscillinx</Text>
                </LinearGradient>
            </MaskedView>
            <Text style={styles.desc}>Your AI-powered trading companion</Text>
            {/* Badges */}
            <View style={styles.badgeGroup}>
                {badgeData.map((row, idx) => (
                    <View key={idx} style={styles.badgeRow}>
                        {row.map(badge => (
                            <View key={badge} style={styles.badge}>
                                <Text style={styles.badgeTxt}>{badge}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
            {/* Get Started button */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dashboard')}>
                <Text style={styles.buttonTxt}>Get Started</Text>
            </TouchableOpacity>
            {/* Progress indicator */}
            <View style={styles.indicatorGroup}>
                <View style={styles.indicatorActive} />
                <View style={styles.indicatorInactive} />
                <View style={styles.indicatorInactive} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C5A790',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: height * 0.12,
    },
    sparkleWrapper: {
        alignItems: 'center',
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
    },
    title: {
        color: '#472512',
        fontSize: width * 0.095,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.006,
        letterSpacing: 0.2,
    },
    titleBold: {
        fontWeight: 'bold',
        fontSize: width * 0.090,
        textAlign: 'center',
    },
    desc: {
        color: '#2E2119',
        fontSize: width * 0.04,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: height * 0.02,
        marginTop: height * 0.02,
        letterSpacing: 0.1,
    },
    badgeGroup: {
        marginVertical: height * 0.015,
        marginBottom: height * 0.04,
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: height * 0.008,
    },
    badge: {
        backgroundColor: '#4E1D02',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.013,
        borderRadius: Math.min(width, height) * 0.11,
        marginHorizontal: width * 0.013,
        marginBottom: 2,
        minWidth: width * 0.22,
        alignItems: 'center',
        shadowColor: '#4E1D02',
        shadowOpacity: 0.12,
        shadowOffset: { width: 1, height: 3 },
        elevation: 4,
    },
    badgeTxt: {
        color: '#F3DAC0',
        fontSize: width * 0.04,
        fontWeight: '600',
        letterSpacing: 0.08,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4E1D02',
        width: width * 0.85,
        marginTop: height * 0.03,
        paddingVertical: height * 0.02,
        borderRadius: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.24,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        marginBottom: height * 0.03,
    },
    buttonTxt: {
        color: '#C5A790',
        fontWeight: 'bold',
        fontSize: width * 0.05,
        letterSpacing: 1,
    },
    indicatorGroup: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: indicatorSize,
    },
    indicatorActive: {
        width: indicatorSize * 1.5,
        height: indicatorSize * 0.41,
        borderRadius: indicatorSize * 0.25,
        backgroundColor: '#4E1D02',
        marginHorizontal: 3,
    },
    indicatorInactive: {
        width: indicatorSize * 0.51,
        height: indicatorSize * 0.41,
        borderRadius: indicatorSize * 0.25,
        backgroundColor: '#9C846F',
        marginHorizontal: 3,
        opacity: 0.9,
    },
});

export default WelcomeScreen;
