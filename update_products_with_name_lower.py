import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase con tu archivo de credenciales
cred = credentials.Certificate("/home/winchester/Vídeos/Ptoyecto App/price-compare-app/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Obtener todos los documentos de la colección 'products'
products_ref = db.collection('products')
docs = products_ref.stream()

# Actualizar cada documento añadiendo el campo 'name_lower'
for doc in docs:
    data = doc.to_dict()
    if 'name_lower' not in data:  # Solo actualizar si no existe el campo
        data['name_lower'] = data['name'].lower()
        db.collection('products').document(doc.id).set(data)
        print(f"Producto {doc.id} actualizado con name_lower: {data['name_lower']}")

print("Todos los productos han sido actualizados con name_lower.")