import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';

function FilterBar({ onFilter }) {
  const [category, setCategory] = useState('Cocina'); // Valor inicial
  const [priceRange, setPriceRange] = useState('0-1000'); // Valor inicial

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    onFilter({ category: value, priceRange });
  };

  const handlePriceRangeChange = (e) => {
    const value = e.target.value;
    setPriceRange(value);
    onFilter({ category, priceRange: value });
  };

  return (
    <motion.div
      className="flex space-x-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
        >
          <option value="Cocina">Cocina</option>
          <option value="Limpieza">Limpieza</option>
          <option value="Bebidas">Bebidas</option>
        </select>
      </div>
      <div className="relative">
        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <select
          value={priceRange}
          onChange={handlePriceRangeChange}
          className="pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
        >
          <option value="0-1000">0 - 1000 ARS</option>
          <option value="1000-1500">1000 - 1500 ARS</option>
          <option value="1500+">1500+ ARS</option>
        </select>
      </div>
    </motion.div>
  );
}

export default FilterBar;