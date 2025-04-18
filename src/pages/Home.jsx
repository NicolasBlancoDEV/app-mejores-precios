import { useContext, useState, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { format } from 'date-fns';

// Variantes para el spinner de carga
const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'linear',
    },
  },
};

// Variantes para el texto "Mejor Precio" con Pulse
const pulseVariants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

// Variantes para el efecto Float de los productos
const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: 'easeInOut',
    },
  },
};

// Variantes para la entrada de los productos (Slide In + Fade In)
const productVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1, // Retraso para que entren uno por uno
      duration: 0.5,
      ease: 'easeInOut',
    },
  }),
};

// Variantes para el botón (Hover Lift)
const buttonVariants = {
  hover: {
    y: -5,
    boxShadow: '0 5px 15px rgba(59, 130, 246, 0.4)',
    transition: { duration: 0.3 },
  },
};

function Home() {
  const { debouncedSearchProductsInFirestore, products, addToCart } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para búsqueda
  useEffect(() => {
    if (debouncedSearchProductsInFirestore) {
      debouncedSearchProductsInFirestore(searchTerm, (results) => {
        setFilteredProducts(results);
      });
    }
  }, [searchTerm, debouncedSearchProductsInFirestore]);

  // Simulación de carga
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // Determinar productos a mostrar
  const displayedProducts = searchTerm ? filteredProducts : products;

  // Encontrar el producto más barato por nombre
  const getCheapestProductByName = (productList) => {
    const nameToCheapest = {};
    productList.forEach((product) => {
      const nameLower = product.name.toLowerCase();
      if (!nameToCheapest[nameLower] || product.price < nameToCheapest[nameLower].price) {
        nameToCheapest[nameLower] = product;
      }
    });
    return nameToCheapest;
  };

  const cheapestProducts = getCheapestProductByName(displayedProducts);

  // Manejador de búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Efecto Parallax para el fondo
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const backgroundX = useTransform(x, [-100, 100], [-10, 10]);
  const backgroundY = useTransform(y, [-100, 100], [-10, 10]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    x.set(mouseX / 2);
    y.set(mouseY / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="min-h-screen pb-8 px-6 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fondo con Animated Gradient y Parallax en tonos oscuros */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-black z-0"
        style={{ x: backgroundX, y: backgroundY }}
        animate={{
          background: [
            'linear-gradient(45deg, #0F172A, #1E293B, #020617)',
            'linear-gradient(45deg, #1E293B, #020617, #0F172A)',
            'linear-gradient(45deg, #020617, #0F172A, #1E293B)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Contenedor principal */}
      <div className="relative z-10">
        {isLoading ? (
          <motion.div
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <motion.div variants={spinnerVariants} animate="animate">
              <FaShoppingCart size={32} className="text-[#34C759]" />
            </motion.div>
            <span className="text-[#FFFFFF] text-lg ml-4">Cargando...</span>
          </motion.div>
        ) : (
          <>
            {/* Barra de búsqueda con Fade In, ajustada para estar más cerca del navbar */}
            <motion.div
              className="container mx-auto mb-6 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <div className="flex justify-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full max-w-sm md:max-w-md p-3 border rounded-lg text-[#000000] placeholder-[#000000] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-center md:text-center"
                  />
                </div>
              </div>
            </motion.div>

            {/* Productos en Masonry Grid, sin cards */}
            <div className="container mx-auto">
              {displayedProducts.length > 0 ? (
                <div className="columns-1 md:columns-3 gap-4 space-y-4">
                  {displayedProducts.map((product, index) => {
                    const isCheapest =
                      cheapestProducts[product.name.toLowerCase()] &&
                      cheapestProducts[product.name.toLowerCase()].id === product.id;

                    return (
                      <motion.div
                        key={product.id}
                        className="p-4 break-inside-avoid"
                        variants={productVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false }}
                        custom={index}
                        animate="animate"
                        whileHover={{ scale: 1.05 }}
                      >
                        {/* Contenedor con efecto Float y Glassmorphism */}
                        <motion.div
                          className="text-[#FFFFFF] p-4 text-center rounded-lg backdrop-filter backdrop-blur-sm bg-opacity-10 bg-gray-800"
                          variants={floatVariants}
                          animate="animate"
                          style={{
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          <h3 className="font-bold text-[#FFFFFF] text-lg">{product.name}</h3>
                          <p className="text-[#FFFFFF]">Precio: ${product.price.toFixed(2)}</p>
                          <p className="text-[#FFFFFF]">Tienda: {product.store}</p>
                          <p className="text-[#FFFFFF]">
                            Fecha de Carga: {product.uploadDate ? format(new Date(product.uploadDate), 'dd/MM/yyyy') : 'N/A'}
                          </p>
                          {isCheapest && (
                            <motion.p
                              className="text-[#34C759] font-semibold mt-2"
                              variants={pulseVariants}
                              animate="animate"
                            >
                              Mejor Precio
                            </motion.p>
                          )}
                          <motion.button
                            onClick={() => addToCart(product)}
                            className="mt-4 px-4 py-2 bg-[#3B82F6] text-[#FFFFFF] rounded-lg"
                            whileHover="hover"
                            variants={buttonVariants}
                          >
                            Agregar al Carrito
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[#FFFFFF] text-center">No se encontraron productos</p>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Home;