import React from "react";
import "./GiftCategories.css";

const categories = [
  {
    title: "Kendine Hediye",
    subtitle: "Bir sürpriz yap",
    image: "/images/giftbox.png", // kendi klasöründe bu görselleri olmalı
  },
  {
    title: "Spora Başla",
    subtitle: "Motivasyon kutusu",
    image: "/images/sport.png",
  },
  {
    title: "Hobi Edin",
    subtitle: "Yeni ilgi alanları",
    image: "/images/hobby.png",
  },
  {
    title: "Kendinle Kal",
    subtitle: "Rahatlama zamanı",
    image: "/images/relax.png",
  },
  {
    title: "Düzen Kur",
    subtitle: "Planlı yaşam başlasın",
    image: "/images/organize.png",
  },
];

const GiftCategories = () => {
  return (
    <div className="gift-container">
      {categories.map((cat, index) => (
        <div className="gift-card" key={index}>
          <img src={cat.image} alt={cat.title} className="gift-img" />
          <h3>{cat.title}</h3>
          <p>{cat.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default GiftCategories;
