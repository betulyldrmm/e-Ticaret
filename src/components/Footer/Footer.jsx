import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Kurumsal Bölüm */}
          <div className="footer-section">
            <h3 className="footer-title">Kurumsal</h3>
            <nav className="footer-nav">
              <a href="/hakkimizda" className="footer-link">Hakkımızda</a>
              <a href="/biz-kimiz" className="footer-link">Biz Kimiz</a>
              <a href="/magazalarimiz" className="footer-link">Mağazalarımız</a>
              <a href="/kariyer" className="footer-link">Kariyer</a>
              <a href="/basin-odasi" className="footer-link">Basın Odası</a>
              <a href="/iletisim" className="footer-link">İletişim</a>
            </nav>
          </div>

          {/* Müşteri Hizmetleri */}
          <div className="footer-section">
            <h3 className="footer-title">Müşteri Hizmetleri</h3>
            <nav className="footer-nav">
              <a href="/sikca-sorulan-sorular" className="footer-link">Sıkça Sorulan Sorular</a>
              <a href="/iade-degisim" className="footer-link">İade & Değişim</a>
              <a href="/kargo-teslimat" className="footer-link">Kargo & Teslimat</a>
              <a href="/odeme-secenekleri" className="footer-link">Ödeme Seçenekleri</a>
              <a href="/uyelik-sozlesmesi" className="footer-link">Üyelik Sözleşmesi</a>
            </nav>
          </div>

          {/* Güvenli Alışveriş */}
          <div className="footer-section">
            <h3 className="footer-title">Güvenli Alışveriş</h3>
            <nav className="footer-nav">
              <a href="/gizlilik-politikasi" className="footer-link">Gizlilik Politikası</a>
              <a href="/kullanim-kosullari" className="footer-link">Kullanım Koşulları</a>
              <a href="/cerez-politikasi" className="footer-link">Çerez Politikası</a>
              <a href="/guvenlik" className="footer-link">Güvenlik</a>
              <a href="/kvkk" className="footer-link">KVKK Aydınlatma Metni</a>
            </nav>
          </div>

          {/* Gel Al Noktaları */}
          <div className="footer-section">
            <h3 className="footer-title">Gel Al Noktaları</h3>
            <nav className="footer-nav">
              <a href="/gel-al-noktalari" className="footer-link">Gel Al Haritası</a>
              <a href="/magaza-bul" className="footer-link">Mağaza Bul</a>
              <a href="/pick-up-point" className="footer-link">Pick Up Point</a>
              <a href="/kargo-takip" className="footer-link">Kargo Takip</a>
            </nav>
          </div>
        </div>

        {/* E-ticaret Platformları */}
        <div className="footer-platforms">
          <h3 className="footer-title">Bizi Takip Edin</h3>
         
        </div>

        {/* Sosyal Medya */}
        <div className="footer-social">
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">📘</a>
            <a href="#" className="social-link" aria-label="Instagram">📷</a>
            <a href="#" className="social-link" aria-label="Twitter">🐦</a>
            <a href="#" className="social-link" aria-label="YouTube">🎥</a>
            <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copy">&copy; 2025 Şirket Adı. Tüm hakları saklıdır.</p>
          <p className="footer-info">7/24 Müşteri Hizmetleri: 0850 XXX XX XX</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;