import React, { useState } from 'react';
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
  'Cocuk',
  'Yedek Parça', 'Aksesuarlar', 'Yağ & Bakım', 'Lastik',
   'Kadın Giyim', 'Erkek Giyim', 'Ayakkabılar', 'Aksesuarlar'
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

  return (
    <>
    <div className="search-categories">
      <input
        type="text"
        placeholder="Kategori ara..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      {filtered.length > 0 && (
        <ul className="search-results">
          {filtered.map((cat) => (
            <li
              key={cat}
              onClick={() => handleClick(cat)}
              className="search-result-item"
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  
    </>
  );
}

export default SearchCategories;
