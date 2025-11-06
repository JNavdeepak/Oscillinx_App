import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, Image,
    ActivityIndicator, Dimensions, StyleSheet, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';
import { supabase } from '../supabaseClient';
import RNFetchBlob from 'rn-fetch-blob';

const { width, height } = Dimensions.get('window');
const darkBrown = '#4E1D02';
const bgBrown = '#C5A790';
const cardBrown = '#623A1D';
const orange = '#E78727';
const borderR = 18;

export type ModelItem = {
    id: string;
    name: string;
    description: string;
    version?: string;
    status: string;
    size_gb?: number;
    created_at?: string;
    file_url?: string;
    is_active?: boolean;
};

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ModelsScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Models'>>();
    const [models, setModels] = useState<ModelItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);

    // Optimistic UI states
    const [optimisticDownloadIds, setOptimisticDownloadIds] = useState<Record<string, boolean>>({});
    const [optimisticActiveIds, setOptimisticActiveIds] = useState<Record<string, boolean>>({});

    const fetchModels = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
            .from('models')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            setError(error.message);
            setModels([]);
        } else {
            setModels((data as ModelItem[]) || []);
        }
        setLoading(false);
    };

    useEffect(() => { fetchModels(); }, []);

    // ======= DOWNLOAD =======
    const handleDownloadModel = async (model: ModelItem) => {
        setDownloadingId(model.id);
        setDownloadProgress(0);

        // Optimistic state
        setOptimisticDownloadIds(prev => ({ ...prev, [model.id]: true }));

        try {
            const urlsArray = Array.isArray(model.file_url)
                ? model.file_url
                : JSON.parse(model.file_url || '[]');

            for (let i = 0; i < urlsArray.length; i++) {
                const url = urlsArray[i];
                const fileName = url.split('/').pop();
                const destPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + fileName;

                await RNFetchBlob
                    .config({ path: destPath, fileCache: true })
                    .fetch('GET', url)
                    .progress({ count: 4 }, (received, total) => {
                        const thisFilePct = total > 0 ? received / total : 0;
                        const overall = ((i + thisFilePct) / urlsArray.length) * 100;
                        setDownloadProgress(Math.round(overall));
                    });

                await sleep(600);
                setDownloadProgress(Math.round(((i + 1) / urlsArray.length) * 100));
            }

            const { error: updateError } = await supabase
                .from('models')
                .update({ status: 'downloaded' })
                .eq('id', model.id);

            if (updateError) {
                Alert.alert('DB Update Failed', updateError.message);
                setDownloadProgress(0);
                setDownloadingId(null);
                setOptimisticDownloadIds(prev => {
                    const newObj = { ...prev }; delete newObj[model.id]; return newObj;
                });
                return;
            }

            setModels(prev =>
                prev.map(m =>
                    m.id === model.id
                        ? { ...m, status: 'downloaded' }
                        : m
                )
            );

            setDownloadProgress(0);
            setDownloadingId(null);
        } catch (error) {
            Alert.alert('Download failed', String(error) || "Error");
            setDownloadProgress(0);
            setDownloadingId(null);
            setOptimisticDownloadIds(prev => {
                const newObj = { ...prev }; delete newObj[model.id]; return newObj;
            });
        }
    };

    // ======= UNINSTALL =======
    const handleUninstallModel = async (model: ModelItem) => {
        try {
            const urlsArray = Array.isArray(model.file_url)
                ? model.file_url
                : JSON.parse(model.file_url || '[]');

            for (const url of urlsArray) {
                const fileName = url.split('/').pop();
                const destPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + fileName;
                const exists = await RNFetchBlob.fs.exists(destPath);
                if (exists) await RNFetchBlob.fs.unlink(destPath);
            }

            const { error: updateError } = await supabase
                .from('models')
                .update({ status: 'available', is_active: false })
                .eq('id', model.id);

            if (updateError) {
                Alert.alert('Uninstall failed', updateError.message);
                return;
            }

            setModels(prevModels =>
                prevModels.map(m =>
                    m.id === model.id
                        ? { ...m, status: 'available', is_active: false }
                        : m
                )
            );
            setOptimisticDownloadIds(prev => {
                const newObj = { ...prev }; delete newObj[model.id]; return newObj;
            });
            setOptimisticActiveIds(prev => {
                const newObj = { ...prev }; delete newObj[model.id]; return newObj;
            });
        } catch (error) {
            Alert.alert('Uninstall failed', String(error) || "Error");
        }
    };

    // ======= ACTIVATE =======
    const handleSetActiveModel = async (modelId: string) => {
        // find the model
        const model = models.find(m => m.id === modelId);
        if (!model) return;

        // Confirm model is downloaded and files exist
        if (model.status !== 'downloaded') {
            Alert.alert("Cannot activate", "Model is not downloaded.");
            return;
        }
        const urlsArray = Array.isArray(model.file_url) ? model.file_url : JSON.parse(model.file_url || '[]');
        for (const url of urlsArray) {
            const fileName = url.split('/').pop();
            const destPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + fileName;
            const exists = await RNFetchBlob.fs.exists(destPath);
            if (!exists) {
                Alert.alert("Cannot activate", `File missing: ${fileName}. Please redownload.`);
                return;
            }
        }

        await supabase.from('models').update({ is_active: false }).eq('is_active', true);
        const { error } = await supabase.from('models')
            .update({ is_active: true, status: 'downloaded' }) // status always re-set on activation!
            .eq('id', modelId);

        if (error) {
            Alert.alert('Activation failed', error.message);
            return;
        }

        setModels(prevModels =>
            prevModels.map(m => ({
                ...m,
                is_active: m.id === modelId,
                status: m.id === modelId ? 'downloaded' : m.status,
            }))
        );
        setOptimisticActiveIds(prev => ({ ...prev, [modelId]: true }));
    };

    const fetchModelsWithFilesCheck = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
            .from('models')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            setError(error.message);
            setModels([]);
            setLoading(false);
            return;
        }

        let modelsWithFileCheck = await Promise.all(
            (data as ModelItem[]).map(async (m) => {
                if (m.status === 'downloaded') {
                    const urlsArray = Array.isArray(m.file_url)
                        ? m.file_url
                        : JSON.parse(m.file_url || '[]');
                    let allFilesPresent = true;
                    for (const url of urlsArray) {
                        const fileName = url.split('/').pop();
                        const destPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + fileName;
                        const exists = await RNFetchBlob.fs.exists(destPath);
                        console.log('Model:', m.name, 'File:', fileName, 'Path:', destPath, 'Exists:', exists);
                        if (!exists) {
                            allFilesPresent = false;
                            break;
                        }
                    }
                    if (!allFilesPresent) {
                        return { ...m, status: 'available', is_active: false };
                    }
                }
                return m;
            })
        );
        setModels(modelsWithFileCheck);
        setLoading(false);
    };

    useEffect(() => {
        // fetch from DB first (already in your code)
        fetchModelsWithFilesCheck();
    }, []);

    // ============ RENDER =============
    return (
        <View style={{ backgroundColor: bgBrown, flex: 1 }}>
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
                <View style={styles.metricRow}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: width * 0.07, marginBottom: 5, paddingHorizontal: width * 0.01 }}>
                    <Text style={styles.sectionLabel}>Available Models</Text>
                </View>
                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 56 }}>
                        <ActivityIndicator size="large" color={orange} style={{ marginBottom: 22 }} />
                        <Text style={{ color: darkBrown, fontWeight: 'bold' }}>Loading models...</Text>
                    </View>
                ) : error ? (
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 48 }}>
                        <Text style={{ color: "#B00020", fontWeight: 'bold', fontSize: width * 0.052, marginBottom: 4 }}>Error loading models</Text>
                        <Text style={{ color: "#B00020", fontSize: width * 0.040 }}>{error}</Text>
                        <TouchableOpacity style={{ marginTop: 14, backgroundColor: orange, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 14 }} onPress={fetchModels}>
                            <Text style={{ color: "#fff", fontWeight: 'bold' }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : models.length === 0 ? (
                    <Text style={{ color: darkBrown, alignSelf: 'center', fontSize: width * 0.046, marginTop: 40 }}>
                        No models found. Add one!
                    </Text>
                ) : (
                    models.map((model) => {
                        const isDownloaded =
                            (model.status &&
                                model.status.trim().toLowerCase() === 'downloaded')
                            || optimisticDownloadIds[model.id];

                        const isActive = model.is_active || optimisticActiveIds[model.id];
                        const isDownloading = downloadingId === model.id;

                        return (
                            <View key={model.id} style={styles.modelCard}>
                                <Text style={styles.modelName}>{model.name}</Text>
                                <Text style={styles.modelDesc}>{model.description}</Text>

                                {/* Only show Download Progress, no buttons */}
                                {isDownloading ? (
                                    <View style={{ marginTop: 20, width: "100%" }}>
                                        <Text style={{
                                            color: "#fff",
                                            fontWeight: "bold",
                                            fontSize: width * 0.034,
                                            marginLeft: 2,
                                            marginBottom: 6
                                        }}>
                                            {downloadProgress}% Completed
                                        </Text>
                                        <View style={{
                                            backgroundColor: "#b7b7b7",
                                            height: 3,
                                            width: "100%",
                                            borderRadius: 5,
                                            overflow: 'hidden'
                                        }}>
                                            <View style={{
                                                backgroundColor: orange,
                                                height: 3,
                                                width: `${downloadProgress}%`,
                                                borderRadius: 5,
                                                position: 'absolute',
                                                left: 0,
                                                top: 0
                                            }} />
                                        </View>
                                    </View>
                                ) : (
                                    <>
                                        {isDownloaded ? (
                                            <TouchableOpacity
                                                style={[
                                                    styles.modelMainBtn,
                                                    { backgroundColor: '#ffdddd', opacity: 1 }
                                                ]}
                                                onPress={() => handleUninstallModel(model)}
                                            >
                                                <Text style={[styles.modelMainBtnTxt, { color: '#a10018' }]}>
                                                    Uninstall
                                                </Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                style={[styles.modelMainBtn]}
                                                onPress={() => handleDownloadModel(model)}
                                            >
                                                <Text style={styles.modelMainBtnTxt}>
                                                    Download
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {/* SET AS ACTIVE BUTTON */}
                                        {isDownloaded && !isActive && (
                                            <TouchableOpacity
                                                style={[styles.modelMainBtn, { backgroundColor: '#b3ebff', marginTop: 8 }]}
                                                onPress={() => handleSetActiveModel(model.id)}
                                            >
                                                <Text style={[styles.modelMainBtnTxt, { color: '#006084' }]}>Activate</Text>
                                            </TouchableOpacity>
                                        )}
                                        {isActive && (
                                            <View style={[styles.modelMainBtn, { backgroundColor: '#bbffb0', marginTop: 8 }]}>
                                                <Text style={[styles.modelMainBtnTxt, { color: '#168d28' }]}>Active</Text>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                        );
                    })
                )}
            </ScrollView>
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
};

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
    sectionLabel: {
        fontSize: width * 0.044,
        fontWeight: "bold",
        color: darkBrown,
        letterSpacing: 0.15,
        marginLeft: 5,
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
