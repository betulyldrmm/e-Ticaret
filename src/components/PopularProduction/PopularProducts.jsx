import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './PopularProducts.css';

const popularProducts = [
  {
    id: 1,
    image: 'spor.jpg',
    title: 'Termo Piknik Çantası 15 Litre 35X20X20 cm',
    rating: 4.8,
    reviewCount: 248,
    originalPrice: null,
    currentPrice: 129.90,
    discount: null,
    installment: '2. Ürüne %5 indirim',
    tag: null
  },
  {
    id: 2,
    image: 'spor.jpg',
    title: 'Viscotex Visco Ortopedik Çocuk Yastığı (Sensitive Baby)',
    rating: 4.7,
    reviewCount: 327,
    originalPrice: null,
    currentPrice: 588.44,
    discount: null,
    installment: '2. Ürüne %5 indirim',
    tag: 'Peşin fiyatına taksit'
  },
  {
    id: 3,
    image: 'spor.jpg',
    title: 'Şifrli Boyama Kitabı Taşıtlar - Özel Sulu Kalem (Pedagog Onaylı)',
    rating: 4.6,
    reviewCount: 627,
    originalPrice: null,
    currentPrice: 149.90,
    discount: null,
    installment: null,
    tag: null
  },
  {
    id: 4,
    image: 'spor.jpg',
    title: 'Hellobaby Basic Erkek Yazı Baskılı Eşofman Takımı Erkek',
    rating: 4.5,
    reviewCount: 183,
    originalPrice: null,
    currentPrice: 349.99,
    discount: null,
    installment: null,
    tag: 'Peşin fiyatına taksit'
  },
  {
    id: 5,
    image: 'spor.jpg',
    title: 'Yumos Açık Hava Etkisi Mavi Gelincik Konsantre Yumuşatıcı',
    rating: 4.8,
    reviewCount: 1,
    originalPrice: 299.90,
    currentPrice: 169.90,
    discount: 26,
    installment: null,
    tag: 'Kartsız 3 taksit'
  },
  {
    id: 6,
    image: 'spor.jpg',
    title: 'Hypnôse Drama Anında Dolgunluk Ve Hacim Etkili Maskara',
    rating: 4.3,
    reviewCount: 118,
    originalPrice: null,
    currentPrice: 2400.00,
    discount: null,
    installment: 'Sepette 1.920,00 TL',
    tag: null
  },
  {
    id: 7,
    image: 'spor.jpg',
    title: 'Profesyonel Spor Ayakkabısı Yüksek Performans',
    rating: 4.9,
    reviewCount: 445,
    originalPrice: 899.90,
    currentPrice: 599.90,
    discount: 33,
    installment: '3 Taksit İmkanı',
    tag: 'En Çok Satan'
  },
  {
    id: 8,
    image: 'spor.jpg',
    title: 'Premium Bluetooth Kulaklık Gürültü Önleyici',
    rating: 4.7,
    reviewCount: 892,
    originalPrice: 1299.90,
    currentPrice: 799.90,
    discount: 38,
    installment: '6 Aya Varan Taksit',
    tag: 'Kartsız 3 taksit'
  }
];

function PopularProducts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const itemsPerPage = 6;

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const addToCart = (product) => {
    alert(`${product.title} sepete eklendi!`);
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

  const visibleProducts = popularProducts.slice(currentIndex, currentIndex + itemsPerPage);

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

      <div className="products-grid">
        {visibleProducts.map((product) => (
          <div key={product.id} className="product-card">
            {product.tag && (
              <div className={`product-tag ${product.tag.includes('Peşin') ? 'installment-tag' : 
                                              product.tag.includes('Kartsız') ? 'no-card-tag' : 
                                              product.tag.includes('En Çok') ? 'bestseller-tag' : 'default-tag'}`}>
                {product.tag}
              </div>
            )}
            
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.title}
                className="product-image"
              />
              <button 
                className={`favorite-btn ${favorites.has(product.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart size={18} fill={favorites.has(product.id) ? '#ff4757' : 'none'} />
              </button>
            </div>

            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              
              <div className="rating-container">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      fill={i < Math.floor(product.rating) ? '#ffa500' : 'none'}
                      color="#ffa500"
                    />
                  ))}
                  <span className="rating-text">{product.rating}</span>
                </div>
                <span className="review-count">({product.reviewCount})</span>
              </div>

              <div className="price-container">
                {product.originalPrice && (
                  <span className="original-price">{product.originalPrice} TL</span>
                )}
                <span className="current-price">{product.currentPrice} TL</span>
                {product.discount && (
                  <span className="discount-badge">%{product.discount}</span>
                )}
              </div>

              {product.installment && (
                <div className="installment-info">
                  {product.installment}
                </div>
              )}

              <button 
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart size={16} />
                Sepete Ekle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularProducts;