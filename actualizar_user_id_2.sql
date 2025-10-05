-- Script para actualizar todos los registros existentes con user_id = 2
-- IMPORTANTE: Ejecutar DESPUÉS de haber aplicado las modificaciones del esquema
-- (después de ejecutar las declaraciones ALTER TABLE)

-- Verificar que el usuario con id = 2 existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.admin_usuarios WHERE id = 2) THEN
        RAISE EXCEPTION 'El usuario con id = 2 no existe en la tabla admin_usuarios';
    END IF;
END $$;

-- 1. Actualizar categories con user_id = 2
UPDATE public.categories 
SET user_id = 2 
WHERE user_id IS NULL;

-- Verificar la actualización
SELECT 'categories' as tabla, COUNT(*) as registros_actualizados 
FROM public.categories 
WHERE user_id = 2;

-- 2. Actualizar ingredients con user_id = 2
UPDATE public.ingredients 
SET user_id = 2 
WHERE user_id IS NULL;

-- Verificar la actualización
SELECT 'ingredients' as tabla, COUNT(*) as registros_actualizados 
FROM public.ingredients 
WHERE user_id = 2;

-- 3. Actualizar suppliers con user_id = 2
UPDATE public.suppliers 
SET user_id = 2 
WHERE user_id IS NULL;

-- Verificar la actualización
SELECT 'suppliers' as tabla, COUNT(*) as registros_actualizados 
FROM public.suppliers 
WHERE user_id = 2;

-- 4. Actualizar inventory con user_id = 2
UPDATE public.inventory 
SET user_id = 2 
WHERE user_id IS NULL;

-- Verificar la actualización
SELECT 'inventory' as tabla, COUNT(*) as registros_actualizados 
FROM public.inventory 
WHERE user_id = 2;

-- 5. Actualizar purchase_orders con user_id = 2
UPDATE public.purchase_orders 
SET user_id = 2 
WHERE user_id IS NULL;

-- Verificar la actualización
SELECT 'purchase_orders' as tabla, COUNT(*) as registros_actualizados 
FROM public.purchase_orders 
WHERE user_id = 2;

-- 6. Actualizar supplier_ingredients con user_id = 2
UPDATE public.supplier_ingredients 
SET user_id = 2 
WHERE user_id IS NULL;

-- Verificar la actualización
SELECT 'supplier_ingredients' as tabla, COUNT(*) as registros_actualizados 
FROM public.supplier_ingredients 
WHERE user_id = 2;

-- Resumen final de todas las actualizaciones
SELECT 
    'RESUMEN FINAL' as descripcion,
    (SELECT COUNT(*) FROM public.categories WHERE user_id = 2) as categories,
    (SELECT COUNT(*) FROM public.ingredients WHERE user_id = 2) as ingredients,
    (SELECT COUNT(*) FROM public.suppliers WHERE user_id = 2) as suppliers,
    (SELECT COUNT(*) FROM public.inventory WHERE user_id = 2) as inventory,
    (SELECT COUNT(*) FROM public.purchase_orders WHERE user_id = 2) as purchase_orders,
    (SELECT COUNT(*) FROM public.supplier_ingredients WHERE user_id = 2) as supplier_ingredients;
