import React, { useState, useEffect } from 'react';
import { database } from '../config/supabase';

const SuppliersManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });
  const [newIngredient, setNewIngredient] = useState({
    ingredient_id: '',
    price: '',
    notes: ''
  });
  const [ingredients, setIngredients] = useState([]);
  const [expandedSupplier, setExpandedSupplier] = useState(null);
  const [supplierIngredients, setSupplierIngredients] = useState({});

  useEffect(() => {
    fetchSuppliers();
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const result = await database.getIngredients();
      if (result.success) {
        setIngredients(result.data);
      } else {
        console.error('Error fetching ingredients:', result.error);
      }
    } catch (err) {
      console.error('Error fetching ingredients:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const result = await database.getSuppliers();
      if (result.success) {
        setSuppliers(result.data);
        setError(null);
      } else {
        setError('Error al cargar los proveedores');
        console.error('Error fetching suppliers:', result.error);
      }
    } catch (err) {
      setError('Error al cargar los proveedores');
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const result = await database.createSupplier(newSupplier);
      if (result.success) {
        setShowAddModal(false);
        setNewSupplier({
          name: '',
          contact_person: '',
          email: '',
          phone: '',
          address: ''
        });
        fetchSuppliers();
      } else {
        console.error('Error adding supplier:', result.error);
      }
    } catch (err) {
      console.error('Error adding supplier:', err);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        const result = await database.deleteSupplier(id);
        if (result.success) {
          fetchSuppliers();
        } else {
          console.error('Error deleting supplier:', result.error);
        }
      } catch (err) {
        console.error('Error deleting supplier:', err);
      }
    }
  };

  const handleSupplierClick = async (supplierId) => {
    if (expandedSupplier === supplierId) {
      setExpandedSupplier(null);
      return;
    }

    try {
      const result = await database.getSupplierIngredients(supplierId);
      if (result.success) {
        setSupplierIngredients(prev => ({
          ...prev,
          [supplierId]: result.data
        }));
        setExpandedSupplier(supplierId);
      } else {
        console.error('Error fetching supplier ingredients:', result.error);
      }
    } catch (err) {
      console.error('Error fetching supplier ingredients:', err);
    }
  };

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    try {
      const result = await database.addSupplierIngredient(selectedSupplierId, newIngredient);
      if (result.success) {
        setShowAddIngredientModal(false);
        setNewIngredient({
          ingredient_id: '',
          price: '',
          notes: ''
        });
        // Refresh the supplier's ingredients
        const refreshResult = await database.getSupplierIngredients(selectedSupplierId);
        if (refreshResult.success) {
          setSupplierIngredients(prev => ({
            ...prev,
            [selectedSupplierId]: refreshResult.data
          }));
        }
      } else {
        console.error('Error adding ingredient:', result.error);
      }
    } catch (err) {
      console.error('Error adding ingredient:', err);
    }
  };

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Gestión de Proveedores</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Agregar Proveedor
        </button>
      </div>

      {/* Tabla de Proveedores */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Persona de Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <React.Fragment key={supplier.id}>
                <tr 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSupplierClick(supplier.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.contact_person}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSupplier(supplier.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
                {expandedSupplier === supplier.id && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Ingredientes del Proveedor</h3>
                        <button
                          onClick={() => {
                            setSelectedSupplierId(supplier.id);
                            setShowAddIngredientModal(true);
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                        >
                          Agregar Ingrediente
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ingrediente
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Última Actualización
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {supplierIngredients[supplier.id]?.map((ingredient) => (
                              <tr key={ingredient.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {ingredient.ingredients?.name || 'N/A'}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {ingredient.price} €
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {ingredient.notes || '-'}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {ingredient.updated_at ? new Date(ingredient.updated_at).toLocaleDateString() : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar proveedor */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Agregar Nuevo Proveedor</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddSupplier} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Persona de Contacto</label>
                    <input
                      type="text"
                      value={newSupplier.contact_person}
                      onChange={(e) => setNewSupplier({ ...newSupplier, contact_person: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={newSupplier.email}
                      onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="tel"
                      value={newSupplier.phone}
                      onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <input
                      type="text"
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-center space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar ingrediente */}
      {showAddIngredientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Agregar Nuevo Ingrediente</h2>
                <button
                  onClick={() => setShowAddIngredientModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddIngredient} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ingrediente</label>
                    <select
                      value={newIngredient.ingredient_id}
                      onChange={(e) => setNewIngredient({ ...newIngredient, ingredient_id: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Seleccionar ingrediente</option>
                      {ingredients.map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newIngredient.price}
                      onChange={(e) => setNewIngredient({ ...newIngredient, price: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      value={newIngredient.notes}
                      onChange={(e) => setNewIngredient({ ...newIngredient, notes: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="flex justify-center space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddIngredientModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersManagement; 