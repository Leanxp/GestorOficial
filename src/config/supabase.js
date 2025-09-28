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

// Funciones para la base de datos
export const database = {
  // Obtener categorías
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
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

  // Obtener ingredientes
  async getIngredients() {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select(`
          *,
          categories(name)
        `)
        .eq('active', true)
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

  // Obtener inventario
  async getInventory() {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          ingredients(name, unit_measure, base_price),
          inventory_families(name),
          inventory_subfamilies(name),
          suppliers(name)
        `)
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

  // Obtener proveedores
  async getSuppliers() {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('active', true)
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
  async getInventoryMovements() {
    try {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select(`
          *,
          ingredients(name, unit_measure),
          admin_usuarios(username)
        `)
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
  }
}

export default supabase
