const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server running' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { model_id, user_message } = req.body;

        if (!user_message) {
            return res.status(400).json({ error: 'user_message required' });
        }

        // Call Ollama API (or your local LLM service)
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: model_id || 'llama2', // fallback to llama2
            prompt: user_message,
            stream: false
        }, {
            timeout: 60000 // 60 seconds timeout
        });

        const bot_reply = response.data.response || 'Sorry, no response generated.';

        res.json({
            bot_reply,
            model_used: model_id,
            tokens_used: response.data.eval_count || 0
        });

    } catch (error) {
        console.error('Chat error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'LLM service not running. Start Ollama or your local model.'
            });
        }

        res.status(500).json({
            error: error.message || 'Failed to generate response'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
