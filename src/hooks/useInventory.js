import { useState, useEffect } from 'react';
import { database } from '../config/supabase';

export const useInventory = () => {
  // Estados para diferentes funcionalidades
  const [inventoryCount, setInventoryCount] = useState(0);
  const [lastMovement, setLastMovement] = useState(null);
  const [growthData, setGrowthData] = useState({
    thisWeek: 0,
    lastWeek: 0,
    growthPercentage: 0
  });
  
  // Estados de carga y error
  const [loading, setLoading] = useState({
    count: true,
    movements: true,
    growth: true
  });
  const [error, setError] = useState({
    count: null,
    movements: null,
    growth: null
  });

  // Obtener user_id una sola vez
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userResult = await database.getCurrentUserId();
        if (userResult.success && userResult.userId) {
          setUserId(userResult.userId);
        }
      } catch (err) {
        console.error('Error al obtener user_id:', err);
      }
    };
    getUserId();
  }, []);

  // Fetch count
  useEffect(() => {
    if (!userId) return;

    const fetchCount = async () => {
      try {
        setLoading(prev => ({ ...prev, count: true }));
        setError(prev => ({ ...prev, count: null }));
        
        const result = await database.getInventoryCount(userId);
        
        if (result.success) {
          setInventoryCount(result.count);
        } else {
          setError(prev => ({ ...prev, count: result.error }));
          setInventoryCount(0);
        }
      } catch (err) {
        setError(prev => ({ ...prev, count: err.message }));
        setInventoryCount(0);
      } finally {
        setLoading(prev => ({ ...prev, count: false }));
      }
    };

    fetchCount();
  }, [userId]);

  // Fetch movements
  useEffect(() => {
    if (!userId) return;

    const fetchMovements = async () => {
      try {
        setLoading(prev => ({ ...prev, movements: true }));
        setError(prev => ({ ...prev, movements: null }));
        
        const result = await database.getInventoryMovements(userId);
        
        if (result.success && result.data && result.data.length > 0) {
          setLastMovement(result.data[0]);
        } else {
          setLastMovement(null);
        }
      } catch (err) {
        setError(prev => ({ ...prev, movements: err.message }));
        setLastMovement(null);
      } finally {
        setLoading(prev => ({ ...prev, movements: false }));
      }
    };

    fetchMovements();
  }, [userId]);

  // Fetch growth
  useEffect(() => {
    if (!userId) return;

    const fetchGrowth = async () => {
      try {
        setLoading(prev => ({ ...prev, growth: true }));
        setError(prev => ({ ...prev, growth: null }));
        
        const result = await database.getInventoryWeeklyGrowth(userId);
        
        if (result.success) {
          setGrowthData(result.data);
        } else {
          setError(prev => ({ ...prev, growth: result.error }));
          setGrowthData({ thisWeek: 0, lastWeek: 0, growthPercentage: 0 });
        }
      } catch (err) {
        setError(prev => ({ ...prev, growth: err.message }));
        setGrowthData({ thisWeek: 0, lastWeek: 0, growthPercentage: 0 });
      } finally {
        setLoading(prev => ({ ...prev, growth: false }));
      }
    };

    fetchGrowth();
  }, [userId]);

  // Funciones de formateo para movimientos
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const movementDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - movementDate) / 1000);
    
    if (diffInSeconds < 60) {
      return 'hace unos segundos';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      if (days === 1) {
        return 'hace 1 día';
      } else if (days < 7) {
        return `hace ${days} días`;
      } else {
        return movementDate.toLocaleDateString('es-ES');
      }
    }
  };

  const formatTime = (dateString) => {
    const movementDate = new Date(dateString);
    return movementDate.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMovementTypeText = (movementType) => {
    const types = {
      'entrada': 'Entrada',
      'salida': 'Salida',
      'ajuste': 'Ajuste',
      'transferencia': 'Transferencia',
      'update': 'actualización',
      'delete': 'eliminado',
      'create': 'añadido'
    };
    
    const normalizedType = movementType?.toLowerCase();
    return types[normalizedType] || movementType;
  };

  const formatMovementDescription = (movement) => {
    const ingredientName = movement.ingredients?.name || 'Ingrediente';
    const unit = movement.ingredients?.unit_measure || 'unidades';
    const movementType = getMovementTypeText(movement.movement_type);
    
    if (movement.movement_type?.toLowerCase() === 'update' && 
        movement.old_value !== null && 
        movement.new_value !== null &&
        movement.field_changed) {
      
      const fieldChanged = movement.field_changed.toLowerCase();
      
      if (fieldChanged === 'quantity') {
        return `Se ha actualizado el stock: ${ingredientName} ${movement.old_value} → ${movement.new_value} ${unit}`;
      }
      
      if (fieldChanged === 'expiry_date') {
        const formatDate = (dateValue) => {
          if (!dateValue) return 'N/A';
          const date = new Date(dateValue);
          return date.toLocaleDateString('es-ES');
        };
        return `Se ha actualizado la fecha de caducidad: ${ingredientName} ${formatDate(movement.old_value)} → ${formatDate(movement.new_value)}`;
      }
      
      if (fieldChanged === 'purchase_price') {
        return `Se ha actualizado el precio: ${ingredientName} ${movement.old_value}€ → ${movement.new_value}€`;
      }
      
      return `Se ha actualizado ${fieldChanged}: ${ingredientName} ${movement.old_value} → ${movement.new_value}`;
    }
    
    return `${ingredientName} - ${movement.quantity} ${unit} (${movementType})`;
  };

  // Funciones de formateo para crecimiento
  const getGrowthText = () => {
    if (loading.growth) return '...';
    
    const { growthPercentage } = growthData;
    
    if (growthPercentage > 0) {
      return `+${growthPercentage}%`;
    } else if (growthPercentage < 0) {
      return `${growthPercentage}%`;
    } else {
      return '0%';
    }
  };

  const getGrowthColor = () => {
    const { growthPercentage } = growthData;
    
    if (growthPercentage > 0) {
      return 'text-green-600 bg-green-50';
    } else if (growthPercentage < 0) {
      return 'text-red-600 bg-red-50';
    } else {
      return 'text-gray-600 bg-gray-50';
    }
  };

  return {
    // Datos
    inventoryCount,
    lastMovement,
    growthData,
    
    // Estados de carga
    loading: loading.count,
    movementLoading: loading.movements,
    growthLoading: loading.growth,
    
    // Errores
    error: error.count,
    movementError: error.movements,
    growthError: error.growth,
    
    // Funciones de formateo para movimientos
    formatTimeAgo,
    formatTime,
    formatMovementDescription,
    
    // Funciones de formateo para crecimiento
    getGrowthText,
    getGrowthColor
  };
};
