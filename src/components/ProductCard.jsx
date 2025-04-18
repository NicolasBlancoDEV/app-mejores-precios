import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';

function ProductCard({ product, allProducts, onAddToCart }) {
  // Encontrar productos con el mismo nombre para comparar precios
  const sameProducts = allProducts.filter((p) => 
    p.name.toLowerCase() === product.name.toLowerCase()
  );
  const prices = sameProducts.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const isBestPrice = product.price === minPrice && sameProducts.length > 1;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className={`p-4 rounded-lg shadow-md ${
        isBestPrice
          ? 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border border-gray-200 dark:border-gray-700'
      }`}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
    >
      <div className="relative">
        {isBestPrice && (
          <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            ★ Mejor
          </span>
        )}
        <h3 className="font-bold text-lg flex justify-between items-start">
          {product.name}
          <span className="text-blue-600 dark:text-blue-400 ml-2">
            ARS {product.price.toFixed(2)}
          </span>
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {product.store} • {product.category}
        </p>
        
        <motion.button
          onClick={onAddToCart}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaShoppingCart />
          Agregar al carrito
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProductCard;