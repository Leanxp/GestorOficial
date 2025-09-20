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
          ingredients(name, unit_measure, min_stock_level),
          inventory_families(name),
          inventory_subfamilies(name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener inventario:', error)
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
          ingredients(name, unit_measure)
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
  }
}

export default supabase
