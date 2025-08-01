import salesData from "@/services/mockData/sales.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SaleService {
  constructor() {
    this.sales = [...salesData];
  }

  async getAll() {
    await delay(300);
    return [...this.sales];
  }

  async getById(id) {
    await delay(200);
    const sale = this.sales.find(s => s.Id === id);
    if (!sale) {
      throw new Error(`Sale with Id ${id} not found`);
    }
    return { ...sale };
  }

  async create(saleData) {
    await delay(400);
    const newId = Math.max(...this.sales.map(s => s.Id), 0) + 1;
    const newSale = {
      Id: newId,
      ...saleData,
      timestamp: new Date().toISOString(),
    };
    this.sales.push(newSale);
    return { ...newSale };
  }

  async getByDateRange(startDate, endDate) {
    await delay(250);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.sales
      .filter(sale => {
        const saleDate = new Date(sale.timestamp);
        return saleDate >= start && saleDate <= end;
      })
      .map(sale => ({ ...sale }));
  }

  async getByProduct(productId) {
    await delay(250);
    return this.sales
      .filter(sale => sale.productId === productId)
      .map(sale => ({ ...sale }));
  }

  async getTodaysSales() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return this.getByDateRange(startOfDay.toISOString(), endOfDay.toISOString());
  }
}

export const saleService = new SaleService();