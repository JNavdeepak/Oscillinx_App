import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';

const { width, height } = Dimensions.get('window');
const darkBrown = '#4E1D02';
const bgBrown = '#C5A790';
const cardBrown = '#623A1D';
const metricBrown = '#522B15';
const orange = '#E78727';
const badgeColor = '#ffb76a';
const green = '#4C9D38';
const borderR = 18;

// Top summary metric
const TopMetricCard = ({
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}) => (
    <View style={[styles.metricCard, { backgroundColor: color }]}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
    </View>
);

// Avatar for models
const ModelIcon = ({
    icon,
    color,
}: {
    icon: string;
    color: string;
}) => (
    <View style={{
        backgroundColor: color + '18',
        width: width * 0.11,
        height: width * 0.11,
        borderRadius: width * 0.055,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: width * 0.03,
    }}>
        <Text style={{ fontSize: width * 0.06 }}>{icon}</Text>
    </View>
);

// Download/Active/Available badge
const StatusBadge = ({
    text,
    color = badgeColor,
}: {
    text: string;
    color?: string;
}) => (
    <View style={{ backgroundColor: color, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 3, marginLeft: 8 }}>
        <Text style={{ color: darkBrown, fontWeight: 'bold', fontSize: width * 0.032 }}>{text}</Text>
    </View>
);

const ModelsScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Models'>>();

    return (
        <View style={{ backgroundColor: bgBrown, flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerArrow} onPress={() => navigation.goBack()}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2732/2732652.png' }}
                        style={{ width: width * 0.05, height: width * 0.05, tintColor: '#fff', bottom: height * 0.006, right: width * 0.03 }}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Models</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: width * 0.2 }}>
                {/* Top Metrics */}
                <View style={styles.metricRow}>
                    <TopMetricCard
                        icon={<Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/25/25407.png' }}
                            style={{ width: width * 0.05, height: width * 0.05, tintColor: '#fff' }}
                        />}
                        label="Downloaded"
                        value="12"
                        color={metricBrown}
                    />
                    <TopMetricCard
                        icon={<Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9073/9073187.png' }}
                            style={{ width: width * 0.05, height: width * 0.05, tintColor: '#fff' }}
                        />}
                        label="Active"
                        value="3"
                        color={metricBrown}
                    />
                    <TopMetricCard
                        icon={<Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/17981/17981948.png' }}
                            style={{ width: width * 0.05, height: width * 0.05, tintColor: '#fff' }}
                        />}
                        label="Storage"
                        value="8.2GB"
                        color={metricBrown}
                    />
                </View>

                {/* Active Model */}
                <Text style={styles.activeLabel}>Active Model</Text>
                <View style={styles.activeCardOuter}>
                    <View style={styles.activeCardInner}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ModelIcon color={green} icon="🌲" />
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: width * 0.053, flexShrink: 1 }}>
                                    GPT-4 Turbo
                                </Text>
                                <View style={{
                                    width: 12, height: 12, backgroundColor: green, borderRadius: 6,
                                    marginLeft: 7, marginBottom: 3, alignSelf: 'center'
                                }} />
                            </View>
                        </View>
                        <Text style={{ color: '#B8B2AF', marginBottom: 3, fontWeight: '500', fontSize: width * 0.034 }}>
                            Open AI • v1.2.3
                        </Text>
                        <Text style={styles.cardSubLabel}>Performance</Text>
                        <View style={styles.barBg}><View style={[styles.barFill, { width: '95%', backgroundColor: '#5FC37E' }]} /></View>
                        <Text style={styles.barInfo}>95%</Text>
                        <Text style={styles.cardSubLabel}>Memory Usage</Text>
                        <View style={styles.barBg}><View style={[styles.barFill, { width: '52%', backgroundColor: '#64AFFF' }]} /></View>
                        <Text style={styles.memInfo}>4.2GB / 8GB</Text>
                        <View style={styles.activeActionRow}>
                            <TouchableOpacity style={styles.activeBtn}><Text style={styles.activeBtnText}>⏸ Pause</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.settingsBtn}><Text style={styles.activeBtnText2}>⚙️ Settings</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Available Models */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: width * 0.07, marginBottom: 5, paddingHorizontal: width * 0.01 }}>
                    <Text style={styles.sectionLabel}>Available Models</Text>
                    <TouchableOpacity style={{ marginLeft: 'auto', marginRight: 6 }}>
                        <Text style={{ color: orange, fontWeight: 'bold', fontSize: width * 0.038 }}>+ Add New</Text>
                    </TouchableOpacity>
                </View>

                {/* Model List Cards */}
                <View>
                    {/* Model 1 */}
                    <View style={styles.modelCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <ModelIcon color="#5DAAFD" icon="🤖" />
                            <Text style={styles.modelName}>Claude Sonnet 3.5</Text>
                            <StatusBadge text="Downloaded" />
                        </View>
                        <Text style={styles.modelMeta}>Anthropic • v3.5.2</Text>
                        <View style={styles.modelDescRow}>
                            <Text style={styles.modelDesc}>🗄 2.8GB</Text>
                            <Text style={styles.modelDesc}>⚡ Speed: Fast</Text>
                        </View>
                        <TouchableOpacity style={styles.modelMainBtn}>
                            <Text style={styles.modelMainBtnTxt}>⇄ Switch</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Model 2 */}
                    <View style={styles.modelCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <ModelIcon color="#994EBA" icon="🧠" />
                            <Text style={styles.modelName}>Llama 3.1 70B</Text>
                            <StatusBadge text="Downloading" color="#ffc07e" />
                        </View>
                        <Text style={styles.modelMeta}>Meta • v3.1.0</Text>
                        <Text style={[styles.modelDesc, { marginTop: 1, marginBottom: width * 0.014 }]}>Download Progress</Text>
                        <View style={styles.barBg}><View style={[styles.barFill, { width: '68%', backgroundColor: orange }]} /></View>
                        <View style={styles.modelDescRow}>
                            <Text style={styles.modelDesc}>4.8GB / 7.1GB</Text>
                            <Text style={styles.modelDesc}>2.3MB/s</Text>
                        </View>
                        <View style={styles.modelActionRow}>
                            <TouchableOpacity style={[styles.modelMainBtn, { flex: 1 }]}>
                                <Text style={styles.modelMainBtnTxt}>⏸ Pause</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtn}><Text style={styles.cancelBtnTxt}>✕</Text></TouchableOpacity>
                        </View>
                    </View>
                    {/* Model 3 */}
                    <View style={styles.modelCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <ModelIcon color="#CB4A6C" icon="🌐" />
                            <Text style={styles.modelName}>Gemini Pro</Text>
                            <StatusBadge text="Available" color="#B6ECF0" />
                        </View>
                        <Text style={styles.modelMeta}>Google • v1.5.0</Text>
                        <View style={styles.modelDescRow}>
                            <Text style={styles.modelDesc}>🗄 3.2GB</Text>
                            <Text style={styles.modelDesc}>⭐ Rating: 4.8</Text>
                        </View>
                        <TouchableOpacity style={[styles.modelMainBtn, { backgroundColor: orange }]}>
                            <Text style={[styles.modelMainBtnTxt, { color: '#fff' }]}>⬇️ Download</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Model 4 */}
                    <View style={styles.modelCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <ModelIcon color="#4C9D38" icon="💻" />
                            <Text style={styles.modelName}>CodeLlama 34B</Text>
                            <StatusBadge text="Downloaded" />
                        </View>
                        <Text style={styles.modelMeta}>Meta • v2.0.1</Text>
                        <View style={styles.modelDescRow}>
                            <Text style={styles.modelDesc}>🗄 1.9GB</Text>
                            <Text style={styles.modelDesc}>⚡ Type: Code</Text>
                        </View>
                        <View style={styles.modelActionRow}>
                            <TouchableOpacity style={styles.modelMainBtn}>
                                <Text style={styles.modelMainBtnTxt}>⇄ Switch</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtnSmall}><Text style={styles.cancelBtnTxt}>🗑️</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Tab Bar - static, outside ScrollView */}
            <View style={styles.tabBar}>
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: darkBrown,
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
        top: height * 0.003,
    },
    headerTitle: {
        color: '#FBEFE0',
        fontSize: width * 0.05,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginBottom: 3,
        letterSpacing: 0.3,
        right: width * 0.06,
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.045,
        marginTop: width * 0.051,
        marginBottom: width * 0.042,
    },
    metricCard: {
        flex: 1,
        backgroundColor: metricBrown,
        borderRadius: borderR,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 6,
        height: width * 0.18,
        shadowColor: "#4E2A14",
        shadowOpacity: 0.10,
        shadowRadius: 7,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
    },
    metricValue: {
        color: "#ffb76a",
        fontWeight: "bold",
        fontSize: width * 0.08,
        marginBottom: 3,
    },
    metricLabel: {
        color: '#fff',
        fontSize: width * 0.038,
        fontWeight: '600',
        opacity: 0.97,
    },
    activeLabel: {
        color: darkBrown,
        fontSize: width * 0.053,
        fontWeight: 'bold',
        marginLeft: width * 0.052,
        marginTop: 5,
        marginBottom: 7,
        letterSpacing: 0.1,
    },
    sectionLabel: {
        fontSize: width * 0.044,
        fontWeight: "bold",
        color: darkBrown,
        letterSpacing: 0.15,
        marginLeft: 5,
    },
    activeCardOuter: {
        backgroundColor: "transparent",
        borderRadius: borderR + 2,
        padding: 2,
        borderWidth: 2,
        borderColor: "#4FC96B",
        marginHorizontal: width * 0.03,
        marginBottom: width * 0.032,
        shadowColor: "#649D42",
        shadowOpacity: 0.11,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
    },
    activeCardInner: {
        backgroundColor: cardBrown,
        borderRadius: borderR,
        padding: width * 0.036,
    },
    cardSubLabel: {
        color: "#ffe2bc",
        fontWeight: "700",
        marginTop: 8,
        fontSize: width * 0.034,
    },
    barBg: {
        width: '100%',
        height: 11,
        borderRadius: 7,
        backgroundColor: "#40322a",
        marginVertical: 4,
        overflow: "hidden",
    },
    barFill: {
        borderRadius: 7,
        height: '100%',
    },
    barInfo: {
        position: 'absolute',
        right: 17,
        top: 102,
        color: "#F7C77C",
        fontWeight: "600",
        fontSize: width * 0.038,
    },
    memInfo: {
        position: 'absolute',
        right: 17,
        top: 152,
        color: "#FBEFE0",
        fontWeight: "600",
        fontSize: width * 0.034,
    },
    activeActionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 17,
        gap: 10,
    },
    activeBtn: {
        backgroundColor: orange,
        borderRadius: 11,
        paddingVertical: 8,
        paddingHorizontal: 23,
        marginRight: 7,
    },
    activeBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: width * 0.046,
    },
    settingsBtn: {
        backgroundColor: "#5B3921",
        borderRadius: 11,
        paddingVertical: 8,
        paddingHorizontal: 22,
        marginLeft: 6,
    },
    activeBtnText2: {
        color: "#FFD38C",
        fontWeight: "bold",
        fontSize: width * 0.043,
    },

    modelCard: {
        backgroundColor: cardBrown,
        borderRadius: borderR,
        padding: width * 0.038,
        marginHorizontal: width * 0.035,
        marginBottom: width * 0.037,
        shadowColor: "#4E2A14",
        shadowOpacity: 0.091,
        shadowRadius: 9,
        shadowOffset: { width: 0, height: 5 },
        elevation: 2,
    },
    modelName: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: width * 0.051,
        marginBottom: 1,
        marginRight: 7,
    },
    modelMeta: {
        color: "#D7C8BA",
        fontWeight: "500",
        marginBottom: 3,
        fontSize: width * 0.034,
    },
    modelDescRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    modelDesc: {
        color: "#ffe7d7",
        fontWeight: "500",
        fontSize: width * 0.038,
        marginRight: 13,
    },
    modelMainBtn: {
        marginTop: width * 0.025,
        backgroundColor: "#FFD1A6",
        paddingVertical: 11,
        borderRadius: 14,
        alignItems: "center",
    },
    modelMainBtnTxt: {
        color: cardBrown,
        fontWeight: "bold",
        fontSize: width * 0.047,
    },
    modelActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: width * 0.012,
    },
    cancelBtn: {
        backgroundColor: "transparent",
        borderWidth: 1.7,
        borderColor: "#fec38d",
        borderRadius: 13,
        paddingVertical: 11,
        paddingHorizontal: 23,
        marginLeft: 13,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelBtnSmall: {
        backgroundColor: "transparent",
        borderWidth: 1.7,
        borderColor: "#fec38d",
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 11,
        marginLeft: 13,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelBtnTxt: {
        color: orange,
        fontWeight: 'bold',
        fontSize: width * 0.042,
    },
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#4E1D02',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 30,
        borderBottomLeftRadius: 31,
        borderBottomRightRadius: 31,
    },
});

export default ModelsScreen;
