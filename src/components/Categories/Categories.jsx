import React, { useState } from 'react';
import './Categories.css';
import {
  FaTshirt,
  FaMobileAlt,
  FaChild,
  FaBaby,
  FaHome,
  FaFootballBall,
  FaSprayCan,
  FaBook,
  FaCar,
  FaAppleAlt,
} from 'react-icons/fa';

const categories = [
  {
    name: 'MODA',
    icon: <FaTshirt />,
    subCategories: ['Kadın Giyim', 'Erkek Giyim', 'Ayakkabılar', 'Aksesuarlar'],
  },
  {
    name: 'ELEKTRONİK',
    icon: <FaMobileAlt />,
    subCategories: ['Telefonlar', 'Bilgisayarlar', 'Kamera', 'Ev Elektroniği'],
  },
  {
    name: 'ÇOCUK',
    icon: <FaChild />,
    subCategories: ['Oyuncaklar', 'Giyim', 'Kitaplar', 'Okul Malzemeleri'],
  },
  {
    name: 'BEBEK',
    icon: <FaBaby />,
    subCategories: ['Bebek Bezi', 'Bebek Giyim', 'Mama & Beslenme', 'Oyun & Aktivite'],
  },
  {
    name: 'DEKORASYON',
    icon: <FaHome />,
    subCategories: ['Mobilya', 'Aydınlatma', 'Mutfak Gereçleri', 'Tekstil'],
  },
  {
    name: 'SPOR',
    icon: <FaFootballBall />,
    subCategories: ['Spor Giyim', 'Outdoor', 'Fitness Ekipmanları', 'Bisiklet'],
  },
  {
    name: 'KOZMETİK',
    icon: <FaSprayCan />,
    subCategories: ['Makyaj', 'Cilt Bakımı', 'Saç Bakımı', 'Parfüm'],
  },
  {
    name: 'KİTAP',
    icon: <FaBook />,
    subCategories: ['Roman', 'Eğitim', 'Defter & Kalem', 'Sanat Malzemeleri'],
  },
  {
    name: 'OTOMOBİL',
    icon: <FaCar />,
    subCategories: ['Yedek Parça', 'Aksesuarlar', 'Yağ & Bakım', 'Lastik'],
  },
  {
    name: 'GIDA',
    icon: <FaAppleAlt />,
    subCategories: ['Atıştırmalıklar', 'İçecekler', 'Organik Ürünler', 'Süt & Süt Ürünleri'],
  },
];

function Categories() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <nav className="category-navv">
      <ul className="category-listt">
        {categories.map((cat, index) => (
          <li
            key={cat.name}
            className="category-itemm"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="container">
              <div className="category-header">
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </div>
            </div>
            {activeIndex === index && (
              <ul className="subcategory-list">
                {cat.subCategories.map((sub) => (
                  <li key={sub} className="subcategory-item">
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Categories;
