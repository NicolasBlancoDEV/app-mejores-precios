import { useContext, useState, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';

function Savings() {
  const { products, removeProduct, debouncedSearchProductsInFirestore } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Búsqueda con debounce (Firestore)
  useEffect(() => {
    if (searchTerm) {
      debouncedSearchProductsInFirestore(searchTerm, (results) => {
        setFilteredProducts(results);
        setSuggestions(results);
      });
    } else {
      setFilteredProducts(products); // Si no hay término de búsqueda, mostrar todos los productos
      setSuggestions([]);
    }
  }, [searchTerm, debouncedSearchProductsInFirestore, products]);

  // Agrupar productos por nombre
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const name = product.name.toLowerCase();
    if (!acc[name]) acc[name] = [];
    acc[name].push(product);
    return acc;
  }, {});

  // Seleccionar el producto con el precio más bajo para cada nombre
  const bestPriceProducts = Object.entries(groupedProducts).map(([name, items]) => {
    const prices = items.map((item) => item.price);
    const minPrice = Math.min(...prices);
    const bestProduct = items.find((item) => item.price === minPrice);
    return {
      name,
      bestProduct,
    };
  });

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  // Seleccionar una sugerencia
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);
  };

  return (
    <motion.div
      className="container mx-auto p-4 pt-20 pb-8 px-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1
        className="text-2xl font-bold mb-6 text-[#FFFFFF] text-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Mejores Precios
      </h1>

      {/* Barra de búsqueda con sugerencias */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-[200px] md:max-w-md">
          <input
            type="text"
            placeholder="Busca un producto, categoría o tienda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-gray-500 text-[#FFFFFF] border-[#3A4450] shadow-md placeholder-[#FFFFFF] text-center md:text-center transition-all duration-300 hover:shadow-lg"
          />
          {/* Sugerencias */}
          {suggestions.length > 0 && searchTerm && (
            <ul className="absolute z-10 w-full bg-[#1F252A] border border-[#3A4450] rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 text-[#FFFFFF] hover:bg-[#3B82F6] cursor-pointer"
                >
                  {suggestion.name} {suggestion.brand ? `- ${suggestion.brand}` : ''} (${suggestion.price.toFixed(2)})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Resultados */}
      {bestPriceProducts.length === 0 ? (
        <motion.p
          className="text-center text-[#FFFFFF] py-8 w-full max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {searchTerm ? "No se encontraron productos." : "No hay productos disponibles."}
        </motion.p>
      ) : (
        <div>
          {/* Lista de productos con el mejor precio */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center"
            variants={containerVariants}
          >
            {bestPriceProducts.map(({ name, bestProduct }) => (
              <motion.div
                key={name}
                className="bg-[#1F252A] rounded-lg shadow-md overflow-hidden border-2 border-[#34C759] w-full max-w-sm"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-[#FFFFFF]">
                    {bestProduct.name}
                    <span className="block text-[#3B82F6] mt-1">
                      ARS {bestProduct.price.toFixed(2)}
                    </span>
                  </h3>
                  <div className="flex justify-center items-center mt-2">
                    <span className="bg-[#2D333B] text-[#34C759] text-xs px-2 py-1 rounded">
                      Mejor Precio
                    </span>
                  </div>
                  <p className="text-[#A0AEC0] text-sm mt-2">
                    {bestProduct.store} • {bestProduct.category}
                  </p>
                  <motion.button
                    onClick={() => removeProduct(bestProduct.id)}
                    className="w-full mt-3 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-[#FFFFFF] py-2 px-4 rounded transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTrash /> Eliminar
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default Savings;