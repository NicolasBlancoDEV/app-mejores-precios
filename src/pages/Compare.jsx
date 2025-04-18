import { useContext, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';

function Compare() {
  const { products, addToCart } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar productos por nombre
  const filteredProducts = products.filter((product) =>
    searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );

  // Encontrar el mejor precio
  const getBestPrice = () => {
    if (filteredProducts.length === 0) return null;
    const prices = filteredProducts.map((p) => p.price);
    const minPrice = Math.min(...prices);
    return minPrice;
  };

  const bestPrice = getBestPrice();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Comparar Precios
      </motion.h1>

      {/* Buscador */}
      <div className="flex justify-center mb-6">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Busca un producto para comparar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all"
          />
        </div>
      </div>

      {/* Resultados de la comparación */}
      {searchTerm && filteredProducts.length === 0 ? (
        <motion.p
          className="text-gray-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No se encontraron productos con ese nombre.
        </motion.p>
      ) : filteredProducts.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
        >
          {filteredProducts.map((product) => {
            const isBestPrice = product.price === bestPrice && filteredProducts.length > 1;
            const savings = product.price - bestPrice;

            return (
              <motion.div
                key={product.id}
                className={`card ${isBestPrice ? 'border-2 border-green-500' : ''}`}
                variants={cardVariants}
              >
                <div className="p-4">
                  <h3 className="flex items-center">
                    {product.name}
                    <span className="ml-2 text-accent">ARS {product.price}</span>
                  </h3>
                  {isBestPrice && (
                    <span className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded mt-1">
                      Mejor Precio
                    </span>
                  )}
                  <p className="text-gray-400 text-sm mt-1">{product.store}</p>
                  <p className="text-gray-500 text-sm">{product.category}</p>
                  {savings > 0 && (
                    <p className="text-green-500 text-sm mt-1">
                      Ahorro si eliges el mejor precio: ARS {savings}
                    </p>
                  )}
                  <motion.button
                    onClick={() => addToCart(product)}
                    className="btn bg-primary-light dark:bg-primary-dark text-white mt-2 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaShoppingCart className="mr-2" />
                    Agregar al Carrito
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.p
          className="text-gray-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Ingresa el nombre de un producto para comparar precios.
        </motion.p>
      )}
    </motion.div>
  );
}

export default Compare;