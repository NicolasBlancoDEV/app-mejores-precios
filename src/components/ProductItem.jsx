const ProductItem = ({ product }) => {
  return (
    <div>
      <h3 className="text-white font-bold">{product.name}</h3>
      <p className="text-gray-300 text-sm">Precio: ${product.price.toFixed(2)}</p>
      <p className="text-gray-300 text-sm">Tienda: {product.store}</p>
    </div>
  );
};

export default ProductItem;