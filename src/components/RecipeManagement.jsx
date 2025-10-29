import React, { useState, useEffect, useRef } from 'react';
import { database } from '../config/supabase';

const RecipeManagement = () => {
  // Estilos CSS integrados
  const styles = {
    svgGlobal: {
      zoom: '1.2',
      overflow: 'visible'
    },
    particles: {
      animation: 'fade-particles 4s ease-in-out infinite alternate',
      willChange: 'transform, opacity'
    },
    particle: {
      willChange: 'transform, opacity',
      transformOrigin: 'center'
    },
    bounceLines: {
      animation: 'bounce-lines 3s ease-in-out infinite alternate'
    },
    plateContainer: {
      position: 'relative',
      willChange: 'transform'
    },
    ingredientSlideIn: {
      animation: 'slideInFromLeft 0.5s ease-out'
    },
    dragging: {
      opacity: '0.7',
      transform: 'rotate(5deg) scale(1.05)'
    }
  };

  // Estados principales
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para la creación de recetas
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    preparation_time: '',
    difficulty: 'Fácil',
    servings: 1,
    category: 'Entrantes'
  });
  
  // Estados para ingredientes
  const [plateIngredients, setPlateIngredients] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Agregar ingredientes, 2: Completar datos
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  
  // Estados para edición de cantidades
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [tempQuantity, setTempQuantity] = useState('');
  
  // Referencias para el plato SVG
  const svgRef = useRef(null);
  
  // Estados para modal de categorías
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForModal, setCategoryForModal] = useState('');
  
  // Estados para edición
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  // Hook para manejar el teclado (cerrar modales con ESC)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        // Cerrar el modal más reciente abierto
        if (showEditModal) {
          setShowEditModal(false);
          setEditingRecipe(null);
        } else if (showCreateModal) {
          handleCloseModal();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCreateModal, showEditModal]);

  // Función para cerrar el modal de creación
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCurrentStep(1);
    setPlateIngredients([]);
    setIngredientSearchTerm('');
    setShowIngredientDropdown(false);
    setFilteredIngredients([]);
    setEditingQuantity(null);
    setTempQuantity('');
    setNewRecipe({
      name: '',
      preparation_time: '',
      difficulty: 'Fácil',
      servings: 1,
      category: 'Entrantes'
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener user_id
      const userIdResult = await database.getCurrentUserId();
      if (!userIdResult.success) {
        setError('Error al obtener información del usuario');
        return;
      }

      // Cargar inventario e ingredientes
      const inventoryResult = await database.getInventory(userIdResult.userId);
      if (inventoryResult.success) {
        setInventory(inventoryResult.data);
      }

      // Cargar recetas (por ahora simulamos datos)
      setRecipes([
        {
          id: 1,
          name: 'Pasta Alfredo',
          description: 'Deliciosa pasta con salsa alfredo cremosa',
          preparation_time: '30 min',
          difficulty: 'Fácil',
          servings: 4,
          category: 'Primeros Platos',
          ingredients: [
            { id: 1, name: 'Pasta', quantity: 500, unit: 'g', position: { x: 35, y: 65 } },
            { id: 2, name: 'Crema', quantity: 200, unit: 'ml', position: { x: 50, y: 70 } },
            { id: 3, name: 'Queso Parmesano', quantity: 100, unit: 'g', position: { x: 60, y: 75 } }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Gazpacho Andaluz',
          description: 'Refrescante sopa fría de tomate y verduras',
          preparation_time: '20 min',
          difficulty: 'Fácil',
          servings: 6,
          category: 'Primeros Platos',
          ingredients: [
            { id: 4, name: 'Tomate', quantity: 1000, unit: 'g', position: { x: 40, y: 68 } },
            { id: 5, name: 'Pepino', quantity: 200, unit: 'g', position: { x: 55, y: 72 } },
            { id: 6, name: 'Pimiento Verde', quantity: 150, unit: 'g', position: { x: 45, y: 78 } },
            { id: 7, name: 'Aceite de Oliva', quantity: 100, unit: 'ml', position: { x: 50, y: 75 } },
            { id: 8, name: 'Ajo', quantity: 2, unit: 'dientes', position: { x: 42, y: 70 } }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Ensalada de Pasta',
          description: 'Ensalada fresca con pasta, tomate, mozzarella y albahaca',
          preparation_time: '25 min',
          difficulty: 'Fácil',
          servings: 4,
          category: 'Primeros Platos',
          ingredients: [
            { id: 9, name: 'Pasta', quantity: 400, unit: 'g', position: { x: 38, y: 66 } },
            { id: 10, name: 'Tomate Cherry', quantity: 300, unit: 'g', position: { x: 52, y: 72 } },
            { id: 11, name: 'Mozzarella', quantity: 250, unit: 'g', position: { x: 48, y: 76 } },
            { id: 12, name: 'Albahaca', quantity: 20, unit: 'g', position: { x: 44, y: 70 } },
            { id: 13, name: 'Aceite de Oliva', quantity: 60, unit: 'ml', position: { x: 56, y: 74 } }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Ensalada César',
          description: 'Ensalada fresca con aderezo césar',
          preparation_time: '15 min',
          difficulty: 'Fácil',
          servings: 2,
          category: 'Aperitivos',
          ingredients: [
            { id: 14, name: 'Lechuga', quantity: 200, unit: 'g', position: { x: 40, y: 68 } },
            { id: 15, name: 'Pollo', quantity: 150, unit: 'g', position: { x: 55, y: 72 } },
            { id: 16, name: 'Crutones', quantity: 50, unit: 'g', position: { x: 45, y: 78 } }
          ],
          created_at: new Date().toISOString()
        }
      ]);
      
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };


  // Función para cambiar de paso
  const handleNextStep = () => {
    if (plateIngredients.length > 0) {
      setCurrentStep(2);
    }
  };

  // Funciones de drag & drop





  // Funciones para gestionar ingredientes en el plato
  const removeIngredientFromPlate = (ingredientId) => {
    setPlateIngredients(prev => prev.filter(item => item.id !== ingredientId));
  };

  const updateIngredientQuantity = (ingredientId, newQuantity) => {
    if (newQuantity <= 0) {
      removeIngredientFromPlate(ingredientId);
      return;
    }
    
    setPlateIngredients(prev => 
      prev.map(item => 
        item.id === ingredientId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Funciones para edición de cantidades
  const handleQuantityClick = (ingredientId, currentQuantity) => {
    setEditingQuantity(ingredientId);
    setTempQuantity(currentQuantity.toString());
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Solo permitir números enteros positivos
    if (/^\d*$/.test(value)) {
      setTempQuantity(value);
    }
  };

  const handleQuantitySubmit = (ingredientId) => {
    const newQuantity = parseInt(tempQuantity);
    if (newQuantity && newQuantity > 0) {
      updateIngredientQuantity(ingredientId, newQuantity);
    }
    setEditingQuantity(null);
    setTempQuantity('');
  };

  const handleQuantityCancel = () => {
    setEditingQuantity(null);
    setTempQuantity('');
  };

  const handleQuantityKeyPress = (e, ingredientId) => {
    if (e.key === 'Enter') {
      handleQuantitySubmit(ingredientId);
    } else if (e.key === 'Escape') {
      handleQuantityCancel();
    }
  };

  // Funciones del buscador de ingredientes
  const handleIngredientSearch = (term) => {
    setIngredientSearchTerm(term);
    if (term.trim()) {
      const filtered = inventory.filter(item => 
        item.ingredients?.name?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredIngredients(filtered);
      setShowIngredientDropdown(true);
    } else {
      setFilteredIngredients([]);
      setShowIngredientDropdown(false);
    }
  };

  const handleAddIngredient = (ingredient) => {
    // Verificar si el ingrediente ya está en el plato
    const existingIngredient = plateIngredients.find(
      item => item.id === ingredient.id
    );
    
    if (existingIngredient) {
      // Incrementar cantidad
      setPlateIngredients(prev => 
        prev.map(item => 
          item.id === ingredient.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Agregar nuevo ingrediente
      const newIngredient = {
        id: ingredient.id,
        name: ingredient.ingredients?.name || 'Ingrediente',
        quantity: 1,
        unit: ingredient.ingredients?.unit_measure || 'unidad',
        position: { x: Math.random() * 40 + 30, y: Math.random() * 20 + 60 }
      };
      
      setPlateIngredients(prev => [...prev, newIngredient]);
    }
    
    // Limpiar búsqueda
    setIngredientSearchTerm('');
    setShowIngredientDropdown(false);
    setFilteredIngredients([]);
  };

  // Funciones para gestionar recetas
  const handleCreateRecipe = () => {
    if (!newRecipe.name.trim()) return;
    
    const recipe = {
      id: Date.now(),
      ...newRecipe,
      ingredients: plateIngredients,
      created_at: new Date().toISOString()
    };
    
    setRecipes(prev => [recipe, ...prev]);
    handleCloseModal();
    setNewRecipe({
      name: '',
      preparation_time: '',
      difficulty: 'Fácil',
      servings: 1,
      category: 'Entrantes'
    });
    setPlateIngredients([]);
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setNewRecipe({
      name: recipe.name,
      preparation_time: recipe.preparation_time,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      category: recipe.category
    });
    
    // Asegurar que los ingredientes tengan posición definida
    const ingredientsWithPosition = (recipe.ingredients || []).map(ingredient => ({
      ...ingredient,
      position: ingredient.position || { 
        x: Math.random() * 40 + 30, 
        y: Math.random() * 20 + 60 
      }
    }));
    
    setPlateIngredients(ingredientsWithPosition);
    setShowEditModal(true);
  };

  const handleUpdateRecipe = () => {
    if (!editingRecipe || !newRecipe.name.trim()) return;
    
    const updatedRecipe = {
      ...editingRecipe,
      ...newRecipe,
      ingredients: plateIngredients,
      updated_at: new Date().toISOString()
    };
    
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === editingRecipe.id ? updatedRecipe : recipe
      )
    );
    
    setShowEditModal(false);
    setEditingRecipe(null);
    setPlateIngredients([]);
  };

  const handleDeleteRecipe = (recipeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    }
  };

  // Filtrar recetas por categoría para el modal
  const recipesByCategory = recipes.filter(recipe => recipe.category === categoryForModal);

  // Función para calcular estadísticas por categoría
  const getCategoryStats = (categoryName) => {
    const categoryRecipes = recipes.filter(recipe => recipe.category === categoryName);
    
    if (categoryRecipes.length === 0) {
      return {
        count: 0,
        hasRecipes: false,
        mostCommonDifficulty: null,
        averageTime: null,
        latestRecipes: []
      };
    }

    // Calcular dificultad más común
    const difficultyCounts = {};
    categoryRecipes.forEach(recipe => {
      difficultyCounts[recipe.difficulty] = (difficultyCounts[recipe.difficulty] || 0) + 1;
    });
    const mostCommonDifficulty = Object.keys(difficultyCounts).reduce((a, b) => 
      difficultyCounts[a] > difficultyCounts[b] ? a : b
    );

    // Calcular tiempo promedio (extraer números de "30 min", "15 min", etc.)
    const times = categoryRecipes
      .map(recipe => {
        const match = recipe.preparation_time?.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(time => time > 0);
    
    const averageTime = times.length > 0 
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : null;

    // Obtener últimas 3 recetas ordenadas por fecha
    const latestRecipes = [...categoryRecipes]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 3);

    return {
      count: categoryRecipes.length,
      hasRecipes: true,
      mostCommonDifficulty,
      averageTime,
      latestRecipes
    };
  };

  // Componente del horno SVG interactivo
  const PlateSVG = () => (
    <div className="relative">
      <svg
        ref={svgRef}
        id="svg-global"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 94 136"
        height="120"
        width="84"
        style={styles.svgGlobal}
        className="transition-all duration-300 sm:h-[150px] sm:w-[105px]"
      >
        {/* Gradientes para horno */}
        <defs>
          <linearGradient id="paint0_linear_204_217" x1="1.00946" y1="92.0933" x2="92.5421" y2="92.0933" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6B7280"/>
            <stop stopColor="#4B5563" offset="1"/>
          </linearGradient>
          <linearGradient id="paint1_linear_204_217" x1="92.5" y1="70" x2="6.72169" y2="91.1638" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9CA3AF"/>
            <stop stopColor="#6B7280" offset="0.29"/>
            <stop stopColor="#4B5563" offset="1"/>
          </linearGradient>
          <linearGradient id="paint2_linear_204_217" x1="92.5" y1="70" x2="3.55544" y2="85.0762" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D1D5DB"/>
            <stop stopColor="#9CA3AF" offset="1"/>
          </linearGradient>
          {/* Más gradientes para las partículas - llamas del horno */}
          <linearGradient id="paint3_linear_204_217" x1="43.5482" y1="28.7976" x2="43.5482" y2="32.558" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4500"/>
            <stop stopColor="#FFD700" offset="1"/>
          </linearGradient>
          <linearGradient id="paint4_linear_204_217" x1="50.0323" y1="44.5915" x2="50.0323" y2="48.3519" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6347"/>
            <stop stopColor="#FFA500" offset="1"/>
          </linearGradient>
          <linearGradient id="paint5_linear_204_217" x1="40.3062" y1="59.6332" x2="40.3062" y2="62.6416" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8C00"/>
            <stop stopColor="#FFD700" offset="1"/>
          </linearGradient>
          <linearGradient id="paint6_linear_204_217" x1="50.7527" y1="68.6583" x2="50.7527" y2="73.9229" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4500"/>
            <stop stopColor="#FFA500" offset="1"/>
          </linearGradient>
          <linearGradient id="paint7_linear_204_217" x1="48.5913" y1="74.675" x2="48.5913" y2="76.9312" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6347"/>
            <stop stopColor="#FFD700" offset="1"/>
          </linearGradient>
          <linearGradient id="paint8_linear_204_217" x1="52.9153" y1="66.402" x2="52.9153" y2="67.1541" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8C00"/>
            <stop stopColor="#FFA500" offset="1"/>
          </linearGradient>
          <linearGradient id="paint9_linear_204_217" x1="52.1936" y1="41.5832" x2="52.1936" y2="43.8394" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4500"/>
            <stop stopColor="#FFD700" offset="1"/>
          </linearGradient>
          <linearGradient id="paint10_linear_204_217" x1="57.2367" y1="27.2935" x2="57.2367" y2="29.5497" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6347"/>
            <stop stopColor="#FFA500" offset="1"/>
          </linearGradient>
          <linearGradient id="paint11_linear_204_217" x1="43.9084" y1="33.3102" x2="43.9084" y2="34.8144" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8C00"/>
            <stop stopColor="#FFD700" offset="1"/>
          </linearGradient>
          <linearGradient id="paint12_linear_204_217" x1="67.8638" y1="88.5145" x2="62.9858" y2="16.0743" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E5E7EB"/>
            <stop stopOpacity="0" stopColor="#9CA3AF" offset="1"/>
          </linearGradient>
          <linearGradient id="paint13_linear_204_217" x1="36.2597" y1="88.0938" x2="31.4515" y2="39.4139" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F3F4F6"/>
            <stop stopOpacity="0" stopColor="#6B7280" offset="1"/>
          </linearGradient>
        </defs>

        {/* Líneas del horno */}
        <path
          stroke="#6B7280"
          d="M87.3629 108.433L49.1073 85.3765C47.846 84.6163 45.8009 84.6163 44.5395 85.3765L6.28392 108.433C5.02255 109.194 5.02255 110.426 6.28392 111.187L44.5395 134.243C45.8009 135.004 47.846 135.004 49.1073 134.243L87.3629 111.187C88.6243 110.426 88.6243 109.194 87.3629 108.433Z"
          id="line-v1"
          style={styles.bounceLines}
        />
        <path
          stroke="#9CA3AF"
          d="M91.0928 95.699L49.2899 70.5042C47.9116 69.6734 45.6769 69.6734 44.2986 70.5042L2.49568 95.699C1.11735 96.5298 1.11735 97.8767 2.49568 98.7074L44.2986 123.902C45.6769 124.733 47.9116 124.733 49.2899 123.902L91.0928 98.7074C92.4712 97.8767 92.4712 96.5298 91.0928 95.699Z"
          id="line-v2"
          style={{...styles.bounceLines, animationDelay: '0.2s'}}
        />

        {/* Horno principal */}
        <g id="node-server" style={{...styles.bounceLines, animationDelay: '0.4s'}}>
          <path
            fill="url(#paint0_linear_204_217)"
            d="M2.48637 72.0059L43.8699 96.9428C45.742 98.0709 48.281 97.8084 50.9284 96.2133L91.4607 71.7833C92.1444 71.2621 92.4197 70.9139 92.5421 70.1257V86.1368C92.5421 86.9686 92.0025 87.9681 91.3123 88.3825C84.502 92.4724 51.6503 112.204 50.0363 113.215C48.2352 114.343 45.3534 114.343 43.5523 113.215C41.9261 112.197 8.55699 91.8662 2.08967 87.926C1.39197 87.5011 1.00946 86.5986 1.00946 85.4058V70.1257C1.11219 70.9289 1.49685 71.3298 2.48637 72.0059Z"
          />
          <path
            stroke="url(#paint2_linear_204_217)"
            fill="url(#paint1_linear_204_217)"
            d="M91.0928 68.7324L49.2899 43.5375C47.9116 42.7068 45.6769 42.7068 44.2986 43.5375L2.49568 68.7324C1.11735 69.5631 1.11735 70.91 2.49568 71.7407L44.2986 96.9356C45.6769 97.7663 47.9116 97.7663 49.2899 96.9356L91.0928 71.7407C92.4712 70.91 92.4712 69.5631 91.0928 68.7324Z"
          />
          
          
          {/* Ingredientes en el plato */}
          {plateIngredients.map((ingredient, index) => {
            // Verificar que el ingrediente tenga posición definida
            if (!ingredient.position || typeof ingredient.position.x === 'undefined' || typeof ingredient.position.y === 'undefined') {
              return null;
            }
            
            return (
              <g key={ingredient.id}>
                <circle
                  cx={ingredient.position.x}
                  cy={ingredient.position.y}
                  r="8"
                  fill="rgba(255, 255, 255, 0.9)"
                  stroke="#667eea"
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
                <text
                  x={ingredient.position.x}
                  y={ingredient.position.y + 2}
                  textAnchor="middle"
                  fontSize="6"
                  fill="#667eea"
                  fontWeight="bold"
                >
                  {ingredient.quantity}
                </text>
              </g>
            );
          })}
        </g>

        {/* Llamas del horno */}
        <g id="particles" style={styles.particles}>
          <path
            fill="url(#paint3_linear_204_217)"
            d="M43.5482 32.558C44.5429 32.558 45.3493 31.7162 45.3493 30.6778C45.3493 29.6394 44.5429 28.7976 43.5482 28.7976C42.5535 28.7976 41.7471 29.6394 41.7471 30.6778C41.7471 31.7162 42.5535 32.558 43.5482 32.558Z"
            className="particle p1"
          />
          <path
            fill="url(#paint4_linear_204_217)"
            d="M50.0323 48.3519C51.027 48.3519 51.8334 47.5101 51.8334 46.4717C51.8334 45.4333 51.027 44.5915 50.0323 44.5915C49.0375 44.5915 48.2311 45.4333 48.2311 46.4717C48.2311 47.5101 49.0375 48.3519 50.0323 48.3519Z"
            className="particle p2"
          />
          <path
            fill="url(#paint5_linear_204_217)"
            d="M40.3062 62.6416C41.102 62.6416 41.7471 61.9681 41.7471 61.1374C41.7471 60.3067 41.102 59.6332 40.3062 59.6332C39.5104 59.6332 38.8653 60.3067 38.8653 61.1374C38.8653 61.9681 39.5104 62.6416 40.3062 62.6416Z"
            className="particle p3"
          />
          <path
            fill="url(#paint6_linear_204_217)"
            d="M50.7527 73.9229C52.1453 73.9229 53.2743 72.7444 53.2743 71.2906C53.2743 69.8368 52.1453 68.6583 50.7527 68.6583C49.3601 68.6583 48.2311 69.8368 48.2311 71.2906C48.2311 72.7444 49.3601 73.9229 50.7527 73.9229Z"
            className="particle p4"
          />
          <path
            fill="url(#paint7_linear_204_217)"
            d="M48.5913 76.9312C49.1882 76.9312 49.672 76.4262 49.672 75.8031C49.672 75.1801 49.1882 74.675 48.5913 74.675C47.9945 74.675 47.5107 75.1801 47.5107 75.8031C47.5107 76.4262 47.9945 76.9312 48.5913 76.9312Z"
            className="particle p5"
          />
          <path
            fill="url(#paint8_linear_204_217)"
            d="M52.9153 67.1541C53.115 67.1541 53.2768 66.9858 53.2768 66.7781C53.2768 66.5704 53.115 66.402 52.9153 66.402C52.7156 66.402 52.5538 66.5704 52.5538 66.7781C52.5538 66.9858 52.7156 67.1541 52.9153 67.1541Z"
            className="particle p6"
          />
          <path
            fill="url(#paint9_linear_204_217)"
            d="M52.1936 43.8394C52.7904 43.8394 53.2743 43.3344 53.2743 42.7113C53.2743 42.0883 52.7904 41.5832 52.1936 41.5832C51.5967 41.5832 51.1129 42.0883 51.1129 42.7113C51.1129 43.3344 51.5967 43.8394 52.1936 43.8394Z"
            className="particle p7"
          />
          <path
            fill="url(#paint10_linear_204_217)"
            d="M57.2367 29.5497C57.8335 29.5497 58.3173 29.0446 58.3173 28.4216C58.3173 27.7985 57.8335 27.2935 57.2367 27.2935C56.6398 27.2935 56.156 27.7985 56.156 28.4216C56.156 29.0446 56.6398 29.5497 57.2367 29.5497Z"
            className="particle p8"
          />
          <path
            fill="url(#paint11_linear_204_217)"
            d="M43.9084 34.8144C44.3063 34.8144 44.6289 34.4777 44.6289 34.0623C44.6289 33.647 44.3063 33.3102 43.9084 33.3102C43.5105 33.3102 43.188 33.647 43.188 34.0623C43.188 34.4777 43.5105 34.8144 43.9084 34.8144Z"
            className="particle p9"
          />
        </g>

        {/* Calor del horno */}
        <g id="reflectores" style={{...styles.bounceLines, animationDelay: '0.4s'}}>
          <path
            fillOpacity="0.2"
            fill="url(#paint12_linear_204_217)"
            d="M49.2037 57.0009L68.7638 68.7786C69.6763 69.3089 69.7967 69.9684 69.794 70.1625V13.7383C69.7649 13.5587 69.6807 13.4657 69.4338 13.3096L48.4832 0.601307C46.9202 -0.192595 46.0788 -0.208238 44.6446 0.601307L23.6855 13.2118C23.1956 13.5876 23.1966 13.7637 23.1956 14.4904L23.246 70.1625C23.2948 69.4916 23.7327 69.0697 25.1768 68.2447L43.9084 57.0008C44.8268 56.4344 45.3776 56.2639 46.43 56.2487C47.5299 56.2257 48.1356 56.4222 49.2037 57.0009Z"
          />
          <path
            fillOpacity="0.2"
            fill="url(#paint13_linear_204_217)"
            d="M48.8867 27.6696C49.9674 26.9175 68.6774 14.9197 68.6774 14.9197C69.3063 14.5327 69.7089 14.375 69.7796 13.756V70.1979C69.7775 70.8816 69.505 71.208 68.7422 71.7322L48.9299 83.6603C48.2003 84.1258 47.6732 84.2687 46.5103 84.2995C45.3295 84.2679 44.8074 84.1213 44.0907 83.6603L24.4348 71.8149C23.5828 71.3313 23.2369 71.0094 23.2316 70.1979L23.1884 13.9816C23.1798 14.8398 23.4982 15.3037 24.7518 16.0874C24.7518 16.0874 42.7629 26.9175 44.2038 27.6696C45.6447 28.4217 46.0049 28.4217 46.5452 28.4217C47.0856 28.4217 47.806 28.4217 48.8867 27.6696Z"
          />
        </g>

        {/* Controles del horno */}
        <g id="panel-rigth" style={{...styles.bounceLines, animationDelay: '0.4s'}}>
          <mask fill="white" id="path-26-inside-1_204_217">
            <path d="M72 91.8323C72 90.5121 72.9268 88.9068 74.0702 88.2467L87.9298 80.2448C89.0731 79.5847 90 80.1198 90 81.44V81.44C90 82.7602 89.0732 84.3656 87.9298 85.0257L74.0702 93.0275C72.9268 93.6876 72 93.1525 72 91.8323V91.8323Z"/>
          </mask>
          <path fill="#C0C0C0" d="M72 91.8323C72 90.5121 72.9268 88.9068 74.0702 88.2467L87.9298 80.2448C89.0731 79.5847 90 80.1198 90 81.44V81.44C90 82.7602 89.0732 84.3656 87.9298 85.0257L74.0702 93.0275C72.9268 93.6876 72 93.1525 72 91.8323V91.8323Z"/>
          <path mask="url(#path-26-inside-1_204_217)" fill="#808080" d="M72 89.4419L90 79.0496L72 89.4419ZM90.6928 81.44C90.6928 82.9811 89.6109 84.8551 88.2762 85.6257L74.763 93.4275C73.237 94.3085 72 93.5943 72 91.8323V91.8323C72 92.7107 72.9268 92.8876 74.0702 92.2275L87.9298 84.2257C88.6905 83.7865 89.3072 82.7184 89.3072 81.84L90.6928 81.44ZM72 94.2227V89.4419V94.2227ZM88.2762 80.0448C89.6109 79.2742 90.6928 79.8989 90.6928 81.44V81.44C90.6928 82.9811 89.6109 84.8551 88.2762 85.6257L87.9298 84.2257C88.6905 83.7865 89.3072 82.7184 89.3072 81.84V81.84C89.3072 80.5198 88.6905 79.8056 87.9298 80.2448L88.2762 80.0448Z"/>
          
          <mask fill="white" id="path-28-inside-2_204_217">
            <path d="M67 94.6603C67 93.3848 67.8954 91.8339 69 91.1962V91.1962C70.1046 90.5584 71 91.0754 71 92.3509V92.5129C71 93.7884 70.1046 95.3393 69 95.977V95.977C67.8954 96.6147 67 96.0978 67 94.8223V94.6603Z"/>
          </mask>
          <path fill="#C0C0C0" d="M67 94.6603C67 93.3848 67.8954 91.8339 69 91.1962V91.1962C70.1046 90.5584 71 91.0754 71 92.3509V92.5129C71 93.7884 70.1046 95.3393 69 95.977V95.977C67.8954 96.6147 67 96.0978 67 94.8223V94.6603Z"/>
          <path mask="url(#path-28-inside-2_204_217)" fill="#808080" d="M67 92.3509L71 90.0415L67 92.3509ZM71.6928 92.5129C71.6928 94.0093 70.6423 95.8288 69.3464 96.577L69.3464 96.577C68.0505 97.3252 67 96.7187 67 95.2223V94.8223C67 95.6559 67.8954 95.8147 69 95.177L69 95.177C69.7219 94.7602 70.3072 93.7465 70.3072 92.9129L71.6928 92.5129ZM67 97.1317V92.3509V97.1317ZM69.2762 91.0367C70.6109 90.2661 71.6928 90.8908 71.6928 92.4319V92.5129C71.6928 94.0093 70.6423 95.8288 69.3464 96.577L69 95.177C69.7219 94.7602 70.3072 93.7465 70.3072 92.9129V92.7509C70.3072 91.4754 69.7219 90.7794 69 91.1962L69.2762 91.0367Z"/>
        </g>
      </svg>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Estilos CSS integrados */}
      <style>{`
        @keyframes fade-particles {
          0%, 100% { 
            opacity: 1; 
            transform: translateY(0px);
          }
          50% { 
            opacity: 0.3; 
            transform: translateY(-2px);
          }
        }
        
        @keyframes floatUp {
          0% { 
            transform: translateY(0px) scale(1); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
            transform: translateY(-2px) scale(1.1);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-20px) scale(1.05);
          }
          100% { 
            transform: translateY(-40px) scale(0.8); 
            opacity: 0; 
          }
        }
        
        @keyframes bounce-lines {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes slideInFromLeft {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        .particle.p1 { 
          animation: floatUp 2.2s linear infinite;
          animation-delay: 0s; 
        }
        .particle.p2 { 
          animation: floatUp 2.5s linear infinite;
          animation-delay: 0.3s; 
        }
        .particle.p3 { 
          animation: floatUp 2s linear infinite;
          animation-delay: 0.6s; 
        }
        .particle.p4 { 
          animation: floatUp 2.8s linear infinite;
          animation-delay: 0.2s; 
        }
        .particle.p5 { 
          animation: floatUp 2.3s linear infinite;
          animation-delay: 0.4s; 
        }
        .particle.p6 { 
          animation: floatUp 3s linear infinite;
          animation-delay: 0.1s; 
        }
        .particle.p7 { 
          animation: floatUp 2.1s linear infinite;
          animation-delay: 0.5s; 
        }
        .particle.p8 { 
          animation: floatUp 2.6s linear infinite;
          animation-delay: 0.2s; 
        }
        .particle {
          will-change: transform, opacity;
          transform-origin: center;
        }
        
        .plate-container {
          will-change: transform;
        }
        
        #particles {
          animation: fade-particles 4s ease-in-out infinite alternate;
          will-change: transform, opacity;
        }
        
        .plate-container::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .plate-container:hover::before {
          opacity: 1;
        }
        
        .ingredient-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .ingredient-item:active {
          transform: scale(0.95);
          transition: transform 0.1s ease;
        }
        
        .action-btn {
          transition: all 0.2s ease;
        }
        
        .action-btn:hover {
          transform: scale(1.1);
        }
        
        .action-btn:active {
          transform: scale(0.95);
        }
        
        .recipe-card {
          transition: all 0.3s ease;
        }
        
        .recipe-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .modal-backdrop {
          backdrop-filter: blur(4px);
        }
        
        @media (max-width: 768px) {
          .plate-container svg {
            zoom: 1;
          }
        }
      `}</style>
      
      <div className="space-y-6">
      {/* Header con botón de crear receta */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
          <button
            onClick={() => setShowCreateModal(true)}
            className="group flex items-center space-x-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 w-full sm:w-auto"
            aria-label="Crear nueva receta"
          >
            <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0 group-hover:bg-indigo-200 transition-colors duration-200">
              <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">Nueva Receta</p>
            </div>
            <svg className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div>
          <p className="text-gray-600 text-center sm:text-left">Crea y gestiona tus recetas de forma interactiva</p>
        </div>
      </div>

      {/* Cartas de categorías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { name: 'Aperitivos', icon: '🍤' },
          { name: 'Primeros Platos', icon: '🥗' },
          { name: 'Segundos Platos', icon: '🍽️' },
          { name: 'Postres', icon: '🍰' },
          { name: 'Bebidas', icon: '🍷' }
        ].map((cat) => {
          const stats = getCategoryStats(cat.name);
          const isEmpty = !stats.hasRecipes;
          
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => {
                setCategoryForModal(cat.name);
                setShowCategoryModal(true);
              }}
              className={`text-left bg-white p-5 rounded-lg shadow-sm border transition-all duration-200 group ${
                isEmpty 
                  ? 'border-gray-200 hover:border-gray-300' 
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              {/* Header con icono y contador */}
              <div className="flex items-start justify-between mb-3">
                <div className={`relative h-12 w-12 flex items-center justify-center rounded-lg text-xl transition-colors duration-200 ${
                  isEmpty
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200'
                }`}>
                  <span>{cat.icon}</span>
                  {/* Badge contador - Opción 1 */}
                  {stats.count > 0 && (
                    <span className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-bold text-white ${
                      stats.count > 9 ? 'bg-indigo-600' : 'bg-indigo-500'
                    }`}>
                      {stats.count > 99 ? '99+' : stats.count}
                    </span>
                  )}
          </div>
                {/* Indicador de estado - Opción 4 */}
                <div className={`h-2 w-2 rounded-full ${
                  isEmpty ? 'bg-gray-300' : 'bg-green-500'
                }`} title={isEmpty ? 'Sin recetas' : `${stats.count} receta(s)`}></div>
          </div>

              {/* Título y descripción */}
              <div className="mb-3">
                <div className={`font-semibold text-base mb-1 truncate transition-colors duration-200 ${
                  isEmpty ? 'text-gray-500' : 'text-gray-900 group-hover:text-indigo-700'
                }`}>
                  {cat.name}
        </div>
                <div className={`text-xs truncate transition-colors duration-200 ${
                  isEmpty ? 'text-gray-400' : 'text-gray-500 group-hover:text-indigo-600'
                }`}>
                  {stats.count === 0 
                    ? 'Sin recetas' 
                    : stats.count === 1 
                      ? '1 receta' 
                      : `${stats.count} recetas`
                  }
                </div>
              </div>

              {/* Estadísticas - Opción 3 */}
              {stats.hasRecipes && (
                <div className="mb-3 space-y-1.5">
                  {stats.mostCommonDifficulty && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        stats.mostCommonDifficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                        stats.mostCommonDifficulty === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {stats.mostCommonDifficulty}
                      </span>
                      <span className="text-gray-500">más común</span>
                    </div>
                  )}
                  {stats.averageTime && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">{stats.averageTime} min</span>
                      <span className="text-gray-500"> promedio</span>
                    </div>
                  )}
                </div>
              )}

              {/* Mini-preview de últimas recetas - Opción 2 */}
              {stats.latestRecipes.length > 0 && (
                <div className="mb-3 pt-2 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-700 mb-1.5">Últimas recetas:</div>
                  <div className="space-y-1">
                    {stats.latestRecipes.map((recipe, idx) => (
                      <div key={recipe.id} className="flex items-center gap-2 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0"></div>
                        <span className="text-gray-600 truncate">{recipe.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer con flecha */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400 group-hover:text-indigo-600 transition-colors duration-200">
                  {isEmpty ? 'Crear receta' : 'Ver todas'}
                </span>
                <svg className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal de crear/editar receta */}
      {(showCreateModal || showEditModal) && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (showEditModal) {
                setShowEditModal(false);
                setEditingRecipe(null);
              } else if (showCreateModal) {
                handleCloseModal();
              }
            }
          }}
        >
          <div className="relative top-2 sm:top-4 lg:top-8 mx-auto p-2 sm:p-3 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-hidden flex flex-col">
            <div className="mt-2 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {showCreateModal ? 'Crear Nueva Receta' : 'Editar Receta'}
                  </h3>
                  {currentStep === 2 && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Paso 2/2
                    </span>
                  )}
                  {currentStep === 1 && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Paso 1/2
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    handleCloseModal();
                    setShowEditModal(false);
                    setPlateIngredients([]);
                    setCurrentStep(1);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className={`grid gap-2 sm:gap-3 ${currentStep === 1 ? 'grid-cols-1' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
                {/* Formulario de datos básicos - Solo visible en el paso 2 */}
                {currentStep === 2 && (
                  <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Nombre de la receta</label>
                    <input
                      type="text"
                      value={newRecipe.name}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Pasta Alfredo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Tiempo de preparación</label>
                      <input
                        type="text"
                        value={newRecipe.preparation_time}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, preparation_time: e.target.value }))}
                        placeholder="Ej: 30 min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Porciones</label>
                      <input
                        type="number"
                        min="1"
                        value={newRecipe.servings}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Dificultad</label>
                      <select
                        value={newRecipe.difficulty}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="Fácil">Fácil</option>
                        <option value="Media">Media</option>
                        <option value="Difícil">Difícil</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Categoría</label>
                      <select
                        value={newRecipe.category}
                        onChange={(e) => setNewRecipe(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="Aperitivos">Aperitivos</option>
                        <option value="Primeros Platos">Primeros Platos</option>
                        <option value="Segundos Platos">Segundos Platos</option>
                        <option value="Postres">Postres</option>
                        <option value="Bebidas">Bebidas</option>
                      </select>
                    </div>
                  </div>
                </div>
                )}

                {/* Mensaje cuando está en paso 1 */}
                {currentStep === 1 && (
                  <div className="space-y-2 sm:space-y-3 order-2 xl:order-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <div className="text-blue-600 mb-2">
                        <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-blue-900 mb-1">
                        {plateIngredients.length === 0 ? 'Agrega los ingredientes de tu receta' : 'Ingredientes listos'}
                      </h3>
                      <p className="text-xs text-blue-700">
                        {plateIngredients.length === 0 
                          ? 'Añade los distintos ingredientes para crear tu receta' 
                          : `Tienes ${plateIngredients.length} ingrediente(s). Cuando termines, haz clic en "Siguiente paso"`
                        }
                      </p>
                      {plateIngredients.length > 0 && (
                        <button
                          onClick={handleNextStep}
                          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          Siguiente paso
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Área de creación interactiva */}
                <div className="space-y-2 sm:space-y-3 order-1 xl:order-2">
                  <div>
                    {/* Horno interactivo */}
                    <div className="flex justify-center mb-2 sm:mb-3">
                      <div className="plate-container" style={styles.plateContainer}>
                        <PlateSVG />
                      </div>
                    </div>

                    {/* Buscador de ingredientes - Solo en paso 1 */}
                    {currentStep === 1 && (
                      <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                        <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <span className="mr-1">🔍</span>
                          Buscar ingredientes
                        </h5>
                        <div className="relative">
                          <input
                            type="text"
                            value={ingredientSearchTerm}
                            onChange={(e) => handleIngredientSearch(e.target.value)}
                            placeholder="Escribe el nombre del ingrediente..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          
                          {/* Dropdown de resultados */}
                          {showIngredientDropdown && filteredIngredients.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {filteredIngredients.slice(0, 10).map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => handleAddIngredient(item)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between"
                                >
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {item.ingredients?.name || 'Sin nombre'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Disponible: {item.quantity} {item.ingredients?.unit_measure || 'unidad'}
                                    </div>
                                  </div>
                                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Lista de ingredientes en el plato - Solo en paso 1 */}
                    {currentStep === 1 && (
                      <>
                        {plateIngredients.length > 0 ? (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2 sm:p-3 border border-green-200">
                            <h5 className="text-xs sm:text-sm font-medium text-green-900 mb-2 flex items-center">
                              
                              Ingredientes agregados ({plateIngredients.length}) - ¡Ahora completa los datos!
                            </h5>
                            <div className="space-y-1 sm:space-y-2 max-h-20 sm:max-h-24 overflow-y-auto">
                              {plateIngredients.map((ingredient, index) => (
                                <div 
                                  key={ingredient.id} 
                                  className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-green-100"
                                  style={{...styles.ingredientSlideIn, animationDelay: `${index * 0.1}s`}}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-gray-900 truncate">{ingredient.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{ingredient.unit}</div>
                                  </div>
                                  <div className="flex items-center space-x-1 flex-shrink-0">
                                    <button
                                      onClick={() => updateIngredientQuantity(ingredient.id, ingredient.quantity - 1)}
                                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center action-btn transition-all duration-200 text-xs"
                                      title="Reducir cantidad"
                                    >
                                      -
                                    </button>
                                    {editingQuantity === ingredient.id ? (
                                      <input
                                        type="text"
                                        value={tempQuantity}
                                        onChange={handleQuantityChange}
                                        onBlur={() => handleQuantitySubmit(ingredient.id)}
                                        onKeyDown={(e) => handleQuantityKeyPress(e, ingredient.id)}
                                        className="text-xs font-medium w-5 sm:w-6 text-center bg-white px-1 py-1 rounded border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        autoFocus
                                      />
                                    ) : (
                                      <span 
                                        className="text-xs font-medium w-5 sm:w-6 text-center bg-green-50 px-1 py-1 rounded cursor-pointer hover:bg-green-100 transition-colors"
                                        onClick={() => handleQuantityClick(ingredient.id, ingredient.quantity)}
                                        title="Haz clic para editar cantidad"
                                      >
                                        {ingredient.quantity}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => updateIngredientQuantity(ingredient.id, ingredient.quantity + 1)}
                                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center action-btn transition-all duration-200 text-xs"
                                      title="Aumentar cantidad"
                                    >
                                      +
                                    </button>
                                    <button
                                      onClick={() => removeIngredientFromPlate(ingredient.id)}
                                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center action-btn transition-all duration-200 text-xs"
                                      title="Eliminar ingrediente"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center border-2 border-dashed border-gray-300">
                            <div className="text-gray-400 mb-1">
                              <svg className="mx-auto h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <h5 className="text-xs font-medium text-gray-500 mb-1">¡Busca ingredientes para agregar!</h5>
                            <p className="text-xs text-gray-400">Usa el buscador para encontrar ingredientes de tu inventario</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-3 pt-2 border-t border-gray-200 flex-shrink-0">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => {
                      handleCloseModal();
                      setShowEditModal(false);
                      setPlateIngredients([]);
                      setCurrentStep(1);
                    }}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  {currentStep === 2 && (
                    <button
                      onClick={showCreateModal ? handleCreateRecipe : handleUpdateRecipe}
                      disabled={!newRecipe.name.trim()}
                      className="w-full sm:w-auto px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:bg-blue-600"
                    >
                      {showCreateModal ? 'Crear Receta' : 'Actualizar Receta'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de categorías */}
      {showCategoryModal && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 modal-backdrop flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCategoryModal(false);
              setCategoryForModal('');
            }
          }}
        >
          <div className="relative mx-auto w-full sm:max-w-6xl bg-white shadow-xl rounded-t-lg sm:rounded-lg overflow-hidden flex flex-col max-h-[90vh] sm:my-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-md text-base sm:text-lg bg-indigo-100 text-indigo-700 flex-shrink-0">
                  <span>
                    {categoryForModal === 'Aperitivos' ? '🍤' :
                     categoryForModal === 'Primeros Platos' ? '🥗' :
                     categoryForModal === 'Segundos Platos' ? '🍽️' :
                     categoryForModal === 'Postres' ? '🍰' :
                     categoryForModal === 'Bebidas' ? '🥤' : ''}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Recetas de {categoryForModal}</h2>
                  <p className="text-xs sm:text-sm text-gray-500">{recipesByCategory.length} receta(s) encontrada(s)</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setCategoryForModal('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 flex-shrink-0 ml-2"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido con scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {recipesByCategory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {recipesByCategory.map((recipe) => (
                    <div key={recipe.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 recipe-card group">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 truncate">{recipe.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{recipe.description}</p>
                          </div>
                          <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                setShowCategoryModal(false);
                                setCategoryForModal('');
                                handleEditRecipe(recipe);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteRecipe(recipe.id);
                                if (recipesByCategory.length === 1) {
                                  setShowCategoryModal(false);
                                  setCategoryForModal('');
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            recipe.difficulty === 'Fácil' ? 'difficulty-easy' :
                            recipe.difficulty === 'Media' ? 'difficulty-medium' :
                            'difficulty-hard'
                          }`}>
                            {recipe.difficulty}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {recipe.category}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {recipe.preparation_time}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {recipe.servings} porciones
                          </span>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</h4>
                          <div className="space-y-1">
                            {recipe.ingredients?.slice(0, 3).map((ingredient, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                • {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                              </div>
                            ))}
                            {recipe.ingredients?.length > 3 && (
                              <div className="text-sm text-gray-500">
                                +{recipe.ingredients.length - 3} ingredientes más...
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Creada: {new Date(recipe.created_at).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m-1.5-18h.008v.008H12V3.75zm0 0h.008v.008H12V3.75z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay recetas en esta categoría</h3>
                  <p className="mt-1 text-sm text-gray-500">Aún no tienes recetas de {categoryForModal}.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setShowCategoryModal(false);
                        setCategoryForModal('');
                        setShowCreateModal(true);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Crear nueva receta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista de recetas - Temporalmente oculta */}
      {false && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 recipe-card group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRecipe(recipe)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  recipe.difficulty === 'Fácil' ? 'difficulty-easy' :
                  recipe.difficulty === 'Media' ? 'difficulty-medium' :
                  'difficulty-hard'
                }`}>
                  {recipe.difficulty}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {recipe.category}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {recipe.preparation_time}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                  {recipe.servings} porciones
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</h4>
                <div className="space-y-1">
                  {recipe.ingredients?.slice(0, 3).map((ingredient, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                    </div>
                  ))}
                  {recipe.ingredients?.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{recipe.ingredients.length - 3} ingredientes más...
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Creada: {new Date(recipe.created_at).toLocaleDateString('es-ES')}
              </div>
            </div>
          </div>
        ))}
      </div>}

      {false && recipes.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m-1.5-18h.008v.008H12V3.75zm0 0h.008v.008H12V3.75z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay recetas</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando tu primera receta.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Receta
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default RecipeManagement;