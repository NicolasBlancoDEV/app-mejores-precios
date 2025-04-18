import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

function SearchBar({ onSearch, products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  // Actualizar las sugerencias cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      onSearch(searchTerm);
      return;
    }

    const uniqueProductNames = [...new Set(products.map((product) => product.name.toLowerCase()))];
    const filteredSuggestions = uniqueProductNames
      .filter((name) => name.includes(searchTerm.toLowerCase()))
      .map((name) => products.find((product) => product.name.toLowerCase() === name).name)
      .slice(0, 5); // Limitar a 5 sugerencias

    setSuggestions(filteredSuggestions);
    onSearch(searchTerm);
  }, [searchTerm, products, onSearch]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    setIsFocused(false);
    onSearch(suggestion);
  };

  const handleBlur = () => {
    // Retrasar el cierre del dropdown para permitir hacer clic en las sugerencias
    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <motion.div
      className="relative w-1/2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Busca productos rápidamente..."
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className="pl-10 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all"
        autoFocus
      />
      {/* Dropdown de sugerencias */}
      {isFocused && suggestions.length > 0 && (
        <motion.ul
          className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 shadow-lg z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-text-light dark:text-text-dark"
            >
              {suggestion}
            </li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}

export default SearchBar;