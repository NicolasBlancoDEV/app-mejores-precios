import { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { motion } from 'framer-motion';

function Favorites() {
  const { products, favorites } = useContext(ProductContext);
  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

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
        Productos Favoritos
      </motion.h1>
      {favoriteProducts.length === 0 ? (
        <motion.p
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No tienes productos favoritos. Ve a la página principal y marca algunos como favoritos.
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
        >
          {favoriteProducts.map((product) => (
            <motion.div
              key={product.id}
              className="card"
              variants={cardVariants}
            >
              <div className="p-4">
                <h3 className="flex items-center">
                  {product.name}
                  <span className="ml-2 text-accent">ARS {product.price}</span>
                </h3>
                <p className="text-gray-400 text-sm">{product.store}</p>
                <p className="text-gray-500 text-sm">{product.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Favorites;