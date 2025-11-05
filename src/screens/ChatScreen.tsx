import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';
import { supabase } from '../supabaseClient';

const { width, height } = Dimensions.get('window');
const homeBrown = '#4E1D02';
const backBrown = '#C5A790';
const msgBrown = '#633513';
const borderRadius = 22;

export type ChatMessage = {
    id: string;
    text: string;
    author?: string;
    created_at: string;
};

const ChatScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Chat'>>();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState<boolean>(false);
    const scrollRef = useRef<ScrollView>(null);

    // Fetch all chat messages from Supabase
    const fetchMessages = async () => {
        setLoading(true); setError(null);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            setError("Could not load messages: " + error.message);
            setMessages([]);
        } else {
            setMessages((data as ChatMessage[]) || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Send a message
    const handleSend = async () => {
        if (inputText.trim()) {
            setSending(true);
            const { error } = await supabase
                .from('messages')
                .insert([{ text: inputText, author: 'navdeepak' }]);
            setSending(false);
            if (error) {
                setError("Message send failed: " + error.message);
            } else {
                setInputText('');
                fetchMessages();
                setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                }, 300);
            }
        }
    };

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
                ref={scrollRef}
                style={styles.scroll}
                contentContainerStyle={{ paddingVertical: width * 0.04, paddingHorizontal: width * 0.045, paddingBottom: 96 }}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 50 }}>
                        <ActivityIndicator size="large" color={homeBrown} />
                        <Text style={{ marginTop: 18, color: homeBrown, fontWeight: '700' }}>Loading messages...</Text>
                    </View>
                ) : error ? (
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: "#B00020", fontWeight: 'bold', fontSize: width * 0.045, marginBottom: 4 }}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            style={{ marginTop: 14, backgroundColor: homeBrown, paddingHorizontal: 26, paddingVertical: 10, borderRadius: 14 }}
                            onPress={fetchMessages}
                        >
                            <Text style={{ color: "#fff", fontWeight: 'bold' }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : messages.length === 0 ? (
                    <View style={styles.systemMsgBubble}>
                        <Text style={styles.systemMsgText}>No messages. Say hello!</Text>
                    </View>
                ) : (
                    messages.slice().reverse().map((msg, idx) => {
                        const isUser = msg.author === 'navdeepak';
                        return (
                            <View key={msg.id || msg.created_at || idx} style={isUser ? styles.userMsgRow : styles.botMsgRow}>
                                <View style={isUser ? styles.userMsgBubble : styles.botMsgBubble}>
                                    <Text style={isUser ? styles.userMsgText : styles.botMsgText}>{msg.text}</Text>
                                </View>
                                <Text style={styles.msgTime}>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}</Text>
                            </View>
                        );
                    })
                )}
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
                        value={inputText}
                        onChangeText={setInputText}
                        editable={!sending && !loading && !error}
                    />
                </View>
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending || loading || !!error}>
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
};

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
        width: width * 0.65,
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
        color: "#222",
        fontWeight: '500',
        backgroundColor: 'transparent',
        paddingVertical: 0,
    },
    sendBtn: {
        marginLeft: -width * 0.055,
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
