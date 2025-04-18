import { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, products, closePurchase } = useContext(ProductContext);
  const navigate = useNavigate();

  // Agrupar productos por nombre para calcular ahorros
  const groupedProducts = products.reduce((acc, product) => {
    const name = product.name.toLowerCase();
    if (!acc[name]) acc[name] = [];
    acc[name].push(product);
    return acc;
  }, {});

  // Calcular ahorros por producto y totales
  const cartWithSavings = cart.map((item) => {
    const productsWithSameName = groupedProducts[item.name.toLowerCase()] || [];
    const prices = productsWithSameName.map((p) => p.price);
    const highestPrice = prices.length > 0 ? Math.max(...prices) : item.price;
    const savingsPerUnit = highestPrice - item.price;
    const quantity = item.quantity || 1;
    const totalSavings = savingsPerUnit * quantity;
    return {
      ...item,
      highestPrice,
      savingsPerUnit,
      totalSavings,
    };
  });

  // Calcular total gastado y total ahorrado
  const totalSpent = cartWithSavings.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const totalSavings = cartWithSavings.reduce(
    (sum, item) => sum + item.totalSavings,
    0
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  // Función para manejar el cierre de la compra y redirigir
  const handleClosePurchase = async () => {
    await closePurchase(); // Cerrar la compra
    navigate('/profile'); // Redirigir al perfil
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
        Carrito
      </h1>

      {cart.length === 0 ? (
        <motion.p
          className="text-center text-[#FFFFFF] py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          El carrito está vacío
        </motion.p>
      ) : (
        <>
          {/* Informe detallado de ahorros al principio */}
          <motion.div
            className="mb-6 p-4 bg-[#1F252A] rounded-lg shadow-md border-2 border-[#3A4450] mx-auto max-w-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-[#FFFFFF] text-center mb-4">
              Informe de Ahorros
            </h2>
            {cartWithSavings.map((item) => (
              <div key={item.id} className="mb-4">
                <p className="text-[#FFFFFF] text-center">
                  <span className="font-semibold">{item.name}</span> (x{item.quantity || 1})
                </p>
                <p className="text-[#FFFFFF] text-center">
                  Precio elegido: ${item.price.toFixed(2)}
                </p>
                <p className="text-[#FFFFFF] text-center">
                  Precio más alto: ${item.highestPrice.toFixed(2)}
                </p>
                {item.savingsPerUnit > 0 ? (
                  <>
                    <p className="text-[#34C759] text-center">
                      Ahorro por unidad: ${item.savingsPerUnit.toFixed(2)}
                    </p>
                    <p className="text-[#34C759] text-center">
                      Ahorro total: ${item.totalSavings.toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="text-[#A0AEC0] text-center">
                    No hay ahorro para este producto
                  </p>
                )}
              </div>
            ))}
            <div className="border-t border-[#3A4450] pt-4 mt-4">
              <p className="text-[#FFFFFF] text-center">
                Total gastado: ${totalSpent.toFixed(2)}
              </p>
              <p className="text-[#34C759] text-center font-semibold">
                Total ahorrado: ${totalSavings.toFixed(2)}
              </p>
            </div>
          </motion.div>

          {/* Lista de productos en el carrito */}
          <div className="grid grid-cols-1 gap-4 justify-items-center">
            {cartWithSavings.map((item) => (
              <motion.div
                key={item.id}
                className="bg-[#1F252A] rounded-lg shadow-md border-2 border-[#3A4450] p-4 w-full max-w-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-[#FFFFFF] text-center">
                  <h3 className="font-bold text-[#FFFFFF]">{item.name}</h3>
                  <p className="text-[#FFFFFF]">
                    Precio unitario: ${item.price.toFixed(2)}
                  </p>
                  <p className="text-[#FFFFFF]">
                    Cantidad: {item.quantity || 1}
                  </p>
                  <p className="text-[#FFFFFF]">
                    Subtotal: ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                  <p className="text-[#FFFFFF]">
                    Tienda: {item.store}
                  </p>
                  {item.savingsPerUnit > 0 ? (
                    <p className="text-[#34C759]">
                      Ahorro por unidad: ${item.savingsPerUnit.toFixed(2)} (comprando a ${item.price.toFixed(2)} frente a ${item.highestPrice.toFixed(2)})
                    </p>
                  ) : (
                    <p className="text-[#A0AEC0]">
                      No hay ahorro para este producto
                    </p>
                  )}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 px-4 py-2 bg-red-500 text-[#FFFFFF] rounded-lg"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Botón para cerrar compra */}
          <motion.div
            className="mt-6 p-4 bg-[#1F252A] rounded-lg shadow-md border-2 border-[#3A4450] mx-auto max-w-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={handleClosePurchase}
              className="w-full px-4 py-2 bg-[#3B82F6] text-[#FFFFFF] rounded-lg"
            >
              Cerrar Compra
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

export default Cart;