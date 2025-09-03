import { supabase } from '../lib/supabase';
import { Product } from '../types';

export interface BulkProductData {
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  imageUrl?: string;
}

export class ProductService {
  static async uploadBulkProducts(products: BulkProductData[], storeId: string): Promise<{ success: Product[], errors: string[] }> {
    const success: Product[] = [];
    const errors: string[] = [];

    for (let i = 0; i < products.length; i++) {
      const productData = products[i];
      const rowNumber = i + 2; // +2 because CSV starts at row 2 (after header)

      try {
        // Validate required fields
        if (!productData.name || !productData.sku || !productData.category) {
          errors.push(`Fila ${rowNumber}: Faltan campos requeridos (nombre, SKU, categoría)`);
          continue;
        }

        // Validate numeric fields
        if (isNaN(productData.price) || productData.price < 0) {
          errors.push(`Fila ${rowNumber}: Precio inválido`);
          continue;
        }

        if (isNaN(productData.cost) || productData.cost < 0) {
          errors.push(`Fila ${rowNumber}: Costo inválido`);
          continue;
        }

        if (isNaN(productData.stock) || productData.stock < 0) {
          errors.push(`Fila ${rowNumber}: Stock inválido`);
          continue;
        }

        if (isNaN(productData.minStock) || productData.minStock < 0) {
          errors.push(`Fila ${rowNumber}: Stock mínimo inválido`);
          continue;
        }

        // Check if SKU already exists
        const { data: existingProduct } = await supabase
          .from('prestashop_products')
          .select('id')
          .eq('reference', productData.sku)
          .single();

        if (existingProduct) {
          errors.push(`Fila ${rowNumber}: El SKU "${productData.sku}" ya existe`);
          continue;
        }

        // Insert product into Supabase
        const { data, error } = await supabase
          .from('prestashop_products')
          .insert({
            prestashop_id: Date.now() + i, // Temporary ID for demo
            name: productData.name,
            reference: productData.sku,
            price: productData.price,
            category_id: 1, // Default category for demo
            stock_quantity: productData.stock,
            active: true
          })
          .select()
          .single();

        if (error) {
          errors.push(`Fila ${rowNumber}: Error al guardar - ${error.message}`);
          continue;
        }

        // Create local Product object
        const newProduct: Product = {
          id: data.id,
          name: productData.name,
          sku: productData.sku,
          category: productData.category,
          price: productData.price,
          cost: productData.cost,
          stock: productData.stock,
          minStock: productData.minStock,
          storeId: storeId,
          imageUrl: productData.imageUrl
        };

        success.push(newProduct);

      } catch (error) {
        errors.push(`Fila ${rowNumber}: Error inesperado - ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }

    return { success, errors };
  }

  static async syncProductsFromSupabase(storeId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('prestashop_products')
        .select('*')
        .eq('active', true);

      if (error) {
        throw new Error(`Error al sincronizar productos: ${error.message}`);
      }

      return data.map(item => ({
        id: item.id,
        name: item.name,
        sku: item.reference || `SKU-${item.id}`,
        category: 'General', // Default category
        price: item.price || 0,
        cost: item.price ? item.price * 0.7 : 0, // Estimate 30% margin
        stock: item.stock_quantity || 0,
        minStock: 5, // Default min stock
        storeId: storeId,
        imageUrl: undefined
      }));

    } catch (error) {
      console.error('Error syncing products:', error);
      throw error;
    }
  }
}