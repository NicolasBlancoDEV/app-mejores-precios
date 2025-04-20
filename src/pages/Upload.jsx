import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Upload = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [storeName, setStoreName] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        toast.error('Por favor, inicia sesión para subir productos');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Manejar la subida manual del producto
  const handleManualUpload = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!name || !price || !storeName) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      const productId = Date.now().toString();
      const productRef = doc(db, 'products', productId);
      await setDoc(productRef, {
        id: productId,
        name,
        price: parseFloat(price),
        store: storeName,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      });

      toast.success('Producto subido exitosamente');
      setName('');
      setPrice('');
      setStoreName('');
    } catch (error) {
      console.error('Error al subir el producto:', error);
      toast.error('Error al subir el producto: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center py-8 px-4">
      <motion.div
        className="bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">Subir Productos</h2>
        <form onSubmit={handleManualUpload} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="name">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Leche La Serenísima"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="price">
              Precio
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 2700"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="store">
              Tienda
            </label>
            <input
              type="text"
              id="store"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Supermercado XYZ"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Subir Producto
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Upload;