export type ConfigType = {
    backendUrl: string;
    timeout: number;
};

export const config: ConfigType = {
    // Replace 192.168.1.X with your actual IP address
    // Find IP: Windows (ipconfig) / Mac (ifconfig | grep "inet ")
    backendUrl: 'http://192.168.1.X:5000',
    timeout: 120000 // 120 seconds
};

// For production, update backendUrl to:
// 'https://your-railway-app.railway.app'
// 'https://your-render-app.onrender.com'
// etc.
