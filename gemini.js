const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Mesaj boş olamaz' });

  try {
    const response = await axios.post(process.env.GEMINI_API_URL, {
      prompt: message,
      // Gemini API dokümantasyonuna göre diğer parametreler
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ reply: response.data.reply });
  } catch (error) {
    console.error('Gemini API hatası:', error.response?.data || error.message);
    res.status(500).json({ error: 'Gemini API hatası' });
  }
});

module.exports = router;