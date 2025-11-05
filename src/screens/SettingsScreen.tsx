import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    TouchableOpacity,
    Switch,
    Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';

const { width, height } = Dimensions.get('window');
const borderR = 18;

const lightBg = '#F9EFE7';
const cardBg = '#C5A790';
const brown = '#4E1D02';
const tan = '#A78C7B';

const SettingRow = ({
    icon,
    label,
    desc,
    onPress,
    isDanger,
    next = true,
}: {
    icon?: React.ReactNode;
    label: string;
    desc?: string;
    onPress?: () => void;
    isDanger?: boolean;
    next?: boolean;
    style?: any;
}) => (
    <TouchableOpacity style={styles.listRow} onPress={onPress} activeOpacity={0.72}>
        {icon}
        <Text style={[styles.listRowLabel, isDanger && { color: '#E14D42' }]}>{label}</Text>
        {!!desc && <Text style={styles.listRowDesc}>{desc}</Text>}
        {next !== false && (
            <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5343/5343102.png' }}
                style={styles.nextArrow}
            />
        )}
    </TouchableOpacity>
);

const CustomSwitch = ({ value, onValueChange, disabled }: any) => (
    <Switch
        trackColor={{ false: '#EFE4DD', true: '#8A6848' }}
        thumbColor={value ? brown : tan}
        ios_backgroundColor="#EEE"
        onValueChange={onValueChange}
        value={value}
        disabled={disabled}
        style={{ transform: [{ scaleX: 1.12 }, { scaleY: 1.12 }] }}
    />
);

const SettingsScreen: React.FC = () => {
    // States for all toggles/sliders
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Settings'>>();
    const [smartSugg, setSmartSugg] = useState(true);
    const [autoC, setAutoC] = useState(true);
    const [learnM, setLearnM] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [animations, setAnimations] = useState(true);
    const [pushNotif, setPushNotif] = useState(false);
    const [emailUpd, setEmailUpd] = useState(false);
    const [soundFx, setSoundFx] = useState(true);
    const [fontSize, setFontSize] = useState(0.5);
    const [dataEnc, setDataEnc] = useState(true);
    const [privMode, setPrivMode] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: lightBg }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerArrow} onPress={() => navigation.goBack()}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2732/2732652.png' }}
                        style={{ width: width * 0.05, height: width * 0.05, tintColor: '#fff', bottom: height * 0.006, right: width * 0.03 }}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: width * 0.10 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: width * 0.13 }}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../assets/Navdeepak.png')}
                            style={styles.avatar}
                        />
                    </View>
                    <TouchableOpacity>
                        <View>
                            <Text style={styles.profileName}>Navdeepak</Text>
                            <Text style={styles.profileBadge}>Premium Member</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5343/5343102.png' }}
                            style={styles.forwardArrow}
                        />
                    </TouchableOpacity>
                </View>

                {/* AI Preferences */}
                <Text style={styles.sectionTitle}>AI Preferences</Text>
                <View style={styles.sectionCard}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Smart Suggestions</Text>
                            <Text style={styles.cardDesc}>Get AI-powered recommendations</Text>
                        </View>
                        <CustomSwitch value={smartSugg} onValueChange={setSmartSugg} />
                    </View>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Auto-Complete</Text>
                            <Text style={styles.cardDesc}>Complete text as you type</Text>
                        </View>
                        <CustomSwitch value={autoC} onValueChange={setAutoC} />
                    </View>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Learning Mode</Text>
                            <Text style={styles.cardDesc}>Adapt to your preferences</Text>
                        </View>
                        <CustomSwitch value={learnM} onValueChange={setLearnM} />
                    </View>
                    <View style={[styles.rowBetween, { marginTop: width * 0.013, alignItems: 'flex-end' }]}>
                        <Text style={styles.cardLabel}>Response Speed</Text>
                        <Text style={styles.cardLabel}>Fast</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        value={0.7}
                        minimumTrackTintColor="#3F74F1"
                        maximumTrackTintColor="#C3B19C"
                        thumbTintColor="#3576ED"
                        disabled={false}
                    />
                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderMini}>Slow</Text>
                        <Text style={styles.sliderMini}>Balanced</Text>
                        <Text style={styles.sliderMini}>Fast</Text>
                    </View>
                </View>

                {/* Appearance */}
                <Text style={styles.sectionTitle}>Appearance</Text>
                <View style={styles.sectionCard}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Dark Mode</Text>
                            <Text style={styles.cardDesc}>Use dark theme</Text>
                        </View>
                        <CustomSwitch value={darkMode} onValueChange={setDarkMode} />
                    </View>
                    <View style={[styles.rowBetween, { marginVertical: width * 0.01, alignItems: 'center' }]}>
                        <Text style={styles.cardLabel}>Font Size</Text>
                        <Text style={styles.cardDesc}>Medium</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        value={fontSize}
                        onValueChange={setFontSize}
                        minimumTrackTintColor="#3F74F1"
                        maximumTrackTintColor="#C3B19C"
                        thumbTintColor="#3576ED"
                    />
                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderMini}>Small</Text>
                        <Text style={styles.sliderMini}>Medium</Text>
                        <Text style={styles.sliderMini}>Large</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Animations</Text>
                            <Text style={styles.cardDesc}>Enable smooth transitions</Text>
                        </View>
                        <CustomSwitch value={animations} onValueChange={setAnimations} />
                    </View>
                </View>

                {/* Notifications */}
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.sectionCard}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Push Notifications</Text>
                            <Text style={styles.cardDesc}>Receive alerts and updates</Text>
                        </View>
                        <CustomSwitch value={pushNotif} onValueChange={setPushNotif} />
                    </View>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Email Updates</Text>
                            <Text style={styles.cardDesc}>Weekly digest and news</Text>
                        </View>
                        <CustomSwitch value={emailUpd} onValueChange={setEmailUpd} />
                    </View>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Sound Effects</Text>
                            <Text style={styles.cardDesc}>Audio feedback for actions</Text>
                        </View>
                        <CustomSwitch value={soundFx} onValueChange={setSoundFx} />
                    </View>
                </View>

                {/* Privacy & Security */}
                <Text style={styles.sectionTitle}>Privacy & Security</Text>
                <View style={styles.sectionCard}>
                    <SettingRow label="Biometric Lock" desc="Use fingerprint or Face ID" onPress={() => { }} />
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardLabel}>Data Encryption</Text>
                        <CustomSwitch value={dataEnc} onValueChange={setDataEnc} />
                    </View>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardLabel}>Private Mode</Text>
                        <CustomSwitch value={privMode} onValueChange={setPrivMode} />
                    </View>
                </View>

                {/* Account */}
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.sectionCard}>
                    <SettingRow label="Export Data" onPress={() => { }} next />
                    <SettingRow label="Clear Cache" onPress={() => { }} next />
                </View>

                {/* Support */}
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.sectionCard}>
                    <SettingRow label="Help Center" onPress={() => { }} next />
                    <SettingRow label="Contact Support" onPress={() => { }} next />
                    <SettingRow label="Rate App" onPress={() => { }} next />
                </View>

                {/* Sign Out Button */}
                {/* <TouchableOpacity
                    style={styles.signOutBtn}
                >
                    <Text style={styles.signOutBtnText}>Sign Out</Text>
                </TouchableOpacity> */}

                <Text style={styles.versionLabel}>Version 1.0.0</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: brown,
        height: width * 0.22,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: width * 0.035,
        paddingHorizontal: width * 0.03,
        justifyContent: 'space-between',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
    },
    headerArrow: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: width * 0.12,
    },
    headerTitle: {
        color: '#fff',
        fontSize: width * 0.05,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginBottom: 3,
        letterSpacing: 0.2,
        right: width * 0.01,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: cardBg,
        borderRadius: borderR + 3,
        marginHorizontal: width * 0.045,
        marginTop: width * 0.04,
        marginBottom: width * 0.025,
        padding: width * 0.03,
        shadowColor: "#836945",
        shadowOpacity: 0.04,
        shadowRadius: 9,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
    },
    avatarContainer: {
        marginRight: width * 0.03,
        borderRadius: width * 0.12,
        overflow: 'hidden',
    },
    avatar: {
        width: width * 0.115,
        height: width * 0.115,
        borderRadius: width * 0.06,
    },
    profileName: {
        color: brown,
        fontWeight: 'bold',
        fontSize: width * 0.053,
        marginBottom: 1,
        letterSpacing: 0.1,
    },
    profileBadge: {
        color: brown,
        fontSize: width * 0.033,
        opacity: 0.65,
    },
    nextArrow: {
        width: width * 0.03,
        height: width * 0.03,
        tintColor: '#79553D',
        opacity: 0.44,
        marginLeft: 10,
    },
    forwardArrow: {
        width: width * 0.03,
        height: width * 0.03,
        tintColor: '#79553D',
        opacity: 0.44,
        marginLeft: 10,
        left: width * 0.38,
    },
    sectionTitle: {
        color: brown,
        fontWeight: 'bold',
        fontSize: width * 0.041,
        marginLeft: width * 0.067,
        marginBottom: 5,
        marginTop: width * 0.045,
        letterSpacing: 0.16,
    },
    sectionCard: {
        backgroundColor: cardBg,
        borderRadius: borderR,
        marginHorizontal: width * 0.045,
        marginBottom: width * 0.018,
        padding: width * 0.033,
        shadowColor: "#D8BC98",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: width * 0.03,
    },
    cardLabel: {
        color: brown,
        fontSize: width * 0.040,
        fontWeight: '700',
        marginBottom: 1,
        letterSpacing: 0.1,
    },
    cardDesc: {
        color: brown,
        fontSize: width * 0.030,
        opacity: 0.63,
        fontWeight: '400',
    },
    slider: {
        width: '97%',
        alignSelf: 'center',
        marginVertical: width * 0.013,
    },
    sliderLabels: {
        width: '97%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginBottom: width * 0.011,
    },
    sliderMini: {
        color: '#757179', fontSize: width * 0.033,
    },
    listRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: width * 0.022,
        borderRadius: 11,
        marginBottom: -2,
    },
    listRowLabel: {
        fontSize: width * 0.041,
        color: brown,
        fontWeight: "600",
        flex: 1,
    },
    listRowDesc: {
        fontSize: width * 0.030,
        color: brown,
        opacity: 0.62,
        marginLeft: 8,
    },
    versionLabel: {
        color: '#A1775B',
        fontSize: width * 0.032,
        textAlign: 'center',
        marginTop: width * 0.09,
        opacity: 0.74,
        fontWeight: '600',
        letterSpacing: 1,
    },
    // signOutBtn: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     alignSelf: 'center',
    //     marginTop: width * 0.07,
    //     paddingVertical: width * 0.038,
    //     paddingHorizontal: width * 0.35,
    //     borderRadius: 16,
    //     backgroundColor: '#FFE5E2',
    //     elevation: 2,
    // },
    // signOutBtnText: {
    //     color: '#E14D42',
    //     fontWeight: 'bold',
    //     fontSize: width * 0.045,
    //     letterSpacing: 0.6,
    // },
});

export default SettingsScreen;
