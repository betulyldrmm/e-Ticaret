import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AuthForm from './pages/AuthForm';


function App() {
  return (
    <BrowserRouter>
     <Routes>
  <Route path='/' element={<Home />} />
  <Route path='/authForm' element={<AuthForm />} />
 
 
</Routes>

    </BrowserRouter>
  );
}

export default App;
