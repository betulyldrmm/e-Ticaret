const express = require('express');
const cors = require('cors');

const app = express();

// Kullanıcı veritabanı (memory'de)
let users = [];

// CORS ayarları
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint çalışıyor');
  res.json({
    message: 'Server çalışıyor!',
    timestamp: new Date().toISOString(),
    port: 5001,
    totalUsers: users.length
  });
});

// Tüm kullanıcıları göster (debug için)
app.get('/api/users', (req, res) => {
  console.log('📋 Kullanıcı listesi istendi');
  res.json({
    success: true,
    users: users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
      // Şifre gösterilmiyor
    }))
  });
});

// KAYIT OL (REGISTER)
app.post('/api/register', (req, res) => {
  console.log('📝 Kayıt isteği geldi:', req.body);
  
  const { username, email, password } = req.body;
  
  // Boş alan kontrolü
  if (!username || !email || !password) {
    console.log('❌ Boş alanlar var');
    return res.status(400).json({
      success: false,
      error: 'Username, email ve password gerekli!'
    });
  }
  
  // Email kontrolü
  if (!email.includes('@')) {
    console.log('❌ Geçersiz email format');
    return res.status(400).json({
      success: false,
      error: 'Geçerli bir email adresi girin!'
    });
  }
  
  // Email zaten kayıtlı mı?
  const existingEmail = users.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (existingEmail) {
    console.log('❌ Email zaten kayıtlı:', email);
    return res.status(409).json({
      success: false,
      error: 'Bu email adresi zaten kayıtlı!'
    });
  }
  
  // Username zaten alınmış mı?
  const existingUsername = users.find(user => user.username.toLowerCase() === username.toLowerCase());
  if (existingUsername) {
    console.log('❌ Username zaten alınmış:', username);
    return res.status(409).json({
      success: false,
      error: 'Bu kullanıcı adı zaten alınmış!'
    });
  }
  
  // Yeni kullanıcı oluştur
  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password: password, // GERÇEK PROJEDE HASH'LE!
    createdAt: new Date().toISOString()
  };
  
  // Kullanıcıyı kaydet
  users.push(newUser);
  
  console.log('✅ Yeni kullanıcı kaydedildi:', {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email
  });
  console.log('📊 Toplam kullanıcı sayısı:', users.length);
  
  // Başarılı yanıt
  res.status(201).json({
    success: true,
    message: 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }
  });
});

// GİRİŞ YAP (LOGIN)
app.post('/api/login', (req, res) => {
  console.log('🔐 Giriş isteği geldi:', req.body);
  
  const { email, password } = req.body;
  
  // Boş alan kontrolü
  if (!email || !password) {
    console.log('❌ Email veya password boş');
    return res.status(400).json({
      success: false,
      error: 'Email ve şifre gerekli!'
    });
  }
  
  // Kullanıcıyı bul
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  
  if (!user) {
    console.log('❌ Kullanıcı bulunamadı:', email);
    return res.status(401).json({
      success: false,
      error: 'Email veya şifre hatalı!'
    });
  }
  
  // Şifre kontrolü
  if (user.password !== password) {
    console.log('❌ Şifre yanlış:', email);
    return res.status(401).json({
      success: false,
      error: 'Email veya şifre hatalı!'
    });
  }
  
  console.log('✅ Başarılı giriş:', {
    id: user.id,
    username: user.username,
    email: user.email
  });
  
  // Başarılı giriş
  res.json({
    success: true,
    message: 'Giriş başarılı!',
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint bulunamadı'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('💥 Server hatası:', error);
  res.status(500).json({
    success: false,
    error: 'Sunucu hatası'
  });
});

// Server başlat
const PORT = 5001;
app.listen(PORT, () => {
  console.log('🚀 Server başlatıldı!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/test`);
  console.log(`👥 Kullanıcılar: http://localhost:${PORT}/api/users`);
  console.log('✅ Hazır, istekleri bekliyor...');
});