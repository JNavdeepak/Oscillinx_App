import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';

const { width, height } = Dimensions.get('window');

// Colors
const homeBrown = '#4E1D02';
const backBrown = '#C5A790';
const msgBrown = '#633513';
const borderRadius = 22;

const messages = [
    { type: 'system', text: "Welcome! How can I assist you today?", time: '' },

    { type: 'user', text: "Hello! Can you help me understand how machine learning works?", time: "2:34 PM" },
    {
        type: 'bot',
        text: "I'd be happy to help! Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.",
        time: "2:34 PM"
    },
    { type: 'user', text: "That's interesting! Can you give me a simple example?", time: "2:35 PM" },
    {
        type: 'bot',
        text: "Absolutely! Think of email spam detection. Instead of programming rules for every possible spam email, we feed the system thousands of examples of spam and legitimate emails. The algorithm learns patterns and can then identify new spam emails it has never seen before.",
        time: "2:35 PM"
    },
    { type: 'user', text: "Perfect explanation! What are the main types of machine learning?", time: "2:36 PM" }
];

const ChatScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Chat'>>();

    return (
        <View style={{ backgroundColor: backBrown, flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerArrow} onPress={() => navigation.goBack()}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2732/2732652.png' }}
                        style={{ width: width * 0.05, height: width * 0.05, tintColor: '#fff', bottom: height * 0.006, right: width * 0.03 }}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Llama-2 7B</Text>
                <TouchableOpacity>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/152/152415.png' }}
                        style={{ width: width * 0.03, height: width * 0.03, tintColor: '#fff', bottom: height * 0.007, right: width * 0.18 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerStack} onPress={() => navigation.navigate('Models')}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1203/1203985.png' }}
                        style={{ width: width * 0.05, height: width * 0.05, tintColor: '#fff', left: width * 0.03, bottom: height * 0.005 }}
                    />
                </TouchableOpacity>
            </View>

            {/* Chat Bubble Area */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ paddingVertical: width * 0.04, paddingHorizontal: width * 0.045, paddingBottom: 96 }}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((msg, idx) => {
                    if (msg.type === 'system') {
                        return (
                            <View key={idx} style={styles.systemMsgBubble}>
                                <Text style={styles.systemMsgText}>{msg.text}</Text>
                            </View>
                        );
                    }
                    if (msg.type === 'user') {
                        return (
                            <View key={idx} style={styles.userMsgRow}>
                                <View style={styles.userMsgBubble}>
                                    <Text style={styles.userMsgText}>{msg.text}</Text>
                                </View>
                                <Text style={styles.msgTime}>{msg.time}</Text>
                            </View>
                        );
                    }
                    // bot messages
                    return (
                        <View key={idx} style={styles.botMsgRow}>
                            <View style={styles.botMsgBubble}>
                                <Text style={styles.botMsgText}>{msg.text}</Text>
                            </View>
                            <Text style={styles.msgTime}>{msg.time}</Text>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Message Input Bar */}
            <View style={styles.inputBarWrapper}>
                <TouchableOpacity style={styles.attachBtn}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/18561/18561830.png' }}
                        style={styles.attachIcon}
                    />
                </TouchableOpacity>
                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor="#ADAEBC"
                        underlineColorAndroid="transparent"
                    />
                </View>
                <TouchableOpacity style={styles.sendBtn}>
                    <View style={styles.sendCircle}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9290/9290348.png' }}
                            style={styles.sendIcon}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: homeBrown,
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
    },
    headerStack: {
        alignItems: 'center',
        width: width * 0.12,
    },
    scroll: {
        flex: 1,
        backgroundColor: backBrown,
    },
    systemMsgBubble: {
        marginBottom: 20,
        alignSelf: 'center',
        backgroundColor: '#EDE2DC',
        borderRadius: 16,
        paddingVertical: width * 0.018,
        paddingHorizontal: width * 0.06,
        maxWidth: '90%',
    },
    systemMsgText: {
        color: '#61717C',
        fontSize: width * 0.04,
        fontWeight: '500',
        textAlign: 'center',
    },
    userMsgRow: {
        marginBottom: 18,
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    userMsgBubble: {
        backgroundColor: msgBrown,
        borderRadius: borderRadius,
        borderBottomRightRadius: borderRadius * 0.28,
        marginBottom: 2,
        paddingVertical: width * 0.034,
        paddingHorizontal: width * 0.04,
        maxWidth: width * 0.80,
    },
    userMsgText: {
        color: '#fff',
        fontSize: width * 0.04,
        fontWeight: '400',
        letterSpacing: 0.06,
    },
    botMsgRow: {
        marginBottom: 18,
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    botMsgBubble: {
        backgroundColor: '#F8F5F0',
        borderRadius: borderRadius,
        borderBottomLeftRadius: borderRadius * 0.28,
        marginBottom: 2,
        paddingVertical: width * 0.032,
        paddingHorizontal: width * 0.04,
        maxWidth: width * 0.87,
    },
    botMsgText: {
        color: '#472512',
        fontSize: width * 0.04,
        fontWeight: '400',
        letterSpacing: 0.04,
    },
    msgTime: {
        fontSize: width * 0.033,
        color: "#866C5E",
        marginHorizontal: 2,
        marginTop: 2,
    },
    inputBarWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        paddingBottom: width * 0.1,
        paddingHorizontal: width * 0.04,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
    },
    attachBtn: {
        marginRight: width * 0.018,
        alignSelf: 'flex-end'
    },
    attachIcon: {
        width: width * 0.07,
        height: width * 0.07,
        tintColor: '#6B6B76',
        opacity: 0.8,
        right: width * 0.05,
        top: height * 0.005,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    inputArea: {
        width: width * 0.65, // sets fixed width, adjust for more or less
        backgroundColor: '#F3F4F6',
        borderRadius: width * 0.05,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width * 0.045,
        minHeight: width * 0.135,
        top: height * 0.015,
        right: width * 0.035,
    },
    input: {
        flex: 1,
        fontSize: width * 0.035,
        color: "#FFF",
        fontWeight: '500',
        backgroundColor: 'transparent',
        paddingVertical: 0,
    },
    sendBtn: {
        marginLeft: -width * 0.055, // slightly overlap right edge for floating button
        zIndex: 5,
        alignSelf: 'center',
    },
    sendCircle: {
        backgroundColor: homeBrown,
        width: width * 0.12,
        height: width * 0.12,
        borderRadius: width * 0.065,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.13,
        shadowRadius: 8,
        shadowOffset: { width: 2, height: 4 },
        elevation: 8,
        top: height * 0.013,
        left: width * 0.06,
    },
    sendIcon: {
        width: width * 0.05,
        height: width * 0.05,
        tintColor: "#fff",
        marginLeft: 1,
        top: height * 0.002,
        right: width * 0.004,
    },
});

export default ChatScreen;
