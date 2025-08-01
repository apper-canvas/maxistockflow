// Product Service with ApperClient integration
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
class ProductService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'product_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "lowStockThreshold_c" } },
          { field: { Name: "lastUpdated_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name || '',
        sku: product.sku_c || '',
        price: product.price_c || 0,
        quantity: product.quantity_c || 0,
        lowStockThreshold: product.lowStockThreshold_c || 0,
        lastUpdated: product.lastUpdated_c || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching products:", error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "lowStockThreshold_c" } },
          { field: { Name: "lastUpdated_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const product = response.data;
      return {
        Id: product.Id,
        name: product.Name || '',
        sku: product.sku_c || '',
        price: product.price_c || 0,
        quantity: product.quantity_c || 0,
        lowStockThreshold: product.lowStockThreshold_c || 0,
        lastUpdated: product.lastUpdated_c || new Date().toISOString()
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching product with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async create(productData) {
    try {
      const params = {
        records: [
          {
            Name: productData.name,
            sku_c: productData.sku,
            price_c: productData.price,
            quantity_c: productData.quantity,
            lowStockThreshold_c: productData.lowStockThreshold,
            lastUpdated_c: new Date().toISOString()
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create products ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdProduct = successfulRecords[0].data;
          return {
            Id: createdProduct.Id,
            name: createdProduct.Name || '',
            sku: createdProduct.sku_c || '',
            price: createdProduct.price_c || 0,
            quantity: createdProduct.quantity_c || 0,
            lowStockThreshold: createdProduct.lowStockThreshold_c || 0,
            lastUpdated: createdProduct.lastUpdated_c || new Date().toISOString()
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating product:", error?.response?.data?.message);
      } else {
        console.error("Error creating product:", error.message);
      }
      throw error;
    }
  }

  async update(id, productData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: productData.name,
            sku_c: productData.sku,
            price_c: productData.price,
            quantity_c: productData.quantity,
            lowStockThreshold_c: productData.lowStockThreshold,
            lastUpdated_c: new Date().toISOString()
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update products ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedProduct = successfulUpdates[0].data;
          return {
            Id: updatedProduct.Id,
            name: updatedProduct.Name || '',
            sku: updatedProduct.sku_c || '',
            price: updatedProduct.price_c || 0,
            quantity: updatedProduct.quantity_c || 0,
            lowStockThreshold: updatedProduct.lowStockThreshold_c || 0,
            lastUpdated: updatedProduct.lastUpdated_c || new Date().toISOString()
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating product:", error?.response?.data?.message);
      } else {
        console.error("Error updating product:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete products ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting product:", error?.response?.data?.message);
      } else {
        console.error("Error deleting product:", error.message);
      }
      throw error;
    }
  }

  async getLowStock(threshold = 10) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "lowStockThreshold_c" } },
          { field: { Name: "lastUpdated_c" } }
        ],
        where: [
          {
            FieldName: "quantity_c",
            Operator: "LessThanOrEqualTo",
            Values: [threshold.toString()]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name || '',
        sku: product.sku_c || '',
        price: product.price_c || 0,
        quantity: product.quantity_c || 0,
        lowStockThreshold: product.lowStockThreshold_c || 0,
        lastUpdated: product.lastUpdated_c || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching low stock products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching low stock products:", error.message);
      }
      return [];
    }
  }

  async getOutOfStock() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "lowStockThreshold_c" } },
          { field: { Name: "lastUpdated_c" } }
        ],
        where: [
          {
            FieldName: "quantity_c",
            Operator: "EqualTo",
            Values: ["0"]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name || '',
        sku: product.sku_c || '',
        price: product.price_c || 0,
        quantity: product.quantity_c || 0,
        lowStockThreshold: product.lowStockThreshold_c || 0,
        lastUpdated: product.lastUpdated_c || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching out of stock products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching out of stock products:", error.message);
      }
      return [];
    }
  }
}

export const productService = new ProductService();