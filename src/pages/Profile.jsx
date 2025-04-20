import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  // Calcular gastos por día
  const getDailySpending = (date) => {
    if (!userData || !userData.purchases) return 0;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return userData.purchases
      .filter((purchase) => {
        const purchaseDate = new Date(purchase.date);
        return purchaseDate >= startOfDay && purchaseDate <= endOfDay;
      })
      .reduce((sum, purchase) => sum + purchase.totalSpent, 0);
  };

  // Calcular gastos por semana
  const getWeeklySpending = (date) => {
    if (!userData || !userData.purchases) return 0;
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return userData.purchases
      .filter((purchase) => {
        const purchaseDate = new Date(purchase.date);
        return purchaseDate >= startOfWeek && purchaseDate <= endOfWeek;
      })
      .reduce((sum, purchase) => sum + purchase.totalSpent, 0);
  };

  // Calcular gastos por mes
  const getMonthlySpending = (date) => {
    if (!userData || !userData.purchases) return 0;
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return userData.purchases
      .filter((purchase) => {
        const purchaseDate = new Date(purchase.date);
        return purchaseDate >= startOfMonth && purchaseDate <= endOfMonth;
      })
      .reduce((sum, purchase) => sum + purchase.totalSpent, 0);
  };

  // Gastos para la fecha seleccionada
  const dailySpending = getDailySpending(selectedDate);
  const weeklySpending = getWeeklySpending(selectedDate);
  const monthlySpending = getMonthlySpending(selectedDate);

  // Filtrar compras según el filtro seleccionado
  const getFilteredPurchases = () => {
    if (!userData || !userData.purchases || userData.purchases.length === 0) return [];

    const now = new Date();
    return userData.purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.date);
      if (filter === 'day') {
        return purchaseDate.toDateString() === now.toDateString();
      } else if (filter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return purchaseDate >= oneWeekAgo;
      } else if (filter === 'month') {
        return (
          purchaseDate.getMonth() === now.getMonth() &&
          purchaseDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  };

  // Función para borrar el historial
  const resetPurchases = async () => {
    try {
      const updatedUserData = {
        ...userData,
        purchases: [],
        stats: { totalSpent: 0, totalPurchases: 0, favoriteCategory: '' },
      };
      await setDoc(doc(db, 'users', auth.currentUser.uid), updatedUserData);
      setUserData(updatedUserData);
      toast.success('Historial borrado');
    } catch (error) {
      toast.error('Error: ' + error.message);
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
        Perfil de {userData.email}
      </h1>

      {/* Calendario */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#FFFFFF] text-center mb-4">
          Registro de Gastos
        </h2>
        <div className="flex justify-center">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="bg-[#1F252A] text-[#FFFFFF] rounded-lg border-2 border-[#3A4450] shadow-md"
            tileClassName="text-[#FFFFFF]"
          />
        </div>
      </div>

      {/* Resumen de gastos */}
      <div className="bg-[#1F252A] rounded-lg shadow-md p-4 border-2 border-[#3A4450] max-w-sm mx-auto mb-6">
        <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2 text-center">
          Gastos para {selectedDate.toLocaleDateString()}
        </h3>
        <p className="text-[#A0AEC0] text-center">
          Día: ${dailySpending.toFixed(2)}
        </p>
        <p className="text-[#A0AEC0] text-center">
          Semana: ${weeklySpending.toFixed(2)}
        </p>
        <p className="text-[#A0AEC0] text-center">
          Mes: ${monthlySpending.toFixed(2)}
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="bg-[#1F252A] rounded-lg shadow-md p-4 border-2 border-[#3A4450] max-w-sm mx-auto mb-6">
        <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2 text-center">
          Estadísticas Generales
        </h3>
        <p className="text-[#A0AEC0] text-center">
          Total Gastado: ${(userData.stats?.totalSpent || 0).toFixed(2)}
        </p>
        <p className="text-[#A0AEC0] text-center">
          Total de Compras: {userData.stats?.totalPurchases || 0}
        </p>
        <p className="text-[#A0AEC0] text-center">
          Categoría Favorita: {userData.stats?.favoriteCategory || 'Ninguna'}
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 my-6 justify-center">
        <motion.button
          onClick={() => setFilter('day')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'day' ? 'bg-[#3B82F6] text-[#FFFFFF]' : 'bg-[#2D333B] text-[#A0AEC0]'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          Hoy
        </motion.button>
        <motion.button
          onClick={() => setFilter('week')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'week' ? 'bg-[#3B82F6] text-[#FFFFFF]' : 'bg-[#2D333B] text-[#A0AEC0]'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          Esta semana
        </motion.button>
        <motion.button
          onClick={() => setFilter('month')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'month' ? 'bg-[#3B82F6] text-[#FFFFFF]' : 'bg-[#2D333B] text-[#A0AEC0]'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          Este mes
        </motion.button>
        <motion.button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all' ? 'bg-[#3B82F6] text-[#FFFFFF]' : 'bg-[#2D333B] text-[#A0AEC0]'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          Todos
        </motion.button>
      </div>

      {/* Lista de compras filtradas */}
      {getFilteredPurchases().length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#A0AEC0] text-center">No hay compras registradas</p>
        </div>
      ) : (
        <div className="space-y-6 flex flex-col items-center">
          {getFilteredPurchases().map((purchase) => (
            <motion.div
              key={purchase.id}
              className="bg-[#1F252A] p-4 rounded-lg shadow border-2 border-[#3A4450] w-full max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <h3 className="font-bold text-[#FFFFFF]">
                  Compra del {new Date(purchase.date).toLocaleDateString()}
                </h3>
                <p className="text-[#FFFFFF]">
                  Total gastado: ${purchase.totalSpent.toFixed(2)}
                </p>
                <p className="text-[#FFFFFF]">
                  Ahorro: ${purchase.totalSavings.toFixed(2)}
                </p>
                <ul className="mt-2">
                  {purchase.items.map((item, i) => (
                    <li key={i} className="text-[#A0AEC0]">
                      {item.name} (x{item.quantity || 1}) - ${item.price.toFixed(2)} ({item.store})
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Botón para borrar historial */}
      <div className="flex justify-center">
        <motion.button
          onClick={resetPurchases}
          className="mt-6 px-4 py-2 bg-red-500 text-[#FFFFFF] rounded-lg"
          whileHover={{ scale: 1.05 }}
        >
          Borrar historial
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Profile;