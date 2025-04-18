import { useContext, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import { motion } from 'framer-motion';

function Upload() {
  const { addProduct, products } = useContext(ProductContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [category, setCategory] = useState('Cocina');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    const uniqueProductNames = [...new Set(products.map((product) => product.name.toLowerCase()))];
    const filteredSuggestions = uniqueProductNames
      .filter((productName) => productName.includes(value.toLowerCase()))
      .map((productName) => products.find((product) => product.name.toLowerCase() === productName).name)
      .slice(0, 5);

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setName(suggestion);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !store || !category) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    await addProduct({ name, price: Number(price), store, category });
    setName('');
    setPrice('');
    setStore('');
    setCategory('Cocina');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="container mx-auto p-4 pt-20 pb-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1
        className="text-2xl font-bold mb-6 text-[#FFFFFF] text-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Subir Producto
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#1F252A] p-6 rounded-lg shadow-md border-2 border-[#3A4450]">
        <div className="mb-4 relative">
          <label className="block text-[#FFFFFF] mb-2">Nombre del Producto</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#1F252A] text-[#FFFFFF]"
            placeholder="Ej: Mayonesa Natura 500g"
          />
          {isFocused && suggestions.length > 0 && (
            <motion.ul
              className="absolute top-full left-0 w-full bg-[#1F252A] border border-[#3A4450] rounded-lg mt-1 shadow-lg z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-[#2D333B] cursor-pointer text-[#FFFFFF]"
                >
                  {suggestion}
                </li>
              ))}
            </motion.ul>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-[#FFFFFF] mb-2">Precio (ARS)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#1F252A] text-[#FFFFFF]"
            placeholder="Ej: 1200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[#FFFFFF] mb-2">Tienda</label>
          <input
            type="text"
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#1F252A] text-[#FFFFFF]"
            placeholder="Ej: Supermercado A"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[#FFFFFF] mb-2">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#1F252A] text-[#FFFFFF]"
          >
            <option value="Cocina" className="text-[#FFFFFF] bg-[#1F252A]">Cocina</option>
            <option value="Limpieza" className="text-[#FFFFFF] bg-[#1F252A]">Limpieza</option>
            <option value="Bebidas" className="text-[#FFFFFF] bg-[#1F252A]">Bebidas</option>
          </select>
        </div>
        <motion.button
          type="submit"
          className="w-full px-4 py-2 bg-[#3B82F6] text-[#FFFFFF] rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Subir Producto
        </motion.button>
      </form>
    </motion.div>
  );
}

export default Upload;