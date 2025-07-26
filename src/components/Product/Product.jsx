
import React, { useState, useEffect } from 'react';
import './Product.css';

const Product = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Spor Ayakkabıları",
      subtitle: "Koşu ve Antrenman",
      buttonText: "Alışverişe Başla",
      products: [
        { name: "Nike Air Max", image: "sports1.jpg", type: "Koşu Ayakkabısı" },
        { name: "Adidas Ultraboost", image: "sports2.jpg", type: "Spor Ayakkabı" },
        { name: "Puma Running", image: "sports3.jpg", type: "Koşu Ayakkabısı" }
      ]
    },
    {
      id: 2,
      title: "Fitness Ekipmanları",
      subtitle: "Antrenman Malzemeleri",
      buttonText: "Keşfet",
      products: [
        { name: "Yoga Matı", image: "sports4.jpg", type: "Yoga Malzemesi" },
        { name: "Dumbbell Set", image: "sports5.jpg", type: "Ağırlık" },
        { name: "Resistance Band", image: "sports6.jpg", type: "Direnç Bandı" }
      ]
    },
    {
      id: 3,
      title: "Spor Giyim",
      subtitle: "Aktif Yaşam",
      buttonText: "İncele",
      products: [
        { name: "Nike Dri-FIT", image: "sports7.jpg", type: "Spor T-Shirt" },
        { name: "Adidas Shorts", image: "sports8.jpg", type: "Spor Şort" },
        { name: "Under Armour", image: "sports9.jpg", type: "Hoodie" }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="carousel-container">
      {/* Date Badge */}
      <div className="date-badge">
        <div className="date-content">
          <div className="date-number">31</div>
          <div className="date-text">TEMMUZ</div>
          <div className="date-text">SON</div>
        </div>
      </div>


      <div className="brand-logo">
        <div className="brand-text">SPORCU</div>
      </div>

   
      <div className="main-content">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
         
            <div className="shapes-container">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>

         
            <div className="products-container">
              <div className="products-wrapper">
         
                <div className="main-product">
                  <img 
                    src={slide.products[0].image} 
                    alt={slide.products[0].name}
                    className="product-image main-image"
                  />
                </div>
                
                <div className="secondary-product secondary-1">
                  <img 
                    src={slide.products[1].image} 
                    alt={slide.products[1].name}
                    className="product-image secondary-image"
                  />
                </div>
                
                <div className="secondary-product secondary-2">
                  <img 
                    src={slide.products[2].image} 
                    alt={slide.products[2].name}
                    className="product-image secondary-image"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side Info Panel */}
      <div className="info-panel">
        <div className="panel-content">
          <div className="panel-date">31 Temmuz</div>
          <h2 className="panel-title">
            {slides[currentSlide].title}
          </h2>
          
          {/* Thin Button */}
          <button 
            onClick={() => console.log('Alışverişe başla clicked')}
            className="action-button"
          >
            <span>{slides[currentSlide].buttonText}</span>
            <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="nav-arrow nav-left">
        <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button onClick={nextSlide} className="nav-arrow nav-right">
        <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="dots-container">
        <div className="dots-wrapper">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;