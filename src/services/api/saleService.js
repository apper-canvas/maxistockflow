// Sale Service with ApperClient integration
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
class SaleService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'sale_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "productId_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI format
      return response.data.map(sale => ({
        Id: sale.Id,
        productId: sale.productId_c?.Id || sale.productId_c,
        quantity: sale.quantity_c || 0,
        price: sale.price_c || 0,
        timestamp: sale.timestamp_c || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching sales:", error?.response?.data?.message);
      } else {
        console.error("Error fetching sales:", error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "productId_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const sale = response.data;
      return {
        Id: sale.Id,
        productId: sale.productId_c?.Id || sale.productId_c,
        quantity: sale.quantity_c || 0,
        price: sale.price_c || 0,
        timestamp: sale.timestamp_c || new Date().toISOString()
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching sale with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching sale with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async create(saleData) {
    try {
      const params = {
        records: [
          {
            Name: `Sale - ${new Date().toISOString()}`,
            productId_c: parseInt(saleData.productId),
            quantity_c: saleData.quantity,
            price_c: saleData.price,
            timestamp_c: new Date().toISOString()
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
          console.error(`Failed to create sales ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdSale = successfulRecords[0].data;
          return {
            Id: createdSale.Id,
            productId: createdSale.productId_c?.Id || createdSale.productId_c,
            quantity: createdSale.quantity_c || 0,
            price: createdSale.price_c || 0,
            timestamp: createdSale.timestamp_c || new Date().toISOString()
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating sale:", error?.response?.data?.message);
      } else {
        console.error("Error creating sale:", error.message);
      }
      throw error;
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "productId_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        where: [
          {
            FieldName: "timestamp_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          },
          {
            FieldName: "timestamp_c",
            Operator: "LessThanOrEqualTo",
            Values: [endDate]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(sale => ({
        Id: sale.Id,
        productId: sale.productId_c?.Id || sale.productId_c,
        quantity: sale.quantity_c || 0,
        price: sale.price_c || 0,
        timestamp: sale.timestamp_c || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching sales by date range:", error?.response?.data?.message);
      } else {
        console.error("Error fetching sales by date range:", error.message);
      }
      return [];
    }
  }

  async getByProduct(productId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "productId_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        where: [
          {
            FieldName: "productId_c",
            Operator: "EqualTo",
            Values: [parseInt(productId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(sale => ({
        Id: sale.Id,
        productId: sale.productId_c?.Id || sale.productId_c,
        quantity: sale.quantity_c || 0,
        price: sale.price_c || 0,
        timestamp: sale.timestamp_c || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching sales by product:", error?.response?.data?.message);
      } else {
        console.error("Error fetching sales by product:", error.message);
      }
      return [];
    }
  }

  async getTodaysSales() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return this.getByDateRange(startOfDay.toISOString(), endOfDay.toISOString());
  }
}

export const saleService = new SaleService();