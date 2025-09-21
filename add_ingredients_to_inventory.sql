-- Script para añadir los nuevos ingredientes al inventario
-- Fecha: 2025-09-21
-- Añade los ingredientes recién creados al inventario con cantidades iniciales

-- =============================================
-- AÑADIR INGREDIENTES AL INVENTARIO
-- =============================================

-- Frutas
INSERT INTO inventory (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES 
((SELECT id FROM ingredients WHERE name = 'Plátano'), 2, 4, 25, 2.0, '2025-10-15', 'PLA-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Fresa'), 2, 4, 15, 4.0, '2025-09-28', 'FRE-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Uva'), 2, 4, 20, 3.0, '2025-10-05', 'UVA-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Pera'), 2, 4, 18, 2.5, '2025-10-10', 'PER-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Melón'), 2, 4, 8, 1.5, '2025-09-25', 'MEL-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Sandía'), 2, 4, 6, 0.7, '2025-09-30', 'SAN-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Limón'), 2, 4, 30, 2.5, '2025-10-20', 'LIM-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Lima'), 2, 4, 25, 3.2, '2025-10-15', 'LIMA-001', NOW());

-- Verduras
INSERT INTO inventory (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES 
((SELECT id FROM ingredients WHERE name = 'Zanahoria'), 2, 4, 35, 1.0, '2025-10-12', 'ZAN-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Cebolla'), 2, 4, 40, 1.2, '2025-11-01', 'CEB-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Ajo'), 2, 4, 8, 7.5, '2025-12-15', 'AJO-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Pimiento'), 2, 4, 25, 2.8, '2025-10-08', 'PIM-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Brócoli'), 2, 4, 20, 2.5, '2025-09-26', 'BRO-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Espinacas'), 2, 4, 15, 2.2, '2025-09-24', 'ESP-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Apio'), 2, 4, 12, 2.0, '2025-10-05', 'API-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Pepino'), 2, 4, 25, 1.6, '2025-09-28', 'PEP-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Champiñones'), 2, 4, 12, 4.0, '2025-09-23', 'CHA-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Setas'), 2, 4, 8, 7.5, '2025-09-25', 'SET-001', NOW());

-- Carnes
INSERT INTO inventory (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES 
((SELECT id FROM ingredients WHERE name = 'Ternera'), 1, 1, 12, 11.5, '2025-09-25', 'TER-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Cerdo'), 1, 1, 15, 7.8, '2025-09-26', 'CER-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Cordero'), 1, 1, 8, 14.5, '2025-09-24', 'COR-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Jamón'), 1, 1, 6, 17.0, '2025-10-15', 'JAM-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Chorizo'), 1, 1, 8, 11.5, '2025-10-20', 'CHO-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Salchichas'), 1, 1, 12, 5.8, '2025-09-27', 'SAL-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Foie gras'), 1, 1, 3, 80.0, '2025-10-30', 'FOI-001', NOW());

-- Lácteos
INSERT INTO inventory (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES 
((SELECT id FROM ingredients WHERE name = 'Yogur'), 4, NULL, 50, 0.7, '2025-09-30', 'YOG-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Mantequilla'), 4, NULL, 15, 3.2, '2025-10-15', 'MAN-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Nata'), 4, NULL, 20, 2.5, '2025-09-28', 'NAT-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Huevos'), 4, NULL, 30, 2.0, '2025-10-05', 'HUE-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Queso fresco'), 4, NULL, 10, 8.0, '2025-09-26', 'QUE-001', NOW());

-- Especias y condimentos
INSERT INTO inventory (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES 
((SELECT id FROM ingredients WHERE name = 'Orégano'), 3, NULL, 3, 11.0, '2026-09-21', 'ORE-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Albahaca'), 3, NULL, 4, 7.5, '2025-10-10', 'ALB-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Tomillo'), 3, NULL, 2, 14.5, '2026-09-21', 'TOM-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Laurel'), 3, NULL, 1, 17.0, '2026-09-21', 'LAU-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Canela'), 3, NULL, 1, 24.0, '2026-09-21', 'CAN-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Nuez moscada'), 3, NULL, 1, 32.0, '2026-09-21', 'NUE-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Mostaza'), 3, NULL, 8, 4.2, '2026-03-21', 'MOS-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Vinagre'), 3, NULL, 12, 2.5, '2026-09-21', 'VIN-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Jengibre'), 3, NULL, 4, 11.0, '2025-10-15', 'JEN-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Ajo negro'), 3, NULL, 1, 42.0, '2026-09-21', 'AJN-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Trufa'), 3, NULL, 0.2, 1100.0, '2025-10-05', 'TRU-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Alcaparras'), 3, NULL, 3, 14.5, '2026-09-21', 'ALC-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Aceitunas'), 3, NULL, 15, 3.2, '2026-09-21', 'ACE-001', NOW());

-- Frutos secos y semillas
INSERT INTO inventory (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES 
((SELECT id FROM ingredients WHERE name = 'Almendras'), 3, NULL, 8, 11.5, '2026-09-21', 'ALM-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Nueces'), 3, NULL, 6, 14.5, '2026-09-21', 'NUE-002', NOW()),
((SELECT id FROM ingredients WHERE name = 'Avellanas'), 3, NULL, 4, 17.0, '2026-09-21', 'AVE-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Pistachos'), 3, NULL, 4, 21.0, '2026-09-21', 'PIS-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Sésamo'), 3, NULL, 3, 7.5, '2026-09-21', 'SES-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Cacahuetes'), 3, NULL, 8, 5.8, '2026-09-21', 'CAC-001', NOW());

-- Pescados y mariscos
INSERT INTO inventory (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES 
((SELECT id FROM ingredients WHERE name = 'Atún'), 1, 2, 8, 17.0, '2025-09-24', 'ATU-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Salmón'), 1, 2, 6, 21.0, '2025-09-23', 'SAL-002', NOW()),
((SELECT id FROM ingredients WHERE name = 'Bacalao'), 1, 2, 10, 14.0, '2025-10-15', 'BAC-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Gambas'), 1, 2, 5, 24.0, '2025-09-25', 'GAM-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Mejillones'), 1, 2, 15, 4.0, '2025-09-24', 'MEJ-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Langostinos'), 1, 2, 4, 26.0, '2025-09-25', 'LAN-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Caviar'), 1, 2, 0.1, 2300.0, '2025-10-30', 'CAV-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Anchoas'), 1, 2, 4, 11.0, '2026-09-21', 'ANC-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Sardinas'), 1, 2, 10, 5.8, '2025-09-26', 'SAR-001', NOW());

-- Cereales y harinas
INSERT INTO inventory (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES 
((SELECT id FROM ingredients WHERE name = 'Harina de trigo'), 3, NULL, 60, 1.0, '2026-09-21', 'HAR-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Arroz'), 3, NULL, 40, 2.2, '2026-09-21', 'ARR-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Pasta'), 3, NULL, 30, 1.6, '2026-09-21', 'PAS-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Avena'), 3, NULL, 25, 2.0, '2026-09-21', 'AVE-002', NOW()),
((SELECT id FROM ingredients WHERE name = 'Pan'), 3, NULL, 20, 1.3, '2025-09-23', 'PAN-001', NOW());

-- Aceites y grasas
INSERT INTO inventory (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES 
((SELECT id FROM ingredients WHERE name = 'Aceite de oliva'), 3, NULL, 15, 6.0, '2026-09-21', 'ACE-002', NOW()),
((SELECT id FROM ingredients WHERE name = 'Aceite de girasol'), 3, NULL, 20, 2.5, '2026-09-21', 'ACE-003', NOW()),
((SELECT id FROM ingredients WHERE name = 'Aceite de sésamo'), 3, NULL, 4, 11.5, '2026-09-21', 'ACE-004', NOW());

-- Ingredientes especiales
INSERT INTO inventory (ingredient_id, family_id, subfamily_id, quantity, purchase_price, expiry_date, batch_number, created_at) VALUES 
((SELECT id FROM ingredients WHERE name = 'Azúcar'), 3, NULL, 60, 1.0, '2026-09-21', 'AZU-001', NOW()),
((SELECT id FROM ingredients WHERE name = 'Miel'), 3, NULL, 8, 7.5, '2026-09-21', 'MIE-001', NOW());

-- =============================================
-- ACTUALIZAR SECUENCIAS
-- =============================================

-- Restablecer secuencia de inventario
SELECT setval('inventory_id_seq', (SELECT MAX(id) FROM inventory));

-- =============================================
-- COMENTARIOS FINALES
-- =============================================

-- Este script añade todos los nuevos ingredientes al inventario con:
-- - Cantidades iniciales realistas según el tipo de ingrediente
-- - Precios de compra actualizados
-- - Fechas de caducidad apropiadas
-- - Números de lote únicos
-- - Asignación a familias y subfamilias correctas
