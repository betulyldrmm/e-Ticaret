const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();

// PostgreSQL bağlantı ayarları
const pool = new Pool({
  user: 'postgres',          
  host: 'localhost',         
  database: 'shopmind_db',   
  password: 'bet2516', 
  port: 5432,               
  max: 20,                  
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000, 
});

// Veritabanı bağlantısını test et ve tabloları oluştur
async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL bağlantısı başarılı');
    
    // Users tablosunu oluştur (yoksa)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Categories tablosunu oluştur (yoksa) - Products'tan önce olmalı
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Products tablosunu oluştur (yoksa)
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        category_id INTEGER DEFAULT 1,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Popular Products tablosunu oluştur (yoksa)
    await client.query(`
      CREATE TABLE IF NOT EXISTS popular_products (
        product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
        rank INTEGER DEFAULT 0
      )
    `);
    
    // Eğer categories tablosu boşsa varsayılan kategoriler ekle
    const categoryCheck = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoryCheck.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO categories (name, description) VALUES 
        ('Spor', 'Spor ürünleri ve ekipmanları'),
        ('Teknoloji', 'Bilgisayar, telefon ve teknoloji ürünleri'),
        ('Kitap', 'Kitaplar ve eğitim materyalleri'),
        ('Otomobil', 'Araç ve otomobil ürünleri')
      `);
      console.log('✅ Varsayılan kategoriler eklendi');
    }
    
    console.log('✅ Users tablosu hazır');
    console.log('✅ Products tablosu hazır');
    console.log('✅ Categories tablosu hazır');
    console.log('✅ Popular Products tablosu hazır');
    client.release();
    
  } catch (error) {
    console.error('❌ PostgreSQL bağlantı hatası:', error.message);
    console.error('💡 Kontrol edilecekler:');
    console.error('   - PostgreSQL servisi çalışıyor mu?');
    console.error('   - Veritabanı adı doğru mu? (shopmind_db)');
    console.error('   - Kullanıcı adı ve şifre doğru mu?');
    console.error('   - Port numarası doğru mu? (5432)');
    process.exit(1);
  }
}

// CORS ayarları
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173','http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Static files (resimler için)
app.use('/images', express.static('public/images'));

// =============================================
// PRODUCTS API ENDPOINTS
// =============================================
// DISCOUNTED PRODUCTS API ENDPOINTS
// =============================================

// İndirimli ürünleri getir
// İndirimli ürünleri getir - Düzeltilmiş versiyon
app.get('/api/discounted-products', async (req, res) => {
  console.log('🔥 İndirimli ürünler istendi');
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.discount > 0 AND p.stock > 0 
      ORDER BY p.discount DESC, p.created_at DESC
      LIMIT 20
    `);
    
    console.log(`✅ ${result.rows.length} indirimli ürün döndürüldü`);
    
    // Eğer hiç indirimli ürün yoksa, rastgele ürünleri indirimli yap
    if (result.rows.length === 0) {
      console.log('⚠️  Hiç indirimli ürün yok, rastgele ürünleri indirimli yapıyorum...');
      
      // Rastgele ürünleri seç ve indirim uygula
      await pool.query(`
        UPDATE products 
        SET discount = CASE 
          WHEN random() < 0.3 THEN floor(random() * 30 + 10)::integer
          ELSE discount 
        END
        WHERE id IN (
          SELECT id FROM products 
          WHERE stock > 0 
          ORDER BY random() 
          LIMIT 8
        )
      `);
      
      // Tekrar indirimli ürünleri getir
      const updatedResult = await pool.query(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.discount > 0 AND p.stock > 0 
        ORDER BY p.discount DESC, p.created_at DESC
        LIMIT 20
      `);
      
      console.log(`✅ ${updatedResult.rows.length} indirimli ürün oluşturuldu ve döndürüldü`);
      return res.json(updatedResult.rows);
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('❌ İndirimli ürünler alınırken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'İndirimli ürünler alınamadı',
      details: error.message 
    });
  }
});
// Tüm ürünleri getir
app.get('/api/products', async (req, res) => {
  console.log('📦 Ürün listesi istendi');
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.stock > 0 
      ORDER BY p.created_at DESC
    `);
    
    console.log(`✅ ${result.rows.length} ürün döndürüldü`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Ürünler alınırken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ürünler alınamadı',
      details: error.message 
    });
  }
});

// Belirli bir ürünü getir
app.get('/api/products/:id', async (req, res) => {
  console.log('🔍 Tek ürün istendi, ID:', req.params.id);
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      console.log('❌ Ürün bulunamadı:', id);
      return res.status(404).json({ 
        success: false,
        error: 'Ürün bulunamadı' 
      });
    }
    
    console.log('✅ Ürün bulundu:', result.rows[0].name);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Ürün alınırken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ürün alınamadı',
      details: error.message 
    });
  }
});

// Kategoriye göre ürünleri getir
app.get('/api/products/category/:categoryId', async (req, res) => {
  console.log('📂 Kategori ürünleri istendi:', req.params.categoryId);
  try {
    const { categoryId } = req.params;
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.category_id = $1 AND p.stock > 0
      ORDER BY p.created_at DESC
    `, [categoryId]);
    
    console.log(`✅ Kategori ${categoryId} için ${result.rows.length} ürün bulundu`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Kategoriye göre ürünler alınırken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Kategoriye göre ürünler alınamadı',
      details: error.message 
    });
  }
});

// Yeni ürün ekle
app.post('/api/products', async (req, res) => {
  console.log('➕ Yeni ürün ekleme istendi:', req.body);
  try {
    const { name, price, description, image_url, category_id, stock } = req.body;
    
    if (!name || !price || !description) {
      console.log('❌ Gerekli alanlar eksik');
      return res.status(400).json({ 
        success: false,
        error: 'Ürün adı, fiyat ve açıklama gerekli' 
      });
    }
    
    const result = await pool.query(`
      INSERT INTO products (name, price, description, image_url, category_id, stock) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `, [name, price, description, image_url || null, category_id || 1, stock || 0]);
    
    console.log('✅ Yeni ürün eklendi:', result.rows[0].name);
    res.status(201).json({ 
      success: true,
      message: 'Ürün başarıyla eklendi',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Ürün eklenirken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ürün eklenemedi',
      details: error.message 
    });
  }
});

// Ürün güncelle
app.put('/api/products/:id', async (req, res) => {
  console.log('✏️ Ürün güncelleme istendi:', req.params.id, req.body);
  try {
    const { id } = req.params;
    const { name, price, description, image_url, category_id, stock } = req.body;
    
    const result = await pool.query(`
      UPDATE products 
      SET name = $1, price = $2, description = $3, image_url = $4, 
          category_id = $5, stock = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 
      RETURNING *
    `, [name, price, description, image_url, category_id, stock, id]);
    
    if (result.rows.length === 0) {
      console.log('❌ Güncellenecek ürün bulunamadı:', id);
      return res.status(404).json({ 
        success: false,
        error: 'Ürün bulunamadı' 
      });
    }
    
    console.log('✅ Ürün güncellendi:', result.rows[0].name);
    res.json({ 
      success: true,
      message: 'Ürün başarıyla güncellendi',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Ürün güncellenirken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ürün güncellenemedi',
      details: error.message 
    });
  }
});

// Ürün sil
app.delete('/api/products/:id', async (req, res) => {
  console.log('🗑️ Ürün silme istendi:', req.params.id);
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      console.log('❌ Silinecek ürün bulunamadı:', id);
      return res.status(404).json({ 
        success: false,
        error: 'Ürün bulunamadı' 
      });
    }
    
    console.log('✅ Ürün silindi:', result.rows[0].name);
    res.json({ 
      success: true,
      message: 'Ürün başarıyla silindi',
      deletedProduct: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Ürün silinirken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ürün silinemedi',
      details: error.message 
    });
  }
});

// =============================================
// POPULAR PRODUCTS API ENDPOINTS
// =============================================

// Popüler ürünleri getir
app.get('/api/popular-products', async (req, res) => {
  console.log('⭐ Popüler ürünler istendi');
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, pp.rank 
      FROM popular_products pp
      JOIN products p ON pp.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.stock > 0
      ORDER BY pp.rank ASC, p.created_at DESC
    `);
    
    console.log(`✅ ${result.rows.length} popüler ürün döndürüldü`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Popüler ürünler alınırken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Popüler ürünler alınamadı',
      details: error.message 
    });
  }
});

// Ürünü popüler ürünlere ekle
app.post('/api/popular-products', async (req, res) => {
  console.log('⭐ Popüler ürün ekleme istendi:', req.body);
  try {
    const { product_id, rank } = req.body;
    
    if (!product_id) {
      console.log('❌ Product ID gerekli');
      return res.status(400).json({ 
        success: false,
        error: 'Product ID gerekli' 
      });
    }
    
    // Önce ürünün var olup olmadığını kontrol et
    const productCheck = await pool.query('SELECT id FROM products WHERE id = $1', [product_id]);
    if (productCheck.rows.length === 0) {
      console.log('❌ Ürün bulunamadı:', product_id);
      return res.status(404).json({ 
        success: false,
        error: 'Ürün bulunamadı' 
      });
    }
    
    // Zaten popüler ürünlerde var mı kontrol et
    const existingCheck = await pool.query('SELECT product_id FROM popular_products WHERE product_id = $1', [product_id]);
    if (existingCheck.rows.length > 0) {
      console.log('❌ Ürün zaten popüler ürünlerde:', product_id);
      return res.status(409).json({ 
        success: false,
        error: 'Bu ürün zaten popüler ürünler listesinde' 
      });
    }
    
    const result = await pool.query(`
      INSERT INTO popular_products (product_id, rank) 
      VALUES ($1, $2) 
      RETURNING *
    `, [product_id, rank || 0]);
    
    console.log('✅ Popüler ürün eklendi:', result.rows[0]);
    res.status(201).json({ 
      success: true,
      message: 'Ürün popüler ürünlere başarıyla eklendi',
      popularProduct: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Popüler ürün eklenirken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Popüler ürün eklenemedi',
      details: error.message 
    });
  }
});

// Popüler ürün sıralamasını güncelle
app.put('/api/popular-products/:productId', async (req, res) => {
  console.log('⭐ Popüler ürün güncelleme istendi:', req.params.productId, req.body);
  try {
    const { productId } = req.params;
    const { rank } = req.body;
    
    const result = await pool.query(`
      UPDATE popular_products 
      SET rank = $1
      WHERE product_id = $2 
      RETURNING *
    `, [rank || 0, productId]);
    
    if (result.rows.length === 0) {
      console.log('❌ Güncellenecek popüler ürün bulunamadı:', productId);
      return res.status(404).json({ 
        success: false,
        error: 'Popüler ürün bulunamadı' 
      });
    }
    
    console.log('✅ Popüler ürün güncellendi:', result.rows[0]);
    res.json({ 
      success: true,
      message: 'Popüler ürün başarıyla güncellendi',
      popularProduct: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Popüler ürün güncellenirken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Popüler ürün güncellenemedi',
      details: error.message 
    });
  }
});

// Ürünü popüler ürünlerden çıkar
app.delete('/api/popular-products/:productId', async (req, res) => {
  console.log('🗑️ Popüler ürün silme istendi:', req.params.productId);
  try {
    const { productId } = req.params;
    const result = await pool.query('DELETE FROM popular_products WHERE product_id = $1 RETURNING *', [productId]);
    
    if (result.rows.length === 0) {
      console.log('❌ Silinecek popüler ürün bulunamadı:', productId);
      return res.status(404).json({ 
        success: false,
        error: 'Popüler ürün bulunamadı' 
      });
    }
    
    console.log('✅ Popüler ürün silindi:', result.rows[0]);
    res.json({ 
      success: true,
      message: 'Ürün popüler ürünlerden başarıyla çıkarıldı',
      deletedPopularProduct: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Popüler ürün silinirken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Popüler ürün silinemedi',
      details: error.message 
    });
  }
});

// =============================================
// CATEGORIES API ENDPOINTS
// =============================================

// Kategorileri getir
app.get('/api/categories', async (req, res) => {
  console.log('📂 Kategori listesi istendi');
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    console.log(`✅ ${result.rows.length} kategori döndürüldü`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Kategoriler alınırken hata:', error);
    res.status(500).json({ 
      success: false,
      error: 'Kategoriler alınamadı',
      details: error.message 
    });
  }
});

// =============================================
// USER ENDPOINTS
// =============================================

// Test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const userResult = await pool.query('SELECT COUNT(*) as total FROM users');
    const productResult = await pool.query('SELECT COUNT(*) as total FROM products');
    const popularResult = await pool.query('SELECT COUNT(*) as total FROM popular_products');
    console.log('✅ Test endpoint çalışıyor');
    res.json({
      message: 'Server çalışıyor!',
      timestamp: new Date().toISOString(),
      port: 5001,
      totalUsers: parseInt(userResult.rows[0].total),
      totalProducts: parseInt(productResult.rows[0].total),
      totalPopularProducts: parseInt(popularResult.rows[0].total),
      database: 'PostgreSQL'
    });
  } catch (error) {
    console.error('❌ Test endpoint hatası:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Veritabanı bağlantı hatası' 
    });
  }
});

// Tüm kullanıcıları göster
app.get('/api/users', async (req, res) => {
  try {
    console.log('📋 Kullanıcı listesi istendi');
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error('❌ Kullanıcı listesi hatası:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Veritabanı hatası' 
    });
  }
});

// KAYIT OL (REGISTER)
app.post('/api/register', async (req, res) => {
  console.log('📝 Kayıt isteği geldi:', req.body);
  
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    console.log('❌ Boş alanlar var');
    return res.status(400).json({
      success: false,
      error: 'Username, email ve password gerekli!'
    });
  }
  
  if (!email.includes('@')) {
    console.log('❌ Geçersiz email format');
    return res.status(400).json({
      success: false,
      error: 'Geçerli bir email adresi girin!'
    });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase().trim(), username.trim()]
    );
    
    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      console.log('❌ Email veya username zaten kayıtlı');
      return res.status(409).json({
        success: false,
        error: 'Bu email adresi veya kullanıcı adı zaten kayıtlı!'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const result = await client.query(
      'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username, email, created_at',
      [userId, username.trim(), email.toLowerCase().trim(), hashedPassword]
    );
    
    await client.query('COMMIT');
    
    const newUser = result.rows[0];
    
    console.log('✅ Yeni kullanıcı PostgreSQL\'e kaydedildi:', {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      created_at: newUser.created_at
    });
    
    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        created_at: newUser.created_at
      }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Kayıt hatası:', error);
    
    if (error.code === '23505') {
      res.status(409).json({
        success: false,
        error: 'Bu email adresi veya kullanıcı adı zaten kayıtlı!'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Sunucu hatası oluştu'
      });
    }
  } finally {
    client.release();
  }
});

// GİRİŞ YAP (LOGIN)
app.post('/api/login', async (req, res) => {
  console.log('🔐 Giriş isteği geldi:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log('❌ Email veya password boş');
    return res.status(400).json({
      success: false,
      error: 'Email ve şifre gerekli!'
    });
  }
  
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Kullanıcı bulunamadı:', email);
      return res.status(401).json({
        success: false,
        error: 'Email veya şifre hatalı!'
      });
    }
    
    const user = result.rows[0];
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
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
    
    res.json({
      success: true,
      message: 'Giriş başarılı!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      }
    });
    
  } catch (error) {
    console.error('❌ Giriş hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası oluştu'
    });
  }
});

// Veritabanı bağlantısı durumu
app.get('/api/db-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    res.json({
      success: true,
      connected: true,
      server_time: result.rows[0].current_time,
      postgresql_version: result.rows[0].version,
      pool_info: {
        total_connections: pool.totalCount,
        idle_connections: pool.idleCount,
        waiting_connections: pool.waitingCount
      }
    });
  } catch (error) {
    console.error('❌ Veritabanı durum kontrolü hatası:', error);
    res.status(500).json({
      success: false,
      connected: false,
      error: error.message
    });
  }
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

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Server kapatılıyor...');
  await pool.end();
  console.log('✅ PostgreSQL bağlantıları kapatıldı');
  process.exit(0);
});

// Server başlat
const PORT = 5001;

async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log('🚀 Server başlatıldı!');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔗 Test: http://localhost:${PORT}/api/test`);
    console.log(`👥 Kullanıcılar: http://localhost:${PORT}/api/users`);
    console.log(`📦 Ürünler: http://localhost:${PORT}/api/products`);
    console.log(`⭐ Popüler Ürünler: http://localhost:${PORT}/api/popular-products`);
    console.log(`📂 Kategoriler: http://localhost:${PORT}/api/categories`);
    console.log(`🗄️  DB Durum: http://localhost:${PORT}/api/db-status`);
    console.log('✅ Hazır, istekleri bekliyor...');
  });
}

startServer().catch(console.error);