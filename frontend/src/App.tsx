import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proizvodi" element={<Products />} />
          <Route path="/proizvodi/:id" element={<ProductDetail />} />
          <Route path="/kosarica" element={<Cart />} />
          <Route path="/naplata" element={<Checkout />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
