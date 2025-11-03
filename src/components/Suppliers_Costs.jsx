import React, { useState, useEffect, useMemo } from 'react';
import { database } from '../config/supabase';

const Suppliers_Costs = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [allProductPrices, setAllProductPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Obtener el user_id del usuario autenticado
      const userIdResult = await database.getCurrentUserId();
      if (!userIdResult.success) {
        setError('Error al obtener información del usuario');
        setLoading(false);
        return;
      }

      // Obtener proveedores y precios de productos en paralelo
      const [suppliersResult, pricesResult] = await Promise.all([
        database.getSuppliers(userIdResult.userId),
        database.getAllProductPrices(userIdResult.userId)
      ]);

      if (suppliersResult.success) {
        setSuppliers(suppliersResult.data);
      } else {
        setError('Error al cargar los proveedores');
        console.error('Error fetching suppliers:', suppliersResult.error);
      }

      if (pricesResult.success) {
        setAllProductPrices(pricesResult.data || []);
      } else {
        console.error('Error fetching product prices:', pricesResult.error);
      }

      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista única de productos disponibles
  const availableProducts = useMemo(() => {
    const productMap = new Map();
    allProductPrices.forEach(item => {
      if (item.ingredients && item.ingredients.id) {
        const productId = item.ingredients.id;
        if (!productMap.has(productId)) {
          productMap.set(productId, {
            id: productId,
            name: item.ingredients.name,
            unit_measure: item.ingredients.unit_measure,
            category: item.ingredients.categories?.name || 'Sin categoría'
          });
        }
      }
    });
    return Array.from(productMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allProductPrices]);

  // Filtrar productos por búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return availableProducts.filter(product => 
      product.name.toLowerCase().includes(query)
    );
  }, [searchQuery, availableProducts]);

  // Obtener precios comparativos del producto seleccionado
  const productComparisons = useMemo(() => {
    if (!selectedProduct) return [];
    
    const comparisons = allProductPrices
      .filter(item => item.ingredients && item.ingredients.id === selectedProduct.id)
      .map(item => ({
        supplierId: item.supplier_id,
        supplierName: item.suppliers?.name || 'Proveedor desconocido',
        supplierContact: item.suppliers?.contact_person || '',
        supplierEmail: item.suppliers?.email || '',
        supplierPhone: item.suppliers?.phone || '',
        price: parseFloat(item.supplier_price) || 0,
        unit: item.supplier_unit || item.ingredients.unit_measure || 'unidad',
        conversionFactor: parseFloat(item.conversion_factor) || 1,
        notes: item.notes || '',
        supplierIngredientId: item.id
      }))
      .sort((a, b) => a.price - b.price);

    return comparisons;
  }, [selectedProduct, allProductPrices]);

  // Calcular KPIs del producto seleccionado
  const productKPIs = useMemo(() => {
    if (productComparisons.length === 0) return null;

    const prices = productComparisons.map(c => c.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const cheapestSupplier = productComparisons.find(c => c.price === minPrice);
    const mostExpensiveSupplier = productComparisons.find(c => c.price === maxPrice);
    const priceDifference = maxPrice - minPrice;
    const priceDifferencePercent = minPrice > 0 ? ((priceDifference / minPrice) * 100).toFixed(2) : 0;

    return {
      minPrice,
      maxPrice,
      avgPrice: avgPrice.toFixed(2),
      cheapestSupplier,
      mostExpensiveSupplier,
      priceDifference: priceDifference.toFixed(2),
      priceDifferencePercent,
      supplierCount: productComparisons.length
    };
  }, [productComparisons]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchQuery(product.name);
  };

  if (loading && suppliers.length === 0) {
    return (
      <div className="py-2">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600">Cargando proveedores...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && suppliers.length === 0) {
    return (
      <div className="py-2">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Comparación de Precios - Proveedores
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Busca un producto y compara sus precios entre todos los proveedores
          </p>
        </div>

        <div className="p-6">
          {/* Buscador de Productos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Producto
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedProduct(null);
                }}
                placeholder="Escribe el nombre del producto..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && !selectedProduct && filteredProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{product.category}</div>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && !selectedProduct && filteredProducts.length === 0 && searchQuery.trim() !== '' && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                  <p className="text-gray-500 text-sm">No se encontraron productos</p>
                </div>
              )}
            </div>
          </div>

          {/* Producto Seleccionado y Comparación */}
          {selectedProduct ? (
            <div className="space-y-6">
              {/* Información del Producto Seleccionado */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  {selectedProduct.name}
                </h3>
                <p className="text-sm text-blue-700">
                  Categoría: {selectedProduct.category} | Unidad: {selectedProduct.unit_measure}
                </p>
              </div>

              {/* KPIs de Comparación */}
              {productKPIs && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-700 font-medium mb-1">Precio Más Bajo</div>
                    <div className="text-2xl font-bold text-green-900">
                      €{productKPIs.minPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {productKPIs.cheapestSupplier?.supplierName}
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-red-700 font-medium mb-1">Precio Más Alto</div>
                    <div className="text-2xl font-bold text-red-900">
                      €{productKPIs.maxPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      {productKPIs.mostExpensiveSupplier?.supplierName}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-700 font-medium mb-1">Precio Promedio</div>
                    <div className="text-2xl font-bold text-blue-900">
                      €{productKPIs.avgPrice}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Entre {productKPIs.supplierCount} proveedores
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-sm text-yellow-700 font-medium mb-1">Diferencia</div>
                    <div className="text-2xl font-bold text-yellow-900">
                      {productKPIs.priceDifferencePercent}%
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">
                      €{productKPIs.priceDifference} de variación
                    </div>
                  </div>
                </div>
              )}

              {/* Tabla Comparativa de Precios */}
              {productComparisons.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Comparación de Precios por Proveedor
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Proveedor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contacto
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unidad
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Notas
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {productComparisons.map((comparison, index) => {
                          const isCheapest = comparison.price === productKPIs?.minPrice;
                          const isMostExpensive = comparison.price === productKPIs?.maxPrice;
                          const avgPrice = parseFloat(productKPIs?.avgPrice || 0);
                          const isBelowAverage = comparison.price < avgPrice;
                          
                          return (
                            <tr
                              key={comparison.supplierIngredientId}
                              className={`hover:bg-gray-50 ${
                                isCheapest ? 'bg-green-50' : ''
                              } ${isMostExpensive ? 'bg-red-50' : ''}`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">
                                  {comparison.supplierName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">
                                  {comparison.supplierContact && (
                                    <div>{comparison.supplierContact}</div>
                                  )}
                                  {comparison.supplierEmail && (
                                    <div className="text-xs text-gray-500">{comparison.supplierEmail}</div>
                                  )}
                                  {comparison.supplierPhone && (
                                    <div className="text-xs text-gray-500">{comparison.supplierPhone}</div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className={`text-lg font-semibold ${
                                  isCheapest ? 'text-green-700' : 
                                  isMostExpensive ? 'text-red-700' : 
                                  'text-gray-900'
                                }`}>
                                  €{comparison.price.toFixed(2)}
                                </div>
                                {productKPIs && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {comparison.price > productKPIs.minPrice ? (
                                      <span className="text-red-600">
                                        +{((comparison.price - productKPIs.minPrice) / productKPIs.minPrice * 100).toFixed(1)}%
                                      </span>
                                    ) : (
                                      <span className="text-green-600">Mejor precio</span>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {comparison.unit}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {isCheapest ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ⭐ Mejor Precio
                                  </span>
                                ) : isMostExpensive ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Más Caro
                                  </span>
                                ) : isBelowAverage ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Bajo Promedio
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Promedio
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {comparison.notes || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600">No hay precios disponibles para este producto</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <p className="mt-4 text-gray-500">
                  Busca un producto para comparar precios entre proveedores
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suppliers_Costs;

