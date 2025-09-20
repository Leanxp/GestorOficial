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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
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
    <div className="py-2">
      <div className="mb-6">
        <p className="text-gray-600">Administra las licencias de todos los usuarios</p>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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

      {/* Modal de edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Editar Licencia</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateLicense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Usuario</label>
                  <input
                    type="text"
                    value={selectedUser?.username || ''}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo de Licencia</label>
                  <select
                    value={editForm.license_type}
                    onChange={(e) => setEditForm({ ...editForm, license_type: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="free">Gratuita</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Expiración</label>
                  <input
                    type="date"
                    value={editForm.license_expires_at}
                    onChange={(e) => setEditForm({ ...editForm, license_expires_at: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Máx. Ingredientes</label>
                    <input
                      type="number"
                      value={editForm.max_ingredients}
                      onChange={(e) => setEditForm({ ...editForm, max_ingredients: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Máx. Proveedores</label>
                    <input
                      type="number"
                      value={editForm.max_suppliers}
                      onChange={(e) => setEditForm({ ...editForm, max_suppliers: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_admin"
                    checked={editForm.is_admin}
                    onChange={(e) => setEditForm({ ...editForm, is_admin: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">
                    Es Administrador
                  </label>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
