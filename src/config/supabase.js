import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://jlddktlbyeiyeinzhfxx.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZGRrdGxieWVpeWVpbnpoZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzc0ODQsImV4cCI6MjA3Mzk1MzQ4NH0.ds0VnAuo1AOwVXP5kdErW09avurdlkIVtcKcAEJtkV8'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funciones de autenticación
export const auth = {
  // Iniciar sesión
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      return { success: false, error: error.message }
    }
  },

  // Registrar usuario
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      
      // Si el registro en Supabase Auth fue exitoso, insertar en admin_usuarios
      if (data.user) {
        try {
          const { error: insertError } = await supabase
            .from('admin_usuarios')
            .insert({
              username: userData.username || email.split('@')[0], // Usar username o parte del email
              email: email,
              pwd: 'supabase_auth', // Marcador para usuarios autenticados por Supabase
              grade: userData.grade || 5,
              license_type: 'free',
              max_ingredients: 15,
              max_suppliers: 15,
              is_admin: false,
              last_update: new Date().toISOString()
            })
          
          if (insertError) {
            console.error('Error al insertar en admin_usuarios:', insertError)
            // No lanzar error aquí para no interrumpir el flujo de registro
          } else {
            console.log('Usuario insertado exitosamente en admin_usuarios')
          }
        } catch (insertError) {
          console.error('Error al insertar en admin_usuarios:', insertError)
          // No lanzar error aquí para no interrumpir el flujo de registro
        }
      }
      
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Error al registrar usuario:', error)
      return { success: false, error: error.message }
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { success: true, user }
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return { success: false, error: error.message }
    }
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Función auxiliar para convertir unidades
const convertUnit = (quantity, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return quantity
  
  // Conversiones culinarias a unidades estándar (primero convertir a g o ml)
  const culinaryToStandard = {
    'cucharada': { 'g': 15, 'ml': 15 },      // 1 cucharada = 15g o 15ml
    'cucharadita': { 'g': 5, 'ml': 5 },     // 1 cucharadita = 5g o 5ml
    'taza': { 'g': 200, 'ml': 250 },        // 1 taza = 200g (sólidos) o 250ml (líquidos)
    'unidad': { 'g': 100 }                  // 1 unidad ≈ 100g promedio (variable según producto)
  }
  
  // Conversiones comunes de masa
  const massConversions = {
    'kg': { 'g': 1000, 'mg': 1000000 },
    'g': { 'kg': 0.001, 'mg': 1000 },
    'mg': { 'kg': 0.000001, 'g': 0.001 }
  }
  
  // Conversiones comunes de volumen
  const volumeConversions = {
    'l': { 'ml': 1000 },
    'ml': { 'l': 0.001 }
  }
  
  // Detectar si el destino es unidad de masa o volumen
  const massUnits = ['kg', 'g', 'mg']
  const volumeUnits = ['l', 'ml']
  const isToMass = massUnits.includes(toUnit)
  const isToVolume = volumeUnits.includes(toUnit)
  
  // Si la unidad origen es culinaria, primero convertir a estándar
  if (culinaryToStandard[fromUnit]) {
    let convertedQuantity
    
    if (isToMass) {
      // Convertir a gramos primero (usar conversión a g)
      convertedQuantity = quantity * (culinaryToStandard[fromUnit]['g'] || culinaryToStandard[fromUnit]['ml'])
      // Luego convertir a la unidad de masa destino
      if (massConversions['g'] && massConversions['g'][toUnit]) {
        return convertedQuantity * massConversions['g'][toUnit]
      }
      return convertedQuantity
    } else if (isToVolume) {
      // Convertir a mililitros primero (usar conversión a ml)
      convertedQuantity = quantity * (culinaryToStandard[fromUnit]['ml'] || culinaryToStandard[fromUnit]['g'])
      // Luego convertir a la unidad de volumen destino
      if (volumeConversions['ml'] && volumeConversions['ml'][toUnit]) {
        return convertedQuantity * volumeConversions['ml'][toUnit]
      }
      return convertedQuantity
    } else if (toUnit === 'unidad') {
      // Si destino es unidad y origen es culinaria, no hay conversión directa
      // Asumir que es 1 a 1 pero ajustado por el factor de la unidad culinaria
      return quantity
    }
  }
  
  // Si la unidad origen es "unidad" y destino es masa/volumen
  if (fromUnit === 'unidad' && isToMass) {
    // Convertir unidad a gramos y luego a la unidad destino
    const grams = quantity * (culinaryToStandard['unidad']['g'] || 100)
    if (massConversions['g'] && massConversions['g'][toUnit]) {
      return grams * massConversions['g'][toUnit]
    }
    return grams
  }
  
  if (fromUnit === 'unidad' && isToVolume) {
    // Para unidades a volumen, usar factor similar (asumir que 1 unidad ≈ 100ml)
    const ml = quantity * 100
    if (volumeConversions['ml'] && volumeConversions['ml'][toUnit]) {
      return ml * volumeConversions['ml'][toUnit]
    }
    return ml
  }
  
  // Si son unidades de masa
  if (massConversions[fromUnit] && massConversions[fromUnit][toUnit]) {
    return quantity * massConversions[fromUnit][toUnit]
  }
  
  // Si son unidades de volumen
  if (volumeConversions[fromUnit] && volumeConversions[fromUnit][toUnit]) {
    return quantity * volumeConversions[fromUnit][toUnit]
  }
  
  // Si no hay conversión disponible, asumir que son la misma unidad
  return quantity
}

// Funciones para la base de datos
export const database = {
  // Obtener el user_id del usuario autenticado
  async getCurrentUserId() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' }
      }
      
      // Buscar el user_id en admin_usuarios usando el email
      const { data: userData, error: userError } = await supabase
        .from('admin_usuarios')
        .select('id')
        .eq('email', user.email)
        .single()
      
      if (userError) throw userError
      
      return { success: true, userId: userData.id }
    } catch (error) {
      console.error('Error al obtener user_id:', error)
      return { success: false, error: error.message }
    }
  },
  // Obtener categorías filtradas por usuario
  async getCategories(userId) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      return { success: false, error: error.message }
    }
  },

  // Crear categoría
  async createCategory(categoryData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al crear categoría:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener ingredientes filtrados por usuario
  async getIngredients(userId) {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select(`
          *,
          categories(name)
        `)
        .eq('active', true)
        .eq('user_id', userId)
        .order('name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener ingredientes:', error)
      return { success: false, error: error.message }
    }
  },

  // Crear ingrediente
  async createIngredient(ingredientData) {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .insert([ingredientData])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al crear ingrediente:', error)
      return { success: false, error: error.message }
    }
  },

  // Actualizar ingrediente
  async updateIngredient(id, ingredientData) {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .update(ingredientData)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al actualizar ingrediente:', error)
      return { success: false, error: error.message }
    }
  },

  // Eliminar ingrediente
  async deleteIngredient(id) {
    try {
      const { error } = await supabase
        .from('ingredients')
        .update({ active: false })
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar ingrediente:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener inventario filtrado por usuario
  async getInventory(userId) {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          ingredients(
            name, 
            unit_measure, 
            base_price,
            alerg_gluten,
            alerg_crustaceos,
            alerg_huevos,
            alerg_pescado,
            alerg_cacahuetes,
            alerg_soja,
            alerg_leche,
            alerg_frutos,
            alerg_apio,
            alerg_mostaza,
            alerg_sesamo,
            alerg_sulfitos,
            alerg_altramuces,
            alerg_moluscos
          ),
          inventory_families(name),
          inventory_subfamilies(name),
          suppliers(name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener inventario:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener inventario con información completa de proveedores
  async getInventoryWithSuppliers() {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          ingredients(name, unit_measure, base_price),
          inventory_families(name),
          inventory_subfamilies(name),
          supplier_ingredients(
            supplier_id,
            supplier_price,
            suppliers(name, contact_person)
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener inventario con proveedores:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener inventario por proveedor
  async getInventoryBySupplier(supplierId) {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          ingredients(name, unit_measure, base_price),
          inventory_families(name),
          inventory_subfamilies(name),
          supplier_ingredients!inner(
            supplier_id,
            supplier_price,
            suppliers(name, contact_person)
          )
        `)
        .eq('supplier_ingredients.supplier_id', supplierId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener inventario por proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Comparar precios entre proveedores
  async compareSupplierPrices(ingredientId) {
    try {
      const { data, error } = await supabase
        .from('supplier_ingredients')
        .select(`
          *,
          suppliers(name, contact_person, phone, email),
          ingredients(name, unit_measure)
        `)
        .eq('ingredient_id', ingredientId)
        .order('supplier_price', { ascending: true })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al comparar precios de proveedores:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener proveedores filtrados por usuario
  async getSuppliers(userId) {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('active', true)
        .eq('user_id', userId)
        .order('name')
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener proveedores:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener órdenes de compra
  async getPurchaseOrders() {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers(name, contact_person),
          purchase_order_items(
            *,
            ingredients(name, unit_measure)
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener órdenes de compra:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener movimientos de inventario
  async getInventoryMovements(userId) {
    try {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select(`
          *,
          ingredients(name, unit_measure),
          admin_usuarios(username)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener movimientos:', error)
      return { success: false, error: error.message }
    }
  },

  // Crear proveedor
  async createSupplier(supplierData) {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al crear proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Actualizar proveedor
  async updateSupplier(id, supplierData) {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplierData)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al actualizar proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Eliminar proveedor
  async deleteSupplier(id) {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({ active: false })
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener ingredientes de un proveedor
  async getSupplierIngredients(supplierId) {
    try {
      const { data, error } = await supabase
        .from('supplier_ingredients')
        .select(`
          *,
          ingredients(
            name, 
            unit_measure,
            alerg_gluten,
            alerg_crustaceos,
            alerg_huevos,
            alerg_pescado,
            alerg_cacahuetes,
            alerg_soja,
            alerg_leche,
            alerg_frutos,
            alerg_apio,
            alerg_mostaza,
            alerg_sesamo,
            alerg_sulfitos,
            alerg_altramuces,
            alerg_moluscos
          )
        `)
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener ingredientes del proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Agregar ingrediente a proveedor
  async addSupplierIngredient(supplierId, ingredientData) {
    try {
      const { data, error } = await supabase
        .from('supplier_ingredients')
        .insert([{
          ...ingredientData,
          supplier_id: supplierId
        }])
        .select(`
          *,
          ingredients(name, unit_measure)
        `)
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al agregar ingrediente al proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Actualizar ingrediente de proveedor
  async updateSupplierIngredient(id, ingredientData) {
    try {
      const { data, error } = await supabase
        .from('supplier_ingredients')
        .update(ingredientData)
        .eq('id', id)
        .select(`
          *,
          ingredients(name, unit_measure)
        `)
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al actualizar ingrediente del proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Eliminar ingrediente de proveedor
  async deleteSupplierIngredient(id) {
    try {
      const { error } = await supabase
        .from('supplier_ingredients')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar ingrediente del proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener todos los precios de productos comparables entre proveedores
  async getAllProductPrices(userId) {
    try {
      const { data, error } = await supabase
        .from('supplier_ingredients')
        .select(`
          id,
          supplier_id,
          ingredient_id,
          supplier_price,
          supplier_unit,
          conversion_factor,
          notes,
          ingredients(
            id,
            name,
            unit_measure,
            categories(name)
          ),
          suppliers(
            id,
            name,
            contact_person,
            email,
            phone
          )
        `)
        .eq('user_id', userId)
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener precios de productos:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener licencia de usuario
  async getUserLicense(email) {
    try {
      const { data, error } = await supabase
        .from('admin_usuarios')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener licencia del usuario:', error)
      return { success: false, error: error.message }
    }
  },

  // Actualizar licencia de usuario
  async updateUserLicense(email, licenseData) {
    try {
      const { data, error } = await supabase
        .from('admin_usuarios')
        .update(licenseData)
        .eq('email', email)
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al actualizar licencia del usuario:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener todos los usuarios (solo para administradores)
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('admin_usuarios')
        .select('id, username, email, license_type, license_expires_at, max_ingredients, max_suppliers, is_admin, last_update')
        .order('last_update', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      return { success: false, error: error.message }
    }
  },

  // Actualizar inventario con información de proveedor
  async updateInventoryWithSupplier(inventoryId, inventoryData) {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .update(inventoryData)
        .eq('id', inventoryId)
        .select(`
          *,
          ingredients(name, unit_measure),
          suppliers(name, contact_person),
          inventory_families(name),
          inventory_subfamilies(name)
        `)
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al actualizar inventario con proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Crear entrada de inventario con proveedor
  async createInventoryWithSupplier(inventoryData) {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert([inventoryData])
        .select(`
          *,
          ingredients(name, unit_measure),
          suppliers(name, contact_person),
          inventory_families(name),
          inventory_subfamilies(name)
        `)
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al crear inventario con proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener conteo de productos en inventario por usuario
  async getInventoryCount(userId) {
    try {
      const { count, error } = await supabase
        .from('inventory')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      
      if (error) throw error
      return { success: true, count: count || 0 }
    } catch (error) {
      console.error('Error al obtener conteo de inventario:', error)
      return { success: false, error: error.message, count: 0 }
    }
  },

  // Obtener estadísticas de crecimiento semanal de inventario
  async getInventoryWeeklyGrowth(userId) {
    try {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Productos añadidos en la última semana
      const { count: thisWeekCount, error: thisWeekError } = await supabase
        .from('inventory')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', oneWeekAgo.toISOString())
        .lt('created_at', now.toISOString());

      if (thisWeekError) throw thisWeekError;

      // Productos añadidos en la semana anterior
      const { count: lastWeekCount, error: lastWeekError } = await supabase
        .from('inventory')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', oneWeekAgo.toISOString());

      if (lastWeekError) throw lastWeekError;

      const thisWeek = thisWeekCount || 0;
      const lastWeek = lastWeekCount || 0;

      // Calcular porcentaje de crecimiento
      let growthPercentage = 0;
      if (lastWeek > 0) {
        growthPercentage = ((thisWeek - lastWeek) / lastWeek) * 100;
      } else if (thisWeek > 0) {
        growthPercentage = 100; // Si no había productos la semana pasada pero hay esta semana
      }

      return {
        success: true,
        data: {
          thisWeek,
          lastWeek,
          growthPercentage: Math.round(growthPercentage)
        }
      };
    } catch (error) {
      console.error('Error al obtener crecimiento semanal:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener estadísticas de inventario por proveedor
  async getInventoryStatsBySupplier() {
    try {
      const { data, error } = await supabase
        .from('supplier_ingredients')
        .select(`
          supplier_id,
          suppliers(name),
          ingredient_id,
          supplier_price,
          ingredients(name as ingredient_name)
        `)
      
      if (error) throw error
      
      // Procesar datos para estadísticas
      const stats = data.reduce((acc, item) => {
        const supplierId = item.supplier_id
        if (!acc[supplierId]) {
          acc[supplierId] = {
            supplier_name: item.suppliers?.name || 'Sin proveedor',
            total_items: 0,
            total_value: 0,
            avg_price: 0
          }
        }
        
        acc[supplierId].total_items += 1
        acc[supplierId].total_value += parseFloat(item.supplier_price || 0)
        
        return acc
      }, {})
      
      // Calcular promedios
      Object.values(stats).forEach(stat => {
        stat.avg_price = stat.total_items > 0 ? stat.total_value / stat.total_items : 0
      })
      
      return { success: true, data: Object.values(stats) }
    } catch (error) {
      console.error('Error al obtener estadísticas de inventario por proveedor:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener recetas con sus ingredientes y pasos
  async getRecipes(userId) {
    try {
      const { data: recipes, error: recipesError } = await supabase
        .from('inventory_recipes')
        .select(`
          id,
          recipe_id,
          recipe_name,
          recipe_category,
          difficulty,
          notes,
          created_at,
          recipe_ingredients(
            id,
            ingredient_id,
            quantity,
            unit_measure,
            position,
            notes,
            ingredients(
              id,
              name,
              unit_measure
            )
          ),
          recipe_steps(
            id,
            step_number,
            step_text
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (recipesError) throw recipesError

      // Obtener todos los supplier_ingredients para el cálculo de costes
      const { data: supplierIngredients, error: supplierError } = await supabase
        .from('supplier_ingredients')
        .select(`
          id,
          ingredient_id,
          supplier_price,
          supplier_unit
        `)
        .eq('user_id', userId)

      if (supplierError) {
        console.warn('Error al obtener supplier_ingredients:', supplierError)
      }

      // Crear un mapa de precios por ingrediente (usar el precio más bajo si hay múltiples proveedores)
      const priceMap = {}
      if (supplierIngredients) {
        supplierIngredients.forEach(si => {
          const ingId = si.ingredient_id
          const price = parseFloat(si.supplier_price) || 0
          if (!priceMap[ingId] || price < priceMap[ingId].price) {
            priceMap[ingId] = {
              price: price,
              unit: si.supplier_unit || 'unidad'
            }
          }
        })
      }

      // Transformar los datos al formato esperado por el componente
      const transformedRecipes = recipes.map(recipe => {
        // Calcular el coste de la receta
        let totalCost = 0
        const recipeIngredients = (recipe.recipe_ingredients || [])
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((ri, idx) => {
            const ingredientRefId = ri.ingredient_id
            const recipeQuantity = parseFloat(ri.quantity) || 0
            const recipeUnit = ri.unit_measure || 'g'
            
            // Calcular coste del ingrediente si hay precio disponible
            let ingredientCost = 0
            if (priceMap[ingredientRefId]) {
              const supplierPrice = priceMap[ingredientRefId].price
              const supplierUnit = priceMap[ingredientRefId].unit
              
              // Convertir unidades si es necesario
              const convertedQuantity = convertUnit(recipeQuantity, recipeUnit, supplierUnit)
              ingredientCost = convertedQuantity * supplierPrice
            }
            
            totalCost += ingredientCost
            
            return {
              id: ri.id,
              ingredientRefId: ingredientRefId,
              name: ri.ingredients?.name || '',
              quantity: recipeQuantity,
              unit: recipeUnit,
              position: {
                x: Math.random() * 40 + 30,
                y: Math.random() * 20 + 60
              },
              notes: ri.notes,
              cost: ingredientCost
            }
          })

        return {
          id: recipe.id,
          name: recipe.recipe_name,
          description: recipe.notes || '',
          difficulty: recipe.difficulty || 'Fácil',
          category: recipe.recipe_category,
          ingredients: recipeIngredients,
          steps: (recipe.recipe_steps || [])
            .sort((a, b) => a.step_number - b.step_number)
            .map(step => ({
              step_number: step.step_number,
              step_text: step.step_text
            })),
          cost: totalCost,
          created_at: recipe.created_at
        }
      })

      return { success: true, data: transformedRecipes }
    } catch (error) {
      console.error('Error al obtener recetas:', error)
      return { success: false, error: error.message }
    }
  }
}

export default supabase
