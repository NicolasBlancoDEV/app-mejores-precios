import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../firebase.js';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, where, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import debounce from 'lodash/debounce';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState([]);

  // Normalizar texto para ignorar acentos
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Obtener datos en tiempo real
  useEffect(() => {
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      console.log('Actualizando productos desde Firestore. Documentos:', snapshot.docs.length);
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      console.log('Productos cargados:', productList.map(p => p.name));
    }, (error) => console.error('Error en products onSnapshot:', error));

    const unsubscribeCart = onSnapshot(collection(db, 'cart'), (snapshot) => {
      console.log('Actualizando carrito desde Firestore. Documentos encontrados:', snapshot.docs.length);
      const cartList = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log('Documento en cart:', doc.id, data);
        return { id: doc.id, ...data };
      });
      setCart(cartList);
    }, (error) => console.error('Error en cart onSnapshot:', error));

    const unsubscribePurchases = onSnapshot(collection(db, 'purchases'), (snapshot) => {
      console.log('Actualizando compras desde Firestore. Documentos:', snapshot.docs.length);
      const purchaseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPurchases(purchaseList);
    }, (error) => console.error('Error en purchases onSnapshot:', error));

    return () => {
      unsubscribeProducts();
      unsubscribeCart();
      unsubscribePurchases();
    };
  }, []);

  // Función de búsqueda con debounce
  const debouncedSearchProducts = debounce(async (term, callback) => {
    try {
      if (!term) {
        callback([]);
        return;
      }

      const normalizedTerm = normalizeText(term.trim());
      const snapshot = await getDocs(collection(db, 'products'));
      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const results = allProducts.filter(product => {
        const normalizedName = normalizeText(product.name || '');
        const normalizedStore = normalizeText(product.store || '');
        const normalizedCategory = normalizeText(product.category || '');
        const normalizedPrice = product.price ? product.price.toString() : '';
        const normalizedBrand = product.brand ? normalizeText(product.brand) : '';

        return (
          normalizedName.includes(normalizedTerm) ||
          normalizedStore.includes(normalizedTerm) ||
          normalizedCategory.includes(normalizedTerm) ||
          normalizedPrice.includes(term.trim()) || // No normalizamos números
          normalizedBrand.includes(normalizedTerm)
        );
      });

      callback(results);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      callback([]);
    }
  }, 300);

  // Función para añadir un producto a la colección products
  const addProduct = async (productData) => {
    try {
      const productWithLower = {
        ...productData,
        name_lower: normalizeText(productData.name?.toLowerCase() || ''),
        brand_lower: productData.brand ? normalizeText(productData.brand.toLowerCase()) : '',
      };
      await addDoc(collection(db, 'products'), productWithLower);
      toast.success('Producto añadido con éxito');
    } catch (error) {
      toast.error(`Error al añadir producto: ${error.message}`);
      console.error("Error añadiendo producto:", error);
    }
  };

  // Función para añadir al carrito (con cantidades)
  const addToCart = async (product) => {
    try {
      const { id, ...productWithoutId } = product;

      // Buscar si ya existe un producto con el mismo nombre y tienda en el carrito
      const cartRef = collection(db, 'cart');
      const q = query(
        cartRef,
        where('name', '==', product.name),
        where('store', '==', product.store)
      );
      const querySnapshot = await getDocs(q);

      // Calcular el ahorro
      const sameProducts = products.filter(
        (p) => p.name.toLowerCase() === product.name.toLowerCase()
      );
      if (sameProducts.length > 1) {
        const prices = sameProducts.map((p) => p.price);
        const maxPrice = Math.max(...prices);
        const savings = maxPrice - product.price;
        if (savings > 0) {
          toast.success(
            `¡Ahorraste $${savings.toFixed(2)} al elegir el mejor precio para ${product.name}!`
          );
        }
      }

      if (!querySnapshot.empty) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        const existingDoc = querySnapshot.docs[0];
        const existingData = existingDoc.data();
        const newQuantity = (existingData.quantity || 1) + 1;
        await updateDoc(doc(db, 'cart', existingDoc.id), {
          quantity: newQuantity,
          addedAt: new Date().toISOString(),
        });
        toast.success(`Cantidad actualizada para ${product.name} (x${newQuantity})`);
      } else {
        // Si no está en el carrito, añadir un nuevo documento
        await addDoc(collection(db, 'cart'), {
          ...productWithoutId,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
        toast.success('Producto añadido al carrito');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error añadiendo al carrito:", error);
    }
  };

  // Función para eliminar del carrito
  const removeFromCart = async (id) => {
    try {
      console.log('Intentando eliminar del carrito con id:', id);
      const cartDocRef = doc(db, 'cart', id);
      const docSnap = await getDoc(cartDocRef);
      if (docSnap.exists()) {
        await deleteDoc(cartDocRef);
        console.log('Documento eliminado con id:', id);
        toast.info('Producto eliminado del carrito');
      } else {
        console.error('Documento con id', id, 'no encontrado en Firestore');
        toast.error('El producto no se encontró en el carrito.');
      }
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      toast.error('Error al eliminar del carrito: ' + error.message);
    }
  };

  // Función para cerrar compra
  const closePurchase = async () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío. Agrega productos antes de cerrar la compra.');
      return;
    }

    try {
      let totalSpent = 0;
      let totalSavings = 0;
      const purchaseItems = cart.map((cartProduct) => {
        const sameProducts = products.filter(
          (p) => p.name.toLowerCase() === cartProduct.name.toLowerCase()
        );
        const prices = sameProducts.map((p) => p.price);
        const maxPrice = Math.max(...prices);
        const savings = sameProducts.length > 1 ? maxPrice - cartProduct.price : 0;
        const quantity = cartProduct.quantity || 1;
        totalSpent += cartProduct.price * quantity;
        totalSavings += savings * quantity;
        return { ...cartProduct, savings, quantity };
      });

      const purchase = {
        date: new Date().toISOString(),
        items: purchaseItems,
        totalSpent,
        totalSavings,
      };
      await addDoc(collection(db, 'purchases'), purchase);

      const cartDocs = await getDocs(collection(db, 'cart'));
      const deletePromises = cartDocs.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      toast.success('Compra cerrada con éxito!');
    } catch (error) {
      toast.error('Error al cerrar la compra: ' + error.message);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        cart,
        purchases,
        addProduct,
        addToCart,
        removeFromCart,
        closePurchase,
        debouncedSearchProductsInFirestore: debouncedSearchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;