-- BACKUP NO ELIMINAR

-- Exportación completa de base de datos Supabase
-- Fecha: 2025-09-21T10:19:54.891Z
-- Proyecto: https://jlddktlbyeiyeinzhfxx.supabase.co
-- Incluye: Estructura de tablas + Datos completos

-- Configuración inicial
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- =============================================
-- CREACIÓN DE TABLAS (ESTRUCTURA)
-- =============================================

-- Tabla: admin_usuarios

CREATE TABLE IF NOT EXISTS admin_usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    grade INTEGER DEFAULT 0,
    email VARCHAR(100) NOT NULL UNIQUE,
    license_type VARCHAR(20) DEFAULT 'free',
    license_expires_at TIMESTAMP WITH TIME ZONE,
    max_ingredients INTEGER DEFAULT 15,
    max_suppliers INTEGER DEFAULT 15,
    is_admin BOOLEAN DEFAULT FALSE,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: categories

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: ingredients

CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    base_price DECIMAL(10,2) DEFAULT 0,
    unit_measure VARCHAR(20) DEFAULT 'kg',
    min_stock_level INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    alerg_gluten BOOLEAN DEFAULT FALSE,
    alerg_crustaceos BOOLEAN DEFAULT FALSE,
    alerg_huevos BOOLEAN DEFAULT FALSE,
    alerg_pescado BOOLEAN DEFAULT FALSE,
    alerg_cacahuetes BOOLEAN DEFAULT FALSE,
    alerg_soja BOOLEAN DEFAULT FALSE,
    alerg_leche BOOLEAN DEFAULT FALSE,
    alerg_frutos BOOLEAN DEFAULT FALSE,
    alerg_apio BOOLEAN DEFAULT FALSE,
    alerg_mostaza BOOLEAN DEFAULT FALSE,
    alerg_sesamo BOOLEAN DEFAULT FALSE,
    alerg_sulfitos BOOLEAN DEFAULT FALSE,
    alerg_altramuces BOOLEAN DEFAULT FALSE,
    alerg_moluscos BOOLEAN DEFAULT FALSE
);

-- Tabla: inventory_families

CREATE TABLE IF NOT EXISTS inventory_families (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: inventory_subfamilies

CREATE TABLE IF NOT EXISTS inventory_subfamilies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    family_id INTEGER REFERENCES inventory_families(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: inventory

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    ingredient_id INTEGER REFERENCES ingredients(id),
    family_id INTEGER REFERENCES inventory_families(id),
    subfamily_id INTEGER REFERENCES inventory_subfamilies(id),
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    purchase_price DECIMAL(10,2) DEFAULT 0,
    expiry_date DATE,
    batch_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: inventory_movements

CREATE TABLE IF NOT EXISTS inventory_movements (
    id SERIAL PRIMARY KEY,
    ingredient_id INTEGER REFERENCES ingredients(id),
    movement_type VARCHAR(20) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    reason TEXT,
    admin_user_id INTEGER REFERENCES admin_usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: suppliers

CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: supplier_ingredients

CREATE TABLE IF NOT EXISTS supplier_ingredients (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(id),
    ingredient_id INTEGER REFERENCES ingredients(id),
    supplier_price DECIMAL(10,2) NOT NULL,
    supplier_unit VARCHAR(20) DEFAULT 'kg',
    conversion_factor DECIMAL(10,4) DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: purchase_orders

CREATE TABLE IF NOT EXISTS purchase_orders (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(id),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_delivery DATE,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: purchase_order_items

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES purchase_orders(id),
    ingredient_id INTEGER REFERENCES ingredients(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DATOS (INSERT STATEMENTS)
-- =============================================

-- Datos de la tabla admin_usuarios
INSERT INTO admin_usuarios (id, username, pwd, grade, email, license_type, license_expires_at, max_ingredients, max_suppliers, is_admin, last_update) VALUES (2, 'Leandro', '$2b$10$dvgJJE8zaV8BTTNhKajh5uatbOVE5Ohl/fbr1WB2UnpZgbvFU7yLO', 0, 'leandrocalvoduran@gmail.com', 'premium', '2026-12-31T23:59:59+00:00', 999999, 999999, TRUE, '2025-09-20T16:13:16.994309+00:00');
INSERT INTO admin_usuarios (id, username, pwd, grade, email, license_type, license_expires_at, max_ingredients, max_suppliers, is_admin, last_update) VALUES (1, 'admin', '$2b$10$l19aHbjcpavO2ClbLEy5f.ry07ZOezKxnGqNxMRN3SE4X.p0pM25e', 0, 'admin@google.com', 'free', '2026-12-31T00:00:00+00:00', 15, 15, TRUE, '2025-04-14T23:00:13+00:00');

-- Datos de la tabla categories
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES (1, 'Frutas', 'Frutas frescas y de temporada', '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00');
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES (2, 'Verduras', 'Verduras y hortalizas', '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00');
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES (3, 'Carnes', 'Carnes y embutidos', '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00');
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES (4, 'Lácteos', 'Productos lácteos', '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00');
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES (5, 'Especias', 'Especias y condimentos', '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00');

-- Datos de la tabla ingredients
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES (1, 'Manzana', 'Manzana roja', 1, 1.5, 'kg', 10, TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES (2, 'Lechuga', 'Lechuga romana', 2, 2, 'unidad', 5, TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES (3, 'Pollo', 'Pechuga de pollo', 3, 5, 'kg', 20, TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES (4, 'Leche', 'Leche entera', 4, 1.2, 'litro', 30, TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES (5, 'Sal', 'Sal fina', 5, 0.5, 'kg', 100, TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES (6, 'Tomate', 'Tomate pera', 2, 2.5, 'kg', 15, TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES (7, 'Pescado', 'Merluza', 3, 8, 'kg', 10, TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES (8, 'Queso', 'Queso manchego', 4, 12, 'kg', 5, TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES (9, 'Pimienta', 'Pimienta negra', 5, 3, 'kg', 50, TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);
INSERT INTO ingredients (id, name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES (10, 'Naranja', 'Naranja de mesa', 1, 1.8, 'kg', 20, TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);

-- Datos de la tabla inventory_families
INSERT INTO inventory_families (id, name, description, created_at) VALUES (1, 'Congelador', 'Productos almacenados en congelador', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory_families (id, name, description, created_at) VALUES (2, 'Cámara de frío', 'Productos almacenados en cámaras de frío', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory_families (id, name, description, created_at) VALUES (3, 'Seco', 'Productos almacenados en seco', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory_families (id, name, description, created_at) VALUES (4, 'Productos de limpieza', 'Productos de limpieza y mantenimiento', '2025-04-17T18:54:41+00:00');

-- Datos de la tabla inventory_subfamilies
INSERT INTO inventory_subfamilies (id, family_id, name, description, created_at) VALUES (1, 2, 'Cámara de carne', 'Cámara específica para almacenamiento de carnes', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory_subfamilies (id, family_id, name, description, created_at) VALUES (2, 2, 'Cámara de pescado', 'Cámara específica para almacenamiento de pescados', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory_subfamilies (id, family_id, name, description, created_at) VALUES (3, 2, 'Cámara de productos terminados', 'Cámara para productos terminados', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory_subfamilies (id, family_id, name, description, created_at) VALUES (4, 2, 'Cámara de frutas y verduras', 'Cámara específica para frutas y verduras', '2025-04-17T18:54:41+00:00');

-- Datos de la tabla inventory
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES (2, 2, 2, 4, 20, 1.5, '2025-05-02', 'Lote456', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES (3, 3, 1, NULL, 100, 4, '2025-06-16', 'Lote789', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES (4, 4, 4, NULL, 150, 0.8, '2025-05-07', 'Lote101', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES (5, 5, 3, NULL, 500, 0.3, '2026-04-17', 'Lote112', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES (6, 6, 2, 4, 30, 2, '2025-04-27', 'Lote113', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES (7, 7, 1, NULL, 25, 6.5, '2025-06-01', 'Lote114', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES (9, 9, 3, NULL, 200, 2.5, '2025-10-14', 'Lote116', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES (10, 10, 2, 4, 40, 1.2, '2025-05-12', 'Lote117', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES (8, 8, 2, 3, 16, 10, '2025-05-17', 'Lote115', '2025-04-17T18:54:41+00:00');
INSERT INTO inventory (id, ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES (1, 1, 2, 4, 50, 1, '2025-05-17', 'Lote123', '2025-04-17T18:54:41+00:00');

-- Datos de la tabla inventory_movements
INSERT INTO inventory_movements (id, ingredient_id, quantity, movement_type, reason, admin_user_id, created_at) VALUES (1, 1, -5, 'Salida', 'Venta a cliente', 1, '2025-04-17T18:54:42+00:00');
INSERT INTO inventory_movements (id, ingredient_id, quantity, movement_type, reason, admin_user_id, created_at) VALUES (2, 2, 10, 'Entrada', 'Compra a proveedor', 1, '2025-04-17T18:54:42+00:00');
INSERT INTO inventory_movements (id, ingredient_id, quantity, movement_type, reason, admin_user_id, created_at) VALUES (3, 3, -20, 'Salida', 'Uso en cocina', 1, '2025-04-17T18:54:42+00:00');
INSERT INTO inventory_movements (id, ingredient_id, quantity, movement_type, reason, admin_user_id, created_at) VALUES (4, 4, 50, 'Entrada', 'Reposición de stock', 1, '2025-04-17T18:54:42+00:00');
INSERT INTO inventory_movements (id, ingredient_id, quantity, movement_type, reason, admin_user_id, created_at) VALUES (5, 5, -10, 'Salida', 'Uso en preparación', 1, '2025-04-17T18:54:42+00:00');

-- Datos de la tabla suppliers
INSERT INTO suppliers (id, name, contact_person, email, phone, address, active, created_at, updated_at) VALUES (1, 'Frutas Hermanos García', 'Juan García', 'juan@frutasgarcia.com', '600111222', 'Calle Mayor, 123', TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00');
INSERT INTO suppliers (id, name, contact_person, email, phone, address, active, created_at, updated_at) VALUES (2, 'Verduras La Huerta', 'María López', 'maria@lahuerta.com', '611222333', 'Avenida del Campo, 456', TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00');
INSERT INTO suppliers (id, name, contact_person, email, phone, address, active, created_at, updated_at) VALUES (4, 'Lácteos La Vaquita', 'Ana Sánchez', 'ana@lavaquita.com', '633444555', 'Carretera de la Leche, 101', TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00');
INSERT INTO suppliers (id, name, contact_person, email, phone, address, active, created_at, updated_at) VALUES (5, 'Especias El Sabor', 'Luis Rodríguez', 'luis@elsabor.com', '644555666', 'Calle de las Especias, 112', TRUE, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00');
INSERT INTO suppliers (id, name, contact_person, email, phone, address, active, created_at, updated_at) VALUES (6, 'Mariscos González', 'Gonzalez', 'mariscos@gonzalez.com', '675321212', 'Calle Sevilla 31', TRUE, '2025-09-21T08:54:24.604321+00:00', '2025-09-21T08:54:24.604321+00:00');
INSERT INTO suppliers (id, name, contact_person, email, phone, address, active, created_at, updated_at) VALUES (7, 'Mercadona', 'Juan Roig', 'mercadona@mercadona.es', '666666666', 'Calle Bellavista', FALSE, '2025-09-21T08:57:50.266495+00:00', '2025-09-21T08:58:06.541746+00:00');
INSERT INTO suppliers (id, name, contact_person, email, phone, address, active, created_at, updated_at) VALUES (3, 'Carnes El Corral', 'Pedro Martínez', 'pedro@elcorral.com', '622333444', 'Plaza de la Carne, 78', TRUE, '2025-04-17T18:54:41+00:00', '2025-09-21T09:20:52.987306+00:00');

-- Datos de la tabla supplier_ingredients
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (1, 1, 1, 1.2, 'Manzanas de temporada', '2025-04-17T18:54:42+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (2, 2, 2, 1.8, 'Lechugas frescas', '2025-04-17T18:54:42+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (4, 4, 4, 1, 'Leche entera pasteurizada', '2025-04-17T18:54:42+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (5, 5, 5, 0.4, 'Sal fina de mesa', '2025-04-17T18:54:42+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (6, 1, 10, 1.5, 'Naranjas de temporada', '2025-04-17T18:54:42+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (7, 2, 6, 2, 'Tomates pera', '2025-04-17T18:54:42+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (9, 4, 8, 10, 'Queso manchego curado', '2025-04-17T18:54:42+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (10, 5, 9, 2.5, 'Pimienta negra molida', '2025-04-17T18:54:42+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (12, 6, 4, 1, '', '2025-09-21T08:55:49.588505+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (8, 3, 7, 6, 'Merluza fresca pa ti', '2025-04-17T18:54:42+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (3, 3, 3, 5.5, 'Pechugas sin hueso', '2025-04-17T18:54:42+00:00');
INSERT INTO supplier_ingredients (id, supplier_id, ingredient_id, supplier_price, notes, created_at) VALUES (13, 3, 2, 1.96, '', '2025-09-21T09:33:20.075015+00:00');

-- Datos de la tabla purchase_orders
INSERT INTO purchase_orders (id, supplier_id, order_date, expected_delivery, status, total_amount, notes, created_at) VALUES (1, 1, '2025-04-17', '2025-04-19', 'Pendiente', 60, NULL, '2025-04-17T18:54:42+00:00');
INSERT INTO purchase_orders (id, supplier_id, order_date, expected_delivery, status, total_amount, notes, created_at) VALUES (2, 2, '2025-04-17', '2025-04-19', 'Pendiente', 36, NULL, '2025-04-17T18:54:42+00:00');
INSERT INTO purchase_orders (id, supplier_id, order_date, expected_delivery, status, total_amount, notes, created_at) VALUES (3, 3, '2025-04-17', '2025-04-19', 'Pendiente', 450, NULL, '2025-04-17T18:54:42+00:00');
INSERT INTO purchase_orders (id, supplier_id, order_date, expected_delivery, status, total_amount, notes, created_at) VALUES (4, 4, '2025-04-17', '2025-04-19', 'Pendiente', 100, NULL, '2025-04-17T18:54:42+00:00');
INSERT INTO purchase_orders (id, supplier_id, order_date, expected_delivery, status, total_amount, notes, created_at) VALUES (5, 5, '2025-04-17', '2025-04-19', 'Pendiente', 200, NULL, '2025-04-17T18:54:42+00:00');

-- Datos de la tabla purchase_order_items
INSERT INTO purchase_order_items (id, order_id, ingredient_id, quantity, unit_price, total_price, created_at) VALUES (1, 1, 1, 50, 1.2, 60, '2025-04-17T18:54:42+00:00');
INSERT INTO purchase_order_items (id, order_id, ingredient_id, quantity, unit_price, total_price, created_at) VALUES (2, 2, 2, 20, 1.8, 36, '2025-04-17T18:54:42+00:00');
INSERT INTO purchase_order_items (id, order_id, ingredient_id, quantity, unit_price, total_price, created_at) VALUES (3, 3, 3, 100, 4.5, 450, '2025-04-17T18:54:42+00:00');
INSERT INTO purchase_order_items (id, order_id, ingredient_id, quantity, unit_price, total_price, created_at) VALUES (4, 4, 4, 100, 1, 100, '2025-04-17T18:54:42+00:00');
INSERT INTO purchase_order_items (id, order_id, ingredient_id, quantity, unit_price, total_price, created_at) VALUES (5, 5, 5, 500, 0.4, 200, '2025-04-17T18:54:42+00:00');

-- =============================================
-- CONFIGURACIÓN ADICIONAL
-- =============================================

-- Restablecer secuencias
SELECT setval('admin_usuarios_id_seq', (SELECT MAX(id) FROM admin_usuarios));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('ingredients_id_seq', (SELECT MAX(id) FROM ingredients));
SELECT setval('inventory_families_id_seq', (SELECT MAX(id) FROM inventory_families));
SELECT setval('inventory_subfamilies_id_seq', (SELECT MAX(id) FROM inventory_subfamilies));
SELECT setval('inventory_id_seq', (SELECT MAX(id) FROM inventory));
SELECT setval('inventory_movements_id_seq', (SELECT MAX(id) FROM inventory_movements));
SELECT setval('suppliers_id_seq', (SELECT MAX(id) FROM suppliers));
SELECT setval('supplier_ingredients_id_seq', (SELECT MAX(id) FROM supplier_ingredients));
SELECT setval('purchase_orders_id_seq', (SELECT MAX(id) FROM purchase_orders));
SELECT setval('purchase_order_items_id_seq', (SELECT MAX(id) FROM purchase_order_items));

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_ingredient ON inventory(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_ingredient ON inventory_movements(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_supplier_ingredients_supplier ON supplier_ingredients(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_order ON purchase_order_items(order_id);

-- Comentarios finales
COMMENT ON TABLE admin_usuarios IS 'Usuarios administradores del sistema';
COMMENT ON TABLE categories IS 'Categorías de ingredientes';
COMMENT ON TABLE ingredients IS 'Ingredientes con información de alérgenos';
COMMENT ON TABLE inventory IS 'Inventario actual de ingredientes';
COMMENT ON TABLE suppliers IS 'Proveedores de ingredientes';
COMMENT ON TABLE purchase_orders IS 'Órdenes de compra a proveedores';
