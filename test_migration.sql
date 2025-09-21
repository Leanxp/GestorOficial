-- Script de prueba para verificar la migración
-- Ejecutar este script para verificar que la migración funcionó correctamente

-- 1. Verificar que los campos se agregaron
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inventory' 
AND column_name IN ('supplier_id', 'supplier_ingredient_id', 'supplier_lot_number', 'supplier_price', 'delivery_date', 'invoice_number');

-- 2. Verificar que los datos se actualizaron
SELECT 
    COUNT(*) as total_items,
    COUNT(supplier_id) as items_with_supplier,
    COUNT(supplier_ingredient_id) as items_with_supplier_ingredient
FROM inventory;

-- 3. Mostrar algunos ejemplos de la nueva estructura
SELECT 
    i.id,
    ing.name as ingredient,
    s.name as supplier,
    i.quantity,
    i.purchase_price,
    i.supplier_price,
    i.delivery_date
FROM inventory i
JOIN ingredients ing ON i.ingredient_id = ing.id
LEFT JOIN suppliers s ON i.supplier_id = s.id
LIMIT 5;

-- 4. Verificar que las vistas se crearon
SELECT table_name 
FROM information_schema.views 
WHERE table_name = 'inventory_with_suppliers';

-- 5. Verificar que las funciones se crearon
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('get_inventory_with_suppliers', 'get_inventory_by_supplier', 'compare_supplier_prices');
