import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <nav className="footer-nav">
          <a href="/" className="footer-link">Anasayfa</a>
          <a href="/hakkimizda" className="footer-link">Hakkımızda</a>
          <a href="/biz-kimiz" className="footer-link">Biz Kimiz</a>
        </nav>
        <p className="footer-copy">&copy; 2025 Şirket Adı. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
