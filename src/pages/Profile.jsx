import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        toast.error('Por favor, inicia sesión para ver tu perfil');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Escuchar cambios en los datos del usuario en Firestore
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        toast.error('No se encontraron datos del usuario');
      }
    }, (error) => {
      console.error('Error al cargar los datos del usuario:', error);
      toast.error('Error al cargar los datos del usuario: ' + error.message);
    });

    return () => unsubscribe();
  }, [user]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-white text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 py-8 px-6">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">Mi Perfil</h1>

        {/* Estadísticas */}
        <div className="bg-gray-700 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Estadísticas de Compras</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-600 p-4 rounded-lg">
              <p className="text-gray-300">Total Gastado</p>
              <p className="text-white text-xl font-bold">
                ${userData.stats?.totalSpent?.toFixed(2) || 0}
              </p>
            </div>
            <div className="bg-gray-600 p-4 rounded-lg">
              <p className="text-gray-300">Total de Compras</p>
              <p className="text-white text-xl font-bold">
                {userData.stats?.totalPurchases || 0}
              </p>
            </div>
            <div className="bg-gray-600 p-4 rounded-lg">
              <p className="text-gray-300">Categoría Favorita</p>
              <p className="text-white text-xl font-bold">
                {userData.stats?.favoriteCategory || 'Ninguna'}
              </p>
            </div>
          </div>
        </div>

        {/* Historial de Compras */}
        <div className="bg-gray-700 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Historial de Compras</h2>
          {userData.purchases?.length > 0 ? (
            <div className="space-y-4">
              {userData.purchases.map((purchase, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-600 p-4 rounded-lg"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <p className="text-gray-300">
                    Fecha:{' '}
                    {new Date(purchase.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-gray-300">
                    Total Gastado: ${purchase.totalSpent.toFixed(2)}
                  </p>
                  <div className="mt-2">
                    <p className="text-gray-300">Productos:</p>
                    <ul className="list-disc list-inside text-white">
                      {purchase.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          {item.name} - Cantidad: {item.quantity} - Precio: $
                          {item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">No tienes compras registradas.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;