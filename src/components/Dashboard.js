import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLicense } from '../hooks/useLicense';
import { useInventory } from '../hooks/useInventory';
import InventoryManagement from './InventoryManagement';
import SuppliersManagement from './SuppliersManagement';
import LicenseManagement from './LicenseManagement';
import RecipeManagement from './RecipeManagement';
import Suppliers_Costs from './Suppliers_Costs';

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isAdmin, getLicenseInfo } = useLicense();
  const { 
    inventoryCount, 
    lastMovement, 
    loading: countLoading, 
    movementLoading, 
    formatTimeAgo, 
    formatTime, 
    formatMovementDescription,
    getGrowthText, 
    getGrowthColor 
  } = useInventory();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState('Dashboard');
  const [showCostsDropdown, setShowCostsDropdown] = useState(false);
  const [costsSubsection, setCostsSubsection] = useState(null);
  
  const licenseInfo = getLicenseInfo();

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        navigate('/login');
      } else {
        console.error('Error al cerrar sesión:', result.error);
        // Aún así redirigir al login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así redirigir al login
      navigate('/login');
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
      { name: 'Proveedores', icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
      { name: 'Gestión de Inventario', icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125' },
      { name: 'Gestión de Recetas', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m-1.5-18h.008v.008H12V3.75zm0 0h.008v.008H12V3.75z' },
      { name: 'Planificación de Menús', icon: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25' },
      { name: 'Cálculo de Costos', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.171-.879-1.172-2.303 0-3.182s3.07-.879 4.242 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { name: 'Informes de Rendimiento', icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z' }
    ];

    // Agregar gestión de licencias solo para administradores
    if (isAdmin()) {
      baseItems.push({
        name: 'Gestión de Licencias',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const costsSubsections = [
    { name: 'Proveedores', value: 'costs-suppliers' },
    { name: 'Inventario', value: 'costs-inventory' },
    { name: 'Menús', value: 'costs-menus' }
  ];

  const handleCostsClick = (isMobile = false) => {
    const newDropdownState = !showCostsDropdown;
    setShowCostsDropdown(newDropdownState);
    
    // Si no hay subsección seleccionada y se cierra el desplegable, mantener "Cálculo de Costos" como activo
    if (costsSubsection === null) {
      setCurrentSection('Cálculo de Costos');
    }
  };

  const handleCostsSubsectionClick = (subsection, isMobile = false) => {
    setCostsSubsection(subsection.value);
    setCurrentSection(`Cálculo de Costos - ${subsection.name}`);
    if (isMobile) {
      setSidebarOpen(false);
      setShowCostsDropdown(false);
    }
  };

  const renderCostsMenuItem = (item, isMobile = false, sidebarCollapsed = false) => {
    const isActive = showCostsDropdown || costsSubsection !== null || currentSection === 'Cálculo de Costos' || currentSection.startsWith('Cálculo de Costos -');
    
    const handleClick = () => {
      if (sidebarCollapsed) {
        // Si el sidebar está colapsado, simplemente establecer la sección
        setCurrentSection('Cálculo de Costos');
        setShowCostsDropdown(false);
      } else {
        handleCostsClick(isMobile);
      }
    };
    
    return (
      <div key={item.name}>
        <button
          onClick={handleClick}
          className={`group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium ${
            isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg
            className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
          </svg>
          {!sidebarCollapsed && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              <svg
                className={`h-4 w-4 transition-transform ${showCostsDropdown ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </>
          )}
        </button>
        {showCostsDropdown && !sidebarCollapsed && (
          <div className="ml-6 mt-1 space-y-1">
            {costsSubsections.map((subsection) => (
              <button
                key={subsection.value}
                onClick={() => handleCostsSubsectionClick(subsection, isMobile)}
                className={`group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium ${
                  costsSubsection === subsection.value
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="ml-2">{subsection.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMenuItem = (item, isMobile = false, sidebarCollapsed = false) => {
    // Si es "Cálculo de Costos", usar el renderizado especial
    if (item.name === 'Cálculo de Costos') {
      return renderCostsMenuItem(item, isMobile, sidebarCollapsed);
    }

    // Para los demás items, usar el renderizado normal
    return (
      <button
        key={item.name}
        onClick={() => {
          setCurrentSection(item.name);
          // Cerrar el desplegable de costos si estaba abierto
          if (showCostsDropdown) {
            setShowCostsDropdown(false);
            setCostsSubsection(null);
          }
          // Cerrar el menú móvil cuando se selecciona una sección
          if (isMobile) {
            setSidebarOpen(false);
          }
        }}
        className={`group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium ${
          currentSection === item.name ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <svg
          className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
        </svg>
        {!sidebarCollapsed && item.name}
      </button>
    );
  };

  const renderContent = () => {
    // Verificar si es una subsección de costos
    if (currentSection.startsWith('Cálculo de Costos -')) {
      const subsectionName = currentSection.replace('Cálculo de Costos - ', '');
      
      // Si es la subsección de Proveedores, mostrar el componente Suppliers_Costs
      if (subsectionName === 'Proveedores') {
        return <Suppliers_Costs />;
      }
      
      // Para otras subsecciones, mostrar un placeholder
      return (
        <div className="py-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Cálculo de Costos - {subsectionName}
            </h2>
            <p className="text-gray-600">
              Contenido para el cálculo de costos de {subsectionName.toLowerCase()}.
            </p>
          </div>
        </div>
      );
    }

    switch(currentSection) {
      case 'Gestión de Inventario':
        return <InventoryManagement />;
      case 'Proveedores':
        return <SuppliersManagement />;
      case 'Gestión de Licencias':
        return <LicenseManagement />;
      case 'Gestión de Recetas':
        return <RecipeManagement />;
      case 'Cálculo de Costos':
        return (
          <div className="py-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Cálculo de Costos
              </h2>
              <p className="text-gray-600">
                Selecciona una subsección para ver los cálculos de costos: Proveedores, Inventario o Menús.
              </p>
            </div>
          </div>
        );
      case 'Dashboard':
        return (
          <div className="py-2">
            {/* Información de Licencia */}
            {licenseInfo && (
              <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md p-3 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">Licencia:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      licenseInfo.type === 'premium' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {licenseInfo.type === 'premium' ? 'Premium' : 'Gratuita'}
                    </span>
                    {licenseInfo.isAdmin && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    )}
                    <span className="text-sm text-gray-600">
                      {licenseInfo.isActive ? (
                        licenseInfo.daysRemaining > 0 ? (
                          `Expira en ${licenseInfo.daysRemaining} días`
                        ) : (
                          'Expira hoy'
                        )
                      ) : (
                        'Expirada'
                      )}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {licenseInfo.limits.ingredients} ingredientes • {licenseInfo.limits.suppliers} proveedores
                  </div>
                </div>
              </div>
            )}

            {/* Diseño móvil optimizado - Grid de 2 columnas en móvil */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Tarjeta de Inventario */}
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700">Inventario</h3>
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-indigo-600 mb-1">
                  {countLoading ? '...' : inventoryCount}
                </p>
                <p className="text-xs text-gray-500 mb-2">Productos en stock</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getGrowthColor()}`}>
                    {getGrowthText()}
                  </span>
                  <span className="text-xs text-gray-400">productos nuevos</span>
                </div>
              </div>

              {/* Tarjeta de Menús Activos */}
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700">Menús</h3>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mb-1">8</p>
                <p className="text-xs text-gray-500 mb-2">Activos</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+2</span>
                  <span className="text-xs text-gray-400">nuevos</span>
                </div>
              </div>

              {/* Tarjeta de Recetas */}
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700">Recetas</h3>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m-1.5-18h.008v.008H12V3.75zm0 0h.008v.008H12V3.75z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">32</p>
                <p className="text-xs text-gray-500 mb-2">Registradas</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+4</span>
                  <span className="text-xs text-gray-400">nuevas</span>
                </div>
              </div>

              {/* Tarjeta de Costos */}
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700">Costos</h3>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.171-.879-1.172-2.303 0-3.182s3.07-.879 4.242 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-purple-600 mb-1">$12.4k</p>
                <p className="text-xs text-gray-500 mb-2">Mensuales</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">-3%</span>
                  <span className="text-xs text-gray-400">vs anterior</span>
                </div>
              </div>
            </div>

            {/* Sección de Actividad Reciente - Optimizada para móvil */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Nueva receta agregada</p>
                      <p className="text-xs text-gray-600 mt-1">Pasta Alfredo</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">hace 2 horas</span>
                        <span className="text-xs text-gray-400">2:30 PM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Actualización de inventario</p>
                      {movementLoading ? (
                        <p className="text-xs text-gray-600 mt-1">Cargando...</p>
                      ) : lastMovement ? (
                        <>
                          <p className="text-xs text-gray-600 mt-1">
                            {formatMovementDescription(lastMovement)}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{formatTimeAgo(lastMovement.created_at)}</span>
                            <span className="text-xs text-gray-400">{formatTime(lastMovement.created_at)}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-gray-600 mt-1">No hay movimientos recientes</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Nuevo menú creado</p>
                      <p className="text-xs text-gray-600 mt-1">Menú de Verano</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">hace 1 día</span>
                        <span className="text-xs text-gray-400">Ayer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden transition-transform duration-200 hover:scale-110"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="sr-only">Abrir menú</span>
          <svg
            className={`h-6 w-6 transition-transform duration-200 ${sidebarOpen ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <h1 className="text-xl font-bold text-gray-800">Gestor de Cocina</h1>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div 
          className={`fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={`fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-800">Gestor de Cocina</h1>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Cerrar menú</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2">
              {menuItems.map(item => renderMenuItem(item, true, false))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Gestor de Cocina
                  </div>
                  <div className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    {licenseInfo ? (
                      `Licencia: ${licenseInfo.type === 'premium' ? 'Premium' : 'Gratuita'}`
                    ) : (
                      'Licencia: Usuario'
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-auto rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:transition-all lg:duration-300 ${
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-2">
            <h1 className={`text-xl font-bold text-gray-800 ${sidebarCollapsed ? 'hidden' : 'block'}`}>Gestor de Cocina</h1>
            <button
              type="button"
              className={`rounded-md p-2 text-gray-700 hover:bg-gray-50 ${sidebarCollapsed ? 'mx-auto' : 'ml-auto'}`}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <span className="sr-only">Colapsar menú</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={sidebarCollapsed ? "M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" : "M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"}
                />
              </svg>
            </button>
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2">
              {menuItems.map(item => renderMenuItem(item, false, sidebarCollapsed))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-2">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div className={`${sidebarCollapsed ? 'hidden' : 'block'}`}>
                  <div className="text-sm font-medium text-gray-700">
                    Gestor de Cocina
                  </div>
                  <div className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    {licenseInfo ? (
                      `Licencia: ${licenseInfo.type === 'premium' ? 'Premium' : 'Gratuita'}`
                    ) : (
                      'Licencia: Usuario'
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`rounded-md bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 ${
                    sidebarCollapsed ? 'mx-auto' : 'ml-auto'
                  }`}
                >
                  {sidebarCollapsed ? (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                  ) : (
                    'Cerrar sesión'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}>
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">{currentSection}</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 