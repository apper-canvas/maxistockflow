import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StatCard from "@/components/molecules/StatCard";
import ProductTable from "@/components/organisms/ProductTable";
import ProductModal from "@/components/organisms/ProductModal";
import LowStockAlert from "@/components/organisms/LowStockAlert";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showLowStockAlert, setShowLowStockAlert] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

useEffect(() => {
    const filtered = products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct.Id, productData);
        toast.success("Product updated successfully!");
      } else {
        await productService.create(productData);
        toast.success("Product added successfully!");
      }
      loadProducts();
    } catch (error) {
      toast.error("Failed to save product. Please try again.");
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productService.delete(productId);
      toast.success("Product deleted successfully!");
      loadProducts();
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
      console.error("Error deleting product:", error);
    }
  };

  const getStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const lowStockCount = products.filter(product => product.quantity <= product.lowStockThreshold).length;
    const outOfStockCount = products.filter(product => product.quantity === 0).length;

    return {
      totalProducts,
      totalValue,
      lowStockCount,
      outOfStockCount,
    };
  };

  const getLowStockProducts = () => {
    return products.filter(product => 
      product.quantity <= product.lowStockThreshold && product.quantity > 0
    );
  };

  if (loading) return <Loading type="page" />;
  if (error) return <Error message={error} onRetry={loadProducts} />;

  const stats = getStats();
  const lowStockProducts = getLowStockProducts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-600 mt-1">Track and manage your product inventory</p>
        </div>
        <Button variant="primary" onClick={handleAddProduct}>
          <ApperIcon name="Plus" size={16} />
          Add Product
        </Button>
      </div>

      {/* Low Stock Alert */}
      {showLowStockAlert && lowStockProducts.length > 0 && (
        <LowStockAlert
          lowStockProducts={lowStockProducts}
          onDismiss={() => setShowLowStockAlert(false)}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="Package"
          change={`${stats.totalProducts} items`}
        />
        <StatCard
          title="Total Value"
          value={`$${stats.totalValue.toFixed(2)}`}
          icon="DollarSign"
          change="Current inventory value"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockCount}
          icon="AlertTriangle"
          change={`${stats.lowStockCount} items need reordering`}
          changeColor={stats.lowStockCount > 0 ? "text-warning-600" : "text-slate-600"}
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStockCount}
          icon="XCircle"
          change={`${stats.outOfStockCount} items unavailable`}
          changeColor={stats.outOfStockCount > 0 ? "text-error-600" : "text-slate-600"}
        />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search products by name or SKU..."
          />
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        searchTerm ? (
          <div className="card p-8">
            <div className="text-center">
              <ApperIcon name="Search" className="mx-auto text-slate-400 mb-3" size={48} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-600">
                No products match your search for "{searchTerm}". Try a different search term.
              </p>
            </div>
          </div>
        ) : (
          <Empty
            title="No products in inventory"
            description="Get started by adding your first product to track inventory."
            actionLabel="Add First Product"
            onAction={handleAddProduct}
            icon="Package"
          />
        )
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
};

export default InventoryPage;