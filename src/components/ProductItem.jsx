import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Variantes para animaciones
const hoverVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const ProductItem = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Función para agregar el producto al carrito
  const handleAddToCart = async () => {
    const success = await addToCart(product);
    if (!success) {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-bold text-[#FFFFFF] text-lg">{product.name}</h3>
      <p className="text-[#A0AEC0] text-sm">Precio: ${product.price?.toFixed(2)}</p>
      {product.store && <p className="text-[#A0AEC0] text-sm">Tienda: {product.store}</p>}
      <motion.button
        onClick={handleAddToCart}
        className="mt-2 px-4 py-2 bg-blue-500 text-[#FFFFFF] rounded-lg"
        whileHover={{ scale: 1.05 }}
      >
        Agregar al Carrito
      </motion.button>
    </div>
  );
};

export default ProductItem;