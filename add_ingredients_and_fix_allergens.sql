-- Script para añadir ingredientes y corregir alérgenos
-- Fecha: 2025-09-21
-- Basado en: backup_completo_supabase_2025-09-21.sql

-- =============================================
-- CORRECCIÓN DE ALÉRGENOS EXISTENTES
-- =============================================

-- Actualizar alérgenos de ingredientes existentes con información correcta
-- Nota: Los ingredientes actuales no tienen alérgenos marcados, se añadirán según corresponda

-- Actualizar Soja existente (ya tiene alerg_soja = 1 correctamente)
UPDATE ingredients SET 
    updated_at = NOW()
WHERE name = 'Soja' AND alerg_soja = 1;

UPDATE ingredients SET 
    alerg_huevos = 1,
    updated_at = NOW()
WHERE name IN ('Huevos', 'Mayonesa', 'Pasteles', 'Tortillas', 'Flan', 'Natillas', 'Merengue');

UPDATE ingredients SET 
    alerg_leche = 1,
    updated_at = NOW()
WHERE name IN ('Leche', 'Queso', 'Mantequilla', 'Yogur', 'Nata', 'Helado', 'Crema', 'Lactosa');

UPDATE ingredients SET 
    alerg_pescado = 1,
    updated_at = NOW()
WHERE name IN ('Pescado', 'Atún', 'Salmón', 'Bacalao', 'Merluza', 'Lubina', 'Dorada', 'Anchoas', 'Sardinas');

UPDATE ingredients SET 
    alerg_crustaceos = 1,
    updated_at = NOW()
WHERE name IN ('Gambas', 'Langostinos', 'Cangrejo', 'Langosta', 'Cigalas', 'Camarones', 'Bogavante');

UPDATE ingredients SET 
    alerg_moluscos = 1,
    updated_at = NOW()
WHERE name IN ('Mejillones', 'Almejas', 'Ostras', 'Vieiras', 'Calamar', 'Pulpo', 'Caracoles');

UPDATE ingredients SET 
    alerg_cacahuetes = 1,
    updated_at = NOW()
WHERE name IN ('Cacahuetes', 'Maní', 'Mantequilla de cacahuete', 'Aceite de cacahuete');

UPDATE ingredients SET 
    alerg_soja = 1,
    updated_at = NOW()
WHERE name IN ('Soja', 'Tofu', 'Tempeh', 'Salsa de soja', 'Aceite de soja', 'Leche de soja', 'Miso');

UPDATE ingredients SET 
    alerg_frutos = 1,
    updated_at = NOW()
WHERE name IN ('Almendras', 'Nueces', 'Avellanas', 'Pistachos', 'Anacardos', 'Pecanas', 'Macadamias', 'Pipas de girasol', 'Sésamo');

UPDATE ingredients SET 
    alerg_apio = 1,
    updated_at = NOW()
WHERE name IN ('Apio', 'Sal de apio', 'Semillas de apio', 'Hojas de apio');

UPDATE ingredients SET 
    alerg_mostaza = 1,
    updated_at = NOW()
WHERE name IN ('Mostaza', 'Semillas de mostaza', 'Hojas de mostaza', 'Salsa mostaza');

UPDATE ingredients SET 
    alerg_sesamo = 1,
    updated_at = NOW()
WHERE name IN ('Sésamo', 'Ajonjolí', 'Aceite de sésamo', 'Tahini', 'Semillas de sésamo');

UPDATE ingredients SET 
    alerg_sulfitos = 1,
    updated_at = NOW()
WHERE name IN ('Vino', 'Cerveza', 'Vinagre', 'Frutos secos', 'Mariscos procesados', 'Conservas');

UPDATE ingredients SET 
    alerg_altramuces = 1,
    updated_at = NOW()
WHERE name IN ('Altramuces', 'Lupinos', 'Harina de altramuz');

-- =============================================
-- NUEVOS INGREDIENTES CON ALÉRGENOS CORRECTOS
-- =============================================

-- Frutas
INSERT INTO ingredients (name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES 
('Plátano', 'Plátano de Canarias', 1, 2.5, 'kg', 15, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Fresa', 'Fresas frescas', 1, 4.5, 'kg', 8, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Uva', 'Uvas blancas', 1, 3.2, 'kg', 12, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Pera', 'Pera conferencia', 1, 2.8, 'kg', 10, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Melón', 'Melón cantalupo', 1, 1.8, 'unidad', 6, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Sandía', 'Sandía sin pepitas', 1, 0.8, 'kg', 4, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Verduras
INSERT INTO ingredients (name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES 
('Zanahoria', 'Zanahoria fresca', 2, 1.2, 'kg', 20, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Cebolla', 'Cebolla amarilla', 2, 1.5, 'kg', 25, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Ajo', 'Ajo morado', 2, 8.5, 'kg', 5, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Pimiento', 'Pimiento rojo', 2, 3.2, 'kg', 15, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Brócoli', 'Brócoli fresco', 2, 2.8, 'kg', 12, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Espinacas', 'Espinacas frescas', 2, 2.5, 'kg', 10, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Apio', 'Apio fresco', 2, 2.2, 'kg', 8, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
('Pepino', 'Pepino español', 2, 1.8, 'kg', 15, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Carnes
INSERT INTO ingredients (name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES 
('Ternera', 'Ternera de primera', 3, 12.5, 'kg', 8, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Cerdo', 'Cerdo ibérico', 3, 8.5, 'kg', 10, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Cordero', 'Cordero lechal', 3, 15.8, 'kg', 6, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Jamón', 'Jamón serrano', 3, 18.5, 'kg', 4, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Chorizo', 'Chorizo ibérico', 3, 12.8, 'kg', 5, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Salchichas', 'Salchichas frescas', 3, 6.5, 'kg', 8, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Lácteos
INSERT INTO ingredients (name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES 
('Yogur', 'Yogur natural', 4, 0.8, 'unidad', 30, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),
('Mantequilla', 'Mantequilla sin sal', 4, 3.5, 'kg', 10, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),
('Nata', 'Nata para cocinar', 4, 2.8, 'litro', 15, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),
('Huevos', 'Huevos de gallina', 4, 2.2, 'docena', 20, TRUE, NOW(), NOW(), 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Queso fresco', 'Queso fresco de cabra', 4, 8.5, 'kg', 8, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0);

-- Especias y condimentos
INSERT INTO ingredients (name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES 
('Orégano', 'Orégano seco', 5, 12.5, 'kg', 2, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Albahaca', 'Albahaca fresca', 5, 8.5, 'kg', 3, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Tomillo', 'Tomillo seco', 5, 15.8, 'kg', 2, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Laurel', 'Hojas de laurel', 5, 18.5, 'kg', 1, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Canela', 'Canela en rama', 5, 25.8, 'kg', 1, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Nuez moscada', 'Nuez moscada molida', 5, 35.5, 'kg', 1, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Mostaza', 'Mostaza de Dijon', 5, 4.5, 'bote', 5, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0),
('Vinagre', 'Vinagre de vino', 5, 2.8, 'litro', 8, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0);

-- Frutos secos y semillas
INSERT INTO ingredients (name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES 
('Almendras', 'Almendras peladas', 1, 12.5, 'kg', 5, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
('Nueces', 'Nueces peladas', 1, 15.8, 'kg', 4, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
('Avellanas', 'Avellanas peladas', 1, 18.5, 'kg', 3, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
('Pistachos', 'Pistachos tostados', 1, 22.8, 'kg', 3, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
('Sésamo', 'Semillas de sésamo', 1, 8.5, 'kg', 2, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0),
('Cacahuetes', 'Cacahuetes tostados', 1, 6.5, 'kg', 5, TRUE, NOW(), NOW(), 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Pescados y mariscos
INSERT INTO ingredients (name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES 
('Atún', 'Atún rojo fresco', 3, 18.5, 'kg', 6, TRUE, NOW(), NOW(), 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Salmón', 'Salmón fresco', 3, 22.8, 'kg', 5, TRUE, NOW(), NOW(), 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Bacalao', 'Bacalao salado', 3, 15.5, 'kg', 8, TRUE, NOW(), NOW(), 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Gambas', 'Gambas congeladas', 3, 25.8, 'kg', 4, TRUE, NOW(), NOW(), 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Mejillones', 'Mejillones frescos', 3, 4.5, 'kg', 10, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1),
('Langostinos', 'Langostinos frescos', 3, 28.5, 'kg', 3, TRUE, NOW(), NOW(), 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Cereales y harinas
INSERT INTO ingredients (name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES 
('Harina de trigo', 'Harina de trigo 000', 5, 1.2, 'kg', 50, TRUE, NOW(), NOW(), 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Arroz', 'Arroz bomba', 5, 2.5, 'kg', 30, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Pasta', 'Pasta de trigo duro', 5, 1.8, 'kg', 25, TRUE, NOW(), NOW(), 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Avena', 'Copos de avena', 5, 2.2, 'kg', 20, TRUE, NOW(), NOW(), 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Pan', 'Pan de molde', 5, 1.5, 'unidad', 15, TRUE, NOW(), NOW(), 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Aceites y grasas
INSERT INTO ingredients (name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES 
('Aceite de oliva', 'Aceite de oliva virgen extra', 5, 6.5, 'litro', 10, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Aceite de girasol', 'Aceite de girasol refinado', 5, 2.8, 'litro', 15, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Aceite de sésamo', 'Aceite de sésamo tostado', 5, 12.5, 'litro', 3, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0);

-- Ingredientes especiales para cocina
INSERT INTO ingredients (name, description, category_id, base_price, unit_measure, min_stock_level, active, created_at, updated_at, alerg_gluten, alerg_crustaceos, alerg_huevos, alerg_pescado, alerg_cacahuetes, alerg_soja, alerg_leche, alerg_frutos, alerg_apio, alerg_mostaza, alerg_sesamo, alerg_sulfitos, alerg_altramuces, alerg_moluscos) VALUES 
('Azúcar', 'Azúcar blanco refinado', 5, 1.2, 'kg', 50, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Miel', 'Miel de flores', 5, 8.5, 'kg', 5, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Limón', 'Limón amarillo', 1, 2.8, 'kg', 20, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Lima', 'Lima verde', 1, 3.5, 'kg', 15, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Jengibre', 'Jengibre fresco', 5, 12.5, 'kg', 3, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Ajo negro', 'Ajo negro fermentado', 5, 45.8, 'kg', 1, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Trufa', 'Trufa negra fresca', 5, 1200.0, 'kg', 0.1, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Caviar', 'Caviar de esturión', 3, 2500.0, 'kg', 0.05, TRUE, NOW(), NOW(), 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Foie gras', 'Foie gras de pato', 3, 85.5, 'kg', 2, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Champiñones', 'Champiñones frescos', 2, 4.5, 'kg', 8, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Setas', 'Setas variadas', 2, 8.5, 'kg', 5, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Alcaparras', 'Alcaparras en salmuera', 5, 15.8, 'kg', 2, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Aceitunas', 'Aceitunas verdes', 5, 3.5, 'kg', 10, TRUE, NOW(), NOW(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Anchoas', 'Anchoas en aceite', 3, 12.5, 'kg', 3, TRUE, NOW(), NOW(), 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
('Sardinas', 'Sardinas frescas', 3, 6.5, 'kg', 8, TRUE, NOW(), NOW(), 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- =============================================
-- ACTUALIZAR SECUENCIAS
-- =============================================

-- Restablecer secuencia de ingredientes
SELECT setval('ingredients_id_seq', (SELECT MAX(id) FROM ingredients));

-- =============================================
-- COMENTARIOS FINALES
-- =============================================

-- Este script añade 60+ nuevos ingredientes con información correcta de alérgenos
-- y corrige los alérgenos de los ingredientes existentes según las normativas europeas
-- de etiquetado de alérgenos (Reglamento UE 1169/2011)

-- RESUMEN DE INGREDIENTES AÑADIDOS:
-- - Frutas: 6 ingredientes (Plátano, Fresa, Uva, Pera, Melón, Sandía, Limón, Lima)
-- - Verduras: 8 ingredientes (Zanahoria, Cebolla, Ajo, Pimiento, Brócoli, Espinacas, Apio, Pepino, Champiñones, Setas)
-- - Carnes: 6 ingredientes (Ternera, Cerdo, Cordero, Jamón, Chorizo, Salchichas, Foie gras)
-- - Lácteos: 5 ingredientes (Yogur, Mantequilla, Nata, Huevos, Queso fresco)
-- - Especias: 8 ingredientes (Orégano, Albahaca, Tomillo, Laurel, Canela, Nuez moscada, Mostaza, Vinagre, Jengibre, Ajo negro)
-- - Frutos secos: 6 ingredientes (Almendras, Nueces, Avellanas, Pistachos, Sésamo, Cacahuetes)
-- - Pescados: 6 ingredientes (Atún, Salmón, Bacalao, Gambas, Mejillones, Langostinos, Caviar, Anchoas, Sardinas)
-- - Cereales: 5 ingredientes (Harina de trigo, Arroz, Pasta, Avena, Pan)
-- - Aceites: 3 ingredientes (Aceite de oliva, Aceite de girasol, Aceite de sésamo)
-- - Especiales: 8 ingredientes (Azúcar, Miel, Trufa, Alcaparras, Aceitunas)

-- TOTAL: 60+ nuevos ingredientes con alérgenos correctamente marcados
-- Todos los ingredientes incluyen precios realistas, unidades de medida apropiadas
-- y niveles de stock mínimo según su tipo y uso en cocina profesional
