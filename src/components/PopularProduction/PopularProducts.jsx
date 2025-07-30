import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './PopularProducts.css';

function PopularProducts() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  // Ürün adına göre resim belirleme fonksiyonu
  const getProductImage = (product) => {
    if (product.image_url && !product.image_url.includes('via.placeholder.com')) {
      return product.image_url;
    }
    
    const productName = product.name?.toLowerCase();
    if (productName?.includes('masa')) return '/images/masa.jpg';
    if (productName?.includes('laptop') || productName?.includes('bilgisayar')) return '/images/laptop.jpg';
    if (productName?.includes('telefon')) return '/images/telefon.jpg';
    if (productName?.includes('kitap')) return '/images/kitap.jpg';
    if (productName?.includes('spor')) return '/images/spor.jpg';
    if (productName?.includes('ayakkabı')) return '/images/ayakkabi.jpg';
    if (productName?.includes('çanta')) return '/images/canta.jpg';
    if (productName?.includes('saat')) return '/images/saat.jpg';
    
    return '/images/default-product.jpg';
  };

  // Resim hata durumunda çalışacak fonksiyon
  const handleImageError = (e, product) => {
    const img = e.target;
    const productName = product.name?.toLowerCase();
    
    if (!img.src.includes('default-product.jpg')) {
      if (productName?.includes('masa')) {
        img.src = '/masa.jpg';
      } else if (productName?.includes('laptop') || productName?.includes('bilgisayar')) {
        img.src = '/laptop.jpg';
      } else if (productName?.includes('telefon')) {
        img.src = '/telefon.jpg';
      } else if (productName?.includes('kitap')) {
        img.src = '/kitap.jpg';
      } else if (productName?.includes('spor')) {
        img.src = '/spor.jpg';
      } else {
        img.src = '/images/default-product.jpg';
      }
    } else {
      // Son çare olarak rastgele placeholder
      img.src = `https://picsum.photos/400/400?random=${product.id}`;
    }
  };

  // ✅ Backend'den popüler ürünleri çek
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/popular-products');
        
        if (!response.ok) {
          throw new Error('Popüler ürünler alınamadı');
        }
        
        const data = await response.json();
        console.log('Popüler ürünler:', data);
        setPopularProducts(data);
        setError(null);
      } catch (error) {
        console.error('Popüler ürünler alınamadı:', error);
        setError(error.message);
        // Hata durumunda normal ürünleri göster
        fetchAllProducts();
      } finally {
        setLoading(false);
      }
    };

    // Eğer popüler ürün yoksa tüm ürünleri göster
    const fetchAllProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products');
        if (response.ok) {
          const data = await response.json();
          // İlk 10 ürünü popüler olarak göster
          setPopularProducts(data.slice(0, 10));
        }
      } catch (error) {
        console.error('Ürünler alınamadı:', error);
      }
    };

    fetchPopularProducts();
  }, []);

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
    
    // LocalStorage'a kaydet (opsiyonel)
    localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
  };

  // Sepete ekle - Auth sayfasına yönlendir
  const addToCart = (product, e) => {
    e.preventDefault(); // Link'in çalışmasını engelle
    e.stopPropagation(); // Event bubbling'i durdur
    
    // Auth sayfasına yönlendir
    navigate('/authForm', { 
      state: { 
        message: `${product.name} ürününü satın almak için giriş yapmalısınız.`,
        product: product 
      } 
    });
  };

  const nextSlide = () => {
    if (currentIndex < popularProducts.length - itemsPerPage) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Favorileri localStorage'dan yükle
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const visibleProducts = popularProducts.slice(currentIndex, currentIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="popular-products-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Popüler ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error && popularProducts.length === 0) {
    return (
      <div className="popular-products-container">
        <div className="error-state">
          <p>Popüler ürünler yüklenirken bir hata oluştu.</p>
          <button onClick={() => window.location.reload()}>Tekrar Dene</button>
        </div>
      </div>
    );
  }

  return (
    <div className="popular-products-container">
      <div className="popular-products-header">
        <h2 className="section-title">POPÜLER ÜRÜNLER</h2>
        <div className="navigation-buttons">
          <button 
            className={`nav-btn prev-btn ${currentIndex === 0 ? 'disabled' : ''}`}
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className={`nav-btn next-btn ${currentIndex >= popularProducts.length - itemsPerPage ? 'disabled' : ''}`}
            onClick={nextSlide}
            disabled={currentIndex >= popularProducts.length - itemsPerPage}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {popularProducts.length === 0 ? (
        <div className="no-products">
          <p>Henüz popüler ürün bulunmuyor.</p>
        </div>
      ) : (
        <div className="products-grid">
          {visibleProducts.map((product) => (
            <Link 
              key={product.id} 
              to={`/urun/${product.id}`} 
              className="product-card-link"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="product-card">
                {/* Özel etiketler */}
                {product.rank <= 3 && (
                  <div className="product-tag bestseller-tag">
                    En Popüler #{product.rank}
                  </div>
                )}
                
                {/* İndirim etiketi */}
                {product.discount > 0 && (
                  <div className="product-tag discount-tag">
                    %{product.discount} İndirim
                  </div>
                )}
                
                <div className="product-image-container">
                  <img 
                    src={getProductImage(product)}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => handleImageError(e, product)}
                  />
                  
                  {/* Detay sayfasına git butonu */}
                  <div className="product-overlay">
                   
                  </div>

                  <button 
                    className={`favorite-btn ${favorites.has(product.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    <Heart size={18} fill={favorites.has(product.id) ? '#ff4757' : 'none'} />
                  </button>
                </div>

                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  
                  {/* Kategori bilgisi */}
                  {product.category_name && (
                    <p className="product-category">{product.category_name}</p>
                  )}
                  
                  {/* Açıklama (kısa) */}
                  {product.description && (
                    <p className="product-description">
                      {product.description.length > 60 
                        ? `${product.description.substring(0, 60)}...` 
                        : product.description
                      }
                    </p>
                  )}
                  
                  {/* Rating (şimdilik sabit değerler, sonra dinamik yapılabilir) */}
                  <div className="rating-container">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < 4 ? '#ffa500' : 'none'} // Şimdilik 4 yıldız
                          color="#ffa500"
                        />
                      ))}
                      <span className="rating-text">4.0</span>
                    </div>
                    <span className="review-count">(128)</span>
                  </div>

                  <div className="price-container">
                    {/* İndirimli fiyat hesaplaması */}
                    {product.discount > 0 && (
                      <span className="old-price">
                        {(product.price / (1 - product.discount / 100)).toFixed(2)} TL
                      </span>
                    )}
                    <span className="current-price">{product.price} TL</span>
                  </div>

                  {/* Stok durumu */}
                  <div className="stock-info">
                    {product.stock > 0 ? (
                      <span className="in-stock">
                        ✓ Stokta ({product.stock} adet)
                        {product.stock < 5 && <span className="low-stock"> - Son {product.stock} adet!</span>}
                      </span>
                    ) : (
                      <span className="out-of-stock">✗ Stokta Yok</span>
                    )}
                  </div>

                  <button 
                    className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
                    onClick={(e) => addToCart(product, e)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart size={16} />
                    {product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Sayfa göstergesi */}
      {popularProducts.length > itemsPerPage && (
        <div className="pagination-info">
          <span>
            {currentIndex + 1}-{Math.min(currentIndex + itemsPerPage, popularProducts.length)} / {popularProducts.length} ürün
          </span>
        </div>
      )}
    </div>
  );
}

export default PopularProducts;