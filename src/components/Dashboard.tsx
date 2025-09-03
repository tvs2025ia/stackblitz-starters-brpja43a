import React from 'react';
import { useData } from '../contexts/DataContext';
import { useStore } from '../contexts/StoreContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  AlertTriangle,
  Calendar
} from 'lucide-react';

export function Dashboard({ onPageChange }) {
  const { sales, products, customers, expenses, cashMovements } = useData();
  const { currentStore } = useStore();

  // Calculate metrics for current store
  const storeProducts = products.filter(p => p.storeId === currentStore?.id);
  const storeSales = sales.filter(s => s.storeId === currentStore?.id);
  const storeCustomers = customers.filter(c => c.storeId === currentStore?.id);
  const storeExpenses = expenses.filter(e => e.storeId === currentStore?.id);

  // NUEVO: Ingresos totales y ventas de hoy incluyen abonos de separados (cashMovement tipo 'sale')
  const totalRevenue = cashMovements.filter(m => m.storeId === currentStore?.id && m.type === 'sale').reduce((sum, m) => sum + m.amount, 0);
  const totalExpenses = storeExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const lowStockProducts = storeProducts.filter(p => p.stock <= p.minStock);

  // Calculate today's ventas + abonos
  const today = new Date();
  const todayMovementSales = cashMovements.filter(m => {
    const d = new Date(m.date);
    return m.storeId === currentStore?.id &&
      m.type === 'sale' &&
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
  });
  const todayRevenue = todayMovementSales.reduce((sum, m) => sum + m.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }: {
    title: string;
    value: string;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    color?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">{currentStore?.name}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos de Hoy (ventas + abonos)"
          value={formatCurrency(todayRevenue)}
          icon={DollarSign}
          trend="up"
          trendValue={`${todayMovementSales.length} ingresos`}
          color="green"
        />
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          trend="up"
          trendValue="+12.5%"
          color="blue"
        />
        <button
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center justify-center text-center hover:bg-gray-50           transition-colors"
        onClick={() => onPageChange('cash-register')}
      >
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-orange-600" />
        </div>
        <p className="text-xl font-bold text-gray-900 mt-3">Cuadre de Caja</p>
        <p className="text-sm font-medium text-gray-600 mt-1">
          Cerrar el día y conciliar
        </p>
      </button>
        <StatCard
          title="Productos en Stock"
          value={storeProducts.length.toString()}
          icon={Package}
          trend="up"
          trendValue={`${lowStockProducts.length} bajo stock`}
          color="purple"
        />
      </div>

      {/* Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
            <h3 className="text-amber-800 font-medium">Productos con Stock Bajo</h3>
          </div>
          <div className="mt-3 space-y-2">
            {lowStockProducts.slice(0, 3).map(product => (
              <div key={product.id} className="flex justify-between items-center text-sm">
                <span className="text-amber-700">{product.name}</span>
                <span className="text-amber-600 font-medium">
                  {product.stock} disponibles (mín: {product.minStock})
                </span>
              </div>
            ))}
            {lowStockProducts.length > 3 && (
              <p className="text-amber-600 text-sm">
                +{lowStockProducts.length - 3} productos más con stock bajo
              </p>
            )}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos Recientes</h3>
          <div className="space-y-4">
            {cashMovements.filter(m => m.storeId === currentStore?.id && m.type === 'sale').slice(-5).reverse().map(mov => (
              <div key={mov.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{mov.description}</p>
                  <p className="text-sm text-gray-500">{mov.referenceId ? `Ref: ${mov.referenceId}` : ''}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(mov.amount)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(mov.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {totalRevenue === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay ingresos registrados</p>
              </div>
            )}
          </div>
        </div>
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Destacados</h3>
          <div className="space-y-4">
            {storeProducts.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                  <p className="text-sm text-gray-500">{product.stock} unidades</p>
                </div>
              </div>
            ))}
            {storeProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay productos registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            onClick={() => onPageChange('pos')}
          >
            <ShoppingCart className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Nueva Venta</span>
          </button>
          <button
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            onClick={() => onPageChange('layaway')}
          >
            <Package className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">Separados</span>
          </button>
          <button
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            onClick={() => onPageChange('inventory')}
          >
            <Package className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Inventario</span>
          </button>
          <button
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            onClick={() => onPageChange('customers')}
          >
            <Users className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Clientes</span>
          </button>
        </div>
      </div>
    </div>
  );
}