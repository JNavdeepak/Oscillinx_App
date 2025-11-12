export type ConfigType = {
    backendUrl: string;
    timeout: number;
};

export const config: ConfigType = {
    backendUrl: 'http://192.168.1.6:5000',
    timeout: 120000
};

export const emulatorBackendUrl = 'http://10.0.2.2:5000';
