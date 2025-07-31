const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../utils/db');
const { generateToken } = require('../utils/auth');

const router = express.Router();

// Kayıt ol
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Boş alanlar var' });

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email=$1 OR username=$2', [email, username]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Kullanıcı zaten var' });

    const hashed = await bcrypt.hash(password, 12);
    const id = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);

    const result = await pool.query(
      'INSERT INTO users (id, username, email, password) VALUES ($1,$2,$3,$4) RETURNING id, username, email',
      [id, username, email, hashed]
    );
    const user = result.rows[0];

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Giriş yap
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Boş alanlar var' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Kullanıcı bulunamadı' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Şifre yanlış' });

    const token = generateToken(user);
    res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;