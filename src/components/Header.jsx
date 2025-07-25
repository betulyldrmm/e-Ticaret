import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">ShopMind</div>

      <nav className="main-nav">
        <a href="#" className='main-nav'>Anasayfa</a>
        <a href="#">Hakkımızda</a>
        <a href="#">İletişim</a>
        <a href="#">Destek</a>
          <a href="#">SEPETIM</a>
          <a href="#">GİRİŞ YAP/ÜYE OL</a>
      </nav>
    </header>
  );
}

export default Header;
