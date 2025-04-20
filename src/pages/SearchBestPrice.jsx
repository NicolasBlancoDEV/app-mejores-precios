import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
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

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const SearchBestPrice = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [bestPriceMap, setBestPriceMap] = useState({}); // Mapa para identificar productos con mejor precio
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Cargar productos desde Firestore
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setFilteredProducts(productsData); // Mostrar todos los productos inicialmente
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
          // Ordenar por precio para encontrar el más bajo
          const sortedByPrice = [...productGroup].sort((a, b) => a.price - b.price);
          const bestPriceProduct = sortedByPrice[0]; // El producto con el precio más bajo
          bestPriceMap[name] = bestPriceProduct.id; // Guardar el ID del producto con mejor precio
        }
      });

      setBestPriceMap(bestPriceMap);
    };

    calculateBestPrice();
  }, [products]);

  // Filtrar productos según la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Función para agregar un producto al carrito
  const handleAddToCart = async (product) => {
    const success = await addToCart(product);
    if (!success) {
      navigate('/login');
    }
  };

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
        {/* Campo de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off" // Desactivar sugerencias
          />
        </div>

        {/* Lista de productos */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className={`p-4 rounded-lg flex justify-between items-center ${
                  isBestPrice(product) ? 'bg-green-700' : 'bg-gray-700'
                }`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <div>
                  <h3 className="text-white font-bold">{product.name}</h3>
                  <p className="text-gray-300 text-sm">
                    Precio: ${product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-300 text-sm">Tienda: {product.store}</p>
                  {product.savings > 0 && (
                    <p className="text-green-400 text-sm">
                      Ahorro: ${product.savings.toFixed(2)}
                    </p>
                  )}
                </div>
                <motion.button
                  onClick={() => handleAddToCart(product)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Agregar al Carrito
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center">
            {searchQuery.trim() === ''
              ? 'No hay productos disponibles.'
              : 'No se encontraron productos que coincidan con tu búsqueda.'}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default SearchBestPrice;