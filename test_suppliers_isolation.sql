-- Script de prueba para verificar el aislamiento de proveedores por usuario
-- Este script verifica que cada usuario solo vea sus propios proveedores

-- 1. Verificar que existen usuarios con diferentes IDs
SELECT 'Verificando usuarios existentes' as test;
SELECT id, username, email FROM admin_usuarios ORDER BY id;

-- 2. Verificar que los proveedores están asociados correctamente por user_id
SELECT 'Verificando proveedores por usuario' as test;
SELECT 
    s.id,
    s.user_id,
    u.username,
    s.name as supplier_name,
    s.contact_person,
    s.email
FROM suppliers s
LEFT JOIN admin_usuarios u ON s.user_id = u.id
ORDER BY s.user_id, s.id;

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

-- 4. Verificar categorías por usuario
SELECT 'Verificando categorías por usuario' as test;
SELECT 
    c.id,
    c.user_id,
    u.username,
    c.name as category_name
FROM categories c
LEFT JOIN admin_usuarios u ON c.user_id = u.id
ORDER BY c.user_id, c.id;

-- 5. Verificar relaciones supplier_ingredients por usuario
SELECT 'Verificando supplier_ingredients por usuario' as test;
SELECT 
    si.id,
    si.user_id,
    u.username,
    s.name as supplier_name,
    ing.name as ingredient_name,
    si.supplier_price
FROM supplier_ingredients si
LEFT JOIN admin_usuarios u ON si.user_id = u.id
LEFT JOIN suppliers s ON si.supplier_id = s.id
LEFT JOIN ingredients ing ON si.ingredient_id = ing.id
ORDER BY si.user_id, si.id;

-- 6. Contar registros por usuario para proveedores
SELECT 'Resumen de proveedores por usuario' as test;
SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT s.id) as suppliers,
    COUNT(DISTINCT ing.id) as ingredients,
    COUNT(DISTINCT c.id) as categories,
    COUNT(DISTINCT si.id) as supplier_ingredients
FROM admin_usuarios u
LEFT JOIN suppliers s ON u.id = s.user_id
LEFT JOIN ingredients ing ON u.id = ing.user_id
LEFT JOIN categories c ON u.id = c.user_id
LEFT JOIN supplier_ingredients si ON u.id = si.user_id
GROUP BY u.id, u.username
ORDER BY u.id;

-- 7. Verificar que no hay datos sin user_id (después de la migración)
SELECT 'Verificando datos sin user_id' as test;
SELECT 'suppliers' as tabla, COUNT(*) as sin_user_id FROM suppliers WHERE user_id IS NULL
UNION ALL
SELECT 'ingredients' as tabla, COUNT(*) as sin_user_id FROM ingredients WHERE user_id IS NULL
UNION ALL
SELECT 'categories' as tabla, COUNT(*) as sin_user_id FROM categories WHERE user_id IS NULL
UNION ALL
SELECT 'supplier_ingredients' as tabla, COUNT(*) as sin_user_id FROM supplier_ingredients WHERE user_id IS NULL;

-- 8. Verificar relaciones entre proveedores e ingredientes por usuario
SELECT 'Verificando relaciones proveedor-ingrediente por usuario' as test;
SELECT 
    u.id as user_id,
    u.username,
    s.name as supplier_name,
    COUNT(si.id) as total_ingredients,
    AVG(si.supplier_price) as avg_price
FROM admin_usuarios u
LEFT JOIN suppliers s ON u.id = s.user_id
LEFT JOIN supplier_ingredients si ON s.id = si.supplier_id AND si.user_id = u.id
GROUP BY u.id, u.username, s.id, s.name
ORDER BY u.id, s.name;
