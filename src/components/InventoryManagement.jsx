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
    supplier_ingredient_id: '',
    supplier_lot_number: '',
    supplier_price: '',
    delivery_date: '',
    invoice_number: '',
    quantity: '',
    purchase_price: '',
    expiry_date: '',
    batch_number: '',
    alerg_gluten: 0,
    alerg_crustaceos: 0,
    alerg_huevos: 0,
    alerg_pescado: 0,
    alerg_cacahuetes: 0,
    alerg_soja: 0,
    alerg_leche: 0,
    alerg_frutos: 0,
    alerg_apio: 0,
    alerg_mostaza: 0,
    alerg_sesamo: 0,
    alerg_sulfitos: 0,
    alerg_altramuces: 0,
    alerg_moluscos: 0
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
    supplier_ingredient_id: '',
    supplier_lot_number: '',
    supplier_price: '',
    delivery_date: '',
    invoice_number: '',
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

  // Hook para manejar el teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        // Cerrar el modal más reciente abierto
        if (showNewProductModal) {
          setShowNewProductModal(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNewProductModal]);

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
    const ingredient = item.ingredients || {};
    setEditForm({
      ingredient_name: item.ingredient_name,
      family_id: item.family_id,
      subfamily_id: item.subfamily_id,
      supplier_id: item.supplier_id || '',
      supplier_ingredient_id: item.supplier_ingredient_id || '',
      supplier_lot_number: item.supplier_lot_number || '',
      supplier_price: item.supplier_price || '',
      delivery_date: item.delivery_date || '',
      invoice_number: item.invoice_number || '',
      quantity: item.quantity,
      purchase_price: item.purchase_price,
      expiry_date: item.expiry_date,
      batch_number: item.batch_number,
      alerg_gluten: ingredient.alerg_gluten || 0,
      alerg_crustaceos: ingredient.alerg_crustaceos || 0,
      alerg_huevos: ingredient.alerg_huevos || 0,
      alerg_pescado: ingredient.alerg_pescado || 0,
      alerg_cacahuetes: ingredient.alerg_cacahuetes || 0,
      alerg_soja: ingredient.alerg_soja || 0,
      alerg_leche: ingredient.alerg_leche || 0,
      alerg_frutos: ingredient.alerg_frutos || 0,
      alerg_apio: ingredient.alerg_apio || 0,
      alerg_mostaza: ingredient.alerg_mostaza || 0,
      alerg_sesamo: ingredient.alerg_sesamo || 0,
      alerg_sulfitos: ingredient.alerg_sulfitos || 0,
      alerg_altramuces: ingredient.alerg_altramuces || 0,
      alerg_moluscos: ingredient.alerg_moluscos || 0
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
      supplier_ingredient_id: '',
      supplier_lot_number: '',
      supplier_price: '',
      delivery_date: '',
      invoice_number: '',
      quantity: '',
      purchase_price: '',
      expiry_date: '',
      batch_number: '',
      alerg_gluten: 0,
      alerg_crustaceos: 0,
      alerg_huevos: 0,
      alerg_pescado: 0,
      alerg_cacahuetes: 0,
      alerg_soja: 0,
      alerg_leche: 0,
      alerg_frutos: 0,
      alerg_apio: 0,
      alerg_mostaza: 0,
      alerg_sesamo: 0,
      alerg_sulfitos: 0,
      alerg_altramuces: 0,
      alerg_moluscos: 0
    });
  };

  const handleSaveEdit = async () => {
    try {
      console.log('Actualizando inventario con ID:', editingItem);
      
      // Obtener el item del inventario para acceder al ingredient_id
      const { data: inventoryItem, error: fetchError } = await supabase
        .from('inventory')
        .select('ingredient_id')
        .eq('id', editingItem)
        .single();
      
      if (fetchError) {
        console.error('Error al obtener item del inventario:', fetchError);
        throw fetchError;
      }
      
      // Actualizar los campos básicos del inventario
      const { error: inventoryError } = await supabase
        .from('inventory')
        .update({
          family_id: editForm.family_id,
          subfamily_id: editForm.subfamily_id,
          quantity: parseFloat(editForm.quantity),
          purchase_price: parseFloat(editForm.purchase_price),
          expiry_date: editForm.expiry_date,
          batch_number: editForm.batch_number,
          supplier_id: editForm.supplier_id || null,
          supplier_ingredient_id: editForm.supplier_ingredient_id || null,
          supplier_lot_number: editForm.supplier_lot_number || null,
          supplier_price: editForm.supplier_price ? parseFloat(editForm.supplier_price) : null,
          delivery_date: editForm.delivery_date || null,
          invoice_number: editForm.invoice_number || null
        })
        .eq('id', editingItem);
      
      if (inventoryError) {
        console.error('Error al actualizar inventario:', inventoryError);
        throw inventoryError;
      }
      
      // Actualizar los alérgenos en la tabla ingredients
      const { error: ingredientsError } = await supabase
        .from('ingredients')
        .update({
          alerg_gluten: editForm.alerg_gluten,
          alerg_crustaceos: editForm.alerg_crustaceos,
          alerg_huevos: editForm.alerg_huevos,
          alerg_pescado: editForm.alerg_pescado,
          alerg_cacahuetes: editForm.alerg_cacahuetes,
          alerg_soja: editForm.alerg_soja,
          alerg_leche: editForm.alerg_leche,
          alerg_frutos: editForm.alerg_frutos,
          alerg_apio: editForm.alerg_apio,
          alerg_mostaza: editForm.alerg_mostaza,
          alerg_sesamo: editForm.alerg_sesamo,
          alerg_sulfitos: editForm.alerg_sulfitos,
          alerg_altramuces: editForm.alerg_altramuces,
          alerg_moluscos: editForm.alerg_moluscos
        })
        .eq('id', inventoryItem.ingredient_id);
      
      if (ingredientsError) {
        console.error('Error al actualizar alérgenos:', ingredientsError);
        throw ingredientsError;
      }
      
      await fetchInventory();
      setEditingItem(null);
    } catch (err) {
      console.error('Error al actualizar el inventario:', err);
      setError('Error al actualizar el inventario: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
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
        active: true,
        // Incluir los alérgenos
        alerg_gluten: newProduct.alergeno_gluten,
        alerg_crustaceos: newProduct.alergeno_crustaceos,
        alerg_huevos: newProduct.alergeno_huevos,
        alerg_pescado: newProduct.alergeno_pescado,
        alerg_cacahuetes: newProduct.alergeno_cacahuetes,
        alerg_soja: newProduct.alergeno_soja,
        alerg_leche: newProduct.alergeno_leche,
        alerg_frutos: newProduct.alergeno_frutos_cascara,
        alerg_apio: newProduct.alergeno_apio,
        alerg_mostaza: newProduct.alergeno_mostaza,
        alerg_sesamo: newProduct.alergeno_sesamo,
        alerg_sulfitos: newProduct.alergeno_dioxido_azufre_sulfitos,
        alerg_altramuces: newProduct.alergeno_altramuces,
        alerg_moluscos: newProduct.alergeno_moluscos
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
        batch_number: newProduct.batch_number,
        supplier_id: newProduct.supplier_id ? parseInt(newProduct.supplier_id) : null,
        supplier_ingredient_id: newProduct.supplier_ingredient_id ? parseInt(newProduct.supplier_ingredient_id) : null,
        supplier_lot_number: newProduct.supplier_lot_number || null,
        supplier_price: newProduct.supplier_price ? parseFloat(newProduct.supplier_price) : null,
        delivery_date: newProduct.delivery_date || null,
        invoice_number: newProduct.invoice_number || null
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
        supplier_ingredient_id: '',
        supplier_lot_number: '',
        supplier_price: '',
        delivery_date: '',
        invoice_number: '',
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

  // Función para manejar clic fuera del modal
  const handleModalBackdropClick = (e, closeFunction) => {
    if (e.target === e.currentTarget) {
      closeFunction();
    }
  };

  const getAllergens = (item) => {
    const allergens = [];
    const ingredient = item.ingredients;
    if (!ingredient) return <span className="text-xs text-gray-500">Sin alérgenos</span>;
    
    if (ingredient.alerg_gluten === 1) allergens.push({ name: 'gluten', file: 'alerg_gluten.png' });
    if (ingredient.alerg_crustaceos === 1) allergens.push({ name: 'crustáceos', file: 'alerg_crustaceos.png' });
    if (ingredient.alerg_huevos === 1) allergens.push({ name: 'huevos', file: 'alerg_huevos.png' });
    if (ingredient.alerg_pescado === 1) allergens.push({ name: 'pescado', file: 'alerg_pescado.png' });
    if (ingredient.alerg_cacahuetes === 1) allergens.push({ name: 'cacahuetes', file: 'alerg_cacahuetes.png' });
    if (ingredient.alerg_soja === 1) allergens.push({ name: 'soja', file: 'alerg_soja.png' });
    if (ingredient.alerg_leche === 1) allergens.push({ name: 'leche', file: 'alerg_leche.png' });
    if (ingredient.alerg_frutos === 1) allergens.push({ name: 'frutos de cáscara', file: 'alerg_frutos.png' });
    if (ingredient.alerg_apio === 1) allergens.push({ name: 'apio', file: 'alerg_apio.png' });
    if (ingredient.alerg_mostaza === 1) allergens.push({ name: 'mostaza', file: 'alerg_mostaza.png' });
    if (ingredient.alerg_sesamo === 1) allergens.push({ name: 'sésamo', file: 'alerg_sesamo.png' });
    if (ingredient.alerg_sulfitos === 1) allergens.push({ name: 'sulfitos', file: 'alerg_sulfitos.png' });
    if (ingredient.alerg_altramuces === 1) allergens.push({ name: 'altramuces', file: 'alerg_altramuces.png' });
    if (ingredient.alerg_moluscos === 1) allergens.push({ name: 'moluscos', file: 'alerg_moluscos.png' });
    
    if (allergens.length === 0) {
      return <span className="text-xs text-gray-500">Sin alérgenos</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {allergens.map((allergen, index) => (
          <img
            key={index}
            src={`/${allergen.file}`}
            alt={allergen.name}
            className="w-6 h-6 object-contain"
            title={allergen.name}
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-b-2 border-indigo-600"></div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Cargando inventario...</p>
          <p className="text-sm text-gray-500 mt-1">Obteniendo productos disponibles</p>
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el inventario</h3>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchInventory}
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
        {/* Botón de nuevo producto */}
        <div className="flex justify-center sm:justify-start">
          <button 
            onClick={() => setShowNewProductModal(true)}
            className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 touch-manipulation"
            aria-label="Agregar nuevo producto al inventario"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Nuevo Producto</span>
            </span>
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar producto..."
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
        
        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={selectedFamily}
            onChange={handleFamilyChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Todas las familias</option>
            {families.map(family => (
              <option key={family.id} value={family.id}>{family.name}</option>
            ))}
          </select>

          <select
            value={selectedSubfamily}
            onChange={handleSubfamilyChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            disabled={!selectedFamily}
          >
            <option value="">Todas las subfamilias</option>
            {subfamilies.map(subfamily => (
              <option key={subfamily.id} value={subfamily.id}>{subfamily.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal para nuevo producto - Responsive */}
      {showNewProductModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowNewProductModal(false))}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Nuevo Producto</h2>
                <button
                  onClick={() => setShowNewProductModal(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <form onSubmit={handleNewProductSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Ingrediente</label>
                    <input
                      type="text"
                      name="ingredient_name"
                      value={newProduct.ingredient_name}
                      onChange={handleNewProductChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ej: Tomate fresco"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                    <textarea
                      name="description"
                      value={newProduct.description}
                      onChange={handleNewProductChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                      placeholder="Descripción opcional del ingrediente"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Familia</label>
                      <select
                        name="family_id"
                        value={newProduct.family_id}
                        onChange={handleFamilyChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Seleccionar familia</option>
                        {families.map(family => (
                          <option key={family.id} value={family.id}>{family.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subfamilia</label>
                      <select
                        name="subfamily_id"
                        value={newProduct.subfamily_id}
                        onChange={handleSubfamilyChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                        disabled={!newProduct.family_id}
                      >
                        <option value="">Seleccionar subfamilia</option>
                        {subfamilies.map(subfamily => (
                          <option key={subfamily.id} value={subfamily.id}>{subfamily.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Proveedor</label>
                    <select
                      name="supplier_id"
                      value={newProduct.supplier_id}
                      onChange={handleNewProductChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Seleccionar proveedor</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cantidad</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          name="quantity"
                          value={newProduct.quantity}
                          onChange={handleNewProductChange}
                          className="flex-1 border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0"
                          required
                          min="0"
                          step="0.01"
                        />
                        <select
                          name="unit_measure"
                          value={newProduct.unit_measure}
                          onChange={handleNewProductChange}
                          className="w-32 sm:w-36 md:w-40 border border-gray-300 rounded-lg shadow-sm py-3 px-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Precio de Compra (€)</label>
                      <input
                        type="number"
                        name="purchase_price"
                        value={newProduct.purchase_price}
                        onChange={handleNewProductChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Información del proveedor */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Información del Proveedor</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Proveedor</label>
                        <select
                          name="supplier_id"
                          value={newProduct.supplier_id}
                          onChange={handleNewProductChange}
                          className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Seleccionar proveedor</option>
                          {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Precio del Proveedor (€)</label>
                        <input
                          type="number"
                          name="supplier_price"
                          value={newProduct.supplier_price}
                          onChange={handleNewProductChange}
                          className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Lote del Proveedor</label>
                        <input
                          type="text"
                          name="supplier_lot_number"
                          value={newProduct.supplier_lot_number}
                          onChange={handleNewProductChange}
                          className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Ej: LOTE-2025-001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Entrega</label>
                        <input
                          type="date"
                          name="delivery_date"
                          value={newProduct.delivery_date}
                          onChange={handleNewProductChange}
                          className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Número de Factura</label>
                      <input
                        type="text"
                        name="invoice_number"
                        value={newProduct.invoice_number}
                        onChange={handleNewProductChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: FACT-2025-001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Caducidad</label>
                      <input
                        type="date"
                        name="expiry_date"
                        value={newProduct.expiry_date}
                        onChange={handleNewProductChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Número de Lote</label>
                      <input
                        type="text"
                        name="batch_number"
                        value={newProduct.batch_number}
                        onChange={handleNewProductChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: L001"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Alérgenos</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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

                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowNewProductModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Vista móvil - Tarjetas */}
      <div className="block md:hidden">
        <div className="space-y-4">
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">
                    {item.ingredients?.name || 'N/A'}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">{item.inventory_families?.name}</span>
                    {item.inventory_subfamilies?.name && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{item.inventory_subfamilies.name}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {editingItem === item.id ? (
                    <>
                      <button 
                        onClick={handleSaveEdit}
                        className="p-3 text-green-600 hover:bg-green-50 active:bg-green-100 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                        aria-label="Guardar cambios"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="p-3 text-gray-600 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                        aria-label="Cancelar edición"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-3 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                        aria-label="Editar producto"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-3 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                        aria-label="Eliminar producto"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Información principal */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 py-2">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8-4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-1">Cantidad</div>
                  {editingItem === item.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        name="quantity"
                        value={editForm.quantity}
                        onChange={handleInputChange}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        min="0"
                        step="0.01"
                      />
                      <span className="text-xs text-gray-500">{item.ingredients?.unit_measure || 'N/A'}</span>
                    </div>
                  ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {item.quantity} <span className="text-xs text-gray-500">{item.ingredients?.unit_measure || 'N/A'}</span>
                    </div>
                  )}
                </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 py-2">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">Precio de Compra</div>
                  {editingItem === item.id ? (
                    <input
                      type="number"
                      name="purchase_price"
                      value={editForm.purchase_price}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded text-sm"
                      min="0"
                      step="0.01"
                    />
                  ) : (
                        <div className="text-sm font-medium text-gray-900">{item.purchase_price} €</div>
                  )}
                </div>
              </div>

                  <div className="flex items-center space-x-3 py-2">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">Fecha de Caducidad</div>
                  {editingItem === item.id ? (
                    <input
                      type="date"
                      name="expiry_date"
                      value={editForm.expiry_date}
                      onChange={handleInputChange}
                          className="w-full px-2 py-1 border rounded text-sm"
                    />
                  ) : (
                        <div className="text-sm font-medium text-gray-900">
                      {new Date(item.expiry_date).toLocaleDateString()}
                        </div>
                  )}
                    </div>
                </div>
                
                  <div className="flex items-center space-x-3 py-2">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">Número de Lote</div>
                  {editingItem === item.id ? (
                    <input
                      type="text"
                      name="batch_number"
                      value={editForm.batch_number}
                      onChange={handleInputChange}
                          className="w-full px-2 py-1 border rounded text-sm"
                    />
                  ) : (
                        <div className="text-sm font-medium text-gray-900">{item.batch_number}</div>
                  )}
                    </div>
                </div>


                {/* Información del proveedor en modo edición */}
                {editingItem === item.id && (
                  <div className="flex items-center space-x-3 py-2">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">Proveedor</div>
                      <div className="grid grid-cols-1 gap-2">
                        <select
                          name="supplier_id"
                          value={editForm.supplier_id}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          <option value="">Seleccionar proveedor</option>
                          {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                          ))}
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            name="supplier_lot_number"
                            value={editForm.supplier_lot_number}
                            onChange={handleInputChange}
                            placeholder="Lote proveedor"
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="number"
                            name="supplier_price"
                            value={editForm.supplier_price}
                            onChange={handleInputChange}
                            placeholder="Precio proveedor"
                            step="0.01"
                            className="px-2 py-1 border rounded text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            name="delivery_date"
                            value={editForm.delivery_date}
                            onChange={handleInputChange}
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="text"
                            name="invoice_number"
                            value={editForm.invoice_number}
                            onChange={handleInputChange}
                            placeholder="Nº factura"
                            className="px-2 py-1 border rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alérgenos */}
                  <div className="flex items-center space-x-3 py-2">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                  </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">Alérgenos</div>
                      <div className="flex-1">
                        {editingItem === item.id ? (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_gluten"
                                checked={editForm.alerg_gluten === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Gluten</label>
                </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_crustaceos"
                                checked={editForm.alerg_crustaceos === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Crustáceos</label>
              </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_huevos"
                                checked={editForm.alerg_huevos === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Huevos</label>
            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_pescado"
                                checked={editForm.alerg_pescado === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Pescado</label>
        </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_cacahuetes"
                                checked={editForm.alerg_cacahuetes === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Cacahuetes</label>
      </div>
                            <div className="flex items-center">
                      <input
                                type="checkbox"
                                name="alerg_soja"
                                checked={editForm.alerg_soja === 1}
                        onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Soja</label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_leche"
                                checked={editForm.alerg_leche === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Leche</label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_frutos"
                                checked={editForm.alerg_frutos === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Frutos cáscara</label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_apio"
                                checked={editForm.alerg_apio === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Apio</label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_mostaza"
                                checked={editForm.alerg_mostaza === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Mostaza</label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_sesamo"
                                checked={editForm.alerg_sesamo === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Sésamo</label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_sulfitos"
                                checked={editForm.alerg_sulfitos === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Sulfitos</label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_altramuces"
                                checked={editForm.alerg_altramuces === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Altramuces</label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="alerg_moluscos"
                                checked={editForm.alerg_moluscos === 1}
                                onChange={handleInputChange}
                                className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-1 text-gray-700">Moluscos</label>
                            </div>
                          </div>
                        ) : (
                          getAllergens(item)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8-4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron productos' : 'No hay productos en el inventario'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm 
                  ? `No se encontraron productos que coincidan con "${searchTerm}"`
                  : 'Comienza agregando tu primer producto al inventario'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowNewProductModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Agregar Primer Producto
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vista desktop - Tarjetas */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Header de la tarjeta */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 break-words mb-1">
                        {item.ingredients?.name || 'N/A'}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 font-medium">{item.inventory_families?.name}</span>
                        {item.inventory_subfamilies?.name && (
                          <>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span className="text-xs text-gray-500">{item.inventory_subfamilies.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                    {editingItem === item.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-105"
                            aria-label="Guardar cambios"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:scale-105"
                            aria-label="Cancelar edición"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:scale-105"
                            aria-label="Editar producto"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                            aria-label="Eliminar producto"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Información de inventario */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8-4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">Cantidad</div>
                    {editingItem === item.id ? (
                          <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          name="quantity"
                          value={editForm.quantity}
                          onChange={handleInputChange}
                              className="flex-1 px-2 py-1 border rounded text-sm"
                          min="0"
                          step="0.01"
                        />
                            <span className="text-xs text-gray-500">{item.ingredients?.unit_measure || 'N/A'}</span>
                      </div>
                    ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {item.quantity} <span className="text-xs text-gray-500">{item.ingredients?.unit_measure || 'N/A'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">Precio de Compra</div>
                    {editingItem === item.id ? (
                      <input
                        type="number"
                        name="purchase_price"
                        value={editForm.purchase_price}
                        onChange={handleInputChange}
                            className="w-full px-2 py-1 border rounded text-sm"
                        min="0"
                        step="0.01"
                      />
                    ) : (
                          <div className="text-sm font-medium text-gray-900">{item.purchase_price} €</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">Fecha de Caducidad</div>
                    {editingItem === item.id ? (
                      <input
                        type="date"
                        name="expiry_date"
                        value={editForm.expiry_date}
                        onChange={handleInputChange}
                            className="w-full px-2 py-1 border rounded text-sm"
                      />
                    ) : (
                          <div className="text-sm font-medium text-gray-900">
                        {new Date(item.expiry_date).toLocaleDateString()}
                      </div>
                    )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">Número de Lote</div>
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        name="batch_number"
                        value={editForm.batch_number}
                        onChange={handleInputChange}
                            className="w-full px-2 py-1 border rounded text-sm"
                      />
                    ) : (
                          <div className="text-sm font-medium text-gray-900">{item.batch_number}</div>
                        )}
                      </div>
                    </div>


                    {/* Alérgenos */}
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">Alérgenos</div>
                        <div className="flex-1">
                          {editingItem === item.id ? (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_gluten"
                                  checked={editForm.alerg_gluten === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Gluten</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_crustaceos"
                                  checked={editForm.alerg_crustaceos === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Crustáceos</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_huevos"
                                  checked={editForm.alerg_huevos === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Huevos</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_pescado"
                                  checked={editForm.alerg_pescado === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Pescado</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_cacahuetes"
                                  checked={editForm.alerg_cacahuetes === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Cacahuetes</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_soja"
                                  checked={editForm.alerg_soja === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Soja</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_leche"
                                  checked={editForm.alerg_leche === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Leche</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_frutos"
                                  checked={editForm.alerg_frutos === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Frutos cáscara</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_apio"
                                  checked={editForm.alerg_apio === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Apio</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_mostaza"
                                  checked={editForm.alerg_mostaza === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Mostaza</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_sesamo"
                                  checked={editForm.alerg_sesamo === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Sésamo</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_sulfitos"
                                  checked={editForm.alerg_sulfitos === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Sulfitos</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_altramuces"
                                  checked={editForm.alerg_altramuces === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Altramuces</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="alerg_moluscos"
                                  checked={editForm.alerg_moluscos === 1}
                                  onChange={handleInputChange}
                                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-1 text-gray-700">Moluscos</label>
                              </div>
                            </div>
                          ) : (
                            getAllergens(item)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8-4" />
                          </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron productos' : 'No hay productos en el inventario'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm 
                  ? `No se encontraron productos que coincidan con "${searchTerm}"`
                  : 'Comienza agregando tu primer producto al inventario'
                }
              </p>
              {!searchTerm && (
                        <button 
                  onClick={() => setShowNewProductModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                  Agregar Primer Producto
                        </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement; 