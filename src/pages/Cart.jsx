import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Cart() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Verificar autenticación y obtener datos del usuario
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          const initialData = {
            uid: user.uid,
            email: user.email,
            cart: [],
            purchases: [],
            stats: { totalSpent: 0, totalPurchases: 0, favoriteCategory: '' }
          };
          await setDoc(userRef, initialData);
          setUserData(initialData);
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Función para cerrar compra
  const handleCheckout = async () => {
    if (!userData || !userData.cart || userData.cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    try {
      const totalSpent = userData.cart.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );
      const totalSavings = userData.cart.reduce(
        (sum, item) => sum + (item.savings || 0),
        0
      );

      const purchase = {
        id: `compra-${Date.now()}`,
        date: new Date().toISOString(),
        totalSpent,
        totalSavings,
        items: userData.cart,
      };

      const updatedPurchases = [...(userData.purchases || []), purchase];
      const updatedStats = {
        totalSpent: (userData.stats?.totalSpent || 0) + totalSpent,
        totalPurchases: (userData.stats?.totalPurchases || 0) + 1,
        favoriteCategory: userData.cart[0]?.category || 'Sin categoría',
      };

      const updatedUserData = {
        ...userData,
        cart: [], // Vaciar el carrito
        purchases: updatedPurchases,
        stats: updatedStats,
      };

      await setDoc(doc(db, 'users', auth.currentUser.uid), updatedUserData);
      setUserData(updatedUserData);
      toast.success('Compra cerrada exitosamente');
    } catch (error) {
      toast.error('Error al cerrar la compra: ' + error.message);
    }
  };

  if (!userData) return <div className="text-center py-8 text-[#FFFFFF]">Cargando...</div>;

  return (
    <motion.div
      className="container mx-auto p-4 pt-20 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1
        className="text-2xl font-bold mb-6 text-[#FFFFFF] text-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Mi Carrito
      </h1>

      {/* Carrito */}
      {userData.cart?.length > 0 ? (
        <div className="space-y-6 flex flex-col items-center">
          {userData.cart.map((item, index) => (
            <motion.div
              key={index}
              className="bg-[#1F252A] p-4 rounded-lg shadow border-2 border-[#3A4450] w-full max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <h3 className="font-bold text-[#FFFFFF]">{item.name}</h3>
                <p className="text-[#A0AEC0]">
                  Precio: ${item.price.toFixed(2)} x {item.quantity || 1}
                </p>
                {item.store && <p className="text-[#A0AEC0]">Tienda: {item.store}</p>}
              </div>
            </motion.div>
          ))}
          <motion.button
            onClick={handleCheckout}
            className="mt-4 px-4 py-2 bg-green-500 text-[#FFFFFF] rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            Cerrar Compra
          </motion.button>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[#A0AEC0] text-center">Tu carrito está vacío.</p>
        </div>
      )}
    </motion.div>
  );
}

export default Cart;