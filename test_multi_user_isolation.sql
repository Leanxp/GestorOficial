-- Script de prueba para verificar el aislamiento multi-usuario
-- Este script verifica que cada usuario solo vea sus propios datos

-- 1. Verificar que existen usuarios con diferentes IDs
SELECT 'Verificando usuarios existentes' as test;
SELECT id, username, email FROM admin_usuarios ORDER BY id;

-- 2. Verificar que los datos están asociados correctamente por user_id
SELECT 'Verificando inventario por usuario' as test;
SELECT 
    i.id,
    i.user_id,
    u.username,
    ing.name as ingredient_name,
    i.quantity
FROM inventory i
LEFT JOIN admin_usuarios u ON i.user_id = u.id
LEFT JOIN ingredients ing ON i.ingredient_id = ing.id
ORDER BY i.user_id, i.id;

-- 3. Verificar ingredientes por usuario
SELECT 'Verificando ingredientes por usuario' as test;
SELECT 
    ing.id,
    ing.user_id,
    u.username,
    ing.name as ingredient_name
FROM ingredients ing
LEFT JOIN admin_usuarios u ON ing.user_id = u.id
ORDER BY ing.user_id, ing.id;

-- 4. Verificar proveedores por usuario
SELECT 'Verificando proveedores por usuario' as test;
SELECT 
    s.id,
    s.user_id,
    u.username,
    s.name as supplier_name
FROM suppliers s
LEFT JOIN admin_usuarios u ON s.user_id = u.id
ORDER BY s.user_id, s.id;

-- 5. Verificar categorías por usuario
SELECT 'Verificando categorías por usuario' as test;
SELECT 
    c.id,
    c.user_id,
    u.username,
    c.name as category_name
FROM categories c
LEFT JOIN admin_usuarios u ON c.user_id = u.id
ORDER BY c.user_id, c.id;

-- 6. Contar registros por usuario
SELECT 'Resumen de datos por usuario' as test;
SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT i.id) as inventory_items,
    COUNT(DISTINCT ing.id) as ingredients,
    COUNT(DISTINCT s.id) as suppliers,
    COUNT(DISTINCT c.id) as categories
FROM admin_usuarios u
LEFT JOIN inventory i ON u.id = i.user_id
LEFT JOIN ingredients ing ON u.id = ing.user_id
LEFT JOIN suppliers s ON u.id = s.user_id
LEFT JOIN categories c ON u.id = c.user_id
GROUP BY u.id, u.username
ORDER BY u.id;

-- 7. Verificar que no hay datos sin user_id (después de la migración)
SELECT 'Verificando datos sin user_id' as test;
SELECT 'inventory' as tabla, COUNT(*) as sin_user_id FROM inventory WHERE user_id IS NULL
UNION ALL
SELECT 'ingredients' as tabla, COUNT(*) as sin_user_id FROM ingredients WHERE user_id IS NULL
UNION ALL
SELECT 'suppliers' as tabla, COUNT(*) as sin_user_id FROM suppliers WHERE user_id IS NULL
UNION ALL
SELECT 'categories' as tabla, COUNT(*) as sin_user_id FROM categories WHERE user_id IS NULL;
