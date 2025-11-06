import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, StyleSheet, Dimensions, ScrollView, TextInput,
    Image, TouchableOpacity, ActivityIndicator,
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

// Backend configuration
const BACKEND_URL = 'http://192.168.1.X:5000'; // Replace X with your actual IP

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

    // ---- Active Model State ----
    const [activeModel, setActiveModel] = useState<any>(null);

    const fetchActiveModel = async () => {
        const { data, error } = await supabase
            .from('models')
            .select('*')
            .eq('is_active', true)
            .eq('status', 'downloaded')
            .maybeSingle();
        if (!error && data) setActiveModel(data);
        else setActiveModel(null);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchActiveModel();
            fetchMessages();
        });
        return unsubscribe;
    }, [navigation]);

    // Fetch all chat messages from Supabase
    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });
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

    // Send a message with AI response
    const handleSend = async () => {
        if (!activeModel) {
            setError("No active model selected — please select one on Models screen.");
            return;
        }

        if (!inputText.trim()) {
            return;
        }

        setSending(true);
        setError(null);

        try {
            // 1. Save user message to database
            const { error: insertError } = await supabase
                .from('messages')
                .insert([{
                    text: inputText,
                    author: 'navdeepak',
                    model_id: activeModel.id,
                    created_at: new Date().toISOString()
                }]);

            if (insertError) {
                throw new Error(`Failed to save message: ${insertError.message}`);
            }

            const userMessage = inputText;
            setInputText('');

            // 2. Call backend for AI response with AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds

            let aiResponse;
            try {
                aiResponse = await fetch(`${BACKEND_URL}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model_id: activeModel.name || activeModel.id,
                        user_message: userMessage
                    }),
                    signal: controller.signal
                });
            } finally {
                clearTimeout(timeoutId);
            }

            if (!aiResponse.ok) {
                const errorData = await aiResponse.json();
                throw new Error(errorData.error || `AI service error: ${aiResponse.status}`);
            }

            const { bot_reply } = await aiResponse.json();

            // 3. Save bot response to database
            const { error: botInsertError } = await supabase
                .from('messages')
                .insert([{
                    text: bot_reply,
                    author: 'bot',
                    model_id: activeModel.id,
                    created_at: new Date().toISOString()
                }]);

            if (botInsertError) {
                console.warn('Failed to save bot response:', botInsertError);
            }

            // 4. Refresh messages
            await fetchMessages();

            // 5. Auto scroll to bottom
            setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
            }, 300);

        } catch (error: any) {
            if (error.name === 'AbortError') {
                setError('Request timeout - Model is taking too long to respond. Try again.');
            } else if (error.message.includes('Failed to fetch')) {
                setError('Cannot reach backend. Make sure server is running on ' + BACKEND_URL);
            } else {
                setError(`Error: ${error.message || String(error)}`);
            }
            console.error('Chat error:', error);
        } finally {
            setSending(false);
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
                {/* Model name and description in header */}
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>
                        {activeModel ? activeModel.name : 'No Active Model'}
                    </Text>
                    {activeModel && (
                        <Text style={{ color: '#FFD24C', textAlign: 'center', fontWeight: 'bold', fontSize: width * 0.032 }}>
                            {activeModel.description}
                        </Text>
                    )}
                </View>
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
                ) : error && messages.length === 0 ? (
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
                    messages.map((msg, idx) => {
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

            {/* Error message display during chat */}
            {error && messages.length > 0 && (
                <View style={{ backgroundColor: '#ffebee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginHorizontal: 12, marginBottom: 8 }}>
                    <Text style={{ color: '#B00020', fontSize: width * 0.032, fontWeight: '500' }}>{error}</Text>
                </View>
            )}

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
                        editable={!sending && !loading}
                    />
                </View>
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending || loading}>
                    <View style={styles.sendCircle}>
                        {sending ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9290/9290348.png' }}
                                style={styles.sendIcon}
                            />
                        )}
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
        top: height * 0.05,
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
