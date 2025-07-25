import React, { useState } from 'react';
import './Sale.css'; // CSS dosyasını import edin

const Sale = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());

  // 10 adet ürün verisi
  const products = [
    {
      id: 1,
      brand: "SportShop",
      title: "Profesyonel Spor Ayakkabısı Yüksek Performans",
      rating: 4.6,
      reviews: 125,
      price: "389.86",
      discount: "15 TL Kupon",
      tag: "HIZLI TESLİMAT",
      badge: "AVANTAJLI ÜRÜN",
      image: "spor.jpg"
    },
    {
      id: 2,
      brand: "FitGear",
      title: "Spor Giyim Seti 3'lü Kombinasyon",
      rating: 4.4,
      reviews: 832,
      price: "110.87",
      discount: "Çok Al Az Öde",
      tag: "HIZLI TESLİMAT",
      badge: "EN ÇOK SATAN",
      image: "spor.jpg"
    },
    {
      id: 3,
      brand: "HealthPlus",
      title: "Spor Takviyesi Protein Tozu %100 Doğal",
      rating: 4.6,
      reviews: 967,
      price: "191.90",
      discount: "Kupon Fırsatı",
      tag: "AVANTAJLI ÜRÜN",
      badge: "SPREYLI KARAKLI YENİ SİSE",
      image: "spor.jpg"
    },
    {
      id: 4,
      brand: "ActiveLife",
      title: "Spor Matı Yoga ve Pilates İçin",
      rating: 4.3,
      reviews: 164,
      price: "269.00",
      discount: "Çok Al Az Öde",
      tag: "HIZLI TESLİMAT",
      badge: "AVANTAJLI ÜRÜN",
      image: "spor.jpg"
    },
    {
      id: 5,
      brand: "WestSport",
      title: "Spor Çantası Su Geçirmez Tasarım",
      rating: 4.4,
      reviews: 439,
      price: "49.90",
      discount: "Kupon Fırsatı",
      tag: "HIZLI TESLİMAT",
      badge: "3. Ürün %15",
      image: "spor.jpg"
    },
    {
      id: 6,
      brand: "PowerFit",
      title: "Spor Eldiveni Antrenman İçin",
      rating: 4.5,
      reviews: 298,
      price: "299.90",
      discount: "Kupon Fırsatı",
      tag: "HIZLI TESLİMAT",
      badge: "AVANTAJLI ÜRÜN",
      image: "spor.jpg"
    },
    {
      id: 7,
      brand: "FlexGym",
      title: "Spor Bandajı Destek Sağlayıcı",
      rating: 4.7,
      reviews: 521,
      price: "159.90",
      discount: "15 TL Kupon",
      tag: "HIZLI TESLİMAT",
      badge: "EN ÇOK SATAN",
      image: "spor.jpg"
    },
    {
      id: 8,
      brand: "RunMax",
      title: "Koşu Saati GPS Özellikli",
      rating: 4.8,
      reviews: 672,
      price: "799.90",
      discount: "Çok Al Az Öde",
      tag: "HIZLI TESLİMAT",
      badge: "AVANTAJLI ÜRÜN",
      image: "spor.jpg"
    },
    {
      id: 9,
      brand: "SportTech",
      title: "Spor Kulaklığı Bluetooth",
      rating: 4.5,
      reviews: 384,
      price: "189.90",
      discount: "Kupon Fırsatı",
      tag: "HIZLI TESLİMAT",
      badge: "AVANTAJLI ÜRÜN",
      image: "spor.jpg"
    },
    {
      id: 10,
      brand: "FitHome",
      title: "Spor Aleti Ev Tipi Kompakt",
      rating: 4.6,
      reviews: 156,
      price: "449.90",
      discount: "15 TL Kupon",
      tag: "HIZLI TESLİMAT",
      badge: "AVANTAJLI ÜRÜN",
      image: "spor.jpg"
    }
  ];

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const nextSlide = () => {
    if (currentIndex < products.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Zaman sayacı (örnek değerler)
  const [timeLeft] = useState({ hours: 2, minutes: 36, seconds: 32 });

  return (
    <div className="flash-products-container">
      {/* Header */}
      <div className="flash-header">
        <div className="flash-title-section">
          <div className="flash-title">
            <span style={{ fontSize: '24px' }}>⚡</span>
            <h2>Flaş Ürünler</h2>
          </div>
          <div className="flash-timer">
            <div className="timer-box">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="timer-box">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="timer-box">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
        <button className="view-all-btn">
          <span>Tüm Ürünler</span>
          <span>➤</span>
        </button>
      </div>

      {/* Carousel Container */}
      <div className="carousel-container">
        <div className="carousel-overflow">
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {products.map((product) => (
              <div key={product.id} className="product-card-wrapper">
                <div className="product-card">
                  {/* Product Image Container */}
                  <div className="product-image-container">
                    {/* Badges */}
                    <div className="product-badges">
                      <div className="badge-delivery">
                        <span>🚚</span>
                        {product.tag}
                      </div>
                      <div className="badge-cargo">
                        <span>📦</span>
                        KARGO BEDAVA
                      </div>
                    </div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="favorite-btn"
                    >
                      <span className={`favorite-icon ${favorites.has(product.id) ? 'active' : ''}`}>
                        {favorites.has(product.id) ? '❤️' : '🤍'}
                      </span>
                    </button>
                    
                    {/* Product Badge */}
                    <div className="product-badge">
                      {product.badge}
                    </div>

                    {/* Product Image Placeholder */}
                    <div className="product-image-placeholder">
                      {product.image}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <h3 className="product-title">
                      {product.title}
                    </h3>
                    
                    {/* Rating */}
                    <div className="product-rating">
                      <span className="rating-score">{product.rating}</span>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`star ${i < Math.floor(product.rating) ? 'filled' : 'empty'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rating-count">({product.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="product-price">
                      <div className="price">{product.price} TL</div>
                    </div>

                    {/* Discount Badges */}
                    <div className="product-discounts">
                      <div className="discount-badge discount-pink">
                        <span>📱</span>
                        {product.discount}
                      </div>
                      <div className="discount-badge discount-orange">
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