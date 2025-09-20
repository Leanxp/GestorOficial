import { useState, useEffect, useContext, createContext } from 'react'
import { useAuth } from './useAuth'
import { database } from '../config/supabase'

const LicenseContext = createContext({})

export const useLicense = () => {
  const context = useContext(LicenseContext)
  if (!context) {
    throw new Error('useLicense debe ser usado dentro de un LicenseProvider')
  }
  return context
}

export const LicenseProvider = ({ children }) => {
  const { user } = useAuth()
  const [license, setLicense] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar información de licencia del usuario
  const loadUserLicense = async () => {
    if (!user?.email) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const result = await database.getUserLicense(user.email)
      if (result.success) {
        setLicense(result.data)
      } else {
        // Si no hay licencia, crear una gratuita por defecto
        const defaultLicense = {
          license_type: 'free',
          license_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
          max_ingredients: 50,
          max_suppliers: 10,
          is_admin: false
        }
        setLicense(defaultLicense)
      }
    } catch (error) {
      console.error('Error al cargar licencia:', error)
      // Licencia gratuita por defecto en caso de error
      const defaultLicense = {
        license_type: 'free',
        license_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        max_ingredients: 50,
        max_suppliers: 10,
        is_admin: false
      }
      setLicense(defaultLicense)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserLicense()
  }, [user])

  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return license?.is_admin === true
  }

  // Verificar si la licencia está activa
  const isLicenseActive = () => {
    if (!license?.license_expires_at) return false
    return new Date(license.license_expires_at) > new Date()
  }

  // Verificar si tiene acceso a una funcionalidad específica
  const checkFeatureAccess = (feature) => {
    if (!license) return false
    if (isAdmin()) return true // Los administradores tienen acceso a todo
    if (!isLicenseActive()) return false // Licencia expirada

    const featureLimits = {
      'inventory': license.max_ingredients > 0,
      'suppliers': license.max_suppliers > 0,
      'reports': license.license_type === 'premium',
      'advanced_analytics': license.license_type === 'premium',
      'export_data': license.license_type === 'premium'
    }

    return featureLimits[feature] || false
  }

  // Obtener límites actuales
  const getLimits = () => {
    if (!license) return { ingredients: 0, suppliers: 0 }
    return {
      ingredients: license.max_ingredients,
      suppliers: license.max_suppliers
    }
  }

  // Verificar si puede agregar más elementos
  const canAddMore = (type, currentCount) => {
    if (!license) return false
    if (isAdmin()) return true
    if (!isLicenseActive()) return false

    const limits = getLimits()
    return currentCount < limits[type]
  }

  // Obtener información de la licencia para mostrar al usuario
  const getLicenseInfo = () => {
    if (!license) return null

    return {
      type: license.license_type,
      expiresAt: license.license_expires_at,
      isActive: isLicenseActive(),
      isAdmin: isAdmin(),
      limits: getLimits(),
      daysRemaining: license.license_expires_at 
        ? Math.ceil((new Date(license.license_expires_at) - new Date()) / (1000 * 60 * 60 * 24))
        : 0
    }
  }

  // Obtener opciones de upgrade
  const getUpgradeOptions = () => {
    if (isAdmin()) return []

    return [
      {
        id: 'premium',
        name: 'Premium',
        price: 29.99,
        period: 'month',
        features: [
          'Sin límites de ingredientes',
          'Sin límites de proveedores',
          'Reportes avanzados',
          'Análisis de datos',
          'Exportación de datos',
          'Soporte prioritario'
        ],
        current: license?.license_type === 'premium'
      }
    ]
  }

  // Actualizar licencia (solo para administradores)
  const updateUserLicense = async (userEmail, licenseData) => {
    if (!isAdmin()) {
      throw new Error('Solo los administradores pueden actualizar licencias')
    }

    try {
      const result = await database.updateUserLicense(userEmail, licenseData)
      if (result.success) {
        // Si es el usuario actual, recargar su licencia
        if (userEmail === user?.email) {
          await loadUserLicense()
        }
        return result
      }
      throw new Error(result.error)
    } catch (error) {
      console.error('Error al actualizar licencia:', error)
      throw error
    }
  }

  // Obtener todos los usuarios para administración
  const getAllUsers = async () => {
    if (!isAdmin()) {
      throw new Error('Solo los administradores pueden ver todos los usuarios')
    }

    try {
      const result = await database.getAllUsers()
      return result
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      throw error
    }
  }

  const value = {
    license,
    loading,
    isAdmin,
    isLicenseActive,
    checkFeatureAccess,
    getLimits,
    canAddMore,
    getLicenseInfo,
    getUpgradeOptions,
    updateUserLicense,
    getAllUsers,
    loadUserLicense
  }

  return (
    <LicenseContext.Provider value={value}>
      {children}
    </LicenseContext.Provider>
  )
}
