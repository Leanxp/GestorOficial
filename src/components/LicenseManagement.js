import React, { useState, useEffect } from 'react'
import { useLicense } from '../hooks/useLicense'

const LicenseManagement = () => {
  const { getAllUsers, updateUserLicense, isAdmin } = useLicense()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    license_type: 'free',
    license_expires_at: '',
    max_ingredients: 50,
    max_suppliers: 10,
    is_admin: false
  })

  useEffect(() => {
    if (isAdmin()) {
      loadUsers()
    } else {
      setError('No tienes permisos para acceder a esta sección')
      setLoading(false)
    }
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const result = await getAllUsers()
      if (result.success) {
        setUsers(result.data)
      } else {
        setError('Error al cargar usuarios')
      }
    } catch (err) {
      setError('Error al cargar usuarios')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditForm({
      license_type: user.license_type || 'free',
      license_expires_at: user.license_expires_at ? new Date(user.license_expires_at).toISOString().split('T')[0] : '',
      max_ingredients: user.max_ingredients || 50,
      max_suppliers: user.max_suppliers || 10,
      is_admin: user.is_admin || false
    })
    setShowEditModal(true)
  }

  // Función para manejar clic fuera del modal
  const handleModalBackdropClick = (e, closeFunction) => {
    if (e.target === e.currentTarget) {
      closeFunction()
    }
  }

  const handleUpdateLicense = async (e) => {
    e.preventDefault()
    try {
      const licenseData = {
        ...editForm,
        license_expires_at: editForm.license_expires_at ? new Date(editForm.license_expires_at).toISOString() : null
      }

      const result = await updateUserLicense(selectedUser.email, licenseData)
      if (result.success) {
        setShowEditModal(false)
        loadUsers() // Recargar lista
        alert('Licencia actualizada correctamente')
      } else {
        alert('Error al actualizar licencia: ' + result.error)
      }
    } catch (err) {
      alert('Error al actualizar licencia: ' + err.message)
    }
  }

  const getLicenseTypeColor = (type) => {
    switch (type) {
      case 'premium': return 'bg-green-100 text-green-800'
      case 'free': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLicenseTypeText = (type) => {
    switch (type) {
      case 'premium': return 'Premium'
      case 'free': return 'Gratuita'
      default: return 'Desconocida'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha'
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  const isExpired = (dateString) => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-b-2 border-indigo-600"></div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Cargando usuarios...</p>
          <p className="text-sm text-gray-500 mt-1">Por favor espera un momento</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p className="text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Licencias</h2>
        <p className="text-gray-600">Administra las licencias de todos los usuarios</p>
      </div>

      {/* Vista móvil - Tarjetas */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.username}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600 truncate">{user.email}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleEditUser(user)}
                    className="p-3 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                    aria-label="Editar licencia de usuario"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                
                {/* Información de licencia */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Tipo de Licencia:</span>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getLicenseTypeColor(user.license_type)}`}>
                      {getLicenseTypeText(user.license_type)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Expira:</span>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${isExpired(user.license_expires_at) ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDate(user.license_expires_at)}
                      </div>
                      {isExpired(user.license_expires_at) && (
                        <span className="text-xs text-red-500">(Expirada)</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Administrador:</span>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_admin ? 'Sí' : 'No'}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-2">Límites de la Licencia</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-indigo-600">{user.max_ingredients}</div>
                        <div className="text-xs text-gray-500">Ingredientes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{user.max_suppliers}</div>
                        <div className="text-xs text-gray-500">Proveedores</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios registrados</h3>
              <p className="text-sm text-gray-500">Los usuarios aparecerán aquí una vez que se registren</p>
            </div>
          )}
        </div>
      </div>

      {/* Vista desktop - Tabla */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Licencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expira
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Límites
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLicenseTypeColor(user.license_type)}`}>
                      {getLicenseTypeText(user.license_type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isExpired(user.license_expires_at) ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatDate(user.license_expires_at)}
                      {isExpired(user.license_expires_at) && (
                        <span className="ml-1 text-xs text-red-500">(Expirada)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-xs">
                      <div>Ingredientes: {user.max_ingredients}</div>
                      <div>Proveedores: {user.max_suppliers}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_admin ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edición - Optimizado para móvil */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowEditModal(false))}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Editar Licencia</h2>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <form onSubmit={handleUpdateLicense} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
                    <input
                      type="text"
                      value={selectedUser?.username || ''}
                      disabled
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base bg-gray-100 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Licencia</label>
                    <select
                      value={editForm.license_type}
                      onChange={(e) => setEditForm({ ...editForm, license_type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="free">Gratuita</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Expiración</label>
                    <input
                      type="date"
                      value={editForm.license_expires_at}
                      onChange={(e) => setEditForm({ ...editForm, license_expires_at: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Máx. Ingredientes</label>
                      <input
                        type="number"
                        value={editForm.max_ingredients}
                        onChange={(e) => setEditForm({ ...editForm, max_ingredients: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Máx. Proveedores</label>
                      <input
                        type="number"
                        value={editForm.max_suppliers}
                        onChange={(e) => setEditForm({ ...editForm, max_suppliers: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="is_admin"
                      checked={editForm.is_admin}
                      onChange={(e) => setEditForm({ ...editForm, is_admin: e.target.checked })}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_admin" className="ml-3 block text-sm font-medium text-gray-900">
                      Es Administrador
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LicenseManagement
