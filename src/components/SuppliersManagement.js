import React, { useState, useEffect } from 'react';
import { database } from '../config/supabase';

const SuppliersManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [showCreateIngredientModal, setShowCreateIngredientModal] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showViewIngredientsModal, setShowViewIngredientsModal] = useState(false);
  const [showEditIngredientModal, setShowEditIngredientModal] = useState(false);
  const [showDeleteIngredientModal, setShowDeleteIngredientModal] = useState(false);
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [selectedSupplierForView, setSelectedSupplierForView] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedSupplierForEdit, setSelectedSupplierForEdit] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });
  const [newIngredient, setNewIngredient] = useState({
    ingredient_id: '',
    supplier_price: '',
    notes: ''
  });
  const [editIngredient, setEditIngredient] = useState({
    ingredient_id: '',
    supplier_price: '',
    notes: '',
    alerg_gluten: false,
    alerg_crustaceos: false,
    alerg_huevos: false,
    alerg_pescado: false,
    alerg_cacahuetes: false,
    alerg_soja: false,
    alerg_leche: false,
    alerg_frutos: false,
    alerg_apio: false,
    alerg_mostaza: false,
    alerg_sesamo: false,
    alerg_sulfitos: false,
    alerg_altramuces: false,
    alerg_moluscos: false
  });
  const [editSupplier, setEditSupplier] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });
  const [newIngredientForCreation, setNewIngredientForCreation] = useState({
    name: '',
    description: '',
    category_id: '',
    unit_measure: 'kg',
    base_price: 0,
    alerg_gluten: false,
    alerg_crustaceos: false,
    alerg_huevos: false,
    alerg_pescado: false,
    alerg_cacahuetes: false,
    alerg_soja: false,
    alerg_leche: false,
    alerg_frutos: false,
    alerg_apio: false,
    alerg_mostaza: false,
    alerg_sesamo: false,
    alerg_sulfitos: false,
    alerg_altramuces: false,
    alerg_moluscos: false
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supplierIngredients, setSupplierIngredients] = useState({});

  // Hook para manejar el teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        // Cerrar el modal más reciente abierto
        if (showCreateCategoryModal) {
          setShowCreateCategoryModal(false);
        } else if (showCreateIngredientModal) {
          setShowCreateIngredientModal(false);
        } else if (showAddIngredientModal) {
          setShowAddIngredientModal(false);
        } else if (showEditIngredientModal) {
          setShowEditIngredientModal(false);
        } else if (showDeleteIngredientModal) {
          setShowDeleteIngredientModal(false);
        } else if (showViewIngredientsModal) {
          setShowViewIngredientsModal(false);
        } else if (showEditSupplierModal) {
          setShowEditSupplierModal(false);
        } else if (showAddModal) {
          setShowAddModal(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCreateCategoryModal, showCreateIngredientModal, showAddIngredientModal, showEditIngredientModal, showDeleteIngredientModal, showViewIngredientsModal, showEditSupplierModal, showAddModal]);

  useEffect(() => {
    fetchSuppliers();
    fetchIngredients();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const result = await database.getCategories();
      if (result.success) {
        setCategories(result.data);
      } else {
        console.error('Error fetching categories:', result.error);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
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

  const handleViewIngredients = async (supplier) => {
    try {
      const result = await database.getSupplierIngredients(supplier.id);
      if (result.success) {
        setSupplierIngredients(prev => ({
          ...prev,
          [supplier.id]: result.data
        }));
        setSelectedSupplierForView(supplier);
        setShowViewIngredientsModal(true);
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
          supplier_price: '',
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

  const handleCreateIngredient = async (e) => {
    e.preventDefault();
    try {
      // Convertir los valores booleanos de alérgenos a 1 o 0 para la base de datos
      const ingredientData = {
        ...newIngredientForCreation,
        alerg_gluten: newIngredientForCreation.alerg_gluten ? 1 : 0,
        alerg_crustaceos: newIngredientForCreation.alerg_crustaceos ? 1 : 0,
        alerg_huevos: newIngredientForCreation.alerg_huevos ? 1 : 0,
        alerg_pescado: newIngredientForCreation.alerg_pescado ? 1 : 0,
        alerg_cacahuetes: newIngredientForCreation.alerg_cacahuetes ? 1 : 0,
        alerg_soja: newIngredientForCreation.alerg_soja ? 1 : 0,
        alerg_leche: newIngredientForCreation.alerg_leche ? 1 : 0,
        alerg_frutos: newIngredientForCreation.alerg_frutos ? 1 : 0,
        alerg_apio: newIngredientForCreation.alerg_apio ? 1 : 0,
        alerg_mostaza: newIngredientForCreation.alerg_mostaza ? 1 : 0,
        alerg_sesamo: newIngredientForCreation.alerg_sesamo ? 1 : 0,
        alerg_sulfitos: newIngredientForCreation.alerg_sulfitos ? 1 : 0,
        alerg_altramuces: newIngredientForCreation.alerg_altramuces ? 1 : 0,
        alerg_moluscos: newIngredientForCreation.alerg_moluscos ? 1 : 0
      };

      const result = await database.createIngredient(ingredientData);
      if (result.success) {
        // Actualizar la lista de ingredientes
        await fetchIngredients();
        // Seleccionar automáticamente el nuevo ingrediente
        setNewIngredient(prev => ({
          ...prev,
          ingredient_id: result.data.id
        }));
        // Cerrar el modal de crear ingrediente
        setShowCreateIngredientModal(false);
        // Resetear el formulario de crear ingrediente
        setNewIngredientForCreation({
          name: '',
          description: '',
          category_id: '',
          unit_measure: 'kg',
          base_price: 0,
          alerg_gluten: false,
          alerg_crustaceos: false,
          alerg_huevos: false,
          alerg_pescado: false,
          alerg_cacahuetes: false,
          alerg_soja: false,
          alerg_leche: false,
          alerg_frutos: false,
          alerg_apio: false,
          alerg_mostaza: false,
          alerg_sesamo: false,
          alerg_sulfitos: false,
          alerg_altramuces: false,
          alerg_moluscos: false
        });
      } else {
        console.error('Error creating ingredient:', result.error);
      }
    } catch (err) {
      console.error('Error creating ingredient:', err);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const result = await database.createCategory(newCategory);
      if (result.success) {
        // Actualizar la lista de categorías
        await fetchCategories();
        // Seleccionar automáticamente la nueva categoría
        setNewIngredientForCreation(prev => ({
          ...prev,
          category_id: result.data.id
        }));
        // Cerrar el modal de crear categoría
        setShowCreateCategoryModal(false);
        // Resetear el formulario de crear categoría
        setNewCategory({
          name: '',
          description: ''
        });
      } else {
        console.error('Error creating category:', result.error);
      }
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  const handleAllergenChange = (allergenName) => {
    setNewIngredientForCreation(prev => ({
      ...prev,
      [allergenName]: !prev[allergenName]
    }));
  };

  const handleEditAllergenChange = (allergenName) => {
    setEditIngredient(prev => ({
      ...prev,
      [allergenName]: !prev[allergenName]
    }));
  };

  const handleEditIngredient = async (e) => {
    e.preventDefault();
    try {
      // Actualizar los datos del supplier_ingredient
      const supplierIngredientData = {
        ingredient_id: editIngredient.ingredient_id,
        supplier_price: editIngredient.supplier_price,
        notes: editIngredient.notes
      };
      
      const result = await database.updateSupplierIngredient(selectedIngredient.id, supplierIngredientData);
      
      if (result.success) {
        // Actualizar los alérgenos del ingrediente
        const allergenData = {
          alerg_gluten: editIngredient.alerg_gluten ? 1 : 0,
          alerg_crustaceos: editIngredient.alerg_crustaceos ? 1 : 0,
          alerg_huevos: editIngredient.alerg_huevos ? 1 : 0,
          alerg_pescado: editIngredient.alerg_pescado ? 1 : 0,
          alerg_cacahuetes: editIngredient.alerg_cacahuetes ? 1 : 0,
          alerg_soja: editIngredient.alerg_soja ? 1 : 0,
          alerg_leche: editIngredient.alerg_leche ? 1 : 0,
          alerg_frutos: editIngredient.alerg_frutos ? 1 : 0,
          alerg_apio: editIngredient.alerg_apio ? 1 : 0,
          alerg_mostaza: editIngredient.alerg_mostaza ? 1 : 0,
          alerg_sesamo: editIngredient.alerg_sesamo ? 1 : 0,
          alerg_sulfitos: editIngredient.alerg_sulfitos ? 1 : 0,
          alerg_altramuces: editIngredient.alerg_altramuces ? 1 : 0,
          alerg_moluscos: editIngredient.alerg_moluscos ? 1 : 0
        };
        
        const allergenResult = await database.updateIngredient(editIngredient.ingredient_id, allergenData);
        
        if (allergenResult.success) {
          setShowEditIngredientModal(false);
          setEditIngredient({
            ingredient_id: '',
            supplier_price: '',
            notes: '',
            alerg_gluten: false,
            alerg_crustaceos: false,
            alerg_huevos: false,
            alerg_pescado: false,
            alerg_cacahuetes: false,
            alerg_soja: false,
            alerg_leche: false,
            alerg_frutos: false,
            alerg_apio: false,
            alerg_mostaza: false,
            alerg_sesamo: false,
            alerg_sulfitos: false,
            alerg_altramuces: false,
            alerg_moluscos: false
          });
          setSelectedIngredient(null);
          // Refresh the supplier's ingredients
          const refreshResult = await database.getSupplierIngredients(selectedSupplierForView.id);
          if (refreshResult.success) {
            setSupplierIngredients(prev => ({
              ...prev,
              [selectedSupplierForView.id]: refreshResult.data
            }));
          }
        } else {
          console.error('Error updating ingredient allergens:', allergenResult.error);
        }
      } else {
        console.error('Error updating ingredient:', result.error);
      }
    } catch (err) {
      console.error('Error updating ingredient:', err);
    }
  };

  const handleDeleteIngredient = async () => {
    try {
      const result = await database.deleteSupplierIngredient(selectedIngredient.id);
      if (result.success) {
        setShowDeleteIngredientModal(false);
        setSelectedIngredient(null);
        // Refresh the supplier's ingredients
        const refreshResult = await database.getSupplierIngredients(selectedSupplierForView.id);
        if (refreshResult.success) {
          setSupplierIngredients(prev => ({
            ...prev,
            [selectedSupplierForView.id]: refreshResult.data
          }));
        }
      } else {
        console.error('Error deleting ingredient:', result.error);
      }
    } catch (err) {
      console.error('Error deleting ingredient:', err);
    }
  };

  const openEditIngredientModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setEditIngredient({
      ingredient_id: ingredient.ingredient_id,
      supplier_price: ingredient.supplier_price,
      notes: ingredient.notes || '',
      alerg_gluten: ingredient.ingredients?.alerg_gluten === 1 || ingredient.ingredients?.alerg_gluten === true,
      alerg_crustaceos: ingredient.ingredients?.alerg_crustaceos === 1 || ingredient.ingredients?.alerg_crustaceos === true,
      alerg_huevos: ingredient.ingredients?.alerg_huevos === 1 || ingredient.ingredients?.alerg_huevos === true,
      alerg_pescado: ingredient.ingredients?.alerg_pescado === 1 || ingredient.ingredients?.alerg_pescado === true,
      alerg_cacahuetes: ingredient.ingredients?.alerg_cacahuetes === 1 || ingredient.ingredients?.alerg_cacahuetes === true,
      alerg_soja: ingredient.ingredients?.alerg_soja === 1 || ingredient.ingredients?.alerg_soja === true,
      alerg_leche: ingredient.ingredients?.alerg_leche === 1 || ingredient.ingredients?.alerg_leche === true,
      alerg_frutos: ingredient.ingredients?.alerg_frutos === 1 || ingredient.ingredients?.alerg_frutos === true,
      alerg_apio: ingredient.ingredients?.alerg_apio === 1 || ingredient.ingredients?.alerg_apio === true,
      alerg_mostaza: ingredient.ingredients?.alerg_mostaza === 1 || ingredient.ingredients?.alerg_mostaza === true,
      alerg_sesamo: ingredient.ingredients?.alerg_sesamo === 1 || ingredient.ingredients?.alerg_sesamo === true,
      alerg_sulfitos: ingredient.ingredients?.alerg_sulfitos === 1 || ingredient.ingredients?.alerg_sulfitos === true,
      alerg_altramuces: ingredient.ingredients?.alerg_altramuces === 1 || ingredient.ingredients?.alerg_altramuces === true,
      alerg_moluscos: ingredient.ingredients?.alerg_moluscos === 1 || ingredient.ingredients?.alerg_moluscos === true
    });
    setShowEditIngredientModal(true);
  };

  const openDeleteIngredientModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setShowDeleteIngredientModal(true);
  };

  const handleEditSupplier = async (e) => {
    e.preventDefault();
    try {
      const result = await database.updateSupplier(selectedSupplierForEdit.id, editSupplier);
      if (result.success) {
        setShowEditSupplierModal(false);
        setEditSupplier({
          name: '',
          contact_person: '',
          email: '',
          phone: '',
          address: ''
        });
        setSelectedSupplierForEdit(null);
        // Refresh the suppliers list
        fetchSuppliers();
      } else {
        console.error('Error updating supplier:', result.error);
      }
    } catch (err) {
      console.error('Error updating supplier:', err);
    }
  };

  const openEditSupplierModal = (supplier) => {
    setSelectedSupplierForEdit(supplier);
    setEditSupplier({
      name: supplier.name,
      contact_person: supplier.contact_person,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address
    });
    setShowEditSupplierModal(true);
  };

  // Función para manejar clic fuera del modal
  const handleModalBackdropClick = (e, closeFunction) => {
    if (e.target === e.currentTarget) {
      closeFunction();
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const name = supplier.name?.toLowerCase() || '';
    const contactPerson = supplier.contact_person?.toLowerCase() || '';
    const email = supplier.email?.toLowerCase() || '';
    const phone = supplier.phone?.toLowerCase() || '';
    const address = supplier.address?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    return name.includes(searchLower) || 
           contactPerson.includes(searchLower) || 
           email.includes(searchLower) || 
           phone.includes(searchLower) || 
           address.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-b-2 border-indigo-600"></div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Cargando proveedores...</p>
          <p className="text-sm text-gray-500 mt-1">Obteniendo información de proveedores</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar los proveedores</h3>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchSuppliers}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Barra de herramientas optimizada para móvil */}
      <div className="space-y-4 mb-6">
        {/* Botón de nuevo proveedor */}
        <div className="flex justify-center sm:justify-start">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 touch-manipulation"
            aria-label="Agregar nuevo proveedor"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Nuevo Proveedor</span>
            </span>
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Vista móvil - Tarjetas */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 break-words">
                    {supplier.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">{supplier.contact_person}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewIngredients(supplier)}
                    className="p-3 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                    aria-label="Ver ingredientes"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => openEditSupplierModal(supplier)}
                    className="p-3 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                    aria-label="Editar proveedor"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="p-3 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                    aria-label="Eliminar proveedor"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Información principal */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 py-2">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <div className="text-sm font-medium text-gray-900 break-words">{supplier.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 py-2">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">Teléfono</div>
                    <div className="text-sm font-medium text-gray-900">{supplier.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 py-2">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">Dirección</div>
                    <div className="text-sm font-medium text-gray-900">{supplier.address}</div>
                  </div>
                </div>
              </div>

            </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.709" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm 
                  ? `No se encontraron proveedores que coincidan con "${searchTerm}"`
                  : 'Comienza agregando tu primer proveedor'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Agregar Primer Proveedor
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vista desktop - Tarjetas */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Header de la tarjeta */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 break-words mb-1">
                      {supplier.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 font-medium">{supplier.contact_person}</span>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-500">Contacto</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleViewIngredients(supplier)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:scale-105"
                        aria-label="Ver ingredientes"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </button>
                          <button
                        onClick={() => openEditSupplierModal(supplier)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
                        aria-label="Editar proveedor"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                        aria-label="Eliminar proveedor"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                          </button>
                        </div>
                        </div>

                  {/* Información de contacto */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">Email</div>
                        <div className="text-sm font-medium text-gray-900 break-words">{supplier.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">Teléfono</div>
                        <div className="text-sm font-medium text-gray-900">{supplier.phone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">Dirección</div>
                        <div className="text-sm font-medium text-gray-900">{supplier.address}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
                ))
              ) : (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.709" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {searchTerm 
                          ? `No se encontraron proveedores que coincidan con "${searchTerm}"`
                          : 'Comienza agregando tu primer proveedor'
                        }
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Agregar Primer Proveedor
                        </button>
                      )}
                    </div>
              )}
        </div>
      </div>

      {/* Modal para agregar proveedor - Optimizado para móvil */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowAddModal(false))}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Nuevo Proveedor</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <form onSubmit={handleAddSupplier} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Proveedor</label>
                    <input
                      type="text"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ej: Distribuidora ABC"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Persona de Contacto</label>
                    <input
                      type="text"
                      value={newSupplier.contact_person}
                      onChange={(e) => setNewSupplier({ ...newSupplier, contact_person: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ej: Juan Pérez"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newSupplier.email}
                      onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ej: contacto@proveedor.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={newSupplier.phone}
                      onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ej: +34 123 456 789"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ej: Calle Mayor 123, Madrid"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Guardar Proveedor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar ingrediente - Mejorado y visual */}
      {showAddIngredientModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowAddIngredientModal(false))}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Header mejorado */}
            <div className="bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Agregar Ingrediente</h2>
                    <p className="text-gray-600 text-sm">Añadir nuevo ingrediente al proveedor</p>
                  </div>
              </div>
                <button
                  onClick={() => setShowAddIngredientModal(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              </div>
            </div>

            {/* Formulario mejorado */}
            <form onSubmit={handleAddIngredient} className="p-6 space-y-6">
              {/* Selector de ingrediente con búsqueda visual */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    <span className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Seleccionar Ingrediente</span>
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCreateIngredientModal(true)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center space-x-1 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Crear Nuevo</span>
                  </button>
                </div>
                <div className="relative">
                <select
                  value={newIngredient.ingredient_id}
                  onChange={(e) => setNewIngredient({ ...newIngredient, ingredient_id: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none bg-white"
                  required
                >
                    <option value="">🔍 Buscar ingrediente...</option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </option>
                  ))}
                </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Campo de precio mejorado */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Precio por Unidad</span>
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg font-medium">€</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newIngredient.supplier_price}
                    onChange={(e) => setNewIngredient({ ...newIngredient, supplier_price: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Precio por unidad de medida del ingrediente</p>
              </div>

              {/* Campo de notas mejorado */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Notas Adicionales</span>
                    <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                  </span>
                </label>
                <textarea
                  value={newIngredient.notes}
                  onChange={(e) => setNewIngredient({ ...newIngredient, notes: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                  rows="3"
                  placeholder="Información adicional sobre el ingrediente, calidad, origen, etc..."
                />
                <p className="text-xs text-gray-500">Información adicional que pueda ser útil</p>
              </div>

              {/* Botones mejorados */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddIngredientModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Agregar Ingrediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para visualizar ingredientes del proveedor */}
      {showViewIngredientsModal && selectedSupplierForView && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowViewIngredientsModal(false))}
        >
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl transform transition-all duration-300 scale-100 overflow-hidden">
            {/* Header del modal */}
            <div className="bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Ingredientes del Proveedor</h2>
                    <p className="text-gray-700 text-base sm:text-lg">{selectedSupplierForView.name}</p>
                    <p className="text-gray-600 text-sm">{selectedSupplierForView.contact_person}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedSupplierId(selectedSupplierForView.id);
                      setShowAddIngredientModal(true);
                    }}
                    className="bg-green-600 text-white px-3 py-2 sm:px-4 rounded-xl hover:bg-green-700 text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-1 sm:space-x-2"
                  >
                    <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="hidden sm:inline">Agregar Ingrediente</span>
                  </button>
                  <button
                    onClick={() => setShowViewIngredientsModal(false)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {supplierIngredients[selectedSupplierForView.id]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {supplierIngredients[selectedSupplierForView.id].map((ingredient, index) => (
                    <div key={ingredient.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                          <h3 className="text-lg font-bold text-gray-900 break-words">
                            {ingredient.ingredients?.name || 'N/A'}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="text-lg font-bold text-indigo-600">
                              {ingredient.supplier_price} €
                            </div>
                            <div className="text-xs text-gray-500">
                              por unidad
                            </div>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => openEditIngredientModal(ingredient)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                              aria-label="Editar ingrediente"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => openDeleteIngredientModal(ingredient)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                              aria-label="Eliminar ingrediente"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {ingredient.notes && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">Notas:</div>
                          <div className="text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-2">
                            {ingredient.notes}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Última actualización:</span>
                        <span className="font-medium">
                          {ingredient.updated_at ? new Date(ingredient.updated_at).toLocaleDateString() : '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay ingredientes registrados</h3>
                  <p className="text-gray-500 mb-6">Este proveedor aún no tiene ingredientes asociados</p>
                  <button
                    onClick={() => {
                      setSelectedSupplierId(selectedSupplierForView.id);
                      setShowAddIngredientModal(true);
                    }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Agregar Primer Ingrediente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar ingrediente */}
      {showEditIngredientModal && selectedIngredient && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowEditIngredientModal(false))}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Editar Ingrediente</h2>
                    <p className="text-gray-600 text-sm">Modificar información del ingrediente</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditIngredientModal(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Formulario de edición */}
            <form onSubmit={handleEditIngredient} className="p-6 space-y-6">
              {/* Selector de ingrediente */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Ingrediente</span>
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={editIngredient.ingredient_id}
                    onChange={(e) => setEditIngredient({ ...editIngredient, ingredient_id: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                    required
                  >
                    <option value="">🔍 Seleccionar ingrediente...</option>
                    {ingredients.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Campo de precio */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Precio por Unidad</span>
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg font-medium">€</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editIngredient.supplier_price}
                    onChange={(e) => setEditIngredient({ ...editIngredient, supplier_price: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Precio por unidad de medida del ingrediente</p>
              </div>

              {/* Campo de notas */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Notas Adicionales</span>
                    <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                  </span>
                </label>
                <textarea
                  value={editIngredient.notes}
                  onChange={(e) => setEditIngredient({ ...editIngredient, notes: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows="3"
                  placeholder="Información adicional sobre el ingrediente, calidad, origen, etc..."
                />
                <p className="text-xs text-gray-500">Información adicional que pueda ser útil</p>
              </div>

              {/* Alérgenos */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>Alérgenos</span>
                    <span className="text-xs text-gray-500 font-normal">(marcar si contiene)</span>
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_gluten"
                      checked={editIngredient.alerg_gluten}
                      onChange={() => handleEditAllergenChange('alerg_gluten')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_gluten" className="text-sm font-medium text-gray-700">Gluten</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_crustaceos"
                      checked={editIngredient.alerg_crustaceos}
                      onChange={() => handleEditAllergenChange('alerg_crustaceos')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_crustaceos" className="text-sm font-medium text-gray-700">Crustáceos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_huevos"
                      checked={editIngredient.alerg_huevos}
                      onChange={() => handleEditAllergenChange('alerg_huevos')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_huevos" className="text-sm font-medium text-gray-700">Huevos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_pescado"
                      checked={editIngredient.alerg_pescado}
                      onChange={() => handleEditAllergenChange('alerg_pescado')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_pescado" className="text-sm font-medium text-gray-700">Pescado</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_cacahuetes"
                      checked={editIngredient.alerg_cacahuetes}
                      onChange={() => handleEditAllergenChange('alerg_cacahuetes')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_cacahuetes" className="text-sm font-medium text-gray-700">Cacahuetes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_soja"
                      checked={editIngredient.alerg_soja}
                      onChange={() => handleEditAllergenChange('alerg_soja')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_soja" className="text-sm font-medium text-gray-700">Soja</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_leche"
                      checked={editIngredient.alerg_leche}
                      onChange={() => handleEditAllergenChange('alerg_leche')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_leche" className="text-sm font-medium text-gray-700">Leche</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_frutos"
                      checked={editIngredient.alerg_frutos}
                      onChange={() => handleEditAllergenChange('alerg_frutos')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_frutos" className="text-sm font-medium text-gray-700">Frutos cáscara</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_apio"
                      checked={editIngredient.alerg_apio}
                      onChange={() => handleEditAllergenChange('alerg_apio')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_apio" className="text-sm font-medium text-gray-700">Apio</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_mostaza"
                      checked={editIngredient.alerg_mostaza}
                      onChange={() => handleEditAllergenChange('alerg_mostaza')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_mostaza" className="text-sm font-medium text-gray-700">Mostaza</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_sesamo"
                      checked={editIngredient.alerg_sesamo}
                      onChange={() => handleEditAllergenChange('alerg_sesamo')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_sesamo" className="text-sm font-medium text-gray-700">Sésamo</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_sulfitos"
                      checked={editIngredient.alerg_sulfitos}
                      onChange={() => handleEditAllergenChange('alerg_sulfitos')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_sulfitos" className="text-sm font-medium text-gray-700">Sulfitos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_altramuces"
                      checked={editIngredient.alerg_altramuces}
                      onChange={() => handleEditAllergenChange('alerg_altramuces')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_altramuces" className="text-sm font-medium text-gray-700">Altramuces</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_alerg_moluscos"
                      checked={editIngredient.alerg_moluscos}
                      onChange={() => handleEditAllergenChange('alerg_moluscos')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_alerg_moluscos" className="text-sm font-medium text-gray-700">Moluscos</label>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Marca los alérgenos que contiene este ingrediente</p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditIngredientModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para confirmar eliminación de ingrediente */}
      {showDeleteIngredientModal && selectedIngredient && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowDeleteIngredientModal(false))}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl transform transition-all duration-300 scale-100">
            {/* Header del modal */}
            <div className="bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Eliminar Ingrediente</h2>
                  <p className="text-gray-600 text-sm">Esta acción no se puede deshacer</p>
                </div>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Eliminar ingrediente?
                </h3>
                <p className="text-gray-600 mb-4">
                  Estás a punto de eliminar el ingrediente <strong>{selectedIngredient.ingredients?.name}</strong> del proveedor <strong>{selectedSupplierForView?.name}</strong>.
                </p>
                <p className="text-sm text-gray-500">
                  Esta acción eliminará permanentemente la información del ingrediente y no se puede deshacer.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteIngredientModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteIngredient}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Eliminar</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar proveedor */}
      {showEditSupplierModal && selectedSupplierForEdit && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowEditSupplierModal(false))}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl sm:rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Editar Proveedor</h2>
                    <p className="text-gray-600 text-sm">Modificar información del proveedor</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditSupplierModal(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Formulario de edición */}
            <form onSubmit={handleEditSupplier} className="p-4 sm:p-6 space-y-6">
              <div className="space-y-4">
                {/* Nombre del proveedor */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Nombre del Proveedor</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={editSupplier.name}
                    onChange={(e) => setEditSupplier({ ...editSupplier, name: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ej: Distribuidora ABC"
                    required
                  />
                </div>

                {/* Persona de contacto */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Persona de Contacto</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={editSupplier.contact_person}
                    onChange={(e) => setEditSupplier({ ...editSupplier, contact_person: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Email</span>
                    </span>
                  </label>
                  <input
                    type="email"
                    value={editSupplier.email}
                    onChange={(e) => setEditSupplier({ ...editSupplier, email: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ej: contacto@proveedor.com"
                    required
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Teléfono</span>
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={editSupplier.phone}
                    onChange={(e) => setEditSupplier({ ...editSupplier, phone: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ej: +34 123 456 789"
                    required
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Dirección</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={editSupplier.address}
                    onChange={(e) => setEditSupplier({ ...editSupplier, address: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ej: Calle Mayor 123, Madrid"
                    required
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditSupplierModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para crear nuevo ingrediente */}
      {showCreateIngredientModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowCreateIngredientModal(false))}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Ingrediente</h2>
                    <p className="text-gray-600 text-sm">Añadir ingrediente al sistema</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateIngredientModal(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Formulario de creación */}
            <form onSubmit={handleCreateIngredient} className="p-6 space-y-6">
              {/* Nombre del ingrediente */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Nombre del Ingrediente</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={newIngredientForCreation.name}
                  onChange={(e) => setNewIngredientForCreation({ ...newIngredientForCreation, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="Ej: Tomate Cherry"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>Descripción</span>
                    <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                  </span>
                </label>
                <textarea
                  value={newIngredientForCreation.description}
                  onChange={(e) => setNewIngredientForCreation({ ...newIngredientForCreation, description: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                  rows="3"
                  placeholder="Descripción del ingrediente..."
                />
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    <span className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Categoría</span>
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCreateCategoryModal(true)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Crear Nueva</span>
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={newIngredientForCreation.category_id}
                    onChange={(e) => setNewIngredientForCreation({ ...newIngredientForCreation, category_id: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none bg-white"
                    required
                  >
                    <option value="">🏷️ Seleccionar categoría...</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Unidad de medida */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4h6" />
                    </svg>
                    <span>Unidad de Medida</span>
                  </span>
                </label>
                <select
                  value={newIngredientForCreation.unit_measure}
                  onChange={(e) => setNewIngredientForCreation({ ...newIngredientForCreation, unit_measure: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none bg-white"
                >
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="g">Gramos (g)</option>
                  <option value="l">Litros (l)</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="unidad">Unidad</option>
                  <option value="paquete">Paquete</option>
                  <option value="caja">Caja</option>
                </select>
              </div>

              {/* Precio base */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Precio Base</span>
                    <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg font-medium">€</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newIngredientForCreation.base_price}
                    onChange={(e) => setNewIngredientForCreation({ ...newIngredientForCreation, base_price: parseFloat(e.target.value) || 0 })}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500">Precio base por unidad de medida</p>
              </div>

              {/* Alérgenos */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>Alérgenos</span>
                    <span className="text-xs text-gray-500 font-normal">(marcar si contiene)</span>
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_gluten"
                      checked={newIngredientForCreation.alerg_gluten}
                      onChange={() => handleAllergenChange('alerg_gluten')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_gluten" className="text-sm font-medium text-gray-700">Gluten</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_crustaceos"
                      checked={newIngredientForCreation.alerg_crustaceos}
                      onChange={() => handleAllergenChange('alerg_crustaceos')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_crustaceos" className="text-sm font-medium text-gray-700">Crustáceos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_huevos"
                      checked={newIngredientForCreation.alerg_huevos}
                      onChange={() => handleAllergenChange('alerg_huevos')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_huevos" className="text-sm font-medium text-gray-700">Huevos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_pescado"
                      checked={newIngredientForCreation.alerg_pescado}
                      onChange={() => handleAllergenChange('alerg_pescado')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_pescado" className="text-sm font-medium text-gray-700">Pescado</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_cacahuetes"
                      checked={newIngredientForCreation.alerg_cacahuetes}
                      onChange={() => handleAllergenChange('alerg_cacahuetes')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_cacahuetes" className="text-sm font-medium text-gray-700">Cacahuetes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_soja"
                      checked={newIngredientForCreation.alerg_soja}
                      onChange={() => handleAllergenChange('alerg_soja')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_soja" className="text-sm font-medium text-gray-700">Soja</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_leche"
                      checked={newIngredientForCreation.alerg_leche}
                      onChange={() => handleAllergenChange('alerg_leche')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_leche" className="text-sm font-medium text-gray-700">Leche</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_frutos"
                      checked={newIngredientForCreation.alerg_frutos}
                      onChange={() => handleAllergenChange('alerg_frutos')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_frutos" className="text-sm font-medium text-gray-700">Frutos cáscara</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_apio"
                      checked={newIngredientForCreation.alerg_apio}
                      onChange={() => handleAllergenChange('alerg_apio')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_apio" className="text-sm font-medium text-gray-700">Apio</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_mostaza"
                      checked={newIngredientForCreation.alerg_mostaza}
                      onChange={() => handleAllergenChange('alerg_mostaza')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_mostaza" className="text-sm font-medium text-gray-700">Mostaza</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_sesamo"
                      checked={newIngredientForCreation.alerg_sesamo}
                      onChange={() => handleAllergenChange('alerg_sesamo')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_sesamo" className="text-sm font-medium text-gray-700">Sésamo</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_sulfitos"
                      checked={newIngredientForCreation.alerg_sulfitos}
                      onChange={() => handleAllergenChange('alerg_sulfitos')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_sulfitos" className="text-sm font-medium text-gray-700">Sulfitos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_altramuces"
                      checked={newIngredientForCreation.alerg_altramuces}
                      onChange={() => handleAllergenChange('alerg_altramuces')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_altramuces" className="text-sm font-medium text-gray-700">Altramuces</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="alerg_moluscos"
                      checked={newIngredientForCreation.alerg_moluscos}
                      onChange={() => handleAllergenChange('alerg_moluscos')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alerg_moluscos" className="text-sm font-medium text-gray-700">Moluscos</label>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Marca los alérgenos que contiene este ingrediente</p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateIngredientModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Crear Ingrediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para crear nueva categoría */}
      {showCreateCategoryModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80] p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowCreateCategoryModal(false))}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Crear Nueva Categoría</h2>
                    <p className="text-gray-600 text-sm">Añadir categoría al sistema</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateCategoryModal(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Formulario de creación */}
            <form onSubmit={handleCreateCategory} className="p-6 space-y-6">
              {/* Nombre de la categoría */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Nombre de la Categoría</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Ej: Verduras, Carnes, Lácteos..."
                  required
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>Descripción</span>
                    <span className="text-xs text-gray-500 font-normal">(opcional)</span>
                  </span>
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                  rows="3"
                  placeholder="Descripción de la categoría..."
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateCategoryModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersManagement; 