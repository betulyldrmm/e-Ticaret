require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/users');
const geminiRoutes = require('./routes/gemini');

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/gemini', geminiRoutes);

app.get('/', (req, res) => res.send('Shopmind Backend is running!'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});