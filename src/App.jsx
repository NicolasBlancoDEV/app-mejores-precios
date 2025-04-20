import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Savings from './pages/Savings';
import Cart from './pages/Cart';
import SearchBestPrice from './pages/SearchBestPrice';
import Profile from './pages/Profile';
import Login from './pages/Login'; // Nueva página de Login
import Signup from './pages/Signup'; // Nueva página de Signup
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <div
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.9) 0%, rgba(50, 50, 60, 0.9) 100%)', // Gradiente oscuro medio transparente
        }}
      >
        <Navbar />
        <ToastContainer />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search-best-price" element={<SearchBestPrice />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} /> {/* Nueva ruta para Login */}
            <Route path="/signup" element={<Signup />} /> {/* Nueva ruta para Signup */}
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;