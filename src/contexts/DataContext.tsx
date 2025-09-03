import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Sale, Customer, Expense, Quote, Purchase, PaymentMethod, User, Supplier, CashRegister, CashMovement, ReceiptTemplate, Layaway, LayawayPayment } from '../types';

interface DataContextType {
  products: Product[];
  sales: Sale[];
  customers: Customer[];
  expenses: Expense[];
  quotes: Quote[];
  purchases: Purchase[];
  paymentMethods: PaymentMethod[];
  users: User[];
  suppliers: Supplier[];
  cashRegisters: CashRegister[];
  cashMovements: CashMovement[];
  expenseCategories: string[];
  receiptTemplates: ReceiptTemplate[];
  layaways: Layaway[];
  isLoading: boolean;
  isConnected: boolean;
  dbService: any;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  addSale: (sale: Sale) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  addExpense: (expense: Expense) => void;
  addQuote: (quote: Quote) => void;
  updateQuote: (quote: Quote) => void;
  addPurchase: (purchase: Purchase) => void;
  addPaymentMethod: (paymentMethod: PaymentMethod) => void;
  updatePaymentMethod: (paymentMethod: PaymentMethod) => void;
  deletePaymentMethod: (id: string) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplier: Supplier) => void;
  addExpenseCategory: (category: string) => void;
  deleteExpenseCategory: (category: string) => void;
  addReceiptTemplate: (template: ReceiptTemplate) => void;
  updateReceiptTemplate: (template: ReceiptTemplate) => void;
  deleteReceiptTemplate: (id: string) => void;
  getActiveReceiptTemplate: (storeId: string) => ReceiptTemplate | null;
  openCashRegister: (register: CashRegister) => void;
  closeCashRegister: (registerId: string, closingAmount: number, expensesTurno?: any[]) => void;
  addCashMovement: (movement: CashMovement) => void;
  addLayaway: (layaway: Layaway) => void;
  updateLayaway: (layaway: Layaway) => void;
  addLayawayPayment: (layawayId: string, payment: LayawayPayment) => void;
  formatCurrency: (amount: number) => string;
  refreshData: () => Promise<void>;
  connectToDatabase: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Mock data with enhanced inventory for MySQL testing
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop HP Pavilion',
    sku: 'LP001',
    category: 'Computadores',
    price: 2500000,
    cost: 2000000,
    stock: 5,
    minStock: 2,
    storeId: '1',
    imageUrl: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Mouse Logitech',
    sku: 'MS001',
    category: 'Accesorios',
    price: 80000,
    cost: 60000,
    stock: 25,
    minStock: 10,
    storeId: '1'
  },
  {
    id: '3',
    name: 'Teclado Mecánico',
    sku: 'KB001',
    category: 'Accesorios',
    price: 150000,
    cost: 120000,
    stock: 15,
    minStock: 5,
    storeId: '1'
  },
  {
    id: '4',
    name: 'Monitor 24"',
    sku: 'MN001',
    category: 'Monitores',
    price: 800000,
    cost: 650000,
    stock: 8,
    minStock: 3,
    storeId: '2'
  },
  {
    id: '5',
    name: 'iPhone 15 Pro',
    sku: 'IP15P',
    category: 'Smartphones',
    price: 5200000,
    cost: 4500000,
    stock: 3,
    minStock: 1,
    storeId: '1'
  },
  {
    id: '6',
    name: 'Auriculares Sony',
    sku: 'AU001',
    category: 'Audio',
    price: 320000,
    cost: 250000,
    stock: 12,
    minStock: 5,
    storeId: '1'
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Efectivo', discountPercentage: 0, isActive: true },
  { id: '2', name: 'Tarjeta Débito', discountPercentage: 2.5, isActive: true },
  { id: '3', name: 'Tarjeta Crédito', discountPercentage: 3.8, isActive: true },
  { id: '4', name: 'Transferencia', discountPercentage: 1.2, isActive: true },
  { id: '5', name: 'PayPal', discountPercentage: 4.2, isActive: true },
  { id: '6', name: 'Nequi', discountPercentage: 1.8, isActive: true }
];

const mockExpenseCategories: string[] = [
  'Servicios',
  'Mantenimiento',
  'Suministros',
  'Marketing',
  'Transporte',
  'Seguridad',
  'Limpieza',
  'Otros'
];

const mockReceiptTemplates: ReceiptTemplate[] = [
  {
    id: '1',
    name: 'Plantilla Principal',
    storeId: '1',
    headerText: '*** RECIBO DE VENTA ***\nTienda Principal\nNIT: 123456789-1\nDir: Calle Principal 123',
    footerText: '¡Gracias por su compra!\nVisite nuestra web: www.tienda.com\nTel: +57 300 123 4567',
    showLogo: true,
    logoUrl: '',
    thermalWidth: 58,
    fontSize: 11,
    showDate: true,
    showEmployee: true,
    showCustomer: true,
    showInvoiceNumber: true,
    showPaymentMethod: true,
    showItemDetails: true,
    showTotals: true,
    isActive: true
  },
  {
    id: '2',
    name: 'Plantilla Sucursal Norte',
    storeId: '2',
    headerText: '*** RECIBO DE VENTA ***\nSucursal Norte\nNIT: 123456789-1\nDir: Av. Norte 456',
    footerText: '��Gracias por su compra!\nSucursal Norte\nTel: +57 300 123 4568',
    showLogo: true,
    logoUrl: '',
    thermalWidth: 58,
    fontSize: 11,
    showDate: true,
    showEmployee: true,
    showCustomer: true,
    showInvoiceNumber: true,
    showPaymentMethod: true,
    showItemDetails: true,
    showTotals: true,
    isActive: true
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    phone: '+57 300 123 4567',
    address: 'Calle 123, Ciudad',
    storeId: '1',
    totalPurchases: 5500000,
    lastPurchase: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@email.com',
    phone: '+57 300 123 4568',
    address: 'Av. Principal 456, Ciudad',
    storeId: '1',
    totalPurchases: 2300000,
    lastPurchase: new Date('2024-01-10')
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@tienda.com',
    role: 'admin',
    storeId: '1',
    createdAt: new Date(),
    isActive: true
  },
  {
    id: '2',
    username: 'empleado1',
    email: 'empleado1@tienda.com',
    role: 'employee',
    storeId: '1',
    createdAt: new Date(),
    isActive: true
  },
  {
    id: '3',
    username: 'empleado2',
    email: 'empleado2@tienda.com',
    role: 'employee',
    storeId: '2',
    createdAt: new Date(),
    isActive: true
  }
];

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Proveedor Tech SA',
    email: 'ventas@proveedortech.com',
    phone: '+57 300 555 0001',
    address: 'Zona Industrial, Ciudad',
    contactPerson: 'Carlos Mendoza',
    isActive: true
  },
  {
    id: '2',
    name: 'Distribuidora Nacional',
    email: 'pedidos@disnacional.com',
    phone: '+57 300 555 0002',
    address: 'Centro Comercial, Ciudad',
    contactPerson: 'Ana López',
    isActive: true
  }
];

interface DataProviderProps {
  children: ReactNode;
}

// Simple MySQL-like simulation using localStorage for persistence
class SimpleDatabase {
  private static get(key: string) {
    try {
      const data = localStorage.getItem(`mysql_sim_${key}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private static set(key: string, data: any) {
    try {
      localStorage.setItem(`mysql_sim_${key}`, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  static async getAllProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    return this.get('products') || mockProducts;
  }

  static async saveProducts(products: Product[]): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.set('products', products);
  }

  static async getAllSales(): Promise<Sale[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.get('sales') || [];
  }

  static async saveSales(sales: Sale[]): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.set('sales', sales);
  }

  static async getAllCustomers(): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.get('customers') || mockCustomers;
  }

  static async saveCustomers(customers: Customer[]): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.set('customers', customers);
  }

  static async testConnection(): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate connection test
      console.log('🔄 Simulando conexión MySQL...');
      console.log('📊 Configuración:', {
        host: import.meta.env.VITE_DB_HOST || 'NO CONFIGURADO',
        port: import.meta.env.VITE_DB_PORT || 'NO CONFIGURADO',
        username: import.meta.env.VITE_DB_USERNAME || 'NO CONFIGURADO',
        database: import.meta.env.VITE_DB_DATABASE || 'NO CONFIGURADO',
        password: import.meta.env.VITE_DB_PASSWORD ? '***CONFIGURADO***' : 'NO CONFIGURADO'
      });
      
      // Simulate successful connection if all credentials are provided
      if (import.meta.env.VITE_DB_HOST && 
          import.meta.env.VITE_DB_USERNAME && 
          import.meta.env.VITE_DB_PASSWORD && 
          import.meta.env.VITE_DB_DATABASE) {
        console.log('✅ Simulación de MySQL conectada (usando localStorage)');
        return true;
      }
      
      console.log('⚠️ Credenciales MySQL incompletas, usando modo offline');
      return false;
    } catch (error) {
      console.error('❌ Error simulando conexión MySQL:', error);
      return false;
    }
  }
}

export function DataProvider({ children }: DataProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const dbService = null; // Placeholder for future real MySQL implementation
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [expenseCategories, setExpenseCategories] = useState<string[]>(mockExpenseCategories);
  const [receiptTemplates, setReceiptTemplates] = useState<ReceiptTemplate[]>(mockReceiptTemplates);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([]);
  const [cashMovements, setCashMovements] = useState<CashMovement[]>([]);
  const [layaways, setLayaways] = useState<Layaway[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Initialize connection on component mount
  useEffect(() => {
    connectToDatabase();
  }, []);

  const connectToDatabase = async () => {
    try {
      setIsLoading(true);
      setIsConnected(false);
      
      // Test MySQL simulation
      const connected = await SimpleDatabase.testConnection();
      setIsConnected(connected);
      
      if (connected) {
        // Load data from simulated MySQL
        const [dbProducts, dbSales, dbCustomers] = await Promise.all([
          SimpleDatabase.getAllProducts(),
          SimpleDatabase.getAllSales(),
          SimpleDatabase.getAllCustomers()
        ]);
        
        setProducts(dbProducts);
        setSales(dbSales);
        setCustomers(dbCustomers);
        
        console.log(`📦 Datos cargados desde MySQL simulado: ${dbProducts.length} productos, ${dbSales.length} ventas, ${dbCustomers.length} clientes`);
      } else {
        // Use mock data
        setProducts(mockProducts);
        setSales([]);
        setCustomers(mockCustomers);
        console.log('📝 Usando datos mock offline');
      }
      
    } catch (error) {
      console.error('❌ Error conectando:', error);
      setIsConnected(false);
      setProducts(mockProducts);
      setSales([]);
      setCustomers(mockCustomers);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    if (isConnected) {
      try {
        setIsLoading(true);
        const [dbProducts, dbSales, dbCustomers] = await Promise.all([
          SimpleDatabase.getAllProducts(),
          SimpleDatabase.getAllSales(),
          SimpleDatabase.getAllCustomers()
        ]);
        
        setProducts(dbProducts);
        setSales(dbSales);
        setCustomers(dbCustomers);
        console.log('🔄 Datos actualizados desde MySQL simulado');
      } catch (error) {
        console.error('Error refrescando datos:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // CRUD functions with MySQL simulation
  const addProduct = async (product: Product) => {
    const newProducts = [...products, product];
    setProducts(newProducts);
    
    if (isConnected) {
      try {
        await SimpleDatabase.saveProducts(newProducts);
        console.log('✅ Producto guardado en MySQL simulado:', product.name);
      } catch (error) {
        console.error('Error guardando producto:', error);
      }
    } else {
      console.log('📝 Producto guardado en memoria (offline):', product.name);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(newProducts);
    
    if (isConnected) {
      try {
        await SimpleDatabase.saveProducts(newProducts);
        console.log('✅ Producto actualizado en MySQL simulado:', updatedProduct.name);
      } catch (error) {
        console.error('Error actualizando producto:', error);
      }
    } else {
      console.log('📝 Producto actualizado en memoria (offline):', updatedProduct.name);
    }
  };

  const addSale = async (sale: Sale) => {
    const newSales = [...sales, sale];
    setSales(newSales);
    
    // Update product stock
    const newProducts = products.map(p => {
      const saleItem = sale.items.find(item => item.productId === p.id);
      if (saleItem) {
        return { ...p, stock: p.stock - saleItem.quantity };
      }
      return p;
    });
    setProducts(newProducts);
    
    if (isConnected) {
      try {
        await Promise.all([
          SimpleDatabase.saveSales(newSales),
          SimpleDatabase.saveProducts(newProducts)
        ]);
        console.log('✅ Venta guardada en MySQL simulado:', sale.invoiceNumber);
      } catch (error) {
        console.error('Error guardando venta:', error);
      }
    } else {
      console.log('📝 Venta guardada en memoria (offline):', sale.invoiceNumber);
    }

    // Add cash movement
    const cashMovement: CashMovement = {
      id: Date.now().toString() + '_sale',
      storeId: sale.storeId,
      employeeId: sale.employeeId,
      type: 'sale',
      amount: sale.total,
      description: `Venta ${sale.invoiceNumber}`,
      date: sale.date,
      referenceId: sale.id
    };
    setCashMovements(prev => [...prev, cashMovement]);
  };

  const addCustomer = async (customer: Customer) => {
    const newCustomers = [...customers, customer];
    setCustomers(newCustomers);
    
    if (isConnected) {
      try {
        await SimpleDatabase.saveCustomers(newCustomers);
        console.log('✅ Cliente guardado en MySQL simulado:', customer.name);
      } catch (error) {
        console.error('Error guardando cliente:', error);
      }
    } else {
      console.log('📝 Cliente guardado en memoria (offline):', customer.name);
    }
  };

  const updateCustomer = async (updatedCustomer: Customer) => {
    const newCustomers = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
    setCustomers(newCustomers);
    
    if (isConnected) {
      try {
        await SimpleDatabase.saveCustomers(newCustomers);
        console.log('✅ Cliente actualizado en MySQL simulado:', updatedCustomer.name);
      } catch (error) {
        console.error('Error actualizando cliente:', error);
      }
    } else {
      console.log('📝 Cliente actualizado en memoria (offline):', updatedCustomer.name);
    }
  };

  // Mock implementations for other features
  const addExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
    const cashMovement: CashMovement = {
      id: Date.now().toString() + '_expense',
      storeId: expense.storeId,
      employeeId: expense.employeeId,
      type: 'expense',
      amount: -expense.amount,
      description: expense.description,
      date: expense.date,
      referenceId: expense.id
    };
    setCashMovements(prev => [...prev, cashMovement]);
  };

  const addQuote = (quote: Quote) => {
    setQuotes(prev => [...prev, quote]);
  };

  const updateQuote = (updatedQuote: Quote) => {
    setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
  };

  const addPurchase = (purchase: Purchase) => {
    setPurchases(prev => [...prev, purchase]);
    purchase.items.forEach(item => {
      setProducts(prev => prev.map(p => 
        p.id === item.productId 
          ? { ...p, stock: p.stock + item.quantity }
          : p
      ));
    });
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const addSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [...prev, supplier]);
  };

  const updateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  };

  const openCashRegister = (register: CashRegister) => {
    setCashRegisters(prev => [...prev, register]);
    const cashMovement: CashMovement = {
      id: Date.now().toString() + '_opening',
      storeId: register.storeId,
      employeeId: register.employeeId,
      type: 'opening',
      amount: register.openingAmount,
      description: 'Apertura de caja',
      date: register.openedAt,
      referenceId: register.id
    };
    setCashMovements(prev => [...prev, cashMovement]);
  };

  const closeCashRegister = (registerId: string, closingAmount: number, expensesTurno?: any[]) => {
    setCashRegisters(prev => prev.map(r => {
      if (r.id === registerId) {
        const openedAt = new Date(r.openedAt);
        const closedAt = new Date();

        const salesTurno = sales.filter(sale =>
          sale.storeId === r.storeId &&
          new Date(sale.date) >= openedAt &&
          new Date(sale.date) <= closedAt
        );
        const salesTotal = salesTurno.reduce((sum, s) => sum + s.total, 0);

        const expensesTurnoArr = expenses.filter(exp =>
          exp.storeId === r.storeId &&
          new Date(exp.date) >= openedAt &&
          new Date(exp.date) <= closedAt
        );
        const expensesTotal = expensesTurnoArr.reduce((sum, e) => sum + e.amount, 0);

        const expectedAmount = r.openingAmount + salesTotal - expensesTotal;
        const difference = closingAmount - expectedAmount;

        return {
          ...r,
          closingAmount,
          closedAt,
          status: 'closed' as const,
          expectedAmount,
          difference,
          expensesTurno: expensesTurnoArr
        };
      }
      return r;
    }));

    const register = cashRegisters.find(r => r.id === registerId);
    if (register) {
      const cashMovement: CashMovement = {
        id: Date.now().toString() + '_closing',
        storeId: register.storeId,
        employeeId: register.employeeId,
        type: 'closing',
        amount: 0,
        description: `Cierre de caja - Conteo: ${formatCurrency(closingAmount)}`,
        date: new Date(),
        referenceId: registerId
      };
      setCashMovements(prev => [...prev, cashMovement]);
    }
  };

  const addCashMovement = (movement: CashMovement) => {
    setCashMovements(prev => [...prev, movement]);
  };

  const addLayaway = (layaway: Layaway) => {
    setLayaways(prev => [...prev, layaway]);
    layaway.items.forEach(item => {
      setProducts(prev => prev.map(p => 
        p.id === item.productId 
          ? { ...p, stock: p.stock - item.quantity }
          : p
      ));
    });
  };

  const updateLayaway = (updatedLayaway: Layaway) => {
    setLayaways(prev => prev.map(l => l.id === updatedLayaway.id ? updatedLayaway : l));
  };

  const addLayawayPayment = (layawayId: string, payment: LayawayPayment) => {
    setLayaways(prev => prev.map(layaway => {
      if (layaway.id === layawayId) {
        const newTotalPaid = layaway.totalPaid + payment.amount;
        const newRemainingBalance = layaway.total - newTotalPaid;
        const newStatus = newRemainingBalance <= 0 ? 'completed' : 'active';
        
        return {
          ...layaway,
          payments: [...layaway.payments, payment],
          totalPaid: newTotalPaid,
          remainingBalance: newRemainingBalance,
          status: newStatus
        };
      }
      return layaway;
    }));

    const layaway = layaways.find(l => l.id === layawayId);
    if (layaway) {
      const cashMovement: CashMovement = {
        id: Date.now().toString() + '_layaway_payment',
        storeId: layaway.storeId,
        employeeId: payment.employeeId,
        type: 'sale',
        amount: payment.amount,
        description: `Abono separado #${layawayId}`,
        date: payment.date,
        referenceId: layawayId
      };
      setCashMovements(prev => [...prev, cashMovement]);
    }
  };

  const addPaymentMethod = (paymentMethod: PaymentMethod) => {
    setPaymentMethods(prev => [...prev, paymentMethod]);
  };

  const updatePaymentMethod = (updatedPaymentMethod: PaymentMethod) => {
    setPaymentMethods(prev => prev.map(pm =>
      pm.id === updatedPaymentMethod.id ? updatedPaymentMethod : pm
    ));
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  };

  const addExpenseCategory = (category: string) => {
    if (!expenseCategories.includes(category)) {
      setExpenseCategories(prev => [...prev, category].sort());
    }
  };

  const deleteExpenseCategory = (category: string) => {
    setExpenseCategories(prev => prev.filter(c => c !== category));
  };

  const addReceiptTemplate = (template: ReceiptTemplate) => {
    setReceiptTemplates(prev => [...prev, template]);
  };

  const updateReceiptTemplate = (updatedTemplate: ReceiptTemplate) => {
    setReceiptTemplates(prev => prev.map(rt =>
      rt.id === updatedTemplate.id ? updatedTemplate : rt
    ));
  };

  const deleteReceiptTemplate = (id: string) => {
    setReceiptTemplates(prev => prev.filter(rt => rt.id !== id));
  };

  const getActiveReceiptTemplate = (storeId: string): ReceiptTemplate | null => {
    return receiptTemplates.find(rt => rt.storeId === storeId && rt.isActive) || null;
  };

  const value = {
    products,
    sales,
    customers,
    expenses,
    quotes,
    purchases,
    paymentMethods,
    users,
    suppliers,
    cashRegisters,
    cashMovements,
    expenseCategories,
    receiptTemplates,
    layaways,
    isLoading,
    isConnected,
    dbService,
    addProduct,
    updateProduct,
    addSale,
    addCustomer,
    updateCustomer,
    addExpense,
    addQuote,
    updateQuote,
    addPurchase,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    addUser,
    updateUser,
    addSupplier,
    updateSupplier,
    addExpenseCategory,
    deleteExpenseCategory,
    addReceiptTemplate,
    updateReceiptTemplate,
    deleteReceiptTemplate,
    getActiveReceiptTemplate,
    openCashRegister,
    closeCashRegister,
    addCashMovement,
    addLayaway,
    updateLayaway,
    addLayawayPayment,
    formatCurrency,
    refreshData,
    connectToDatabase
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
