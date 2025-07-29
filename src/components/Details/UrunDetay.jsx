import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Minus, 
  Plus, 
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw 
} from 'lucide-react';
import './UrunDetay.css';
import Header from '../Header/Header';

const UrunDetay = () => {
  const { urunId } = useParams();
  const navigate = useNavigate();
  const [urun, setUrun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adet, setAdet] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Ürün detaylarını veritabanından çek
  useEffect(() => {
    const fetchUrun = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/products/${urunId}`);
        
        if (!response.ok) {
          throw new Error('Ürün bulunamadı');
        }
        
        const data = await response.json();
        console.log('Ürün detayı:', data);
        setUrun(data);
        setError(null);
      } catch (error) {
        console.error('Ürün detayı alınamadı:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (urunId) {
      fetchUrun();
    }
  }, [urunId]);

  // Favorileri kontrol et
  useEffect(() => {
    if (urun?.id) {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const favorites = new Set(JSON.parse(savedFavorites));
        setIsFavorite(favorites.has(urun.id));
      }
    }
  }, [urun?.id]);

  const handleAdetChange = (type) => {
    if (type === 'increase' && adet < urun.stock) {
      setAdet(adet + 1);
    } else if (type === 'decrease' && adet > 1) {
      setAdet(adet - 1);
    }
  };

  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem('favorites');
    const favorites = savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
    
    if (favorites.has(urun.id)) {
      favorites.delete(urun.id);
      setIsFavorite(false);
    } else {
      favorites.add(urun.id);
      setIsFavorite(true);
    }
    
    localStorage.setItem('favorites', JSON.stringify([...favorites]));
  };

  const sepeteEkle = () => {
    // Auth sayfasına yönlendir
    navigate('/auth', {
      state: {
        message: `${urun.name} ürününü (${adet} adet) satın almak için giriş yapmalısınız.`,
        product: urun,
        quantity: adet
      }
    });
  };

  if (loading) {
    return (
       
      <div className="urun-detay-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Ürün detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !urun) {
    return (
      <div className="urun-bulunamadi">
        <h2>Ürün Bulunamadı</h2>
        <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link to="/urunler" className="geri-don-btn">
          <ArrowLeft size={18} />
          Ürünlere Geri Dön
        </Link>
      </div>
    );
  }

  // İndirimli fiyat hesaplama
  const eskiFiyat = urun.discount > 0 
    ? (urun.price / (1 - urun.discount / 100)).toFixed(2)
    : null;

  return (
    <>
    <Header></Header>
    <div className="urun-detay-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Ana Sayfa</Link>
        <span> / </span>
        <Link to="/urunler">Ürünler</Link>
        <span> / </span>
        {urun.category_name && (
          <>
            <span>{urun.category_name}</span>
            <span> / </span>
          </>
        )}
        <span>{urun.name}</span>
      </nav>

      <div className="urun-detay-content">
        {/* Sol Taraf - Resimler */}
        <div className="urun-resimler">
          <div className="ana-resim">
            <img 
              src={urun.image_url || 'https://via.placeholder.com/500x500?text=Ürün+Resmi'} 
              alt={urun.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x500?text=Ürün+Resmi';
              }}
            />
            {urun.stock <= 0 && (
              <div className="stok-yok-overlay">Stokta Yok</div>
            )}
          </div>
          
          {/* Eğer birden fazla resim varsa küçük resimler gösterilebilir */}
          {/* Şimdilik tek resim gösteriyoruz */}
        </div>

        {/* Sağ Taraf - Ürün Bilgileri */}
        <div className="urun-bilgileri">
          <div className="urun-baslik">
            <h1>{urun.name}</h1>
            {urun.category_name && (
              <p className="marka-kategori">{urun.category_name}</p>
            )}
          </div>

          {/* Rating */}
          <div className="rating-section">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i < 4 ? '#ffa500' : 'none'} 
                  color="#ffa500"
                />
              ))}
            </div>
            <span className="rating-text">(4.0) • 128 değerlendirme</span>
          </div>

          <div className="fiyat-bolumu">
            {eskiFiyat && (
              <span className="eski-fiyat">{eskiFiyat} TL</span>
            )}
            <span className="guncel-fiyat">{urun.price} TL</span>
            {urun.discount > 0 && (
              <span className="indirim-orani">
                %{urun.discount} İndirim
              </span>
            )}
          </div>

          {/* Açıklama */}
          {urun.description && (
            <div className="urun-aciklama">
              <p>{urun.description}</p>
            </div>
          )}

          {/* Adet Seçimi */}
          {urun.stock > 0 && (
            <div className="adet-secimi">
              <h3>Adet:</h3>
              <div className="adet-kontrol">
                <button 
                  onClick={() => handleAdetChange('decrease')}
                  disabled={adet <= 1}
                >
                  <Minus size={16} />
                </button>
                <span>{adet}</span>
                <button 
                  onClick={() => handleAdetChange('increase')}
                  disabled={adet >= urun.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Sepete Ekle */}
          <div className="sepet-bolumu">
            <div className="action-buttons">
              <button 
                className={`sepete-ekle-btn ${urun.stock <= 0 ? 'disabled' : ''}`}
                onClick={sepeteEkle}
                disabled={urun.stock <= 0}
              >
                <ShoppingCart size={18} />
                {urun.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
              </button>
              
              <button 
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={toggleFavorite}
              >
                <Heart size={18} fill={isFavorite ? '#ff4757' : 'none'} />
              </button>
            </div>
            
            <div className="stok-durumu">
              {urun.stock > 0 ? (
                <span className="stokta-var">✓ Stokta Var ({urun.stock} adet) - Hızlı Teslimat</span>
              ) : (
                <span className="stokta-yok">✗ Bu ürün şu anda stokta bulunmuyor</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alt Bilgiler */}
      <div className="alt-bilgiler">
        <div className="ozellik-kartlari">
          <div className="ozellik-karti">
            <Truck size={24} />
            <div>
              <h4>Ücretsiz Kargo</h4>
              <p>150₺ ve üzeri alışverişlerde</p>
            </div>
          </div>
          
          <div className="ozellik-karti">
            <RotateCcw size={24} />
            <div>
              <h4>Kolay İade</h4>
              <p>14 gün içinde ücretsiz iade</p>
            </div>
          </div>
          
          <div className="ozellik-karti">
            <Shield size={24} />
            <div>
              <h4>Garanti</h4>
              <p>2 yıl resmi distribütör garantisi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Geri Dön Butonu */}
      <div className="geri-don-container">
        <button 
          className="geri-don-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Geri Dön
        </button>
      </div>
    </div>
    </>
  );
};

export default UrunDetay;