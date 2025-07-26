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
    <div className="flashhh-products-container">
     
      <div className="flashhh-header">
        <div className="flashhh-title-section">
          <div className="flashhh-title">
            <span style={{ fontSize: '24px' }}>⚡</span>
            <h2>Flaş Ürünler</h2>
          </div>
          
        </div>
        <button className="vieww-all-btn">
          <span>Tüm Ürünler</span>
          <span>➤</span>
        </button>
      </div>

      {/* Carousel Container */}
      <div className="carouselll-container">
        <div className="carouselll-overflow">
          <div 
            className="carouselll-track"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {products.map((product) => (
              <div key={product.id} className="producttt-card-wrapper">
                <div className="producttt-card">
                  {/* Product Image Container */}
                  <div className="producttt-image-container">
                    {/* Badges */}
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
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="favoriteee-btn"
                    >
                      <span className={`favoriteee-icon ${favorites.has(product.id) ? 'active' : ''}`}>
                        {favorites.has(product.id) ? '❤️' : '🤍'}
                      </span>
                    </button>
                    
                    {/* Product Badge */}
                    <div className="producttt-badge">
                      {product.badge}
                    </div>

                    {/* Product Image Placeholder */}
                    <div className="producttt-image-placeholder">
                      {product.image}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="producttt-info">
                    <div className="producttt-brand">{product.brand}</div>
                    <h3 className="producttt-title">
                      {product.title}
                    </h3>
                    
                    {/* Rating */}
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

                    {/* Price */}
                    <div className="producttt-price">
                      <div className="priceee">{product.price} TL</div>
                    </div>

                    {/* Discount Badges */}
                    <div className="producttt-discounts">
                      <div className="discounttt-badge discount-pink">
                        <span>📱</span>
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