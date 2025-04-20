import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Cart from './pages/Cart';
import SearchBestPrice from './pages/SearchBestPrice';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider } from './context/CartContext'; // Importamos el CartProvider

function App() {
  return (
    <CartProvider> {/* Envuelve toda la app con el CartProvider */}
      <Router>
        <div
          className="min-h-screen"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.9) 0%, rgba(50, 50, 60, 0.9) 100%)',
          }}
        >
          <Navbar />
          <ToastContainer />
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/search-best-price" element={<SearchBestPrice />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;