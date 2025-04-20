import { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';

// Crear el contexto del carrito
const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // Escuchar cambios en la autenticación del usuario
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // Si el usuario cierra sesión, limpiar el carrito local
        setCartItems([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Escuchar cambios en el carrito de Firestore cuando hay un usuario autenticado
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribeCart = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const cart = userData.cart || [];
        setCartItems(cart);
      } else {
        // Si el documento no existe, inicializarlo con un carrito vacío
        setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          cart: [],
          purchases: [],
          stats: { totalSpent: 0, totalPurchases: 0, favoriteCategory: '' },
        });
        setCartItems([]);
      }
    }, (error) => {
      console.error('Error al escuchar cambios en el carrito:', error);
      toast.error('Error al cargar el carrito');
    });

    return () => unsubscribeCart();
  }, [user]);

  // Función para agregar un producto al carrito
  const addToCart = async (product) => {
    if (!user) {
      toast.error('Por favor, inicia sesión para agregar productos al carrito');
      return false;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      let userData;
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        userData = {
          uid: user.uid,
          email: user.email,
          cart: [],
          purchases: [],
          stats: { totalSpent: 0, totalPurchases: 0, favoriteCategory: '' },
        };
        await setDoc(userRef, userData);
      }

      const cart = userData.cart || [];
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          store: product.store || 'Sin tienda',
          quantity: 1,
          savings: product.savings || 0,
          category: product.category || 'Sin categoría',
        });
      }

      await updateDoc(userRef, { cart });
      toast.success(`${product.name} agregado al carrito`);
      return true;
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('Error al agregar al carrito: ' + error.message);
      return false;
    }
  };

  // Función para obtener la cantidad total de productos en el carrito
  const getCartCount = () => {
    const count = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    return count;
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartContext);