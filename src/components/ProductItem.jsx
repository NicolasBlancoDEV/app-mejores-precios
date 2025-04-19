import React from 'react';
import { format } from 'date-fns';

const ProductItem = React.memo(({ product, index, cheapestProducts, addToCart }) => {
  const isCheapest =
    cheapestProducts[product.name.toLowerCase()] &&
    cheapestProducts[product.name.toLowerCase()].id === product.id;

  return (
    <div className="p-4 break-inside-avoid">
      <div
        className="text-[#FFFFFF] p-4 text-center rounded-lg backdrop-filter backdrop-blur-sm bg-opacity-10 bg-gray-800"
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
          <p className="text-[#34C759] font-semibold mt-2">
            Mejor Precio
          </p>
        )}
        <button
          onClick={() => addToCart(product)}
          className="mt-4 px-4 py-2 bg-[#3984fc] text-[#FFFFFF] rounded-lg"
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
});

export default ProductItem;