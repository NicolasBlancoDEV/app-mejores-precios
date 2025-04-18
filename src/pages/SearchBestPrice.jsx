import { useContext, useState, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { motion } from 'framer-motion';

function SearchBestPrice() {
  const { debouncedSearchProductsInFirestore } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Búsqueda con debounce (Firestore)
  useEffect(() => {
    if (searchTerm) {
      debouncedSearchProductsInFirestore(searchTerm, (results) => {
        setFilteredProducts(results);
        setSuggestions(results);
      });
    } else {
      setFilteredProducts([]);
      setSuggestions([]);
    }
  }, [searchTerm, debouncedSearchProductsInFirestore]);

  // Filtrar productos que coincidan con el término de búsqueda (ignorando mayúsculas/minúsculas)
  const matchingProducts = filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar productos de menor a mayor precio
  const sortedProducts = [...matchingProducts].sort((a, b) => a.price - b.price);

  // Calcular diferencia y ahorro
  const priceDifference = sortedProducts.length > 0 ? (sortedProducts[sortedProducts.length - 1].price - sortedProducts[0].price).toFixed(2) : 0;
  const savingsMessage = priceDifference > 0 ? `Ahorrarías ARS ${priceDifference} si eliges el mejor precio.` : '';

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  // Seleccionar una sugerencia y ocultar las sugerencias
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]); // Limpiar las sugerencias al seleccionar
  };

  return (
    <motion.div
      className="container mx-auto p-4 pt-20 pb-8 px-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1
        className="text-2xl font-bold mb-6 text-[#FFFFFF] text-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Buscar Mejor Precio
      </h1>

      {/* Barra de búsqueda con sugerencias */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-[200px] md:max-w-md">
          <input
            type="text"
            placeholder="Busca un producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-gray-500 text-[#FFFFFF] border-[#3A4450] shadow-md placeholder-[#FFFFFF] text-center md:text-center transition-all duration-300 hover:shadow-lg"
          />
          {/* Sugerencias */}
          {suggestions.length > 0 && searchTerm && (
            <ul className="absolute z-10 w-full bg-[#1F252A] border border-[#3A4450] rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 text-[#FFFFFF] hover:bg-[#3B82F6] cursor-pointer"
                >
                  {suggestion.name} {suggestion.brand ? `- ${suggestion.brand}` : ''} (${suggestion.price.toFixed(2)})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Resultados */}
      {sortedProducts.length === 0 ? (
        <motion.p
          className="text-center text-[#FFFFFF] py-8 w-full max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {searchTerm ? "No se encontraron productos." : "Busca un producto para ver los precios."}
        </motion.p>
      ) : (
        <div>
          {/* Lista de productos en tarjetas */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center"
            variants={containerVariants}
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className={`bg-[#1F252A] rounded-lg shadow-md overflow-hidden border-2 w-full max-w-sm ${
                  index === 0 ? 'border-[#34C759]' : 'border-[#3A4450]'
                }`}
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-[#FFFFFF]">
                    {product.name}
                    <span className="block text-[#3B82F6] mt-1">
                      ARS {product.price.toFixed(2)}
                    </span>
                  </h3>
                  {index === 0 && (
                    <div className="flex justify-center items-center mt-2">
                      <span className="bg-[#2D333B] text-[#34C759] text-xs px-2 py-1 rounded">
                        Mejor Precio
                      </span>
                    </div>
                  )}
                  <p className="text-[#A0AEC0] text-sm mt-2">
                    {product.store} • {product.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabla con los mismos productos */}
          {sortedProducts.length > 0 && (
            <motion.div
              className="mt-6 w-full max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-[#FFFFFF] text-center mb-4">
                Comparación de Precios
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-[#1F252A] rounded-lg shadow-md border-2 border-[#3A4450] text-sm">
                  <thead>
                    <tr className="bg-[#2D333B] text-[#FFFFFF] text-left">
                      <th className="p-2">Producto</th>
                      <th className="p-2">Tienda</th>
                      <th className="p-2 text-right">Precio (ARS)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map((product, index) => (
                      <tr
                        key={product.id}
                        className={`border-t border-[#3A4450] text-[#FFFFFF] ${
                          index === 0 ? 'bg-[#34C759]/10' : ''
                        }`}
                      >
                        <td className="p-2">{product.name} {product.brand ? `- ${product.brand}` : ''}</td>
                        <td className="p-2">{product.store}</td>
                        <td className="p-2 text-right">{product.price.toFixed(2)}</td>
                      </tr>
                    ))}
                    {sortedProducts.length > 1 && (
                      <tr className="bg-[#2D333B] text-[#FFFFFF] font-semibold">
                        <td colSpan="2" className="p-2">
                          Diferencia entre el más caro y el más barato:
                        </td>
                        <td className="p-2 text-right text-[#34C759]">
                          ARS {priceDifference}
                        </td>
                      </tr>
                    )}
                    {sortedProducts.length > 1 && (
                      <tr className="bg-[#2D333B] text-[#FFFFFF]">
                        <td colSpan="3" className="p-2 text-center">
                          {savingsMessage}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default SearchBestPrice;