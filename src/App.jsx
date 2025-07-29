import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AuthForm from './pages/AuthForm';
import Home1 from './pages/Home1';
import UrunListesi from './components/Details/UrunListesi';
import UrunDetay from './components/Details/UrunDetay';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/authForm' element={<AuthForm />} />
        <Route path='/home1' element={<Home1 />} />
         <Route path="/urunler" element={<UrunListesi />} />
            <Route path="/urun/:urunId" element={<UrunDetay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
