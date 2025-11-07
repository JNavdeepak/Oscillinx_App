const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Configuration
const PORT = process.env.PORT || 5000;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http:// 16.16.146.175:11434/api/generate';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'tinyllama';

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'Server running',
        ollama_api: OLLAMA_API_URL,
        default_model: DEFAULT_MODEL,
        timestamp: new Date().toISOString()
    });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { model_id, user_message } = req.body;

        // Validation
        if (!user_message) {
            return res.status(400).json({
                error: 'user_message is required'
            });
        }

        const selectedModel = model_id || DEFAULT_MODEL;

        console.log(`[${new Date().toISOString()}] Chat Request - Model: ${selectedModel}, Message: "${user_message.substring(0, 50)}..."`);

        // Call Ollama API on AWS
        const response = await axios.post(OLLAMA_API_URL, {
            model: selectedModel,
            prompt: user_message,
            stream: false
        }, {
            timeout: 60000, // 60 seconds timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const bot_reply = response.data.response || 'Sorry, no response generated.';
        const tokens_used = response.data.eval_count || 0;

        console.log(`[${new Date().toISOString()}] Chat Response - Tokens: ${tokens_used}`);

        res.json({
            success: true,
            bot_reply,
            model_used: selectedModel,
            tokens_used
        });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Chat Error:`, error.message);

        // Connection refused (Ollama not running or unreachable)
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'LLM service not reachable',
                message: 'Check if Ollama is running on AWS instance ( 16.16.146.175:11434)',
                code: 'SERVICE_UNAVAILABLE'
            });
        }

        // Timeout error
        if (error.code === 'ETIMEDOUT') {
            return res.status(504).json({
                success: false,
                error: 'Request timeout',
                message: 'Model took too long to respond. Try a smaller prompt or different model.',
                code: 'TIMEOUT'
            });
        }

        // Axios error with response
        if (error.response) {
            return res.status(error.response.status || 500).json({
                success: false,
                error: 'Ollama API error',
                message: error.response.data?.error || error.message,
                code: 'API_ERROR'
            });
        }

        // Generic error
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message || 'Failed to generate response',
            code: 'INTERNAL_ERROR'
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.path}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Server error',
        message: err.message
    });
});

// Start server
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log('\n=================================');
        console.log('✅ Express Server Started');
        console.log('=================================');
        console.log(`🌐 Server URL: http://0.0.0.0:${PORT}`);
        console.log(`🤖 Ollama API: ${OLLAMA_API_URL}`);
        console.log(`📦 Default Model: ${DEFAULT_MODEL}`);
        console.log(`⏰ Started at: ${new Date().toISOString()}`);
        console.log('=================================\n');
    });
}

module.exports = app;
