import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleTravelChat, handleVoiceConversation, handleGuideAutoReply } from './server/geminiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API endpoints
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const result = await handleTravelChat(message, history);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gemini/voice-conversation', async (req, res) => {
  try {
    const { voiceText } = req.body;
    const result = await handleVoiceConversation(voiceText || 'Hello ANAR Travel');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gemini/guide-reply', async (req, res) => {
  try {
    const { guideName, district, userMessage } = req.body;
    const result = await handleGuideAutoReply(guideName, district, userMessage);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend files from dist/
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ANAR Travel server running on http://0.0.0.0:${PORT}`);
});
