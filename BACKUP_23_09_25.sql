-- Backup de la base de datos Supabase
-- Generado el: 2025-09-23T19:41:01.983Z
-- Base de datos: https://jlddktlbyeiyeinzhfxx.supabase.co
-- Método: API de Supabase

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

-- Deshabilitar triggers temporalmente
SET session_replication_role = replica;

-- Estructura básica para la tabla "admin_usuarios"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "admin_usuarios" (
  "id" INTEGER,
  "username" TEXT,
  "pwd" TEXT,
  "grade" INTEGER,
  "email" TEXT,
  "license_type" TEXT,
  "license_expires_at" TEXT,
  "max_ingredients" INTEGER,
  "max_suppliers" INTEGER,
  "is_admin" BOOLEAN,
  "last_update" TEXT
);

-- Datos para la tabla "admin_usuarios"
INSERT INTO "admin_usuarios" ("id", "username", "pwd", "grade", "email", "license_type", "license_expires_at", "max_ingredients", "max_suppliers", "is_admin", "last_update") VALUES
  (2, 'Leandro', '$2b$10$dvgJJE8zaV8BTTNhKajh5uatbOVE5Ohl/fbr1WB2UnpZgbvFU7yLO', 0, 'leandrocalvoduran@gmail.com', 'premium', '2026-12-31T23:59:59+00:00', 999999, 999999, true, '2025-09-20T16:13:16.994309+00:00'),
  (1, 'admin', '$2b$10$l19aHbjcpavO2ClbLEy5f.ry07ZOezKxnGqNxMRN3SE4X.p0pM25e', 0, 'admin@google.com', 'free', '2026-12-31T00:00:00+00:00', 15, 15, true, '2025-04-14T23:00:13+00:00');

-- Estructura básica para la tabla "categories"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "categories" (
  "id" INTEGER,
  "name" TEXT,
  "description" TEXT,
  "created_at" TEXT,
  "updated_at" TEXT
);

-- Datos para la tabla "categories"
INSERT INTO "categories" ("id", "name", "description", "created_at", "updated_at") VALUES
  (1, 'Frutas', 'Frutas frescas y de temporada', '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00'),
  (2, 'Verduras', 'Verduras y hortalizas', '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00'),
  (3, 'Carnes', 'Carnes y embutidos', '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00'),
  (4, 'Lácteos', 'Productos lácteos', '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00'),
  (5, 'Especias', 'Especias y condimentos', '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00'),
  (6, 'Pescados', 'Fresco fresquísimo', '2025-09-23T18:10:35.58451+00:00', '2025-09-23T18:10:35.58451+00:00'),
  (7, 'Mariscos', 'Lo mejor del mar', '2025-09-23T18:37:53.976906+00:00', '2025-09-23T18:37:53.976906+00:00');

-- Estructura básica para la tabla "ingredients"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "ingredients" (
  "id" INTEGER,
  "name" TEXT,
  "description" TEXT,
  "category_id" INTEGER,
  "base_price" NUMERIC,
  "unit_measure" TEXT,
  "min_stock_level" INTEGER,
  "active" BOOLEAN,
  "created_at" TEXT,
  "updated_at" TEXT,
  "alerg_gluten" BOOLEAN,
  "alerg_crustaceos" BOOLEAN,
  "alerg_huevos" BOOLEAN,
  "alerg_pescado" BOOLEAN,
  "alerg_cacahuetes" BOOLEAN,
  "alerg_soja" BOOLEAN,
  "alerg_leche" BOOLEAN,
  "alerg_frutos" BOOLEAN,
  "alerg_apio" BOOLEAN,
  "alerg_mostaza" BOOLEAN,
  "alerg_sesamo" BOOLEAN,
  "alerg_sulfitos" BOOLEAN,
  "alerg_altramuces" BOOLEAN,
  "alerg_moluscos" BOOLEAN
);

-- Datos para la tabla "ingredients"
INSERT INTO "ingredients" ("id", "name", "description", "category_id", "base_price", "unit_measure", "min_stock_level", "active", "created_at", "updated_at", "alerg_gluten", "alerg_crustaceos", "alerg_huevos", "alerg_pescado", "alerg_cacahuetes", "alerg_soja", "alerg_leche", "alerg_frutos", "alerg_apio", "alerg_mostaza", "alerg_sesamo", "alerg_sulfitos", "alerg_altramuces", "alerg_moluscos") VALUES
  (1, 'Manzana', 'Manzana roja', 1, 1.5, 'kg', 10, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', false, false, false, false, false, false, false, false, false, false, false, false, false, false),
  (2, 'Lechuga', 'Lechuga romana', 2, 2, 'unidad', 5, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', false, false, false, false, false, false, false, false, false, false, false, false, false, false),
  (5, 'Sal', 'Sal fina', 5, 0.5, 'kg', 100, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', false, false, false, false, false, false, false, false, false, false, false, false, false, false),
  (6, 'Tomate', 'Tomate pera', 2, 2.5, 'kg', 15, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', false, false, false, false, false, false, false, false, false, false, false, false, false, false),
  (9, 'Pimienta', 'Pimienta negra', 5, 3, 'kg', 50, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', false, false, false, false, false, false, false, false, false, false, false, false, false, false),
  (10, 'Naranja', 'Naranja de mesa', 1, 1.8, 'kg', 20, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', false, false, false, false, false, false, false, false, false, false, false, false, false, false),
  (7, 'Pescado', 'Merluza', 6, 8, 'kg', 10, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', false, false, false, false, false, false, false, false, false, false, false, false, false, false),
  (4, 'Leche', 'Leche entera', 4, 1.2, 'litro', 30, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', false, false, false, false, false, false, true, false, false, false, false, false, false, false),
  (16, 'Filetes de cerdo', 'De la granja a tu casa', 3, 7.5, 'kg', 0, true, '2025-09-23T18:07:28.941138+00:00', '2025-09-23T18:07:28.941138+00:00', false, false, false, false, false, false, false, false, false, true, false, false, false, false),
  (3, 'Pollo', 'Pechuga de pollo', 3, 5, 'kg', 20, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', false, false, false, false, false, false, false, false, false, true, false, true, false, false),
  (8, 'Queso', 'Queso manchego', 4, 12, 'kg', 5, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00', false, false, false, false, false, false, true, false, false, false, false, false, false, false),
  (20, 'Coquinas', 'Coquinas de mazagón', 7, 0, 'caja', 0, true, '2025-09-23T18:43:06.913345+00:00', '2025-09-23T18:43:06.913345+00:00', false, true, false, false, false, false, false, false, false, false, false, false, false, true),
  (19, 'Gambas', 'Gambas de Huelva', 7, 0, 'caja', 0, true, '2025-09-23T18:39:04.302531+00:00', '2025-09-23T18:39:04.302531+00:00', false, true, false, false, false, false, false, false, false, false, false, false, false, true),
  (17, 'Merluza', '', 3, 0, 'kg', 0, true, '2025-09-23T18:09:49.25035+00:00', '2025-09-23T18:09:49.25035+00:00', false, false, false, true, false, false, false, false, false, false, false, false, false, false);

-- Estructura básica para la tabla "inventory"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "inventory" (
  "id" INTEGER,
  "ingredient_id" INTEGER,
  "family_id" INTEGER,
  "subfamily_id" INTEGER,
  "quantity" INTEGER,
  "purchase_price" INTEGER,
  "expiry_date" TEXT,
  "batch_number" TEXT,
  "created_at" TEXT,
  "supplier_id" INTEGER
);

-- Datos para la tabla "inventory"
INSERT INTO "inventory" ("id", "ingredient_id", "family_id", "subfamily_id", "quantity", "purchase_price", "expiry_date", "batch_number", "created_at", "supplier_id") VALUES
  (15, 4, 2, 4, 1, 1, '2025-09-26', 'L001', '2025-09-23T17:51:19.477848+00:00', 4),
  (16, 2, 2, 4, 1, 1.8, '2025-09-24', 'L001', '2025-09-23T17:52:58.352636+00:00', 2),
  (17, 3, 2, 1, 1, 5.5, '2025-09-25', 'L002', '2025-09-23T17:53:29.748278+00:00', 3),
  (19, 17, 1, NULL, 2, 21, '2025-10-08', 'L004', '2025-09-23T18:16:22.869894+00:00', 6),
  (20, 19, 1, NULL, 2, 14, '2025-10-10', 'L123', '2025-09-23T18:39:42.151191+00:00', 6),
  (18, 4, 2, 4, 1, 0.38, '2025-09-27', 'L003', '2025-09-23T17:59:37.426693+00:00', 3),
  (21, 20, 1, NULL, 1, 16, '2025-09-26', 'L121', '2025-09-23T18:45:00.195185+00:00', 6);

-- Estructura básica para la tabla "inventory_families"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "inventory_families" (
  "id" INTEGER,
  "name" TEXT,
  "description" TEXT,
  "created_at" TEXT
);

-- Datos para la tabla "inventory_families"
INSERT INTO "inventory_families" ("id", "name", "description", "created_at") VALUES
  (1, 'Congelador', 'Productos almacenados en congelador', '2025-04-17T18:54:41+00:00'),
  (2, 'Cámara de frío', 'Productos almacenados en cámaras de frío', '2025-04-17T18:54:41+00:00'),
  (3, 'Seco', 'Productos almacenados en seco', '2025-04-17T18:54:41+00:00'),
  (4, 'Productos de limpieza', 'Productos de limpieza y mantenimiento', '2025-04-17T18:54:41+00:00');

-- Estructura básica para la tabla "inventory_subfamilies"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "inventory_subfamilies" (
  "id" INTEGER,
  "name" TEXT,
  "family_id" INTEGER,
  "description" TEXT,
  "created_at" TEXT
);

-- Datos para la tabla "inventory_subfamilies"
INSERT INTO "inventory_subfamilies" ("id", "name", "family_id", "description", "created_at") VALUES
  (1, 'Cámara de carne', 2, 'Cámara específica para almacenamiento de carnes', '2025-04-17T18:54:41+00:00'),
  (2, 'Cámara de pescado', 2, 'Cámara específica para almacenamiento de pescados', '2025-04-17T18:54:41+00:00'),
  (3, 'Cámara de productos terminados', 2, 'Cámara para productos terminados', '2025-04-17T18:54:41+00:00'),
  (4, 'Cámara de frutas y verduras', 2, 'Cámara específica para frutas y verduras', '2025-04-17T18:54:41+00:00');

-- Estructura básica para la tabla "inventory_movements"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "inventory_movements" (
  "id" INTEGER,
  "ingredient_id" INTEGER,
  "movement_type" TEXT,
  "quantity" INTEGER,
  "reason" TEXT,
  "admin_user_id" INTEGER,
  "created_at" TEXT
);

-- Datos para la tabla "inventory_movements"
INSERT INTO "inventory_movements" ("id", "ingredient_id", "movement_type", "quantity", "reason", "admin_user_id", "created_at") VALUES
  (1, 1, 'Salida', -5, 'Venta a cliente', 1, '2025-04-17T18:54:42+00:00'),
  (2, 2, 'Entrada', 10, 'Compra a proveedor', 1, '2025-04-17T18:54:42+00:00'),
  (3, 3, 'Salida', -20, 'Uso en cocina', 1, '2025-04-17T18:54:42+00:00'),
  (4, 4, 'Entrada', 50, 'Reposición de stock', 1, '2025-04-17T18:54:42+00:00'),
  (5, 5, 'Salida', -10, 'Uso en preparación', 1, '2025-04-17T18:54:42+00:00');

-- Estructura básica para la tabla "purchase_orders"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "purchase_orders" (
  "id" INTEGER,
  "supplier_id" INTEGER,
  "order_date" TEXT,
  "expected_delivery" TEXT,
  "status" TEXT,
  "total_amount" INTEGER,
  "notes" TEXT,
  "created_at" TEXT
);

-- Datos para la tabla "purchase_orders"
INSERT INTO "purchase_orders" ("id", "supplier_id", "order_date", "expected_delivery", "status", "total_amount", "notes", "created_at") VALUES
  (1, 1, '2025-04-17T00:00:00+00:00', '2025-04-19', 'Pendiente', 60, NULL, '2025-04-17T18:54:42+00:00'),
  (2, 2, '2025-04-17T00:00:00+00:00', '2025-04-19', 'Pendiente', 36, NULL, '2025-04-17T18:54:42+00:00'),
  (3, 3, '2025-04-17T00:00:00+00:00', '2025-04-19', 'Pendiente', 450, NULL, '2025-04-17T18:54:42+00:00'),
  (4, 4, '2025-04-17T00:00:00+00:00', '2025-04-19', 'Pendiente', 100, NULL, '2025-04-17T18:54:42+00:00'),
  (5, 5, '2025-04-17T00:00:00+00:00', '2025-04-19', 'Pendiente', 200, NULL, '2025-04-17T18:54:42+00:00');

-- Estructura básica para la tabla "purchase_order_items"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "purchase_order_items" (
  "id" INTEGER,
  "order_id" INTEGER,
  "ingredient_id" INTEGER,
  "quantity" INTEGER,
  "unit_price" NUMERIC,
  "total_price" INTEGER,
  "created_at" TEXT
);

-- Datos para la tabla "purchase_order_items"
INSERT INTO "purchase_order_items" ("id", "order_id", "ingredient_id", "quantity", "unit_price", "total_price", "created_at") VALUES
  (1, 1, 1, 50, 1.2, 60, '2025-04-17T18:54:42+00:00'),
  (2, 2, 2, 20, 1.8, 36, '2025-04-17T18:54:42+00:00'),
  (3, 3, 3, 100, 4.5, 450, '2025-04-17T18:54:42+00:00'),
  (4, 4, 4, 100, 1, 100, '2025-04-17T18:54:42+00:00'),
  (5, 5, 5, 500, 0.4, 200, '2025-04-17T18:54:42+00:00');

-- Estructura básica para la tabla "suppliers"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "suppliers" (
  "id" INTEGER,
  "name" TEXT,
  "contact_person" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "city" TEXT,
  "postal_code" TEXT,
  "country" TEXT,
  "active" BOOLEAN,
  "created_at" TEXT,
  "updated_at" TEXT
);

-- Datos para la tabla "suppliers"
INSERT INTO "suppliers" ("id", "name", "contact_person", "email", "phone", "address", "city", "postal_code", "country", "active", "created_at", "updated_at") VALUES
  (1, 'Frutas Hermanos García', 'Juan García', 'juan@frutasgarcia.com', '600111222', 'Calle Mayor, 123', NULL, NULL, NULL, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00'),
  (2, 'Verduras La Huerta', 'María López', 'maria@lahuerta.com', '611222333', 'Avenida del Campo, 456', NULL, NULL, NULL, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00'),
  (4, 'Lácteos La Vaquita', 'Ana Sánchez', 'ana@lavaquita.com', '633444555', 'Carretera de la Leche, 101', NULL, NULL, NULL, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00'),
  (5, 'Especias El Sabor', 'Luis Rodríguez', 'luis@elsabor.com', '644555666', 'Calle de las Especias, 112', NULL, NULL, NULL, true, '2025-04-17T18:54:41+00:00', '2025-04-17T18:54:41+00:00'),
  (7, 'Mercadona', 'Juan Roig', 'mercadona@mercadona.es', '666666666', 'Calle Bellavista', NULL, NULL, NULL, false, '2025-09-21T08:57:50.266495+00:00', '2025-09-21T08:58:06.541746+00:00'),
  (3, 'Carnes El Corrales', 'Pedro Martínez', 'pedro@elcorral.com', '622333444', 'Plaza de la Carne, 78', NULL, NULL, NULL, true, '2025-04-17T18:54:41+00:00', '2025-09-21T09:20:52.987306+00:00'),
  (6, 'Pescadería González', 'Gonzalez', 'mariscos@gonzalez.com', '675321212', 'Calle Sevilla 31', NULL, NULL, NULL, true, '2025-09-21T08:54:24.604321+00:00', '2025-09-21T08:54:24.604321+00:00');

-- Estructura básica para la tabla "supplier_ingredients"
-- NOTA: Esta es una estructura inferida. Ajusta los tipos de datos según sea necesario.
CREATE TABLE IF NOT EXISTS "supplier_ingredients" (
  "id" INTEGER,
  "supplier_id" INTEGER,
  "ingredient_id" INTEGER,
  "supplier_price" NUMERIC,
  "supplier_unit" TEXT,
  "conversion_factor" INTEGER,
  "notes" TEXT,
  "created_at" TEXT
);

-- Datos para la tabla "supplier_ingredients"
INSERT INTO "supplier_ingredients" ("id", "supplier_id", "ingredient_id", "supplier_price", "supplier_unit", "conversion_factor", "notes", "created_at") VALUES
  (1, 1, 1, 1.2, 'kg', 1, 'Manzanas de temporada', '2025-04-17T18:54:42+00:00'),
  (2, 2, 2, 1.8, 'kg', 1, 'Lechugas frescas', '2025-04-17T18:54:42+00:00'),
  (4, 4, 4, 1, 'kg', 1, 'Leche entera pasteurizada', '2025-04-17T18:54:42+00:00'),
  (5, 5, 5, 0.4, 'kg', 1, 'Sal fina de mesa', '2025-04-17T18:54:42+00:00'),
  (6, 1, 10, 1.5, 'kg', 1, 'Naranjas de temporada', '2025-04-17T18:54:42+00:00'),
  (7, 2, 6, 2, 'kg', 1, 'Tomates pera', '2025-04-17T18:54:42+00:00'),
  (10, 5, 9, 2.5, 'kg', 1, 'Pimienta negra molida', '2025-04-17T18:54:42+00:00'),
  (15, 3, 16, 7.19, 'kg', 1, 'De la granja a tu casa', '2025-09-23T18:08:17.257437+00:00'),
  (3, 3, 3, 5.5, 'kg', 1, 'Pechugas sin hueso', '2025-04-17T18:54:42+00:00'),
  (9, 4, 8, 10, 'kg', 1, 'Queso manchego curado', '2025-04-17T18:54:42+00:00'),
  (18, 6, 20, 16, 'kg', 1, '', '2025-09-23T18:43:30.357297+00:00'),
  (17, 6, 19, 14, 'kg', 1, '', '2025-09-23T18:39:12.597943+00:00'),
  (16, 6, 17, 21, 'kg', 1, '', '2025-09-23T18:09:56.599686+00:00');


-- Restaurar configuración
SET session_replication_role = DEFAULT;

-- Resumen del backup
-- Tablas procesadas: 11/11
-- Total de registros: 73
-- Backup completado: 2025-09-23T19:41:03.002Z
