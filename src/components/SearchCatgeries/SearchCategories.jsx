
import React, { useState } from 'react';
import { Search, ShoppingCart, Heart } from 'lucide-react';
import './SearchCategories.css';

const categories = [
  'Moda',
  'Elektronik',
  'Çocuk',
  'Bebek',
  'Ev & Dekorasyon',
  'Spor',
  'Kozmetik',
  'Kitap & Kırtasiye',
  'Otomobil',
  'Gıda',
  'Yedek Parça',
  'Aksesuarlar',
  'Yağ & Bakım',
  'Lastik',
  'Kadın Giyim',
  'Erkek Giyim',
  'Ayakkabılar'
];

function SearchCategories() {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length === 0) {
      setFiltered([]);
      return;
    }

    const filteredCats = categories.filter(cat =>
      cat.toLowerCase().includes(val.toLowerCase())
    );
    setFiltered(filteredCats);
  };

  const handleClick = (category) => {
    alert(`${category} kategorisine gidiliyor!`);
    setQuery('');
    setFiltered([]);
  };

  const handleCartClick = () => {
    alert('Sepetim açılıyor!');
  };

  const handleFavoritesClick = () => {
    alert('Favorilerim açılıyor!');
  };

  return (
    <div className="header-container">
      <div className="search-section">
        <div className="search-categories">
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Aradığınız ürün, kategori veya markayı yazınız"
              value={query}
              onChange={handleChange}
              className="search-input"
            />
          </div>
          {filtered.length > 0 && (
            <ul className="search-results">
              {filtered.map((cat) => (
                <li
                  key={cat}
                  onClick={() => handleClick(cat)}
                  className="search-result-item"
                >
                  <Search size={16} className="result-icon" />
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="action-buttons">
          <button 
            className="action-button favorites-btn"
            onClick={handleFavoritesClick}
          >
            <Heart size={60} color='red'  />
            <span className='action-button'>Favorilerim</span>
          </button>
          
          <button 
            className="action-button cart-btn"
            onClick={handleCartClick}
          >
            <ShoppingCart size={60} />
            <span className='action-button'>Sepetim</span>
          
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchCategories;