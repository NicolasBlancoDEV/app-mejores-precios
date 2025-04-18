import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Configuración de Firebase (reemplaza con los valores de tu proyecto)
const firebaseConfig = {
    apiKey: "AIzaSyAH79Cxqb64KarifDMfd_Fz8Ve3hba2WPo",
    authDomain: "pricecompareapp-8831e.firebaseapp.com",
    projectId: "pricecompareapp-8831e",
    storageBucket: "pricecompareapp-8831e.firebasestorage.app",
    messagingSenderId: "154771645191",
    appId: "1:154771645191:web:14e043add23e0d7d31dba2",
    measurementId: "G-9F0HP6H07D"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para actualizar los documentos
async function updateCartTimestamps() {
  console.log('Iniciando actualización de timestamps en la colección cart...');
  const cartSnapshot = await getDocs(collection(db, 'cart'));
  let updatedCount = 0;

  for (const doc of cartSnapshot.docs) {
    const data = doc.data();
    if (!data.timestamp) {
      await updateDoc(doc.ref, { timestamp: new Date().toISOString() });
      console.log(`Documento ${doc.id} actualizado con timestamp: ${new Date().toISOString()}`);
      updatedCount++;
    } else {
      console.log(`Documento ${doc.id} ya tiene timestamp, no se modifica.`);
    }
  }

  console.log(`Actualización completada. Se actualizaron ${updatedCount} documentos.`);
}

// Ejecutar la función y manejar errores
updateCartTimestamps().catch((error) => {
  console.error('Error al actualizar los timestamps:', error);
});