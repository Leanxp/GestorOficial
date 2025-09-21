-- ========================================
-- MIGRACIÓN: Relacionar Inventario con Proveedores
-- Fecha: 2025-01-27
-- Base de datos: Supabase PostgreSQL
-- ========================================

-- 1. Agregar campos a la tabla inventory para rastrear proveedores
ALTER TABLE inventory 
ADD COLUMN supplier_id INTEGER,
ADD COLUMN supplier_ingredient_id INTEGER,
ADD COLUMN supplier_lot_number VARCHAR(50),
ADD COLUMN supplier_price DECIMAL(10,2),
ADD COLUMN delivery_date DATE,
ADD COLUMN invoice_number VARCHAR(100);

-- 2. Agregar foreign keys con referencias a las tablas existentes
ALTER TABLE inventory 
ADD CONSTRAINT fk_inventory_supplier_id 
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;

ALTER TABLE inventory 
ADD CONSTRAINT fk_inventory_supplier_ingredient_id 
    FOREIGN KEY (supplier_ingredient_id) REFERENCES supplier_ingredients(id) ON DELETE SET NULL;

-- 3. Crear índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_inventory_supplier_id ON inventory(supplier_id);
CREATE INDEX IF NOT EXISTS idx_inventory_supplier_ingredient_id ON inventory(supplier_ingredient_id);
CREATE INDEX IF NOT EXISTS idx_inventory_delivery_date ON inventory(delivery_date);
CREATE INDEX IF NOT EXISTS idx_inventory_invoice_number ON inventory(invoice_number);

-- 4. Actualizar datos existentes con proveedores por defecto
-- Asignar proveedores basándose en la relación existente en supplier_ingredients
UPDATE inventory 
SET 
    supplier_id = si.supplier_id,
    supplier_ingredient_id = si.id,
    supplier_price = inventory.purchase_price,
    delivery_date = inventory.created_at::date,
    supplier_lot_number = inventory.batch_number
FROM supplier_ingredients si
WHERE inventory.ingredient_id = si.ingredient_id
AND inventory.supplier_id IS NULL;

-- 5. Para items sin proveedor asignado, asignar el primer proveedor disponible
UPDATE inventory 
SET 
    supplier_id = (
        SELECT s.id 
        FROM suppliers s 
        WHERE s.active = true 
        ORDER BY s.id 
        LIMIT 1
    ),
    supplier_price = inventory.purchase_price,
    delivery_date = inventory.created_at::date,
    supplier_lot_number = inventory.batch_number
WHERE inventory.supplier_id IS NULL;

-- 6. Crear vista para consultas optimizadas de inventario con proveedores
CREATE OR REPLACE VIEW inventory_with_suppliers AS
SELECT 
    i.id,
    i.ingredient_id,
    i.family_id,
    i.subfamily_id,
    i.quantity,
    i.purchase_price,
    i.expiry_date,
    i.batch_number,
    i.created_at,
    -- Información del proveedor
    i.supplier_id,
    i.supplier_ingredient_id,
    i.supplier_lot_number,
    i.supplier_price,
    i.delivery_date,
    i.invoice_number,
    -- Datos relacionados
    ing.name as ingredient_name,
    ing.unit_measure,
    ing.min_stock_level,
    ing.base_price,
    -- Alérgenos
    ing.alerg_gluten,
    ing.alerg_crustaceos,
    ing.alerg_huevos,
    ing.alerg_pescado,
    ing.alerg_cacahuetes,
    ing.alerg_soja,
    ing.alerg_leche,
    ing.alerg_frutos,
    ing.alerg_apio,
    ing.alerg_mostaza,
    ing.alerg_sesamo,
    ing.alerg_sulfitos,
    ing.alerg_altramuces,
    ing.alerg_moluscos,
    -- Información del proveedor
    s.name as supplier_name,
    s.contact_person,
    s.email as supplier_email,
    s.phone as supplier_phone,
    -- Información de familia/subfamilia
    if.name as family_name,
    isf.name as subfamily_name,
    -- Información de categoría
    c.name as category_name
FROM inventory i
LEFT JOIN ingredients ing ON i.ingredient_id = ing.id
LEFT JOIN suppliers s ON i.supplier_id = s.id
LEFT JOIN supplier_ingredients si ON i.supplier_ingredient_id = si.id
LEFT JOIN inventory_families if ON i.family_id = if.id
LEFT JOIN inventory_subfamilies isf ON i.subfamily_id = isf.id
LEFT JOIN categories c ON ing.category_id = c.id
WHERE ing.active = true;

-- 7. Crear función para obtener inventario con información de proveedores
CREATE OR REPLACE FUNCTION get_inventory_with_suppliers()
RETURNS TABLE (
    id INTEGER,
    ingredient_name VARCHAR(100),
    supplier_name VARCHAR(100),
    quantity DECIMAL(10,2),
    purchase_price DECIMAL(10,2),
    supplier_price DECIMAL(10,2),
    expiry_date DATE,
    batch_number VARCHAR(50),
    supplier_lot_number VARCHAR(50),
    delivery_date DATE,
    family_name VARCHAR(100),
    subfamily_name VARCHAR(100),
    unit_measure VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        iws.id,
        iws.ingredient_name,
        iws.supplier_name,
        iws.quantity,
        iws.purchase_price,
        iws.supplier_price,
        iws.expiry_date,
        iws.batch_number,
        iws.supplier_lot_number,
        iws.delivery_date,
        iws.family_name,
        iws.subfamily_name,
        iws.unit_measure
    FROM inventory_with_suppliers iws
    ORDER BY iws.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 8. Crear función para obtener inventario por proveedor
CREATE OR REPLACE FUNCTION get_inventory_by_supplier(supplier_id_param INTEGER)
RETURNS TABLE (
    id INTEGER,
    ingredient_name VARCHAR(100),
    quantity DECIMAL(10,2),
    purchase_price DECIMAL(10,2),
    supplier_price DECIMAL(10,2),
    expiry_date DATE,
    batch_number VARCHAR(50),
    supplier_lot_number VARCHAR(50),
    delivery_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        iws.id,
        iws.ingredient_name,
        iws.quantity,
        iws.purchase_price,
        iws.supplier_price,
        iws.expiry_date,
        iws.batch_number,
        iws.supplier_lot_number,
        iws.delivery_date
    FROM inventory_with_suppliers iws
    WHERE iws.supplier_id = supplier_id_param
    ORDER BY iws.delivery_date DESC;
END;
$$ LANGUAGE plpgsql;

-- 9. Crear función para comparar precios entre proveedores
CREATE OR REPLACE FUNCTION compare_supplier_prices(ingredient_id_param INTEGER)
RETURNS TABLE (
    supplier_name VARCHAR(100),
    supplier_price DECIMAL(10,2),
    current_stock DECIMAL(10,2),
    last_delivery DATE,
    supplier_contact VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.name as supplier_name,
        si.supplier_price,
        COALESCE(SUM(i.quantity), 0) as current_stock,
        MAX(i.delivery_date) as last_delivery,
        s.contact_person as supplier_contact
    FROM supplier_ingredients si
    JOIN suppliers s ON si.supplier_id = s.id
    LEFT JOIN inventory i ON si.id = i.supplier_ingredient_id
    WHERE si.ingredient_id = ingredient_id_param
    AND s.active = true
    GROUP BY s.id, s.name, si.supplier_price, s.contact_person
    ORDER BY si.supplier_price ASC;
END;
$$ LANGUAGE plpgsql;

-- 10. Comentarios y documentación
COMMENT ON COLUMN inventory.supplier_id IS 'ID del proveedor que suministró este lote';
COMMENT ON COLUMN inventory.supplier_ingredient_id IS 'ID de la relación proveedor-ingrediente específica';
COMMENT ON COLUMN inventory.supplier_lot_number IS 'Número de lote del proveedor';
COMMENT ON COLUMN inventory.supplier_price IS 'Precio pagado al proveedor por este lote';
COMMENT ON COLUMN inventory.delivery_date IS 'Fecha de entrega del proveedor';
COMMENT ON COLUMN inventory.invoice_number IS 'Número de factura del proveedor';

COMMENT ON VIEW inventory_with_suppliers IS 'Vista completa del inventario con información de proveedores';
COMMENT ON FUNCTION get_inventory_with_suppliers() IS 'Función para obtener inventario con datos de proveedores';
COMMENT ON FUNCTION get_inventory_by_supplier(INTEGER) IS 'Función para obtener inventario filtrado por proveedor';
COMMENT ON FUNCTION compare_supplier_prices(INTEGER) IS 'Función para comparar precios entre proveedores de un ingrediente';

-- ========================================
-- VERIFICACIÓN DE LA MIGRACIÓN
-- ========================================

-- Verificar que los campos se agregaron correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inventory' 
AND column_name IN ('supplier_id', 'supplier_ingredient_id', 'supplier_lot_number', 'supplier_price', 'delivery_date', 'invoice_number');

-- Verificar que los datos se actualizaron
SELECT 
    COUNT(*) as total_items,
    COUNT(supplier_id) as items_with_supplier,
    COUNT(supplier_ingredient_id) as items_with_supplier_ingredient
FROM inventory;

-- Mostrar algunos ejemplos de la nueva estructura
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
