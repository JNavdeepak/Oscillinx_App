import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';

const { width, height } = Dimensions.get('window');

const homeBrown = '#4E1D02';
const backBrown = '#C5A790';
const cardRadius = 20;

const DashboardScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Dashboard'>>();

    return (
        <View style={{ flex: 1, backgroundColor: backBrown }}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Header */}
                <View style={styles.headerRow}>
                    <View style={styles.headerAvatar}>
                        <Image
                            source={require('../assets/Oscillinx-2.png')}
                            style={{ width: width * 0.15, height: width * 0.15 }}
                        />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>AI Assistant</Text>
                        <Text style={styles.headerSubtitle}>Your intelligent companion</Text>
                    </View>
                    <View style={styles.headerStatusContainer}>
                        <View style={styles.headerOnlineDot} />
                        <Text style={styles.headerOnlineTxt}>Online</Text>
                    </View>
                    <View style={styles.headerMenu}>
                        <Image
                            source={require('../assets/user.png')}
                            style={{ width: width * 0.1, height: width * 0.1, tintColor: homeBrown }}
                        />
                    </View>
                </View>

                {/* Welcome Back Card */}
                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeTitle}>Welcome back!</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Ready to explore AI capabilities?
                    </Text>
                    <View style={styles.modelCard}>
                        <View style={styles.modelIconWrap}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/4036/4036788.png' }} style={{ width: width * 0.04, height: width * 0.04, tintColor: backBrown }} />
                        </View>
                        <View>
                            <Text style={styles.modelName}>AI Model: GPT-4</Text>
                            <Text style={styles.modelDesc}>High performance mode</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.welcomeGear}>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png' }} style={{ width: width * 0.08, height: width * 0.08, tintColor: homeBrown }} />
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickRow}>
                    <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Chat')}>
                        <View style={styles.quickIconWrap}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3114/3114735.png' }} style={{ width: width * 0.04, height: width * 0.04, tintColor: homeBrown }} />
                        </View>
                        <View>
                            <Text style={styles.quickCardTitle}>Chat</Text>
                            <Text style={styles.quickCardDesc}>Start a conversation with AI</Text>
                        </View>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5343/5343102.png' }} style={{ width: width * 0.04, height: width * 0.04, tintColor: '#fff7e8', marginLeft: width * 0.26 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickCard}>
                        <View style={styles.quickIconWrap}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1250/1250990.png' }} style={{ width: width * 0.04, height: width * 0.04, tintColor: homeBrown }} />
                        </View>
                        <View>
                            <Text style={styles.quickCardTitle}>Summarize</Text>
                            <Text style={styles.quickCardDesc}>Get quick summaries of content</Text>
                        </View>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5343/5343102.png' }} style={{ width: width * 0.04, height: width * 0.04, tintColor: "#fff7e8", marginLeft: width * 0.19 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickCard}>
                        <View style={styles.quickIconWrap}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/16806/16806660.png' }} style={{ width: width * 0.04, height: width * 0.04, tintColor: homeBrown }} />
                        </View>
                        <View>
                            <Text style={styles.quickCardTitle}>Models</Text>
                            <Text style={styles.quickCardDesc}>Explore AI model options</Text>
                        </View>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5343/5343102.png' }} style={{ width: width * 0.04, height: width * 0.04, tintColor: "#fff7e8", marginLeft: width * 0.3 }} />
                    </TouchableOpacity>
                </View>

                {/* Usage Stats */}
                <Text style={styles.sectionTitle}>Usage Stats</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statsCard}>
                        <Text style={styles.statsValue}>24</Text>
                        <Text style={styles.statsLabel}>Messages</Text>
                        <Text style={styles.statsSubtle}>Today</Text>
                    </View>
                    <View style={styles.statsCard}>
                        <Text style={styles.statsValue}>2.4h</Text>
                        <Text style={styles.statsLabel}>Usage time</Text>
                        <Text style={styles.statsSubtle}>Total</Text>
                    </View>
                </View>

                {/* Recent Activity */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.activityGroup}>
                    <View style={styles.activityCard}>
                        <View style={styles.activityLeft}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1782/1782357.png' }} style={{ width: width * 0.052, height: width * 0.052, tintColor: homeBrown }} />
                            <Text style={styles.activityTitle}>AI Chat Session</Text>
                        </View>
                        <View style={styles.activityDotActive} />
                        <Text style={styles.activityTime}>2 minutes ago</Text>
                    </View>
                    <View style={styles.activityCard}>
                        <View style={styles.activityLeft}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/684/684872.png' }} style={{ width: width * 0.052, height: width * 0.052, tintColor: homeBrown }} />
                            <Text style={styles.activityTitle}>Document Summary</Text>
                        </View>
                        <View style={styles.activityDotBlue} />
                        <Text style={styles.activityTime}>15 minutes ago</Text>
                    </View>
                    <View style={styles.activityCard}>
                        <View style={styles.activityLeft}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png' }} style={{ width: width * 0.052, height: width * 0.052, tintColor: homeBrown }} />
                            <Text style={styles.activityTitle}>Model Updated</Text>
                        </View>
                        <View style={styles.activityDotOrange} />
                        <Text style={styles.activityTime}>1 hour ago</Text>
                    </View>
                </View>

                {/* Explore Features */}
                <Text style={styles.sectionTitle}>Explore Features</Text>
                <View style={styles.featuresGroup}>
                    <View style={styles.featureCard}>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png' }} style={{ width: width * 0.08, height: width * 0.08, tintColor: homeBrown }} />
                        <Text style={styles.featureTitle}>Image Gen</Text>
                        <Text style={styles.featureDesc}>Create images with AI</Text>
                    </View>
                    <View style={styles.featureCard}>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png' }} style={{ width: width * 0.08, height: width * 0.08, tintColor: homeBrown }} />
                        <Text style={styles.featureTitle}>Code Help</Text>
                        <Text style={styles.featureDesc}>Programming assistance</Text>
                    </View>
                    <View style={styles.featureCard}>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png' }} style={{ width: width * 0.08, height: width * 0.08, tintColor: homeBrown }} />
                        <Text style={styles.featureTitle}>Translate</Text>
                        <Text style={styles.featureDesc}>Multi-language support</Text>
                    </View>
                    <View style={styles.featureCard}>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png' }} style={{ width: width * 0.08, height: width * 0.08, tintColor: homeBrown }} />
                        <Text style={styles.featureTitle}>Analytics</Text>
                        <Text style={styles.featureDesc}>Usage insights</Text>
                    </View>
                </View>
            </ScrollView >

            {/* Tab Bar - static, outside ScrollView */}
            < View style={styles.tabBar} >
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/6997/6997164.png' }}
                        style={{ width: width * 0.065, height: width * 0.065, tintColor: "#fff7e8", bottom: height * 0.01 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2983/2983720.png' }}
                        style={{ width: width * 0.065, height: width * 0.065, tintColor: "#fff7e8", bottom: height * 0.01 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Models')}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/15553/15553777.png' }}
                        style={{ width: width * 0.065, height: width * 0.065, tintColor: "#fff7e8", bottom: height * 0.01 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9637/9637797.png' }}
                        style={{ width: width * 0.065, height: width * 0.065, tintColor: "#fff7e8", bottom: height * 0.01 }}
                    />
                </TouchableOpacity>
            </View >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: width * 0.03,
        paddingHorizontal: width * 0.04,
        paddingBottom: width * 0.2,
        minHeight: height + width * 0.18,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.02,
        marginTop: height * 0.05,
    },
    headerAvatar: {
        width: width * 0.07,
        height: width * 0.07,
        borderRadius: width * 0.04,
        marginRight: width * 0.08,
        right: width * 0.015,
        bottom: height * 0.016,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: homeBrown,
        fontSize: width * 0.047,
        marginBottom: 2,
    },
    headerSubtitle: {
        color: homeBrown,
        fontSize: width * 0.033,
    },
    headerStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: width * 0.01,
    },
    headerOnlineDot: {
        width: 12,
        height: 12,
        backgroundColor: '#78CA7E',
        borderRadius: 6,
        marginRight: 4,
    },
    headerOnlineTxt: {
        fontWeight: '700',
        color: '#78CA7E',
        fontSize: width * 0.040,
    },
    headerMenu: {
        marginLeft: width * 0.01,
    },
    welcomeCard: {
        backgroundColor: '#D9C2AB',
        borderRadius: cardRadius,
        padding: width * 0.03,
        marginBottom: height * 0.01,
    },
    welcomeTitle: {
        color: homeBrown,
        fontWeight: 'bold',
        fontSize: width * 0.068,
        marginBottom: 2,
    },
    welcomeSubtitle: {
        color: homeBrown,
        fontSize: width * 0.043,
        marginBottom: 6,
    },
    modelCard: {
        backgroundColor: backBrown,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 18,
        padding: 8,
        marginTop: 8,
    },
    modelIconWrap: {
        backgroundColor: homeBrown,
        borderRadius: 13,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    modelName: {
        fontWeight: 'bold',
        color: homeBrown,
        fontSize: width * 0.045,
    },
    modelDesc: {
        color: homeBrown,
        fontSize: width * 0.029,
    },
    welcomeGear: {
        position: 'absolute',
        top: width * 0.025,
        right: width * 0.025,
    },

    sectionTitle: {
        color: homeBrown,
        fontWeight: 'bold',
        fontSize: width * 0.048,
        marginVertical: 9,
        marginTop: 12,
    },
    quickRow: {
        marginBottom: 6,
    },
    quickCard: {
        backgroundColor: homeBrown,
        borderRadius: cardRadius,
        padding: width * 0.031,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 7,
        shadowColor: homeBrown,
        elevation: 4,
    },
    quickIconWrap: {
        backgroundColor: backBrown,
        borderRadius: 13,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    quickCardTitle: {
        color: '#fff7e8',
        fontWeight: 'bold',
        fontSize: width * 0.04,
    },
    quickCardDesc: {
        color: '#fff7e8',
        fontSize: width * 0.03,
    },
    quickArrow: {
        marginLeft: 'auto',
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3,
    },
    statsCard: {
        backgroundColor: '#E6D2BF',
        borderRadius: cardRadius,
        flex: 1,
        margin: 4,
        alignItems: 'center',
        padding: width * 0.04,
    },
    statsValue: {
        color: homeBrown,
        fontWeight: 'bold',
        fontSize: width * 0.055,
        marginBottom: 5,
    },
    statsLabel: {
        color: homeBrown,
        fontSize: width * 0.035,
        fontWeight: '700',
    },
    statsSubtle: {
        color: homeBrown,
        fontSize: width * 0.028,
    },

    activityGroup: {
        marginVertical: 4,
    },
    activityCard: {
        backgroundColor: '#E6D2BF',
        borderRadius: cardRadius,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 4,
        padding: width * 0.025,
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityTitle: {
        color: homeBrown,
        fontWeight: '700',
        fontSize: width * 0.042,
        marginLeft: 9,
    },
    activityDotActive: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#13D65D',
        marginRight: 9,
        marginLeft: 4,
    },
    activityDotBlue: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#338AEA',
        marginRight: 9,
        marginLeft: 4,
    },
    activityDotOrange: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#E6A936',
        marginRight: 9,
        marginLeft: 4,
    },
    activityTime: {
        color: homeBrown,
        fontSize: width * 0.038,
    },

    featuresGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    featureCard: {
        width: width * 0.41,
        backgroundColor: '#E6D2BF',
        borderRadius: cardRadius,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 7,
        marginBottom: 9,
        shadowColor: '#D9C2AB',
        elevation: 3,
    },
    featureTitle: {
        color: homeBrown,
        fontWeight: 'bold',
        fontSize: width * 0.045,
        marginVertical: 2,
    },
    featureDesc: {
        color: homeBrown,
        fontSize: width * 0.033,
    },

    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: homeBrown,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 30,
        borderBottomLeftRadius: 31,
        borderBottomRightRadius: 31,
    },
});

export default DashboardScreen;
