import React, { useState, useEffect } from 'react';
import './Sale.css';

const Sale = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/discounted-products');

        if (!response.ok) {
          throw new Error('İndirimli ürünler yüklenemedi');
        }

        const data = await response.json();
        console.log('🔥 API\'den gelen indirimli ürünler:', data);

        // BASIT HAL - PopularProducts gibi aynı mantık
        const formattedProducts = data.map(product => {
          console.log(`Ürün ${product.id} - Image URL: ${product.image_url}`);
          
          return {
            id: product.id,
            brand: product.name,
            title: product.description || product.name,
            rating: 4.5,
            reviews: Math.floor(Math.random() * 1000) + 100,
            price: product.price.toString(),
            discount: `%${product.discount} indirim`,
            tag: "HIZLI TESLİMAT",
            badge: "İNDİRİMLİ ÜRÜN",
            image_url: product.image_url || '/images/default-product.jpg' // PopularProducts ile aynı
          };
        });

        console.log(`✅ ${formattedProducts.length} indirimli ürün formatlandı`);
        setProducts(formattedProducts);
      } catch (err) {
        setError(err.message);
        console.error('İndirimli ürünler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(productId) ? newFavorites.delete(productId) : newFavorites.add(productId);
    setFavorites(newFavorites);
  };

  const nextSlide = () => {
    if (currentIndex < products.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="flashhh-products-container">
        <div className="loading-container">
          <p>İndirimli ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flashhh-products-container">
        <div className="error-container">
          <p>Hata: {error}</p>
          <button onClick={() => window.location.reload()}>Tekrar Dene</button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flashhh-products-container">
        <div className="no-products">
          <p>Şu anda indirimli ürün bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flashhh-products-container">
      <div className="flashhh-header">
        <div className="flashhh-title-section">
          <div className="flashhh-title">
            <span style={{ fontSize: '24px' }}>🔥</span>
            <h2>İndirimli Ürünler ({products.length} ürün)</h2>
          </div>
        </div>
        <button className="vieww-all-btn">
          <span>Tüm İndirimli Ürünler</span>
          <span>➤</span>
        </button>
      </div>

      <div className="carouselll-container">
        <div className="carouselll-overflow">
          <div
            className="carouselll-track"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {products.map((product) => (
              <div key={product.id} className="producttt-card-wrapper">
                <div className="producttt-card">
                  <div className="producttt-image-container">
                    <div className="producttt-badges">
                      <div className="badgeee-delivery">
                        <span>🚚</span>
                        {product.tag}
                      </div>
                      <div className="badgeee-cargo">
                        <span>📦</span>
                        KARGO BEDAVA
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="favoriteee-btn"
                    >
                      <span className={`favoriteee-icon ${favorites.has(product.id) ? 'active' : ''}`}>
                        {favorites.has(product.id) ? '❤️' : '🤍'}
                      </span>
                    </button>

                    <div className="producttt-badge">
                      {product.badge}
                    </div>

                    <div className="producttt-image-placeholder">
                      {/* PopularProducts ile aynı mantık kullan */}
                      <img
                        src={product.image_url || '/images/default-product.jpg'}
                        alt={product.title}
                        className="producttt-image"
                        onError={(e) => {
                          console.error(`❌ Resim yüklenemedi: ${product.image_url}`);
                          console.log('🔄 Default resme geçiliyor...');
                          e.target.src = '/images/default-product.jpg';
                        }}
                        onLoad={() => {
                          console.log(`✅ Resim başarıyla yüklendi: ${product.image_url}`);
                        }}
                      />
                    </div>
                  </div>

                  <div className="producttt-info">
                    <div className="producttt-brand">{product.brand}</div>
                    <h3 className="producttt-title">{product.title}</h3>

                    <div className="producttt-rating">
                      <span className="ratinggg-score">{product.rating}</span>
                      <div className="ratinggg-stars">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`starrr ${i < Math.floor(product.rating) ? 'filled' : 'empty'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ratinggg-count">({product.reviews})</span>
                    </div>

                    <div className="producttt-price">
                      <div className="priceee">{product.price} TL</div>
                    </div>

                    <div className="producttt-discounts">
                      <div className="discounttt-badge discount-pink">
                        <span>🔥</span>
                        {product.discount}
                      </div>
                      <div className="discounttt-badge discount-orange">
                        <span>⚡</span>
                        Çok Al Az Öde
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentIndex < products.length - 4 && (
          <button
            onClick={nextSlide}
            className="nav-arrow"
          >
            <span className="nav-arrow-icon">➤</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sale;