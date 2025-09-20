import React, { useState, useEffect } from 'react';
import { database, supabase } from '../config/supabase';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [selectedSubfamily, setSelectedSubfamily] = useState('');
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubfamilies] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    ingredient_name: '',
    family_id: '',
    subfamily_id: '',
    supplier_id: '',
    quantity: '',
    purchase_price: '',
    expiry_date: '',
    batch_number: ''
  });
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    ingredient_name: '',
    description: '',
    family_id: '',
    subfamily_id: '',
    quantity: '',
    purchase_price: '',
    expiry_date: '',
    batch_number: '',
    supplier_id: '',
    unit_measure: '',
    alergeno_gluten: 0,
    alergeno_crustaceos: 0,
    alergeno_huevos: 0,
    alergeno_pescado: 0,
    alergeno_cacahuetes: 0,
    alergeno_soja: 0,
    alergeno_leche: 0,
    alergeno_frutos_cascara: 0,
    alergeno_apio: 0,
    alergeno_mostaza: 0,
    alergeno_sesamo: 0,
    alergeno_dioxido_azufre_sulfitos: 0,
    alergeno_altramuces: 0,
    alergeno_moluscos: 0
  });
  const [suppliers, setSuppliers] = useState([]);
  const [unitMeasures] = useState([
    'kg',
    'g',
    'litro',
    'ml',
    'unidades',
    'paquetes',
    'latas',
    'botellas',
    'cajas'
  ]);

  useEffect(() => {
    fetchInventory();
    fetchFamilies();
    fetchSuppliers();
  }, []);

  const fetchInventory = async () => {
    try {
      const result = await database.getInventory();
      if (result.success) {
        setInventory(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar el inventario:', err);
      setError('Error al cargar el inventario');
      setLoading(false);
    }
  };

  const fetchFamilies = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_families')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setFamilies(data);
    } catch (err) {
      console.error('Error al cargar las familias:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const result = await database.getSuppliers();
      if (result.success) {
        setSuppliers(result.data);
      }
    } catch (err) {
      console.error('Error al cargar los proveedores:', err);
    }
  };

  const handleFamilyChange = async (e) => {
    const familyId = e.target.value;
    setSelectedFamily(familyId);
    setSelectedSubfamily('');
    setNewProduct(prev => ({
      ...prev,
      family_id: familyId,
      subfamily_id: ''
    }));
    
    if (familyId) {
      try {
        console.log('Cargando subfamilias para familia:', familyId);
        const { data, error } = await supabase
          .from('inventory_subfamilies')
          .select('*')
          .eq('family_id', familyId)
          .order('name');
        
        if (error) throw error;
        console.log('Respuesta de subfamilias:', data);
        setSubfamilies(data || []);
      } catch (err) {
        console.error('Error al cargar las subfamilias:', err);
        setError('Error al cargar las subfamilias');
        setSubfamilies([]);
      }
    } else {
      setSubfamilies([]);
    }
  };

  const handleSubfamilyChange = (e) => {
    const subfamilyId = e.target.value;
    setSelectedSubfamily(subfamilyId);
    setNewProduct(prev => ({
      ...prev,
      subfamily_id: subfamilyId
    }));
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setEditForm({
      ingredient_name: item.ingredient_name,
      family_id: item.family_id,
      subfamily_id: item.subfamily_id,
      supplier_id: item.supplier_id,
      quantity: item.quantity,
      purchase_price: item.purchase_price,
      expiry_date: item.expiry_date,
      batch_number: item.batch_number
    });
    if (item.family_id) {
      fetchSubfamiliesForEdit(item.family_id);
    }
  };

  const fetchSubfamiliesForEdit = async (familyId) => {
    try {
      const { data, error } = await supabase
        .from('inventory_subfamilies')
        .select('*')
        .eq('family_id', familyId)
        .order('name');
      
      if (error) throw error;
      setSubfamilies(data || []);
    } catch (err) {
      console.error('Error al cargar las subfamilias:', err);
      setSubfamilies([]);
    }
  };

  const handleEditFamilyChange = async (e) => {
    const familyId = e.target.value;
    setEditForm(prev => ({
      ...prev,
      family_id: familyId,
      subfamily_id: ''
    }));
    
    if (familyId) {
      await fetchSubfamiliesForEdit(familyId);
    } else {
      setSubfamilies([]);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({
      ingredient_name: '',
      family_id: '',
      subfamily_id: '',
      supplier_id: '',
      quantity: '',
      purchase_price: '',
      expiry_date: '',
      batch_number: ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('inventory')
        .update({
          family_id: editForm.family_id,
          subfamily_id: editForm.subfamily_id,
          quantity: editForm.quantity,
          purchase_price: editForm.purchase_price,
          expiry_date: editForm.expiry_date,
          batch_number: editForm.batch_number
        })
        .eq('id', editingItem);
      
      if (error) throw error;
      await fetchInventory();
      setEditingItem(null);
    } catch (err) {
      console.error('Error al actualizar el inventario:', err);
      setError('Error al actualizar el inventario');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este item del inventario?')) {
      try {
        const { error } = await supabase
          .from('inventory')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        await fetchInventory();
      } catch (err) {
        console.error('Error al eliminar el inventario:', err);
        setError('Error al eliminar el inventario');
      }
    }
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewProductSubmit = async (e) => {
    e.preventDefault();
    try {
      // Primero crear el ingrediente
      const ingredientData = {
        name: newProduct.ingredient_name,
        description: newProduct.description,
        category_id: 1, // Por defecto categoría 1
        base_price: parseFloat(newProduct.purchase_price) || 0,
        unit_measure: newProduct.unit_measure,
        min_stock_level: 10, // Valor por defecto
        active: true
      };

      const { data: ingredient, error: ingredientError } = await supabase
        .from('ingredients')
        .insert([ingredientData])
        .select()
        .single();

      if (ingredientError) throw ingredientError;

      // Luego crear el item de inventario
      const inventoryData = {
        ingredient_id: ingredient.id,
        family_id: parseInt(newProduct.family_id),
        subfamily_id: newProduct.subfamily_id ? parseInt(newProduct.subfamily_id) : null,
        quantity: parseFloat(newProduct.quantity),
        purchase_price: parseFloat(newProduct.purchase_price),
        expiry_date: newProduct.expiry_date,
        batch_number: newProduct.batch_number
      };

      const { error: inventoryError } = await supabase
        .from('inventory')
        .insert([inventoryData]);

      if (inventoryError) throw inventoryError;

      await fetchInventory();
      setShowNewProductModal(false);
      setNewProduct({
        ingredient_name: '',
        description: '',
        family_id: '',
        subfamily_id: '',
        quantity: '',
        purchase_price: '',
        expiry_date: '',
        batch_number: '',
        supplier_id: '',
        unit_measure: '',
        alergeno_gluten: 0,
        alergeno_crustaceos: 0,
        alergeno_huevos: 0,
        alergeno_pescado: 0,
        alergeno_cacahuetes: 0,
        alergeno_soja: 0,
        alergeno_leche: 0,
        alergeno_frutos_cascara: 0,
        alergeno_apio: 0,
        alergeno_mostaza: 0,
        alergeno_sesamo: 0,
        alergeno_dioxido_azufre_sulfitos: 0,
        alergeno_altramuces: 0,
        alergeno_moluscos: 0
      });
    } catch (err) {
      console.error('Error al crear el producto:', err);
      setError('Error al crear el producto');
    }
  };

  const getAllergens = (item) => {
    const allergens = [];
    if (item.alergeno_gluten === 1) allergens.push('alerg_gluten.png');
    if (item.alergeno_crustaceos === 1) allergens.push('alerg_crustaceos.png');
    if (item.alergeno_huevos === 1) allergens.push('alerg_huevos.png');
    if (item.alergeno_pescado === 1) allergens.push('alerg_pescado.png');
    if (item.alergeno_cacahuetes === 1) allergens.push('alerg_cacahuetes.png');
    if (item.alergeno_soja === 1) allergens.push('alerg_soja.png');
    if (item.alergeno_leche === 1) allergens.push('alerg_leche.png');
    if (item.alergeno_frutos_cascara === 1) allergens.push('alerg_frutos.png');
    if (item.alergeno_apio === 1) allergens.push('alerg_apio.png');
    if (item.alergeno_mostaza === 1) allergens.push('alerg_mostaza.png');
    if (item.alergeno_sesamo === 1) allergens.push('alerg_sesamo.png');
    if (item.alergeno_dioxido_azufre_sulfitos === 1) allergens.push('alerg_sulfitos.png');
    if (item.alergeno_altramuces === 1) allergens.push('alerg_altramuces.png');
    if (item.alergeno_moluscos === 1) allergens.push('alerg_moluscos.png');
    
    if (allergens.length === 0) {
      return <span className="text-xs text-gray-500">Sin alérgenos</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {allergens.map((allergen, index) => (
          <img
            key={index}
            src={`/alerg_${allergen.split('_')[1]}`}
            alt={allergen.split('_')[1].replace('.png', '')}
            className="w-6 h-6 object-contain"
            title={allergen.split('_')[1].replace('.png', '')}
          />
        ))}
      </div>
    );
  };

  const filteredInventory = inventory.filter(item => {
    const ingredientName = item.ingredients?.name || '';
    const matchesSearch = ingredientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = !selectedFamily || item.family_id === parseInt(selectedFamily);
    const matchesSubfamily = !selectedSubfamily || item.subfamily_id === parseInt(selectedSubfamily);
    return matchesSearch && matchesFamily && matchesSubfamily;
  });

  if (loading) return <div className="flex justify-center items-center h-64">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="py-4">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={() => setShowNewProductModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Nuevo Producto
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
        
        <div className="flex gap-4">
          <select
            value={selectedFamily}
            onChange={handleFamilyChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Todas las familias</option>
            {families.map(family => (
              <option key={family.id} value={family.id}>{family.name}</option>
            ))}
          </select>

          <select
            value={selectedSubfamily}
            onChange={handleSubfamilyChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={!selectedFamily}
          >
            <option value="">Todas las subfamilias</option>
            {subfamilies.map(subfamily => (
              <option key={subfamily.id} value={subfamily.id}>{subfamily.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal para nuevo producto */}
      {showNewProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Nuevo Producto</h2>
                <button
                  onClick={() => setShowNewProductModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleNewProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Ingrediente</label>
                    <input
                      type="text"
                      name="ingredient_name"
                      value={newProduct.ingredient_name}
                      onChange={handleNewProductChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      name="description"
                      value={newProduct.description}
                      onChange={handleNewProductChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Familia</label>
                    <select
                      name="family_id"
                      value={newProduct.family_id}
                      onChange={handleFamilyChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Seleccionar familia</option>
                      {families.map(family => (
                        <option key={family.id} value={family.id}>{family.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subfamilia</label>
                    <select
                      name="subfamily_id"
                      value={newProduct.subfamily_id}
                      onChange={handleSubfamilyChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={!newProduct.family_id}
                    >
                      <option value="">Seleccionar subfamilia</option>
                      {subfamilies.map(subfamily => (
                        <option key={subfamily.id} value={subfamily.id}>{subfamily.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                    <select
                      name="supplier_id"
                      value={newProduct.supplier_id}
                      onChange={handleNewProductChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Seleccionar proveedor</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          name="quantity"
                          value={newProduct.quantity}
                          onChange={handleNewProductChange}
                          className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                          min="0"
                          step="0.01"
                        />
                        <select
                          name="unit_measure"
                          value={newProduct.unit_measure}
                          onChange={handleNewProductChange}
                          className="mt-1 block w-16 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Unidad</option>
                          {unitMeasures.map((unit, index) => (
                            <option key={index} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Precio de Compra</label>
                      <input
                        type="number"
                        name="purchase_price"
                        value={newProduct.purchase_price}
                        onChange={handleNewProductChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha de Caducidad</label>
                      <input
                        type="date"
                        name="expiry_date"
                        value={newProduct.expiry_date}
                        onChange={handleNewProductChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Número de Lote</label>
                      <input
                        type="text"
                        name="batch_number"
                        value={newProduct.batch_number}
                        onChange={handleNewProductChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alérgenos</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_gluten"
                          checked={newProduct.alergeno_gluten === 1}
                          onChange={(e) => {
                            console.log('Checkbox gluten cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_gluten: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Gluten</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_crustaceos"
                          checked={newProduct.alergeno_crustaceos === 1}
                          onChange={(e) => {
                            console.log('Checkbox crustaceos cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_crustaceos: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Crustáceos</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_huevos"
                          checked={newProduct.alergeno_huevos === 1}
                          onChange={(e) => {
                            console.log('Checkbox huevos cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_huevos: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Huevos</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_pescado"
                          checked={newProduct.alergeno_pescado === 1}
                          onChange={(e) => {
                            console.log('Checkbox pescado cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_pescado: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Pescado</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_cacahuetes"
                          checked={newProduct.alergeno_cacahuetes === 1}
                          onChange={(e) => {
                            console.log('Checkbox cacahuetes cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_cacahuetes: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Cacahuetes</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_soja"
                          checked={newProduct.alergeno_soja === 1}
                          onChange={(e) => {
                            console.log('Checkbox soja cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_soja: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Soja</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_leche"
                          checked={newProduct.alergeno_leche === 1}
                          onChange={(e) => {
                            console.log('Checkbox leche cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_leche: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Leche</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_frutos_cascara"
                          checked={newProduct.alergeno_frutos_cascara === 1}
                          onChange={(e) => {
                            console.log('Checkbox frutos cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_frutos_cascara: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Frutos de cáscara</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_apio"
                          checked={newProduct.alergeno_apio === 1}
                          onChange={(e) => {
                            console.log('Checkbox apio cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_apio: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Apio</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_mostaza"
                          checked={newProduct.alergeno_mostaza === 1}
                          onChange={(e) => {
                            console.log('Checkbox mostaza cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_mostaza: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Mostaza</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_sesamo"
                          checked={newProduct.alergeno_sesamo === 1}
                          onChange={(e) => {
                            console.log('Checkbox sesamo cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_sesamo: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Sésamo</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_dioxido_azufre_sulfitos"
                          checked={newProduct.alergeno_dioxido_azufre_sulfitos === 1}
                          onChange={(e) => {
                            console.log('Checkbox sulfitos cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_dioxido_azufre_sulfitos: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Dióxido de azufre y sulfitos</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_altramuces"
                          checked={newProduct.alergeno_altramuces === 1}
                          onChange={(e) => {
                            console.log('Checkbox altramuces cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_altramuces: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Altramuces</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="alergeno_moluscos"
                          checked={newProduct.alergeno_moluscos === 1}
                          onChange={(e) => {
                            console.log('Checkbox moluscos cambiado:', e.target.checked);
                            setNewProduct(prev => ({
                              ...prev,
                              alergeno_moluscos: e.target.checked ? 1 : 0
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Moluscos</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewProductModal(false)}
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

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Familia
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Subfamilia
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Proveedor
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Precio
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Caducidad
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Lote
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alérgenos
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingItem === item.id ? (
                      <>
                        <input
                          type="text"
                          name="ingredient_name"
                          value={editForm.ingredient_name}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      </>
                    ) : (
                      <>
                        <div className="text-xs font-medium text-gray-900">{item.ingredients?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500 md:hidden">
                          {item.inventory_families?.name} {item.inventory_subfamilies?.name ? `- ${item.inventory_subfamilies.name}` : ''}
                        </div>
                      </>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell">
                    {editingItem === item.id ? (
                      <select
                        name="family_id"
                        value={editForm.family_id}
                        onChange={handleEditFamilyChange}
                        className="w-full px-2 py-1 border rounded text-xs"
                      >
                        <option value="">Seleccionar familia</option>
                        {families.map(family => (
                          <option key={family.id} value={family.id}>{family.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-xs text-gray-900">{item.inventory_families?.name || 'N/A'}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden lg:table-cell">
                    {editingItem === item.id ? (
                      <select
                        name="subfamily_id"
                        value={editForm.subfamily_id}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded text-xs"
                        disabled={!editForm.family_id}
                      >
                        <option value="">Seleccionar subfamilia</option>
                        {subfamilies.map(subfamily => (
                          <option key={subfamily.id} value={subfamily.id}>{subfamily.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-xs text-gray-900">{item.inventory_subfamilies?.name || '-'}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell">
                    {editingItem === item.id ? (
                      <select
                        name="supplier_id"
                        value={editForm.supplier_id}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded text-xs"
                      >
                        <option value="">Seleccionar proveedor</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-xs text-gray-900">N/A</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingItem === item.id ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          name="quantity"
                          value={editForm.quantity}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 border rounded text-xs"
                          min="0"
                          step="0.01"
                        />
                        <div className="text-xs text-gray-500">{item.ingredients?.unit_measure || 'N/A'}</div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-900">{item.quantity} {item.ingredients?.unit_measure || 'N/A'}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden sm:table-cell">
                    {editingItem === item.id ? (
                      <input
                        type="number"
                        name="purchase_price"
                        value={editForm.purchase_price}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded text-xs"
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      <div className="text-xs text-gray-900">{item.purchase_price} €</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden lg:table-cell">
                    {editingItem === item.id ? (
                      <input
                        type="date"
                        name="expiry_date"
                        value={editForm.expiry_date}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded text-xs"
                      />
                    ) : (
                      <div className="text-xs text-gray-900">
                        {new Date(item.expiry_date).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden xl:table-cell">
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        name="batch_number"
                        value={editForm.batch_number}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded text-xs"
                      />
                    ) : (
                      <div className="text-xs text-gray-900">{item.batch_number}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {getAllergens(item)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                    {editingItem === item.id ? (
                      <>
                        <button 
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-900 mr-2"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement; 