import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Variantes para animaciones
const hoverVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const ProductItem = ({ product }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Función para agregar el producto al carrito
  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Por favor, inicia sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      let userData;
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        // Si el documento no existe, lo creamos
        userData = {
          uid: user.uid,
          email: user.email,
          cart: [],
          purchases: [],
          stats: { totalSpent: 0, totalPurchases: 0, favoriteCategory: '' }
        };
        await setDoc(userRef, userData);
      }

      const cart = userData.cart || [];
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          store: product.store || 'Sin tienda',
          quantity: 1,
          savings: product.savings || 0,
          category: product.category || 'Sin categoría',
        });
      }

      await updateDoc(userRef, { cart });
      toast.success(`${product.name} agregado al carrito`);
    } catch (error) {
      toast.error('Error al agregar al carrito: ' + error.message);
    }
  };

  return (
    <motion.div
      className="bg-[#1F252A] p-4 rounded-lg shadow border-2 border-[#3A4450] w-full max-w-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover="hover"
      variants={hoverVariants}
    >
      <div className="text-center">
        <h3 className="font-bold text-[#FFFFFF]">{product.name}</h3>
        <p className="text-[#A0AEC0]">Precio: ${product.price?.toFixed(2)}</p>
        {product.store && <p className="text-[#A0AEC0]">Tienda: {product.store}</p>}
        <motion.button
          onClick={handleAddToCart}
          className="mt-2 px-4 py-2 bg-blue-500 text-[#FFFFFF] rounded-lg"
          whileHover={{ scale: 1.05 }}
        >
          Agregar al Carrito
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductItem;