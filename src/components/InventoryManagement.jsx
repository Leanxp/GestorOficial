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
    batch_number: ''
  });
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    ingredient_id: '',
    family_id: '',
    subfamily_id: '',
    supplier_id: '',
    quantity: '',
    expiry_date: '',
    batch_number: ''
  });
  const [ingredients, setIngredients] = useState([]);
  const [availableSuppliers, setAvailableSuppliers] = useState([]);
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] = useState(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [showMovementsModal, setShowMovementsModal] = useState(false);
  const [movements, setMovements] = useState([]);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [expandedDates, setExpandedDates] = useState(new Set());

  // Hook para manejar el teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        // Cerrar el modal más reciente abierto
        if (showDeleteProductModal) {
          setShowDeleteProductModal(false);
        } else if (showMovementsModal) {
          closeMovementsModal();
        } else if (showNewProductModal) {
          handleCloseModal();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDeleteProductModal, showMovementsModal, showNewProductModal]);

  useEffect(() => {
    fetchInventory();
    fetchFamilies();
    fetchIngredients();
  }, []);

  // Filtrar ingredientes para el autocompletar
  useEffect(() => {
    if (ingredientSearchTerm.trim() === '') {
      setFilteredIngredients([]);
    } else {
      const filtered = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(ingredientSearchTerm.toLowerCase())
      );
      setFilteredIngredients(filtered);
    }
  }, [ingredientSearchTerm, ingredients]);

  const fetchInventory = async () => {
    try {
      // Obtener el user_id del usuario autenticado
      const userIdResult = await database.getCurrentUserId();
      if (!userIdResult.success) {
        setError('Error al obtener información del usuario');
        setLoading(false);
        return;
      }

      const result = await database.getInventory(userIdResult.userId);
      if (result.success) {
        // console.log('Datos del inventario:', result.data);
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


  const fetchIngredients = async () => {
    try {
      // Obtener el user_id del usuario autenticado
      const userIdResult = await database.getCurrentUserId();
      if (!userIdResult.success) {
        console.error('Error al obtener información del usuario');
        return;
      }

      const result = await database.getIngredients(userIdResult.userId);
      if (result.success) {
        setIngredients(result.data || []);
      }
    } catch (err) {
      console.error('Error al cargar los ingredientes:', err);
    }
  };

  const fetchMovements = async () => {
    setMovementsLoading(true);
    try {
      // Obtener el user_id del usuario autenticado
      const userIdResult = await database.getCurrentUserId();
      if (!userIdResult.success) {
        setError('Error al obtener información del usuario');
        return;
      }

      // Obtener movimientos de la última semana
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('inventory_movements')
        .select(`
          *,
          ingredients(name, unit_measure),
          admin_usuarios(username)
        `)
        .eq('user_id', userIdResult.userId)
        .gte('created_at', oneWeekAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovements(data || []);
    } catch (err) {
      console.error('Error al cargar los movimientos:', err);
      setError('Error al cargar los movimientos');
    } finally {
      setMovementsLoading(false);
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
        // console.log('Cargando subfamilias para familia:', familyId);
        const { data, error } = await supabase
          .from('inventory_subfamilies')
          .select('*')
          .eq('family_id', familyId)
          .order('name');
        
        if (error) throw error;
        // console.log('Respuesta de subfamilias:', data);
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


  // Funciones para el autocompletar de ingredientes
  const handleIngredientSearchChange = (e) => {
    const value = e.target.value;
    setIngredientSearchTerm(value);
    setShowIngredientDropdown(true);
    
    // Si se limpia el campo, resetear la selección
    if (value === '') {
      setNewProduct(prev => ({ ...prev, ingredient_id: '', supplier_id: '' }));
      setAvailableSuppliers([]);
    }
  };

  const handleIngredientSelect = async (ingredient) => {
    setNewProduct(prev => ({ ...prev, ingredient_id: ingredient.id, supplier_id: '' }));
    setIngredientSearchTerm(ingredient.name);
    setShowIngredientDropdown(false);
    
    // Cargar proveedores para el ingrediente seleccionado
    try {
      const { data, error } = await supabase
        .from('supplier_ingredients')
        .select(`
          supplier_id,
          suppliers (
            id,
            name
          )
        `)
        .eq('ingredient_id', ingredient.id);
      
      if (error) throw error;
      
      // Extraer los proveedores únicos
      const uniqueSuppliers = data.reduce((acc, item) => {
        if (!acc.find(s => s.id === item.suppliers.id)) {
          acc.push(item.suppliers);
        }
        return acc;
      }, []);
      
      setAvailableSuppliers(uniqueSuppliers);
    } catch (err) {
      console.error('Error al cargar proveedores del ingrediente:', err);
      setAvailableSuppliers([]);
    }
  };

  const handleIngredientInputFocus = () => {
    if (ingredientSearchTerm.trim() !== '') {
      setShowIngredientDropdown(true);
    }
  };

  const handleIngredientInputBlur = () => {
    // Delay para permitir el click en las opciones
    setTimeout(() => {
      setShowIngredientDropdown(false);
    }, 200);
  };

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isItemExpanded = (itemId) => {
    return expandedItems.has(itemId);
  };

  // Función para determinar el estado del producto basado en cantidad y fecha de caducidad
  const getProductStatus = (item) => {
    const today = new Date();
    const expiryDate = new Date(item.expiry_date);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Rojo: cantidad = 0 o fecha ya caducada
    if (item.quantity <= 0 || diffDays < 0) {
      return { status: 'red', message: 'Stock agotado o producto caducado' };
    }
    
    // Amarillo: cantidad < 5 o caduca en 3 días o menos
    if (item.quantity < 5 || diffDays <= 3) {
      return { status: 'yellow', message: 'Stock bajo o próximo a caducar' };
    }
    
    // Verde: cantidad >= 5 y caduca en más de 3 días
    return { status: 'green', message: 'Stock y fecha en buen estado' };
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
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
      batch_number: ''
    });
  };

  const handleSaveEdit = async () => {
    // Iniciar el proceso de guardado
    setIsSavingEdit(true);
    
    try {
      // console.log('Actualizando inventario con ID:', editingItem);
      
      // Obtener el user_id del usuario autenticado
      const userIdResult = await database.getCurrentUserId();
      if (!userIdResult.success) {
        throw new Error('Error al obtener información del usuario');
      }

      // Obtener los valores actuales del inventario para comparar
      const { data: currentData, error: fetchError } = await supabase
        .from('inventory')
        .select('ingredient_id, family_id, subfamily_id, quantity, expiry_date, batch_number')
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
          expiry_date: editForm.expiry_date,
          batch_number: editForm.batch_number
        })
        .eq('id', editingItem);
      
      if (inventoryError) {
        console.error('Error al actualizar inventario:', inventoryError);
        throw inventoryError;
      }

      // Registrar cambios en inventory_movements
      const movements = [];
      
      // Verificar cambios en quantity
      if (currentData.quantity !== parseFloat(editForm.quantity)) {
        movements.push({
          inventory_id: editingItem,
          ingredient_id: currentData.ingredient_id,
          user_id: userIdResult.userId,
          movement_type: 'update',
          field_changed: 'quantity',
          old_value: currentData.quantity?.toString() || '',
          new_value: editForm.quantity,
          quantity: parseFloat(editForm.quantity),
          reason: 'Edición manual de cantidad'
        });
      }

      // Verificar cambios en expiry_date
      if (currentData.expiry_date !== editForm.expiry_date) {
        movements.push({
          inventory_id: editingItem,
          ingredient_id: currentData.ingredient_id,
          user_id: userIdResult.userId,
          movement_type: 'update',
          field_changed: 'expiry_date',
          old_value: currentData.expiry_date || '',
          new_value: editForm.expiry_date,
          reason: 'Edición manual de fecha de caducidad'
        });
      }

      // Verificar cambios en batch_number
      if (currentData.batch_number !== editForm.batch_number) {
        movements.push({
          inventory_id: editingItem,
          ingredient_id: currentData.ingredient_id,
          user_id: userIdResult.userId,
          movement_type: 'update',
          field_changed: 'batch_number',
          old_value: currentData.batch_number || '',
          new_value: editForm.batch_number,
          reason: 'Edición manual de número de lote'
        });
      }

      // Verificar cambios en family_id
      if (currentData.family_id !== parseInt(editForm.family_id)) {
        movements.push({
          inventory_id: editingItem,
          ingredient_id: currentData.ingredient_id,
          user_id: userIdResult.userId,
          movement_type: 'update',
          field_changed: 'family_id',
          old_value: currentData.family_id?.toString() || '',
          new_value: editForm.family_id,
          reason: 'Reclasificación de familia'
        });
      }

      // Verificar cambios en subfamily_id
      if (currentData.subfamily_id !== parseInt(editForm.subfamily_id)) {
        movements.push({
          inventory_id: editingItem,
          ingredient_id: currentData.ingredient_id,
          user_id: userIdResult.userId,
          movement_type: 'update',
          field_changed: 'subfamily_id',
          old_value: currentData.subfamily_id?.toString() || '',
          new_value: editForm.subfamily_id,
          reason: 'Reclasificación de subfamilia'
        });
      }

      // Insertar movimientos si hay cambios
      if (movements.length > 0) {
        const { error: movementsError } = await supabase
          .from('inventory_movements')
          .insert(movements);

        if (movementsError) {
          console.error('Error al registrar movimientos:', movementsError);
          // No lanzar error aquí para no interrumpir la edición
        }
      }
      
      await fetchInventory();
      setEditingItem(null);
    } catch (err) {
      console.error('Error al actualizar el inventario:', err);
      setError('Error al actualizar el inventario: ' + (err.message || 'Error desconocido'));
    } finally {
      // Resetear estado de guardado
      setIsSavingEdit(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleDelete = async () => {
    try {
      // Obtener el user_id del usuario autenticado
      const userIdResult = await database.getCurrentUserId();
      if (!userIdResult.success) {
        throw new Error('Error al obtener información del usuario');
      }

      // Guardar información del producto antes de eliminarlo
      const productInfo = {
        inventory_id: selectedProductForDelete.id,
        ingredient_id: selectedProductForDelete.ingredient_id,
        quantity: selectedProductForDelete.quantity,
        ingredient_name: selectedProductForDelete.ingredients?.name || 'Producto desconocido'
      };

      // Primero eliminar todos los movimientos que referencian este inventory_id
      const { error: deleteMovementsError } = await supabase
        .from('inventory_movements')
        .delete()
        .eq('inventory_id', selectedProductForDelete.id);

      if (deleteMovementsError) {
        console.error('Error al eliminar movimientos previos:', deleteMovementsError);
        // Continuar con la eliminación aunque falle la limpieza de movimientos
      }

      // Eliminar el producto
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', selectedProductForDelete.id);
      
      if (error) throw error;

      // Registrar el movimiento de eliminación después de eliminar
      const { error: movementError } = await supabase
        .from('inventory_movements')
        .insert({
          inventory_id: null, // No usar inventory_id para eliminaciones
          ingredient_id: productInfo.ingredient_id,
          user_id: userIdResult.userId,
          movement_type: 'delete',
          field_changed: 'product_deleted',
          old_value: 'Producto existente',
          new_value: 'Producto eliminado',
          quantity: productInfo.quantity,
          reason: `Producto "${productInfo.ingredient_name}" eliminado del inventario`
        });

      if (movementError) {
        console.error('Error al registrar movimiento de eliminación:', movementError);
        // No lanzar error aquí para no interrumpir la eliminación
      }
      
      setShowDeleteProductModal(false);
      setSelectedProductForDelete(null);
      await fetchInventory();
    } catch (err) {
      console.error('Error al eliminar el inventario:', err);
      setError('Error al eliminar el inventario');
    }
  };

  const openDeleteProductModal = (item) => {
    setSelectedProductForDelete(item);
    setShowDeleteProductModal(true);
  };

  const openMovementsModal = () => {
    setShowMovementsModal(true);
    fetchMovements();
  };


  const closeMovementsModal = () => {
    setShowMovementsModal(false);
    setMovements([]);
    setExpandedDates(new Set());
  };

  const toggleDateExpansion = (date) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const isDateExpanded = (date) => {
    return expandedDates.has(date);
  };

  const expandAllDates = () => {
    if (movements.length === 0) return;
    
    const groupedMovements = movements.reduce((groups, movement) => {
      const date = new Date(movement.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(movement);
      return groups;
    }, {});
    
    const allDates = Object.keys(groupedMovements);
    setExpandedDates(new Set(allDates));
  };

  const collapseAllDates = () => {
    setExpandedDates(new Set());
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
    
    // Iniciar el proceso de guardado
    setIsSavingProduct(true);
    setSaveProgress(0);
    
    try {
      // Paso 1: Validar datos (0-30%)
      setSaveProgress(10);
      await new Promise(resolve => setTimeout(resolve, 200)); // Simular validación
      
      // Obtener el user_id del usuario autenticado
      const userIdResult = await database.getCurrentUserId();
      if (!userIdResult.success) {
        throw new Error('Error al obtener información del usuario');
      }
      
      setSaveProgress(20);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Obtener información del ingrediente seleccionado
      const selectedIngredient = ingredients.find(ing => ing.id === parseInt(newProduct.ingredient_id));
      if (!selectedIngredient) {
        throw new Error('Ingrediente no encontrado');
      }

      // Obtener información del proveedor seleccionado
      const selectedSupplier = availableSuppliers.find(sup => sup.id === parseInt(newProduct.supplier_id));
      if (!selectedSupplier) {
        throw new Error('Proveedor no encontrado');
      }
      
      setSaveProgress(30);

      // Paso 2: Obtener información del proveedor (30-60%)
      setSaveProgress(40);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Obtener información del supplier_ingredient para obtener precio
      const { data: supplierIngredient, error: supplierIngredientError } = await supabase
        .from('supplier_ingredients')
        .select('*')
        .eq('supplier_id', newProduct.supplier_id)
        .eq('ingredient_id', newProduct.ingredient_id)
        .single();

      if (supplierIngredientError) {
        throw new Error('No se encontró información del ingrediente en el proveedor');
      }
      
      setSaveProgress(50);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Crear el item de inventario con user_id
      const inventoryData = {
        ingredient_id: parseInt(newProduct.ingredient_id),
        family_id: parseInt(newProduct.family_id),
        subfamily_id: newProduct.subfamily_id ? parseInt(newProduct.subfamily_id) : null,
        supplier_id: parseInt(newProduct.supplier_id),
        quantity: parseFloat(newProduct.quantity) || 0,
        purchase_price: supplierIngredient.supplier_price || 0,
        expiry_date: newProduct.expiry_date,
        batch_number: newProduct.batch_number,
        user_id: userIdResult.userId
      };

      // Paso 3: Crear producto (60-90%)
      setSaveProgress(60);
      await new Promise(resolve => setTimeout(resolve, 300));

      const { data: insertedData, error: inventoryError } = await supabase
        .from('inventory')
        .insert([inventoryData])
        .select('id')
        .single();

      if (inventoryError) throw inventoryError;
      
      setSaveProgress(75);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Paso 4: Registrar movimientos (90-100%)
      setSaveProgress(85);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Registrar el movimiento de creación
      const { error: movementError } = await supabase
        .from('inventory_movements')
        .insert({
          inventory_id: insertedData.id,
          ingredient_id: parseInt(newProduct.ingredient_id),
          user_id: userIdResult.userId,
          movement_type: 'create',
          field_changed: 'new_product',
          old_value: '',
          new_value: 'Producto creado',
          quantity: parseFloat(newProduct.quantity),
          reason: 'Nuevo producto agregado al inventario'
        });

      if (movementError) {
        console.error('Error al registrar movimiento de creación:', movementError);
        // No lanzar error aquí para no interrumpir la creación
      }
      
      setSaveProgress(95);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Actualizar inventario
      await fetchInventory();
      
      setSaveProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Cerrar modal después de completar
      handleCloseModal();
      
    } catch (err) {
      console.error('Error al crear el producto:', err);
      setError('Error al crear el producto: ' + (err.message || 'Error desconocido'));
    } finally {
      // Resetear estados de progreso
      setIsSavingProduct(false);
      setSaveProgress(0);
    }
  };

  // Función para manejar clic fuera del modal
  const handleModalBackdropClick = (e, closeFunction) => {
    if (e.target === e.currentTarget) {
      closeFunction();
    }
  };

  // Función para cerrar el modal y resetear el formulario
  const handleCloseModal = () => {
    setShowNewProductModal(false);
      setNewProduct({
        ingredient_id: '',
        family_id: '',
        subfamily_id: '',
        supplier_id: '',
        quantity: '',
        expiry_date: '',
        batch_number: ''
      });
    setAvailableSuppliers([]);
    // Reset autocomplete fields
    setIngredientSearchTerm('');
    setShowIngredientDropdown(false);
  };

  const getAllergens = (item) => {
    const allergens = [];
    const ingredient = item.ingredients;
    
    if (!ingredient) {
      return <span className="text-xs text-gray-500">Sin ingrediente</span>;
    }
    
    // Debug: Log para verificar los datos del ingrediente
    //console.log('Datos del ingrediente para alérgenos:', ingredient);
    
    // Lista de alérgenos con sus archivos
    const allergenList = [
      { key: 'alerg_gluten', name: 'gluten', file: 'alerg_gluten.png' },
      { key: 'alerg_crustaceos', name: 'crustáceos', file: 'alerg_crustaceos.png' },
      { key: 'alerg_huevos', name: 'huevos', file: 'alerg_huevos.png' },
      { key: 'alerg_pescado', name: 'pescado', file: 'alerg_pescado.png' },
      { key: 'alerg_cacahuetes', name: 'cacahuetes', file: 'alerg_cacahuetes.png' },
      { key: 'alerg_soja', name: 'soja', file: 'alerg_soja.png' },
      { key: 'alerg_leche', name: 'leche', file: 'alerg_leche.png' },
      { key: 'alerg_frutos', name: 'frutos de cáscara', file: 'alerg_frutos.png' },
      { key: 'alerg_apio', name: 'apio', file: 'alerg_apio.png' },
      { key: 'alerg_mostaza', name: 'mostaza', file: 'alerg_mostaza.png' },
      { key: 'alerg_sesamo', name: 'sésamo', file: 'alerg_sesamo.png' },
      { key: 'alerg_sulfitos', name: 'sulfitos', file: 'alerg_sulfitos.png' },
      { key: 'alerg_altramuces', name: 'altramuces', file: 'alerg_altramuces.png' },
      { key: 'alerg_moluscos', name: 'moluscos', file: 'alerg_moluscos.png' }
    ];
    
    // Verificar cada alérgeno - manejar tanto boolean como número
    allergenList.forEach(allergen => {
      const value = ingredient[allergen.key];
      // Verificar si el valor es truthy (true, 1, "true", etc.)
      if (value === true || value === 1 || value === "true" || value === "1") {
        //console.log(`Alérgeno encontrado: ${allergen.name} (${allergen.key}) = ${value}`);
        allergens.push(allergen);
      }
    });
    
    //console.log('Alérgenos encontrados:', allergens);
    
    if (allergens.length === 0) {
      return <span className="text-xs text-gray-500">Sin alérgenos</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {allergens.map((allergen, index) => (
          <div key={index} className="flex items-center">
            <img
              src={`/${allergen.file}`}
              alt={allergen.name}
              className="w-6 h-6 object-contain"
              title={allergen.name}
              onError={(e) => {
                // console.log('Error loading image:', allergen.file);
                // Reemplazar con texto
                e.target.style.display = 'none';
                const parent = e.target.parentNode;
                const textSpan = document.createElement('span');
                textSpan.className = 'text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full';
                textSpan.textContent = allergen.name.charAt(0).toUpperCase();
                textSpan.title = allergen.name;
                parent.appendChild(textSpan);
              }}
            />
          </div>
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
    <div className="py-4 min-w-0 overflow-x-hidden">
      {/* Barra de herramientas optimizada para móvil */}
      <div className="space-y-4 mb-6">
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
          <button 
            onClick={() => setShowNewProductModal(true)}
            className="group flex items-center space-x-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 w-full sm:w-auto"
            aria-label="Agregar nuevo producto al inventario"
          >
            <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0 group-hover:bg-indigo-200 transition-colors duration-200">
              <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">Nuevo Producto</p>
            </div>
            <svg className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button 
            onClick={openMovementsModal}
            className="group flex items-center space-x-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 w-full sm:w-auto"
            aria-label="Ver movimientos del inventario"
          >
            <div className="bg-green-100 p-2 rounded-lg flex-shrink-0 group-hover:bg-green-200 transition-colors duration-200">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-200">Movimientos</p>
            </div>
            <svg className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
          onClick={(e) => handleModalBackdropClick(e, handleCloseModal)}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl h-[85vh] sm:h-auto sm:max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header fijo */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Nuevo Producto</h2>
                    <p className="text-gray-600 text-sm">Añadir nuevo producto al inventario</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                  aria-label="Cerrar modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <form onSubmit={handleNewProductSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Seleccionar Ingrediente</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={ingredientSearchTerm}
                          onChange={handleIngredientSearchChange}
                          onFocus={handleIngredientInputFocus}
                          onBlur={handleIngredientInputBlur}
                          className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="🔍 Buscar ingrediente..."
                          required
                        />
                        
                        {/* Dropdown de resultados */}
                        {showIngredientDropdown && filteredIngredients.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredIngredients.map((ingredient) => (
                              <div
                                key={ingredient.id}
                                onClick={() => handleIngredientSelect(ingredient)}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900">
                                    {ingredient.name}
                                  </span>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {ingredient.unit_measure}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Mensaje cuando no hay resultados */}
                        {showIngredientDropdown && ingredientSearchTerm.trim() !== '' && filteredIngredients.length === 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              No se encontraron ingredientes
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Busca y selecciona un ingrediente existente para agregar al inventario
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Cantidad</label>
                      <div className="flex gap-2 min-w-0">
                        <input
                          type="number"
                          name="quantity"
                          value={newProduct.quantity}
                          onChange={handleNewProductChange}
                          className="flex-1 min-w-0 border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0"
                          required
                          min="0"
                          step="0.01"
                        />
                        <span className="flex items-center px-2 text-xs text-gray-500 bg-gray-50 border border-gray-300 rounded-lg flex-shrink-0">
                          {(() => {
                            const selectedIngredient = ingredients.find(ing => ing.id === parseInt(newProduct.ingredient_id));
                            return selectedIngredient?.unit_measure || 'unidad';
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Seleccionar Proveedor</label>
                    <select
                      name="supplier_id"
                      value={newProduct.supplier_id}
                      onChange={handleNewProductChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                      disabled={!newProduct.ingredient_id || availableSuppliers.length === 0}
                      required
                    >
                      <option value="">
                        {!newProduct.ingredient_id 
                          ? 'Primero selecciona un ingrediente' 
                          : availableSuppliers.length === 0 
                            ? 'No hay proveedores disponibles para este ingrediente'
                            : 'Seleccionar proveedor'
                        }
                      </option>
                      {availableSuppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Solo se muestran proveedores que tienen este ingrediente disponible
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Familia</label>
                      <select
                        name="family_id"
                        value={newProduct.family_id}
                        onChange={handleFamilyChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Seleccionar familia</option>
                        {families.map(family => (
                          <option key={family.id} value={family.id}>{family.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Subfamilia</label>
                      <select
                        name="subfamily_id"
                        value={newProduct.subfamily_id}
                        onChange={handleSubfamilyChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                        disabled={!newProduct.family_id}
                      >
                        <option value="">Seleccionar subfamilia</option>
                        {subfamilies.map(subfamily => (
                          <option key={subfamily.id} value={subfamily.id}>{subfamily.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Fecha de Caducidad</label>
                      <input
                        type="date"
                        name="expiry_date"
                        value={newProduct.expiry_date}
                        onChange={handleNewProductChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Número de Lote</label>
                      <input
                        type="text"
                        name="batch_number"
                        value={newProduct.batch_number}
                        onChange={handleNewProductChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: L001"
                        required
                      />
                    </div>
                  </div>

                  {/* Información del ingrediente seleccionado */}
                  {newProduct.ingredient_id && (
                    <div className="mt-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Información del Ingrediente</h3>
                      {(() => {
                        const selectedIngredient = ingredients.find(ing => ing.id === parseInt(newProduct.ingredient_id));
                        return selectedIngredient ? (
                          <div className="grid grid-cols-1 gap-1.5 text-xs">
                            <div>
                              <span className="font-medium text-gray-600">Nombre:</span>
                              <p className="text-gray-900 break-words">{selectedIngredient.name}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Unidad:</span>
                              <p className="text-gray-900">{selectedIngredient.unit_measure}</p>
                            </div>
                            {selectedIngredient.description && (
                              <div>
                                <span className="font-medium text-gray-600">Descripción:</span>
                                <p className="text-gray-900 break-words text-xs">{selectedIngredient.description}</p>
                              </div>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {/* Información del proveedor seleccionado */}
                  {newProduct.supplier_id && (
                    <div className="mt-2 p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Información del Proveedor</h3>
                      {(() => {
                        const selectedSupplier = availableSuppliers.find(sup => sup.id === parseInt(newProduct.supplier_id));
                        return selectedSupplier ? (
                          <div className="text-xs">
                            <span className="font-medium text-gray-600">Proveedor:</span>
                            <p className="text-gray-900 break-words">{selectedSupplier.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              La información se obtendrá automáticamente del proveedor.
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                {/* Barra de progreso */}
                {isSavingProduct && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-900">Guardando producto...</h3>
                        <p className="text-xs text-blue-700">Por favor espera mientras procesamos tu solicitud</p>
                      </div>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${saveProgress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-blue-600 font-medium">
                        {saveProgress < 30 ? 'Validando datos...' :
                         saveProgress < 60 ? 'Creando producto...' :
                         saveProgress < 90 ? 'Registrando movimientos...' :
                         'Finalizando...'}
                      </span>
                      <span className="text-xs text-blue-600 font-bold">{Math.round(saveProgress)}%</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSavingProduct}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:from-gray-400 disabled:to-gray-500"
                  >
                    {isSavingProduct ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Guardando...</span>
                      </span>
                    ) : (
                      'Guardar Producto'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Lista - Responsive */}
      <div className="space-y-2 min-w-0">
        {filteredInventory.length > 0 ? (
          filteredInventory.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 min-w-0">
              {/* Header de la fila - Siempre visible */}
              <div 
                className="p-2 sm:p-3 cursor-pointer hover:bg-gray-50 transition-colors min-w-0"
                onClick={() => toggleItemExpansion(item.id)}
              >
                {/* Layout móvil - Compacto */}
                <div className="block sm:hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <svg 
                          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                            isItemExpanded(item.id) ? 'rotate-90' : ''
                          }`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {item.ingredients?.name || 'N/A'}
                        </h3>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs text-gray-600">{item.inventory_families?.name}</span>
                          {item.inventory_subfamilies?.name && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-xs text-gray-600">{item.inventory_subfamilies.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Indicador de cantidad y botones de acción móvil */}
                    <div className="flex items-center space-x-2 ml-2" onClick={(e) => e.stopPropagation()}>
                      {/* Indicador de estado del producto con tooltip */}
                      <div className="relative group">
                        <div className="flex items-center justify-center cursor-help">
                          {(() => {
                            const productStatus = getProductStatus(item);
                            
                            if (productStatus.status === 'red') {
                              return (
                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              );
                            } else if (productStatus.status === 'yellow') {
                              return (
                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              );
                            } else {
                              return (
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              );
                            }
                          })()}
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white text-gray-800 text-xs rounded-lg shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-48 sm:max-w-none">
                          <div className="text-center">
                            <div className="font-semibold mb-1 text-gray-900">Estado del Producto</div>
                            <div className="space-y-1">
                              <div className="break-words">
                                <span className="text-gray-600">Cantidad:</span> 
                                <span className={`ml-1 font-medium ${item.quantity <= 0 ? 'text-red-600' : item.quantity < 5 ? 'text-amber-600' : 'text-green-600'}`}>
                                  {item.quantity} {item.ingredients?.unit_measure || 'unidad'}
                                </span>
                              </div>
                              <div className="break-words">
                                <span className="text-gray-600">Caducidad:</span> 
                                <span className={`ml-1 font-medium ${(() => {
                                  const today = new Date();
                                  const expiryDate = new Date(item.expiry_date);
                                  const diffTime = expiryDate - today;
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                  if (diffDays < 0) return 'text-red-600';
                                  if (diffDays <= 3) return 'text-amber-600';
                                  return 'text-green-600';
                                })()}`}>
                                  {new Date(item.expiry_date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-100 break-words">
                                {getProductStatus(item).message}
                              </div>
                            </div>
                          </div>
                          {/* Flecha del tooltip */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                        </div>
                      </div>
                      
                      {editingItem === item.id ? (
                        <>
                          <button 
                            onClick={handleSaveEdit}
                            disabled={isSavingEdit}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Guardar cambios"
                          >
                            {isSavingEdit ? (
                              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                            aria-label="Cancelar edición"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            aria-label="Editar producto"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => openDeleteProductModal(item)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Layout desktop - Compacto */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <svg 
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                          isItemExpanded(item.id) ? 'rotate-90' : ''
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {item.ingredients?.name || 'N/A'}
                      </h3>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-xs text-gray-600">{item.inventory_families?.name}</span>
                        {item.inventory_subfamilies?.name && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-gray-600">{item.inventory_subfamilies.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicador de cantidad y botones de acción */}
                  <div className="flex items-center space-x-2 ml-3" onClick={(e) => e.stopPropagation()}>
                    {/* Indicador de estado del producto con tooltip */}
                    <div className="relative group">
                      <div className="flex items-center justify-center cursor-help">
                        {(() => {
                          const productStatus = getProductStatus(item);
                          
                          if (productStatus.status === 'red') {
                            return (
                              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            );
                          } else if (productStatus.status === 'yellow') {
                            return (
                              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            );
                          } else {
                            return (
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            );
                          }
                        })()}
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white text-gray-800 text-xs rounded-lg shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-48 sm:max-w-none">
                        <div className="text-center">
                          <div className="font-semibold mb-1 text-gray-900">Estado del Producto</div>
                          <div className="space-y-1">
                            <div className="break-words">
                              <span className="text-gray-600">Cantidad:</span> 
                              <span className={`ml-1 font-medium ${item.quantity <= 0 ? 'text-red-600' : item.quantity < 5 ? 'text-amber-600' : 'text-green-600'}`}>
                                {item.quantity} {item.ingredients?.unit_measure || 'unidad'}
                              </span>
                            </div>
                            <div className="break-words">
                              <span className="text-gray-600">Caducidad:</span> 
                              <span className={`ml-1 font-medium ${(() => {
                                const today = new Date();
                                const expiryDate = new Date(item.expiry_date);
                                const diffTime = expiryDate - today;
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                if (diffDays < 0) return 'text-red-600';
                                if (diffDays <= 3) return 'text-amber-600';
                                return 'text-green-600';
                              })()}`}>
                                {new Date(item.expiry_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-100 break-words">
                              {getProductStatus(item).message}
                            </div>
                          </div>
                        </div>
                        {/* Flecha del tooltip */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                      </div>
                    </div>
                    
                    {editingItem === item.id ? (
                      <>
                        <button 
                          onClick={handleSaveEdit}
                          disabled={isSavingEdit}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Guardar cambios"
                        >
                          {isSavingEdit ? (
                            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          aria-label="Cancelar edición"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          aria-label="Editar producto"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => openDeleteProductModal(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido expandible */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isItemExpanded(item.id) ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-2 sm:px-3 pb-2 sm:pb-3 border-t border-gray-100 bg-gray-50 min-w-0">
                  <div className="pt-2 sm:pt-3 space-y-2 sm:space-y-3">
                    {/* Información detallada */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 min-w-0">
                      {/* Proveedor */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 mb-1">Proveedor</div>
                          <div className="text-sm font-medium text-gray-700 truncate">
                            {item.suppliers?.name || 'Sin proveedor'}
                          </div>
                        </div>
                      </div>

                      {/* Cantidad editable */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8-4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 mb-1">Cantidad</div>
                          {editingItem === item.id ? (
                            <div className="flex items-center space-x-2 min-w-0">
                              <input
                                type="number"
                                name="quantity"
                                value={editForm.quantity}
                                onChange={handleInputChange}
                                className="flex-1 min-w-0 px-2 py-1 border rounded text-sm"
                                min="0"
                                step="0.01"
                              />
                              <span className="text-xs text-gray-500 flex-shrink-0">{item.ingredients?.unit_measure || 'N/A'}</span>
                            </div>
                          ) : (
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {item.quantity} <span className="text-xs text-gray-500">{item.ingredients?.unit_measure || 'N/A'}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Precio */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 mb-1">Precio de Compra</div>
                          <div className="text-sm font-medium text-gray-900 truncate">{item.purchase_price} €</div>
                        </div>
                      </div>

                      {/* Fecha de caducidad editable */}
                      <div className="flex items-center space-x-3 min-w-0">
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
                              className="w-full min-w-0 px-2 py-1 border rounded text-sm"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {new Date(item.expiry_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Número de lote editable */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                              className="w-full min-w-0 px-2 py-1 border rounded text-sm"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900 truncate">{item.batch_number}</div>
                          )}
                        </div>
                      </div>

                      {/* Alérgenos */}
                      <div className="flex items-start space-x-3 md:col-span-2 lg:col-span-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mt-1">
                          <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 mb-1">Alérgenos</div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            {getAllergens(item)}
                          </div>
                        </div>
                      </div>
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

      {/* Modal para confirmar eliminación de producto */}
      {showDeleteProductModal && selectedProductForDelete && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => handleModalBackdropClick(e, () => setShowDeleteProductModal(false))}
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
                  <h2 className="text-xl font-bold text-gray-900">Eliminar Producto</h2>
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
                  ¿Eliminar producto?
                </h3>
                <p className="text-gray-600 mb-4">
                  Estás a punto de eliminar el producto <strong>{selectedProductForDelete.ingredients?.name}</strong> del inventario.
                </p>
                <p className="text-sm text-gray-500">
                  Esta acción eliminará permanentemente:
                </p>
                <ul className="text-sm text-gray-500 mt-2 space-y-1">
                  <li>• Información del producto en inventario</li>
                  <li>• Cantidad y fecha de caducidad</li>
                  <li>• Número de lote y datos del proveedor</li>
                </ul>
                <p className="text-sm text-red-600 font-medium mt-3">
                  Esta acción no se puede deshacer.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteProductModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
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

      {/* Modal para mostrar movimientos */}
      {showMovementsModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={(e) => handleModalBackdropClick(e, closeMovementsModal)}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-[75vh] sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header fijo */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-3 sm:p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-6 h-6 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="h-3 w-3 sm:h-6 sm:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">Movimientos del Inventario</h2>
                    <p className="text-gray-600 text-xs sm:text-sm truncate">Actividad de la última semana</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {movements.length > 0 && (
                    <>
                      <button
                        onClick={expandAllDates}
                        className="hidden sm:flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        aria-label="Expandir todas las fechas"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span>Expandir todo</span>
                      </button>
                      <button
                        onClick={collapseAllDates}
                        className="hidden sm:flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        aria-label="Colapsar todas las fechas"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span>Colapsar todo</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={closeMovementsModal}
                    className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0"
                    aria-label="Cerrar modal"
                  >
                    <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto p-1 sm:p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {movementsLoading ? (
                <div className="flex flex-col justify-center items-center h-24 sm:h-32 space-y-2 sm:space-y-4">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
                  <div className="text-center px-4">
                    <p className="text-xs sm:text-base font-medium text-gray-900">Cargando movimientos...</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Obteniendo actividad reciente</p>
                  </div>
                </div>
              ) : movements.length > 0 ? (
                <div className="space-y-2 sm:space-y-4">
                  {(() => {
                    // Agrupar movimientos por fecha
                    const groupedMovements = movements.reduce((groups, movement) => {
                      const date = new Date(movement.created_at).toDateString();
                      if (!groups[date]) {
                        groups[date] = [];
                      }
                      groups[date].push(movement);
                      return groups;
                    }, {});

                    // Ordenar fechas de más reciente a más antigua
                    const sortedDates = Object.keys(groupedMovements).sort((a, b) => 
                      new Date(b) - new Date(a)
                    );

                    return sortedDates.map((date, dateIndex) => {
                      const dateMovements = groupedMovements[date];
                      const formattedDate = new Date(date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                      const isExpanded = isDateExpanded(date);

                      return (
                        <div key={date} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          {/* Encabezado de fecha - Clickeable */}
                          <div 
                            className="p-2 sm:p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 border-b border-gray-100"
                            onClick={() => toggleDateExpansion(date)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                <div className="w-6 h-6 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-xs sm:text-lg font-bold text-gray-900 capitalize truncate">
                                    {formattedDate}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                                    {dateMovements.length} movimiento{dateMovements.length !== 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Icono de expansión */}
                              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                                <span className="hidden sm:inline text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {isExpanded ? 'Ocultar' : 'Ver'} movimientos
                                </span>
                                <svg 
                                  className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform duration-200 ${
                                    isExpanded ? 'rotate-90' : ''
                                  }`} 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Lista de movimientos del día - Expandible */}
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                          }`}>
                            <div className="p-1 sm:p-4 space-y-1 sm:space-y-3 bg-gray-50">
                              {dateMovements.map((movement, index) => (
                                <div key={movement.id || index} className="bg-white rounded-lg p-2 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-3">
                                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                                          movement.movement_type === 'create' ? 'bg-green-500' :
                                          movement.movement_type === 'update' ? 'bg-blue-500' :
                                          movement.movement_type === 'delete' ? 'bg-red-500' :
                                          'bg-gray-500'
                                        }`}></div>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                          {movement.movement_type === 'create' ? 'Producto Creado' :
                                           movement.movement_type === 'update' ? 'Producto Actualizado' :
                                           movement.movement_type === 'delete' ? 'Producto Eliminado' :
                                           'Movimiento'}
                                        </span>
                                        <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex-shrink-0">
                                          {new Date(movement.created_at).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                      
                                      <div className="space-y-1 sm:space-y-2">
                                        <div className="flex items-start space-x-1 sm:space-x-2">
                                          <svg className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8-4" />
                                          </svg>
                                          <p className="text-xs sm:text-sm text-gray-700 break-words">
                                            <span className="font-medium">Ingrediente:</span> {movement.ingredients?.name || 'N/A'}
                                          </p>
                                        </div>
                                        
                                        {movement.field_changed && (
                                          <div className="flex items-start space-x-1 sm:space-x-2">
                                            <svg className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <p className="text-xs sm:text-sm text-gray-700 break-words">
                                              <span className="font-medium">Campo:</span> {movement.field_changed}
                                            </p>
                                          </div>
                                        )}
                                        
                                        {movement.quantity !== null && movement.quantity !== undefined && (
                                          <div className="flex items-start space-x-1 sm:space-x-2">
                                            <svg className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <p className="text-xs sm:text-sm text-gray-700 break-words">
                                              <span className="font-medium">Cantidad:</span> {movement.quantity} {movement.ingredients?.unit_measure || 'unidad'}
                                            </p>
                                          </div>
                                        )}
                                        
                                        {movement.old_value && movement.new_value && (
                                          <div className="text-xs sm:text-sm text-gray-700">
                                            <div className="flex items-start space-x-1 sm:space-x-2 mb-1">
                                              <svg className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                              </svg>
                                              <span className="font-medium">Cambio:</span>
                                            </div>
                                            <div className="ml-4 sm:ml-6 flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                              <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-red-100 text-red-800 rounded text-xs font-medium break-all">
                                                {movement.old_value}
                                              </span>
                                              <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                              <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 text-green-800 rounded text-xs font-medium break-all">
                                                {movement.new_value}
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                        
                                        {movement.reason && (
                                          <div className="flex items-start space-x-1 sm:space-x-2">
                                            <svg className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                            <p className="text-xs sm:text-sm text-gray-600 italic break-words">
                                              {movement.reason}
                                            </p>
                                          </div>
                                        )}
                                        
                                        {movement.admin_usuarios?.username && (
                                          <div className="flex items-center space-x-1 sm:space-x-2">
                                            <svg className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <p className="text-xs text-gray-500 break-words">
                                              <span className="font-medium">Usuario:</span> {movement.admin_usuarios.username}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-12 px-4">
                  <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No hay movimientos recientes</h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                    No se han registrado movimientos en el inventario durante la última semana.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryManagement; 