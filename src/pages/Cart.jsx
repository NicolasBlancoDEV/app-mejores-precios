import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Variantes para animaciones
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Cart = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Función para eliminar un producto del carrito
  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const updatedCart = cartItems.filter((item) => item.id !== productId);
      await updateDoc(userRef, { cart: updatedCart });
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      toast.error('Error al eliminar el producto: ' + error.message);
    }
  };

  // Función para borrar todo el carrito
  const clearCart = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { cart: [] });
      toast.success('Carrito vaciado');
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      toast.error('Error al vaciar el carrito: ' + error.message);
    }
  };

  // Función para cerrar la compra
  const handleCheckout = async () => {
    if (!user) return;
    if (cartItems.length === 0) {
      toast.warn('El carrito está vacío');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // Calcular estadísticas
      const totalSpent = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

      // Obtener categoría más comprada
      const categories = cartItems.reduce((acc, item) => {
        const category = item.category || 'Sin categoría';
        acc[category] = (acc[category] || 0) + item.quantity;
        return acc;
      }, {});
      const favoriteCategory = Object.keys(categories).reduce((a, b) =>
        categories[a] > categories[b] ? a : b
      );

      // Actualizar estadísticas
      const updatedStats = {
        totalSpent: (userData.stats?.totalSpent || 0) + totalSpent,
        totalPurchases: (userData.stats?.totalPurchases || 0) + totalItems,
        favoriteCategory: favoriteCategory,
      };

      // Mover los productos del carrito a purchases
      const purchases = userData.purchases || [];
      const newPurchase = {
        items: cartItems,
        date: new Date().toISOString(),
        totalSpent: totalSpent,
      };
      purchases.push(newPurchase);

      // Limpiar el carrito y actualizar estadísticas
      await updateDoc(userRef, {
        cart: [],
        purchases: purchases,
        stats: updatedStats,
      });

      toast.success('¡Compra realizada! Visita tu perfil para ver las estadísticas de tus compras.', {
        onClick: () => navigate('/profile'),
      });
    } catch (error) {
      console.error('Error al cerrar la compra:', error);
      toast.error('Error al cerrar la compra: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 py-8 px-6">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Tu Carrito</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <FaShoppingCart size={48} className="text-gray-400 mb-4" />
          <p className="text-white text-lg">El carrito está vacío</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Lista de productos en el carrito */}
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <div>
                  <h3 className="text-white font-bold">{item.name}</h3>
                  <p className="text-gray-300 text-sm">Precio: ${item.price.toFixed(2)}</p>
                  <p className="text-gray-300 text-sm">Tienda: {item.store}</p>
                  <p className="text-gray-300 text-sm">Cantidad: {item.quantity}</p>
                  <p className="text-gray-300 text-sm">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <motion.button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-500"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaTrash size={20} />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Total del carrito */}
          <div className="mt-6 text-white text-right">
            <p className="text-lg font-bold">
              Total: $
              {cartItems
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </p>
          </div>

          {/* Botones de acciones */}
          <div className="mt-6 flex justify-between">
            <motion.button
              onClick={clearCart}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Borrar Carrito
            </motion.button>
            <motion.button
              onClick={handleCheckout}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Cerrar Compra
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;