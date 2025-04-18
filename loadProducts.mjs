import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase.js';

// Nombres reales de productos (30 nombres, se repetirán para llegar a 150)
const productNames = [
  'Leche Entera La Serenísima 1L',
  'Yogur Natural Danone 500g',
  'Pan Lactal Fargo 500g',
  'Queso Cremoso La Paulina 400g',
  'Manteca Sancor 200g',
  'Arroz Integral Lucchetti 1kg',
  'Fideos Spaghetti Matarazzo 500g',
  'Aceite de Girasol Cocinero 900ml',
  'Azúcar Ledesma 1kg',
  'Harina 000 Morixe 1kg',
  'Café Molido La Virginia 250g',
  'Té en Saquitos Taragüi 50u',
  'Galletitas Dulces Criollitas 300g',
  'Mermelada de Frutilla Arcor 454g',
  'Atún en Lomitos La Campagnola 170g',
  'Salsa de Tomate Cica 520g',
  'Mayonesa Natura 500g',
  'Ketchup Hellmann’s 250g',
  'Jabón Líquido Ala 900ml',
  'Detergente Magistral 750ml',
  'Esponja de Cocina Virulana 2u',
  'Papel Higiénico Elite 4 rollos',
  'Shampoo Sedal 400ml',
  'Acondicionador Dove 200ml',
  'Jabón en Barra Lux 90g',
  'Pasta Dental Colgate 90g',
  'Cerveza Brahma 1L',
  'Gaseosa Coca-Cola 1.5L',
  'Agua Mineral Villavicencio 2L',
  'Jugo de Naranja Cepita 1L',
];

// Categorías y tiendas
const categories = ['Cocina', 'Limpieza', 'Bebidas'];
const stores = ['Supermercado A', 'Supermercado B', 'Tienda C'];

async function loadProducts() {
  // Generar 150 productos (repetimos nombres para simular productos iguales en diferentes tiendas)
  for (let i = 0; i < 150; i++) {
    const name = productNames[i % productNames.length]; // Cicla entre los nombres
    const product = {
      name: name,
      price: Math.floor(Math.random() * 1000) + 100, // Precio entre 100 y 1100
      store: stores[Math.floor(Math.random() * stores.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      name_lower: name.toLowerCase(), // Para búsqueda
    };
    try {
      await addDoc(collection(db, 'products'), product);
      console.log(`Producto "${name}" cargado`);
    } catch (error) {
      console.error(`Error cargando producto "${name}":`, error);
    }
  }
  console.log('Carga de 150 productos completada');
}

loadProducts();