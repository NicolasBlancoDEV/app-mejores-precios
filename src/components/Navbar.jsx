import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaPlus, FaBars, FaTimes, FaShoppingCart, FaSearch, FaUser } from 'react-icons/fa';

// Variantes para el efecto Float de los íconos
const floatVariants = {
  animate: {
    y: [0, -5, 0],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

// Variantes para el menú desplegable
const menuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
};

// Variantes para los enlaces
const linkVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center bg-transparent">
        {/* Ícono principal con efecto Float */}
        <Link to="/">
          <motion.div
            className="text-2xl font-bold text-white p-2 rounded-full shadow-soft"
            variants={floatVariants}
            animate="animate"
          >
            <FaHome size={24} className="text-yellow-400" />
          </motion.div>
        </Link>

        {/* Enlaces para pantallas grandes */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/">
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaHome className="mr-1 text-blue-400" /> Inicio
            </motion.div>
          </Link>
          <Link to="/upload">
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaPlus className="mr-1 text-green-400" /> Subir Producto
            </motion.div>
          </Link>
          <Link to="/search-best-price">
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaSearch className="mr-1 text-purple-400" /> Buscar Mejor Precio
            </motion.div>
          </Link>
          <Link to="/savings">
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaHome className="mr-1 text-teal-400" /> Mejores Precios
            </motion.div>
          </Link>
          <Link to="/cart">
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaShoppingCart className="mr-1 text-orange-400" /> Carrito
            </motion.div>
          </Link>
          <Link to="/profile">
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaUser className="mr-1 text-indigo-400" /> Mi Perfil
            </motion.div>
          </Link>
        </div>

        {/* Botón del menú hamburguesa con efecto Float */}
        <motion.button
          className="md:hidden text-white p-2 rounded-lg shadow-soft"
          variants={floatVariants}
          animate="animate"
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={24} className="text-gray-300" /> : <FaBars size={24} className="text-gray-300" />}
        </motion.button>
      </div>

      {/* Menú desplegable para pantallas pequeñas */}
      <motion.div
        className="md:hidden overflow-hidden bg-transparent"
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        variants={menuVariants}
      >
        <div className="flex flex-col space-y-2 px-4 py-2 bg-transparent">
          <Link to="/" onClick={toggleMenu}>
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaHome className="mr-2 text-blue-400" /> Inicio
            </motion.div>
          </Link>
          <Link to="/upload" onClick={toggleMenu}>
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaPlus className="mr-2 text-green-400" /> Subir Producto
            </motion.div>
          </Link>
          <Link to="/search-best-price" onClick={toggleMenu}>
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaSearch className="mr-2 text-purple-400" /> Buscar Mejor Precio
            </motion.div>
          </Link>
          <Link to="/savings" onClick={toggleMenu}>
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaHome className="mr-2 text-teal-400" /> Mejores Precios
            </motion.div>
          </Link>
          <Link to="/cart" onClick={toggleMenu}>
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaShoppingCart className="mr-2 text-orange-400" /> Carrito
            </motion.div>
          </Link>
          <Link to="/profile" onClick={toggleMenu}>
            <motion.div
              className="flex items-center text-white"
              whileHover="hover"
              variants={linkVariants}
            >
              <FaUser className="mr-2 text-indigo-400" /> Mi Perfil
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </nav>
  );
}

export default Navbar;