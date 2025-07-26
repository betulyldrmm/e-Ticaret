import React from 'react';
import Header from '../components/Header/Header';
import Categories from '../components/Categories/Categories';
import SearchCategories from '../components/SearchCatgeries/SearchCategories';
import Sale from '../components/Sale/Sale';
import PopularProducts from '../components/PopularProduction/PopularProducts';
import Brand from '../components/Brand/Brand';
import Product from '../components/Product/Product';
import Footer from '../components/Footer/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <Categories />
      <SearchCategories></SearchCategories>  <br></br><br></br>
      <Product></Product><br></br><br></br>
 <Sale></Sale>
    <PopularProducts></PopularProducts>
     <PopularProducts></PopularProducts>
     <Brand></Brand>
     <Product></Product><br></br><br></br>
     
     <Footer></Footer>
    </>
  );
};

export default Home;
