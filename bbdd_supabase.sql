-- ========================================
-- Base de datos para Supabase - Gestor de Cocina
-- Convertido desde MariaDB/MySQL a PostgreSQL
-- ========================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- TABLA: admin_usuarios
-- ========================================
CREATE TABLE IF NOT EXISTS admin_usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50),
  pwd VARCHAR(255) DEFAULT '123',
  grade INTEGER DEFAULT 5,
  email VARCHAR(255) NOT NULL UNIQUE,
  license_type VARCHAR(20) DEFAULT 'free',
  license_expires_at TIMESTAMP WITH TIME ZONE,
  max_ingredients INTEGER DEFAULT 50,
  max_suppliers INTEGER DEFAULT 10,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos de usuarios
INSERT INTO admin_usuarios (id, username, pwd, grade, email, license_type, license_expires_at, max_ingredients, max_suppliers, is_admin, created_at, last_update) VALUES
(1, 'admin', '$2b$10$l19aHbjcpavO2ClbLEy5f.ry07ZOezKxnGqNxMRN3SE4X.p0pM25e', 0, 'admin@google.com', 'premium', '2026-12-31 23:59:59', 999999, 999999, true, '2025-04-14 23:00:13', '2025-04-14 23:00:13'),
(2, 'Leandro', '$2b$10$dvgJJE8zaV8BTTNhKajh5uatbOVE5Ohl/fbr1WB2UnpZgbvFU7yLO', 0, 'leandrocalvoduran@gmail.com', 'premium', '2026-12-31 23:59:59', 999999, 999999, true, '2025-04-17 14:49:11', '2025-04-17 14:49:11');

-- Actualizar usuario Leandro para que sea administrador (en caso de que ya exista)
UPDATE admin_usuarios 
SET 
  is_admin = true,
  license_type = 'premium',
  license_expires_at = '2026-12-31 23:59:59',
  max_ingredients = 999999,
  max_suppliers = 999999,
  last_update = NOW()
WHERE email = 'leandrocalvoduran@gmail.com';

-- ========================================
-- TABLA: categories
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos de categorías
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES
(1, 'Frutas', 'Frutas frescas y de temporada', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(2, 'Verduras', 'Verduras y hortalizas', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(3, 'Carnes', 'Carnes y embutidos', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(4, 'Lácteos', 'Productos lácteos', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(5, 'Especias', 'Especias y condimentos', '2025-04-17 18:54:41', '2025-04-17 18:54:41');

-- ========================================
-- TABLA: inventory_families
-- ========================================
CREATE TABLE IF NOT EXISTS inventory_families (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos de familias de inventario
INSERT INTO inventory_families (id, name, description, created_at, updated_at) VALUES
(1, 'Congelador', 'Productos almacenados en congelador', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(2, 'Cámara de frío', 'Productos almacenados en cámaras de frío', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(3, 'Seco', 'Productos almacenados en seco', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(4, 'Productos de limpieza', 'Productos de limpieza y mantenimiento', '2025-04-17 18:54:41', '2025-04-17 18:54:41');

-- ========================================
-- TABLA: inventory_subfamilies
-- ========================================
CREATE TABLE IF NOT EXISTS inventory_subfamilies (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_inventory_subfamilies_family_id 
    FOREIGN KEY (family_id) REFERENCES inventory_families(id) ON DELETE CASCADE
);

-- Insertar datos de subfamilias de inventario
INSERT INTO inventory_subfamilies (id, family_id, name, description, created_at, updated_at) VALUES
(1, 2, 'Cámara de carne', 'Cámara específica para almacenamiento de carnes', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(2, 2, 'Cámara de pescado', 'Cámara específica para almacenamiento de pescados', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(3, 2, 'Cámara de productos terminados', 'Cámara para productos terminados', '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(4, 2, 'Cámara de frutas y verduras', 'Cámara específica para frutas y verduras', '2025-04-17 18:54:41', '2025-04-17 18:54:41');

-- ========================================
-- TABLA: ingredients
-- ========================================
CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  category_id INTEGER,
  base_price DECIMAL(10,2),
  unit_measure VARCHAR(50),
  min_stock_level INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_ingredients_category_id 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Insertar datos de ingredientes
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at) VALUES
(1, 'Manzana', 'Manzana roja', 1, 1.50, 'kg', 10, true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(2, 'Lechuga', 'Lechuga romana', 2, 2.00, 'unidad', 5, true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(3, 'Pollo', 'Pechuga de pollo', 3, 5.00, 'kg', 20, true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(4, 'Leche', 'Leche entera', 4, 1.20, 'litro', 30, true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(5, 'Sal', 'Sal fina', 5, 0.50, 'kg', 100, true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(6, 'Tomate', 'Tomate pera', 2, 2.50, 'kg', 15, true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(7, 'Pescado', 'Merluza', 3, 8.00, 'kg', 10, true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(8, 'Queso', 'Queso manchego', 4, 12.00, 'kg', 5, true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(9, 'Pimienta', 'Pimienta negra', 5, 3.00, 'kg', 50, true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(10, 'Naranja', 'Naranja de mesa', 1, 1.80, 'kg', 20, true, '2025-04-17 18:54:41', '2025-04-17 18:54:41');

-- ========================================
-- TABLA: suppliers
-- ========================================
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos de proveedores
INSERT INTO suppliers (id, name, contact_person, email, phone, address, active, created_at, updated_at) VALUES
(1, 'Frutas Hermanos García', 'Juan García', 'juan@frutasgarcia.com', '600111222', 'Calle Mayor, 123', true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(2, 'Verduras La Huerta', 'María López', 'maria@lahuerta.com', '611222333', 'Avenida del Campo, 456', true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(3, 'Carnes El Corral', 'Pedro Martínez', 'pedro@elcorral.com', '622333444', 'Plaza de la Carne, 789', true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(4, 'Lácteos La Vaquita', 'Ana Sánchez', 'ana@lavaquita.com', '633444555', 'Carretera de la Leche, 101', true, '2025-04-17 18:54:41', '2025-04-17 18:54:41'),
(5, 'Especias El Sabor', 'Luis Rodríguez', 'luis@elsabor.com', '644555666', 'Calle de las Especias, 112', true, '2025-04-17 18:54:41', '2025-04-17 18:54:41');

-- ========================================
-- TABLA: inventory
-- ========================================
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  ingredient_id INTEGER,
  family_id INTEGER,
  subfamily_id INTEGER,
  quantity DECIMAL(10,2),
  purchase_price DECIMAL(10,2),
  expiry_date DATE,
  batch_number VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_inventory_ingredient_id 
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
  CONSTRAINT fk_inventory_family_id 
    FOREIGN KEY (family_id) REFERENCES inventory_families(id) ON DELETE SET NULL,
  CONSTRAINT fk_inventory_subfamily_id 
    FOREIGN KEY (subfamily_id) REFERENCES inventory_subfamilies(id) ON DELETE SET NULL
);

-- Insertar datos de inventario
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES
(1, 1, 2, 4, 50.00, 1.00, '2025-05-17', 'Lote123', '2025-04-17 18:54:41'),
(2, 2, 2, 4, 20.00, 1.50, '2025-05-02', 'Lote456', '2025-04-17 18:54:41'),
(3, 3, 1, NULL, 100.00, 4.00, '2025-06-16', 'Lote789', '2025-04-17 18:54:41'),
(4, 4, 4, NULL, 150.00, 0.80, '2025-05-07', 'Lote101', '2025-04-17 18:54:41'),
(5, 5, 3, NULL, 500.00, 0.30, '2026-04-17', 'Lote112', '2025-04-17 18:54:41'),
(6, 6, 2, 4, 30.00, 2.00, '2025-04-27', 'Lote113', '2025-04-17 18:54:41'),
(7, 7, 1, NULL, 25.00, 6.50, '2025-06-01', 'Lote114', '2025-04-17 18:54:41'),
(8, 8, 2, 3, 10.00, 10.00, '2025-05-17', 'Lote115', '2025-04-17 18:54:41'),
(9, 9, 3, NULL, 200.00, 2.50, '2025-10-14', 'Lote116', '2025-04-17 18:54:41'),
(10, 10, 2, 4, 40.00, 1.20, '2025-05-12', 'Lote117', '2025-04-17 18:54:41');

-- ========================================
-- TABLA: inventory_movements
-- ========================================
CREATE TABLE IF NOT EXISTS inventory_movements (
  id SERIAL PRIMARY KEY,
  ingredient_id INTEGER,
  quantity DECIMAL(10,2),
  movement_type VARCHAR(50),
  user_id INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_inventory_movements_ingredient_id 
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
  CONSTRAINT fk_inventory_movements_user_id 
    FOREIGN KEY (user_id) REFERENCES admin_usuarios(id) ON DELETE SET NULL
);

-- Insertar datos de movimientos de inventario
INSERT INTO inventory_movements (id, ingredient_id, quantity, movement_type, user_id, notes, created_at) VALUES
(1, 1, -5.00, 'Salida', 1, 'Venta a cliente', '2025-04-17 18:54:42'),
(2, 2, 10.00, 'Entrada', 1, 'Compra a proveedor', '2025-04-17 18:54:42'),
(3, 3, -20.00, 'Salida', 1, 'Uso en cocina', '2025-04-17 18:54:42'),
(4, 4, 50.00, 'Entrada', 1, 'Reposición de stock', '2025-04-17 18:54:42'),
(5, 5, -10.00, 'Salida', 1, 'Uso en preparación', '2025-04-17 18:54:42');

-- ========================================
-- TABLA: purchase_orders
-- ========================================
CREATE TABLE IF NOT EXISTS purchase_orders (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER,
  order_date DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  status VARCHAR(50),
  total_amount DECIMAL(10,2),
  user_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_purchase_orders_supplier_id 
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
  CONSTRAINT fk_purchase_orders_user_id 
    FOREIGN KEY (user_id) REFERENCES admin_usuarios(id) ON DELETE SET NULL
);

-- Insertar datos de órdenes de compra
INSERT INTO purchase_orders (id, supplier_id, order_date, expected_delivery_date, actual_delivery_date, status, total_amount, user_id, created_at, updated_at) VALUES
(1, 1, '2025-04-17', '2025-04-19', NULL, 'Pendiente', 60.00, 1, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(2, 2, '2025-04-17', '2025-04-19', NULL, 'Pendiente', 36.00, 1, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(3, 3, '2025-04-17', '2025-04-19', NULL, 'Pendiente', 450.00, 1, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(4, 4, '2025-04-17', '2025-04-19', NULL, 'Pendiente', 100.00, 1, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(5, 5, '2025-04-17', '2025-04-19', NULL, 'Pendiente', 200.00, 1, '2025-04-17 18:54:42', '2025-04-17 18:54:42');

-- ========================================
-- TABLA: purchase_order_items
-- ========================================
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id SERIAL PRIMARY KEY,
  purchase_order_id INTEGER,
  ingredient_id INTEGER,
  quantity DECIMAL(10,2),
  unit_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_purchase_order_items_order_id 
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_purchase_order_items_ingredient_id 
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Insertar datos de items de órdenes de compra
INSERT INTO purchase_order_items (id, purchase_order_id, ingredient_id, quantity, unit_price, created_at, updated_at) VALUES
(1, 1, 1, 50.00, 1.20, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(2, 2, 2, 20.00, 1.80, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(3, 3, 3, 100.00, 4.50, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(4, 4, 4, 100.00, 1.00, '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(5, 5, 5, 500.00, 0.40, '2025-04-17 18:54:42', '2025-04-17 18:54:42');

-- ========================================
-- TABLA: supplier_ingredients
-- ========================================
CREATE TABLE IF NOT EXISTS supplier_ingredients (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER,
  ingredient_id INTEGER,
  price DECIMAL(10,2),
  notes VARCHAR(255),
  last_purchase_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_supplier_ingredients_supplier_id 
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  CONSTRAINT fk_supplier_ingredients_ingredient_id 
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Insertar datos de ingredientes de proveedores
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, price, notes, last_purchase_date, created_at, updated_at) VALUES
(1, 1, 1, 1.20, 'Manzanas de temporada', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(2, 2, 2, 1.80, 'Lechugas frescas', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(3, 3, 3, 4.50, 'Pechugas sin hueso', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(4, 4, 4, 1.00, 'Leche entera pasteurizada', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(5, 5, 5, 0.40, 'Sal fina de mesa', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(6, 1, 10, 1.50, 'Naranjas de temporada', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(7, 2, 6, 2.00, 'Tomates pera', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(8, 3, 7, 6.50, 'Merluza fresca', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(9, 4, 8, 10.00, 'Queso manchego curado', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42'),
(10, 5, 9, 2.50, 'Pimienta negra molida', '2025-04-17 18:54:42', '2025-04-17 18:54:42', '2025-04-17 18:54:42');

-- ========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ========================================
CREATE INDEX IF NOT EXISTS idx_ingredients_category_id ON ingredients(category_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_active ON ingredients(active);
CREATE INDEX IF NOT EXISTS idx_inventory_ingredient_id ON inventory(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_inventory_family_id ON inventory(family_id);
CREATE INDEX IF NOT EXISTS idx_inventory_subfamily_id ON inventory(subfamily_id);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry_date ON inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_ingredient_id ON inventory_movements(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON inventory_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_order_id ON purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_supplier_ingredients_supplier_id ON supplier_ingredients(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_ingredients_ingredient_id ON supplier_ingredients(ingredient_id);

-- ========================================
-- FUNCIONES Y TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_families_updated_at BEFORE UPDATE ON inventory_families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_subfamilies_updated_at BEFORE UPDATE ON inventory_subfamilies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_order_items_updated_at BEFORE UPDATE ON purchase_order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_ingredients_updated_at BEFORE UPDATE ON supplier_ingredients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS) - OPCIONAL
-- ========================================
-- Descomenta las siguientes líneas si quieres habilitar RLS

-- ALTER TABLE admin_usuarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory_families ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory_subfamilies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE supplier_ingredients ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS RLS DE EJEMPLO (OPCIONAL)
-- ========================================
-- Descomenta y ajusta según tus necesidades de seguridad

-- CREATE POLICY "Users can view all data" ON admin_usuarios FOR SELECT USING (true);
-- CREATE POLICY "Users can update own data" ON admin_usuarios FOR UPDATE USING (id = auth.uid());

-- ========================================
-- VISTAS ÚTILES PARA REPORTES
-- ========================================

-- Vista para stock bajo
CREATE OR REPLACE VIEW low_stock_view AS
SELECT 
    i.id,
    i.name as ingredient_name,
    i.min_stock_level,
    COALESCE(SUM(inv.quantity), 0) as current_stock,
    c.name as category_name
FROM ingredients i
LEFT JOIN inventory inv ON i.id = inv.ingredient_id
LEFT JOIN categories c ON i.category_id = c.id
WHERE i.active = true
GROUP BY i.id, i.name, i.min_stock_level, c.name
HAVING COALESCE(SUM(inv.quantity), 0) <= i.min_stock_level;

-- Vista para productos próximos a vencer
CREATE OR REPLACE VIEW expiring_products_view AS
SELECT 
    i.name as ingredient_name,
    inv.batch_number,
    inv.expiry_date,
    inv.quantity,
    inv.purchase_price,
    c.name as category_name,
    (inv.expiry_date - CURRENT_DATE) as days_to_expiry
FROM inventory inv
JOIN ingredients i ON inv.ingredient_id = i.id
JOIN categories c ON i.category_id = c.id
WHERE inv.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
AND inv.quantity > 0
ORDER BY inv.expiry_date ASC;

-- Vista para resumen de inventario por categoría
CREATE OR REPLACE VIEW inventory_summary_by_category AS
SELECT 
    c.name as category_name,
    COUNT(DISTINCT i.id) as total_ingredients,
    COUNT(DISTINCT inv.id) as inventory_entries,
    COALESCE(SUM(inv.quantity), 0) as total_quantity,
    COALESCE(AVG(inv.purchase_price), 0) as avg_purchase_price,
    COALESCE(SUM(inv.quantity * inv.purchase_price), 0) as total_value
FROM categories c
LEFT JOIN ingredients i ON c.id = i.category_id AND i.active = true
LEFT JOIN inventory inv ON i.id = inv.ingredient_id
GROUP BY c.id, c.name
ORDER BY total_value DESC;

-- ========================================
-- COMENTARIOS FINALES
-- ========================================
-- Este archivo SQL está optimizado para Supabase y PostgreSQL
-- Incluye:
-- - Sintaxis PostgreSQL nativa
-- - Índices para optimización
-- - Triggers para actualización automática de timestamps
-- - Vistas útiles para reportes
-- - Estructura preparada para RLS (Row Level Security)
-- - Foreign keys con acciones apropiadas (CASCADE, SET NULL)
-- - Tipos de datos optimizados para PostgreSQL
