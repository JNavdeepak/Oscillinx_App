import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Dimensions, ScrollView, Image,
    TouchableOpacity, Switch, Platform, ActivityIndicator
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';
import { supabase } from '../supabaseClient';

const { width, height } = Dimensions.get('window');
const borderR = 18;
const lightBg = '#F9EFE7';
const cardBg = '#C5A790';
const brown = '#4E1D02';
const tan = '#A78C7B';

type AppSettings = {
    id: string;
    smartSugg: boolean;
    autoC: boolean;
    learnM: boolean;
    darkMode: boolean;
    animations: boolean;
    pushNotif: boolean;
    emailUpd: boolean;
    soundFx: boolean;
    fontSize: number;
    dataEnc: boolean;
    privMode: boolean;
};

const CustomSwitch = ({ value, onValueChange, disabled }: { value: boolean; onValueChange: (val: boolean) => void; disabled: boolean }) => (
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

const SettingsScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Settings'>>();
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const TEST_USER_ID = 'test-user-123';

    const fetchSettings = async () => {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
            .from('settings')
            .select('*')
            .eq('userId', TEST_USER_ID)
            .single();

        if (fetchError) {
            setError('Could not load settings: ' + fetchError.message);
            setSettings(null);
        } else if (!data) {
            setSettings(null);
            setError(null);
        } else {
            setSettings(data as AppSettings);
            setError(null);
        }
        setLoading(false);
    };

    const updateSetting = async (field: keyof AppSettings, value: boolean | number) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
        await supabase.from('settings').update({ [field]: value }).eq('id', settings.id);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: lightBg }}>
                <ActivityIndicator size="large" color={brown} />
                <Text style={{ marginTop: 25, color: brown, fontWeight: '600', fontSize: 18 }}>Loading settings...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: lightBg }}>
                <Text style={{ color: '#B00020', fontWeight: 'bold', fontSize: 22, marginBottom: 8 }}>{error}</Text>
                <TouchableOpacity
                    style={{ marginTop: 8, backgroundColor: brown, paddingHorizontal: 27, paddingVertical: 12, borderRadius: 16 }}
                    onPress={fetchSettings}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!settings) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: lightBg }}>
                <Text style={{ color: brown, fontSize: 20, marginBottom: 13 }}>No settings found.</Text>
                <TouchableOpacity
                    style={{ marginTop: 7, backgroundColor: brown, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 14 }}
                    onPress={fetchSettings}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
                <View style={{ width: width * 0.1 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: width * 0.13 }}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../assets/navdeepak.png')} style={styles.avatar} />
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
                        <CustomSwitch value={settings.smartSugg} onValueChange={(val: boolean) => updateSetting('smartSugg', val)} disabled={loading} />
                    </View>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Auto-Complete</Text>
                            <Text style={styles.cardDesc}>Complete text as you type</Text>
                        </View>
                        <CustomSwitch value={settings.autoC} onValueChange={(val: boolean) => updateSetting('autoC', val)} disabled={loading} />
                    </View>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Learning Mode</Text>
                            <Text style={styles.cardDesc}>Adapt to your preferences</Text>
                        </View>
                        <CustomSwitch value={settings.learnM} onValueChange={(val: boolean) => updateSetting('learnM', val)} disabled={loading} />
                    </View>
                    <View style={[styles.rowBetween, { marginTop: width * 0.013, alignItems: 'flex-end' }]}>
                        <Text style={styles.cardLabel}>Response Speed</Text>
                        <Text style={styles.cardLabel}>Fast</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        value={settings.fontSize}
                        onValueChange={(val: number) => updateSetting('fontSize', val)}
                        minimumTrackTintColor="#3F74F1"
                        maximumTrackTintColor="#C3B19C"
                        thumbTintColor="#3576ED"
                        disabled={loading}
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
                        <CustomSwitch value={settings.darkMode} onValueChange={(val: boolean) => updateSetting('darkMode', val)} disabled={loading} />
                    </View>
                    <View style={[styles.rowBetween, { marginVertical: width * 0.01, alignItems: 'center' }]}>
                        <Text style={styles.cardLabel}>Font Size</Text>
                        <Text style={styles.cardDesc}>Medium</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        value={settings.fontSize}
                        onValueChange={(val: number) => updateSetting('fontSize', val)}
                        minimumTrackTintColor="#3F74F1"
                        maximumTrackTintColor="#C3B19C"
                        thumbTintColor="#3576ED"
                        disabled={loading}
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
                        <CustomSwitch value={settings.animations} onValueChange={(val: boolean) => updateSetting('animations', val)} disabled={loading} />
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
                        <CustomSwitch value={settings.pushNotif} onValueChange={(val: boolean) => updateSetting('pushNotif', val)} disabled={loading} />
                    </View>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Email Updates</Text>
                            <Text style={styles.cardDesc}>Weekly digest and news</Text>
                        </View>
                        <CustomSwitch value={settings.emailUpd} onValueChange={(val: boolean) => updateSetting('emailUpd', val)} disabled={loading} />
                    </View>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.cardLabel}>Sound Effects</Text>
                            <Text style={styles.cardDesc}>Audio feedback for actions</Text>
                        </View>
                        <CustomSwitch value={settings.soundFx} onValueChange={(val: boolean) => updateSetting('soundFx', val)} disabled={loading} />
                    </View>
                </View>

                {/* Privacy & Security */}
                <Text style={styles.sectionTitle}>Privacy & Security</Text>
                <View style={styles.sectionCard}>
                    <SettingRow label="Biometric Lock" desc="Use fingerprint or Face ID" onPress={() => { }} />
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardLabel}>Data Encryption</Text>
                        <CustomSwitch value={settings.dataEnc} onValueChange={(val: boolean) => updateSetting('dataEnc', val)} disabled={loading} />
                    </View>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardLabel}>Private Mode</Text>
                        <CustomSwitch value={settings.privMode} onValueChange={(val: boolean) => updateSetting('privMode', val)} disabled={loading} />
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
        shadowColor: '#836945',
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
        shadowColor: '#D8BC98',
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
        fontSize: width * 0.04,
        fontWeight: '700',
        marginBottom: 1,
        letterSpacing: 0.1,
    },
    cardDesc: {
        color: brown,
        fontSize: width * 0.03,
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
        color: '#757179',
        fontSize: width * 0.033,
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
        fontWeight: '600',
        flex: 1,
    },
    listRowDesc: {
        fontSize: width * 0.03,
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
});

export default SettingsScreen;
