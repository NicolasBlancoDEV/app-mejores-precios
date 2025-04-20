import { useState, useEffect, Suspense } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, query, orderBy, limit, startAfter, getDocs, where } from 'firebase/firestore';
import ProductItem from '../components/ProductItem';

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

const productVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeInOut',
    },
  }),
};

const buttonVariants = {
  hover: {
    y: -5,
    boxShadow: '0 5px 15px rgba(59, 130, 246, 0.4)',
    transition: { duration: 0.3 },
  },
};

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [cheapestProductsMap, setCheapestProductsMap] = useState({});

  const fetchProducts = async (isLoadMore = false) => {
    try {
      setIsLoading(true);
      const productsQuery = query(
        collection(db, 'products'),
        orderBy('name'),
        limit(10),
        ...(isLoadMore && lastDoc ? [startAfter(lastDoc)] : [])
      );

      const querySnapshot = await getDocs(productsQuery);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (isLoadMore) {
        setAllProducts(prev => [...prev, ...productsData]);
      } else {
        setAllProducts(productsData);
      }

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 10);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const q = query(
        collection(db, 'products'),
        orderBy('name_lower'),
        where('name_lower', '>=', searchTerm.toLowerCase()),
        where('name_lower', '<=', searchTerm.toLowerCase() + '\uf8ff'),
        limit(10)
      );
      getDocs(q).then((querySnapshot) => {
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFilteredProducts(results);
        setIsLoading(false);
      });
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm]);

  // Calcular los mejores precios después de actualizar los productos
  useEffect(() => {
    const displayedProducts = searchTerm ? filteredProducts : allProducts;
    const getCheapestProductByName = (productList) => {
      const nameToCheapest = {};
      productList.forEach((product) => {
        const nameLower = product.name.toLowerCase();
        if (!nameToCheapest[nameLower] || product.price < nameToCheapest[nameLower].price) {
          nameToCheapest[nameLower] = { ...product };
        }
      });
      return nameToCheapest;
    };

    const cheapest = getCheapestProductByName(displayedProducts);
    setCheapestProductsMap(cheapest);
  }, [allProducts, filteredProducts, searchTerm]);

  const displayedProducts = searchTerm ? filteredProducts : allProducts;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

  const loadMore = () => {
    fetchProducts(true);
  };

  return (
    <motion.div
      className="min-h-screen pb-8 px-6 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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

      <div className="relative z-10">
        {isLoading && displayedProducts.length === 0 ? (
          <motion.div
            className="fixed inset-0 flex flex-col justify-center items-center z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <motion.div variants={spinnerVariants} animate="animate">
              <FaShoppingCart size={48} className="text-[#34C759]" />
            </motion.div>
            <span className="text-[#FFFFFF] text-xl mt-4">Cargando...</span>
          </motion.div>
        ) : (
          <>
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

            <div className="container mx-auto">
              {/* Todos los Productos */}
              <h2 className="text-xl font-semibold text-[#FFFFFF] text-center mb-4">
                Productos
              </h2>
              {displayedProducts.length > 0 ? (
                <>
                  <div className="space-y-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0">
                    {displayedProducts.map((product, index) => {
                      const isCheapest = cheapestProductsMap[product.name.toLowerCase()]?.id === product.id;
                      const isLastInRow = (index + 1) % 4 === 0; // Calcula si es el último producto de la fila (4 columnas)
                      return (
                        <Suspense key={product.id} fallback={<div>Cargando producto...</div>}>
                          <div className="flex flex-col items-center lg:flex-row lg:items-center">
                            <motion.div
                              custom={index}
                              variants={productVariants}
                              initial="hidden"
                              animate="visible"
                              className="relative flex flex-col items-center min-w-0"
                            >
                              <div
                                className={`w-full ${isCheapest ? 'bg-green-500/20 border-transparent rounded-lg p-4' : ''}`}
                              >
                                {isCheapest && (
                                  <div className="text-center mb-2">
                                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                      Mejor Precio
                                    </span>
                                  </div>
                                )}
                                <ProductItem product={product} />
                              </div>
                            </motion.div>
                            {/* Línea vertical en pantallas grandes */}
                            {!isLastInRow && (
                              <div className="hidden lg:block h-16 border-l border-[#3A4450] mx-3 self-center" />
                            )}
                            {/* Línea horizontal en móviles */}
                            {index < displayedProducts.length - 1 && (
                              <hr className="w-1/2 mx-auto border-t border-[#3A4450] my-4 lg:hidden" />
                            )}
                          </div>
                        </Suspense>
                      );
                    })}
                  </div>
                  {hasMore && (
                    <motion.button
                      onClick={loadMore}
                      disabled={isLoading}
                      className="mt-6 px-4 py-2 bg-[#3B82F6] text-[#FFFFFF] rounded-lg block mx-auto"
                      whileHover="hover"
                      variants={buttonVariants}
                    >
                      {isLoading ? 'Cargando más...' : 'Cargar más'}
                    </motion.button>
                  )}
                </>
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