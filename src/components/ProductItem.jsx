import { motion } from 'framer-motion';

// Variantes para animaciones
const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const ProductItem = ({ product, handleAddToCart }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-white font-bold">{product.name}</h3>
        <p className="text-gray-300 text-sm">Precio: ${product.price.toFixed(2)}</p>
        <p className="text-gray-300 text-sm">Tienda: {product.store}</p>
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
    </div>
  );
};

export default ProductItem;