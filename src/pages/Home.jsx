import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import ProductItem from '../components/ProductItem';
import { toast } from 'react-toastify';

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [bestPriceMap, setBestPriceMap] = useState({});

  // Cargar productos desde Firestore y ordenarlos por fecha
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Ordenar por fecha de creación (más reciente primero)
      const sortedProducts = productsData.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setProducts(sortedProducts);
    }, (error) => {
      console.error('Error al cargar los productos:', error);
      toast.error('Error al cargar los productos: ' + error.message);
    });

    return () => unsubscribe();
  }, []);

  // Calcular el mejor precio para cada producto (por nombre)
  useEffect(() => {
    const calculateBestPrice = () => {
      const groupedByName = products.reduce((acc, product) => {
        const name = product.name.toLowerCase();
        if (!acc[name]) {
          acc[name] = [];
        }
        acc[name].push(product);
        return acc;
      }, {});

      const bestPriceMap = {};
      Object.keys(groupedByName).forEach((name) => {
        const productGroup = groupedByName[name];
        if (productGroup.length > 1) {
          const sortedByPrice = [...productGroup].sort((a, b) => a.price - b.price);
          const bestPriceProduct = sortedByPrice[0];
          bestPriceMap[name] = bestPriceProduct.id;
        }
      });

      setBestPriceMap(bestPriceMap);
    };

    calculateBestPrice();
  }, [products]);

  // Determinar si un producto tiene el mejor precio
  const isBestPrice = (product) => {
    const name = product.name.toLowerCase();
    return bestPriceMap[name] === product.id;
  };

  return (
    <div className="min-h-screen bg-gray-800 py-8 px-6">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">Productos</h1>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className={`p-4 rounded-lg ${
                  isBestPrice(product) ? 'bg-green-700' : 'bg-gray-700'
                }`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <ProductItem product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center">No hay productos disponibles.</p>
        )}
      </motion.div>
    </div>
  );
};

export default Home;