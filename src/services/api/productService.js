import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  constructor() {
    this.products = [...productsData];
  }

  async getAll() {
    await delay(300);
    return [...this.products];
  }

  async getById(id) {
    await delay(200);
    const product = this.products.find(p => p.Id === id);
    if (!product) {
      throw new Error(`Product with Id ${id} not found`);
    }
    return { ...product };
  }

  async create(productData) {
    await delay(400);
    const newId = Math.max(...this.products.map(p => p.Id), 0) + 1;
    const newProduct = {
      Id: newId,
      ...productData,
      lastUpdated: new Date().toISOString(),
    };
    this.products.push(newProduct);
    return { ...newProduct };
  }

  async update(id, productData) {
    await delay(400);
    const index = this.products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Product with Id ${id} not found`);
    }
    
    this.products[index] = {
      ...this.products[index],
      ...productData,
      Id: id,
      lastUpdated: new Date().toISOString(),
    };
    
    return { ...this.products[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Product with Id ${id} not found`);
    }
    
    const deletedProduct = this.products.splice(index, 1)[0];
    return { ...deletedProduct };
  }

  async getLowStock(threshold = 10) {
    await delay(250);
    return this.products
      .filter(product => product.quantity <= threshold)
      .map(product => ({ ...product }));
  }

  async getOutOfStock() {
    await delay(250);
    return this.products
      .filter(product => product.quantity === 0)
      .map(product => ({ ...product }));
  }
}

export const productService = new ProductService();