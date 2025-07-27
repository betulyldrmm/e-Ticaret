import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5001';


const axios = {
  get: async (url, config = {}) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      signal: config.timeout ? AbortSignal.timeout(config.timeout) : undefined
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Server hatası' }));
      throw { 
        response: { 
          status: response.status, 
          data: errorData 
        } 
      };
    }
    
    return { data: await response.json() };
  },
  
  post: async (url, data, config = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: JSON.stringify(data),
      signal: config.timeout ? AbortSignal.timeout(config.timeout) : undefined
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Server hatası' }));
      throw { 
        response: { 
          status: response.status, 
          data: errorData 
        } 
      };
    }
    
    return { data: await response.json() };
  }
};

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('Kontrol edilmedi');
  

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [debugLog, setDebugLog] = useState([]);

  const addDebugLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      addDebugLog('🔍 Server durumu kontrol ediliyor...');
      const response = await axios.get(`${API_BASE_URL}/api/test`, { timeout: 5000 });
      
      addDebugLog('✅ Server yanıt verdi');
      setServerStatus('✅ Çalışıyor');
      setMessage(`Server durumu: ${response.data.message} (${response.data.registeredUsersCount || 0} kayıtlı kullanıcı)`);
    } catch (error) {
      addDebugLog(`❌ Server hatası: ${error.message}`);
      
      if (error.name === 'AbortError') {
        setServerStatus('❌ Timeout');
        setMessage('❌ Server yanıt vermiyor (timeout)');
      } else if (error.message.includes('fetch')) {
        setServerStatus('❌ Server kapalı');
        setMessage('❌ Server kapalı - node server.js ile başlatın');
      } else {
        setServerStatus('❌ Hata');
        setMessage(`❌ Server hatası: ${error.message}`);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    addDebugLog(`📝 ${name} = "${value}"`);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsLogin(true);
    setForm({ username: '', email: '', password: '' });
    setMessage('✅ Çıkış yapıldı');
    addDebugLog('👋 Çıkış yapıldı');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    addDebugLog(`📤 ${isLogin ? 'Login' : 'Register'} isteği başlıyor...`);

    try {
      let response;
      
      if (isLogin) {
        addDebugLog('🔐 Login isteği - GERÇEK SERVER');
        
        if (!form.email || !form.password) {
          throw new Error('Email ve şifre gerekli');
        }
        
        const loginData = {
          email: form.email,
          password: form.password
        };
        
        addDebugLog(`📧 Gönderilen data: ${JSON.stringify(loginData)}`);
        response = await axios.post(`${API_BASE_URL}/api/login`, loginData, { timeout: 10000 });
        
      } else {
        addDebugLog('📝 Register isteği - GERÇEK SERVER');
        
        if (!form.username || !form.email || !form.password) {
          throw new Error('Tüm alanlar gerekli');
        }
        
       
        const registerData = {
          username: form.username,
          email: form.email,
          password: form.password
        };
        
        addDebugLog(`📝 Gönderilen data: ${JSON.stringify(registerData)}`);
        response = await axios.post(`${API_BASE_URL}/api/register`, registerData, { timeout: 10000 });
      }
      
      addDebugLog(`✅ Server response: ${JSON.stringify(response.data)}`);
      
      if (isLogin) {
        // LOGIN BAŞARILI
        setUser({
          id: response.data.userId || response.data.id,
          username: response.data.username,
          email: response.data.email
        });
        setIsLoggedIn(true);
        setMessage(`✅ Hoş geldin ${response.data.username}! Giriş başarılı.`);
        addDebugLog(`🎉 Login başarılı: ${response.data.username}`);
         // ANASAYFAYA YÖNLENDİR
  setTimeout(() => {
    window.location.href = '/';
  }, 1000);
}
      
       else {
        // REGISTER BAŞARILI
        setMessage(`✅ Kayıt başarılı! Şimdi ${form.email} ile giriş yapabilirsin.`);
        addDebugLog(`📝 Register başarılı: ${response.data.username}`);
        
        // 2 saniye sonra otomatik giriş sayfasına geç
        setTimeout(() => {
          setIsLogin(true);
          // Email ve password'ü koru, sadece username'i temizle
          setForm({ 
            username: '', 
            email: form.email,
            password: form.password
          });
          setMessage('👉 Şimdi giriş yapabilirsin!');
          addDebugLog('🔄 Giriş sayfasına yönlendirildi');
        }, 2000);
      }
      
    } catch (error) {
      addDebugLog(`❌ Hata detayı: ${JSON.stringify(error)}`);
      
      if (error.response) {
        const errorMsg = error.response.data.error || error.response.data.message || 'Bilinmeyen server hatası';
        setMessage(`❌ Server hatası (${error.response.status}): ${errorMsg}`);
        addDebugLog(`❌ Server error: ${error.response.status} - ${errorMsg}`);
      } else if (error.name === 'AbortError') {
        setMessage('❌ İstek zaman aşımına uğradı');
        addDebugLog('❌ Timeout hatası');
      } else if (error.message.includes('fetch')) {
        setMessage('❌ Server\'a bağlanılamıyor. Server çalışıyor mu?');
        addDebugLog('❌ Bağlantı hatası');
      } else {
        setMessage(`❌ Hata: ${error.message}`);
        addDebugLog(`❌ Bilinmeyen hata: ${error.message}`);
      }
    } finally {
      setLoading(false);
      addDebugLog('🏁 İstek tamamlandı');
    }
  };

  const showRegisteredUsers = async () => {
    try {
      addDebugLog('📋 Kullanıcı listesi alınıyor...');
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      
      if (response.data.users && response.data.users.length > 0) {
        const usersList = response.data.users.map(u => `${u.username} (${u.email}) - ID: ${u.id || u._id}`).join('\n');
        setMessage(`📋 Kayıtlı kullanıcılar:\n${usersList}`);
        addDebugLog(`📋 ${response.data.users.length} kullanıcı bulundu`);
        
        // Debug için: Son kayıt olan kullanıcının şifresini kontrol et
        const lastUser = response.data.users[response.data.users.length - 1];
        addDebugLog(`🔍 Son kullanıcı: ${JSON.stringify(lastUser)}`);
      } else {
        setMessage('📋 Henüz kayıtlı kullanıcı yok');
        addDebugLog('📋 Kullanıcı listesi boş');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setMessage(`❌ Kullanıcı listesi alınamadı: ${errorMsg}`);
      addDebugLog(`❌ Kullanıcı listesi hatası: ${errorMsg}`);
    }
  };

  
  const testDifferentLoginFormats = async () => {
    if (!form.email || !form.password) {
      setMessage('❌ Önce email ve şifre girin');
      return;
    }

    const testFormats = [
      { email: form.email, password: form.password },
      { username: form.username || form.email.split('@')[0], password: form.password },
      { email: form.email, password: form.password, username: form.username || form.email.split('@')[0] },
      { user: form.email, password: form.password },
      { login: form.email, password: form.password }
    ];

    addDebugLog('🧪 Farklı login formatları test ediliyor...');
    
    for (let i = 0; i < testFormats.length; i++) {
      try {
        addDebugLog(`🧪 Format ${i + 1}: ${JSON.stringify(testFormats[i])}`);
        const response = await axios.post(`${API_BASE_URL}/api/login`, testFormats[i]);
        setMessage(`✅ BAŞARILI! Format ${i + 1} çalıştı: ${JSON.stringify(testFormats[i])}`);
        addDebugLog(`✅ Format ${i + 1} başarılı!`);
        return;
      } catch (error) {
        addDebugLog(`❌ Format ${i + 1} başarısız: ${error.response?.data?.error || error.message}`);
      }
    }
    
    setMessage('❌ Hiçbir format çalışmadı. Server kodunu kontrol edin.');
  };


  const testRegisterEndpoint = async () => {
    try {
      addDebugLog('🧪 Register endpoint test...');
      const testData = { 
        username: `test_${Date.now()}`, 
        email: `test_${Date.now()}@test.com`, 
        password: '123456' 
      };
      
      const response = await axios.post(`${API_BASE_URL}/api/register`, testData);
      setMessage(`✅ Register endpoint çalışıyor: ${response.data.message}`);
      addDebugLog('✅ Register test başarılı');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setMessage(`❌ Register endpoint hatası: ${errorMsg}`);
      addDebugLog(`❌ Register test hatası: ${errorMsg}`);
    }
  };

  const testLoginEndpoint = async () => {
    try {
      addDebugLog('🧪 Login endpoint test...');
     
      const testUser = { 
        username: `testlogin_${Date.now()}`, 
        email: `testlogin_${Date.now()}@test.com`, 
        password: '123456' 
      };
      

      await axios.post(`${API_BASE_URL}/api/register`, testUser);
      addDebugLog('🧪 Test kullanıcısı kayıt edildi');
      
  
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      setMessage(`✅ Login endpoint çalışıyor: ${response.data.message}`);
      addDebugLog('✅ Login test başarılı');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setMessage(`❌ Login endpoint hatası: ${errorMsg}`);
      addDebugLog(`❌ Login test hatası: ${errorMsg}`);
    }
  };

  if (isLoggedIn && user) {
    return (
      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>🎉 Başarıyla Giriş Yaptınız!</h2>
          <div style={{ 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            padding: '15px', 
            borderRadius: '8px', 
            margin: '15px 0' 
          }}>
            <h3>👤 {user.username}</h3>
            <p>📧 {user.email}</p>
            <p>🆔 ID: {user.id}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            👋 Çıkış Yap
          </button>
          <button onClick={checkServerStatus} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            🔄 Server Kontrol
          </button>
          <button onClick={showRegisteredUsers} style={{ padding: '10px 20px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            📋 Tüm Kullanıcılar
          </button>
        </div>

    
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
          <h4>🔧 İşlem Geçmişi:</h4>
          {debugLog.map((log, index) => (
            <div key={index} style={{ fontSize: '12px', fontFamily: 'monospace', marginBottom: '3px' }}>
              {log}
            </div>
          ))}
        </div>

        {message && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            borderRadius: '4px',
            wordBreak: 'break-word'
          }}>
            {message}
          </div>
        )}
      </div>
    );
  }

  
  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>{isLogin ? '🔐 Giriş Yap' : '📝 Kayıt Ol'}</h2>
      
     
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', marginBottom: '20px', borderRadius: '4px' }}>
        <h3>🔧 Server Bilgileri</h3>
        <p><strong>Server Durumu:</strong> {serverStatus}</p>
        <p><strong>API URL:</strong> {API_BASE_URL}</p>
        <p><strong>Mod:</strong> {isLogin ? 'Giriş Yapma' : 'Kayıt Olma'}</p>
        
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
          <button onClick={checkServerStatus} style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            🔄 Server Kontrol
          </button>
          <button onClick={testRegisterEndpoint} style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            🧪 Register Test
          </button>
          <button onClick={testLoginEndpoint} style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#fd7e14', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            🧪 Login Test
          </button>
          <button onClick={showRegisteredUsers} style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            📋 Kullanıcılar
          </button>
          <button onClick={testDifferentLoginFormats} style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#e83e8c', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            🧪 Login Formatları Test
          </button>
        </div>
        

        <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#ffffff', borderRadius: '3px', maxHeight: '120px', overflowY: 'auto', border: '1px solid #dee2e6' }}>
          <strong style={{ fontSize: '12px' }}>Son İşlemler:</strong>
          {debugLog.slice(-5).map((log, index) => (
            <div key={index} style={{ fontSize: '10px', fontFamily: 'monospace', marginBottom: '2px' }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      <div>
  
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              name="username"
              placeholder="Kullanıcı Adı"
              value={form.username}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>
        )}
        

        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>
          <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: loading ? '#6c757d' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '⏳ İşleniyor...' : (isLogin ? '🔐 Giriş Yap' : '📝 Kayıt Ol')}
        </button>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        <button 
          onClick={() => { 
            setIsLogin(!isLogin); 
            setMessage(''); 
            setForm({ username: '', email: '', password: '' });
            addDebugLog(`🔄 Mod değişti: ${!isLogin ? 'Giriş' : 'Kayıt'}`);
          }}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#007bff', 
            cursor: 'pointer', 
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          {isLogin ? '📝 Kayıt Olmak İstiyorum' : '🔐 Zaten Hesabım Var'}
        </button>
      </p>
      
      {message && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          wordBreak: 'break-word'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default AuthForm;