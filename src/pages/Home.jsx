import React from 'react';
import Header from '../components/Header';
import Categories from '../components/Categories';
import SearchCategories from '../components/SearchCategories';
import Sale from '../components/Sale';

const Home = () => {
  return (
    <>
      <Header />
   <Categories />
    <SearchCategories></SearchCategories>  <br></br><br></br>
    <Sale></Sale>
    </>
  );
};

export default Home;
