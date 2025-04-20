import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import { CartProvider } from './context/CartContext';
   import { ToastContainer } from 'react-toastify';
   import 'react-toastify/dist/ReactToastify.css'; // Importar los estilos de react-toastify
   import Navbar from './components/Navbar';
   import Home from './pages/Home';
   import Upload from './pages/Upload';
   import SearchBestPrice from './pages/SearchBestPrice';
   import Cart from './pages/Cart';
   import Profile from './pages/Profile';
   import Login from './pages/Login';
   import Signup from './pages/Signup';

   function App() {
     return (
       <CartProvider>
         <Router>
           <Navbar />
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/upload" element={<Upload />} />
             <Route path="/search-best-price" element={<SearchBestPrice />} />
             <Route path="/cart" element={<Cart />} />
             <Route path="/profile" element={<Profile />} />
             <Route path="/login" element={<Login />} />
             <Route path="/signup" element={<Signup />} />
             <Route path="*" element={<div className="text-white text-center mt-10">Página no encontrada (404)</div>} />
           </Routes>
           <ToastContainer
             position="top-right"
             autoClose={3000}
             hideProgressBar={false}
             newestOnTop={false}
             closeOnClick
             rtl={false}
             pauseOnFocusLoss
             draggable
             pauseOnHover
             theme="dark"
           />
         </Router>
       </CartProvider>
     );
   }

   export default App;