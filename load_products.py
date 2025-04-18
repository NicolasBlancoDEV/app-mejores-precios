import firebase_admin
from firebase_admin import credentials, firestore
import random

# Inicializar Firebase
cred = credentials.Certificate("/home/winchester/Vídeos/Ptoyecto App/price-compare-app/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Limpiar la colección 'products' antes de cargar nuevos productos
docs = db.collection('products').stream()
for doc in docs:
    doc.reference.delete()
print("Productos existentes eliminados.")

# Lista de categorías y tiendas para generar datos realistas
categories = ["Bebidas", "Cocina", "Limpieza", "Cuidado Personal", "Snacks", "Lácteos", "Panadería", "Congelados"]
stores = ["Supermercado A", "Supermercado B", "Supermercado C", "Tienda D", "Hipermercado E"]

# Lista base de productos para generar variaciones
base_products = [
    ("Leche Entera 1L", 900, "Lácteos"),
    ("Yogur Natural 500g", 600, "Lácteos"),
    ("Pan Lactal 500g", 450, "Panadería"),
    ("Arroz Integral 1kg", 800, "Cocina"),
    ("Aceite de Oliva 500ml", 1200, "Cocina"),
    ("Detergente Líquido 1L", 700, "Limpieza"),
    ("Shampoo 400ml", 850, "Cuidado Personal"),
    ("Galletitas Dulces 200g", 350, "Snacks"),
    ("Jugo de Naranja 1L", 500, "Bebidas"),
    ("Helado de Vainilla 1L", 1100, "Congelados"),
    ("Pasta Fideos 500g", 400, "Cocina"),
    ("Salsa de Tomate 500g", 300, "Cocina"),
    ("Jabón en Polvo 800g", 650, "Limpieza"),
    ("Acondicionador 400ml", 900, "Cuidado Personal"),
    ("Papas Fritas 150g", 400, "Snacks"),
    ("Agua Mineral 2L", 250, "Bebidas"),
    ("Pizza Congelada 400g", 950, "Congelados"),
    ("Manteca 200g", 500, "Lácteos"),
    ("Harina 1kg", 350, "Cocina"),
    ("Esponja de Limpieza", 150, "Limpieza"),
]

# Generar 200 productos variando precios y tiendas
products = []
for i in range(200):
    base_product = base_products[i % len(base_products)]
    name = base_product[0]
    base_price = base_product[1]
    category = base_product[2]
    # Variar el precio entre -20% y +20% y redondear a 2 decimales
    price_variation = random.uniform(0.8, 1.2)
    price = round(base_price * price_variation, 2)
    store = random.choice(stores)
    products.append({
        "name": name,
        "price": price,
        "store": store,
        "category": category
    })

# Cargar los productos a Firestore
for product in products:
    db.collection('products').add(product)
    print(f"Producto agregado: {product['name']} - ARS {product['price']} ({product['store']})")

print("Carga de productos completada!")