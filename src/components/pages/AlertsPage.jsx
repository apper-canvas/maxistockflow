import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StockIndicator from "@/components/molecules/StockIndicator";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";

const AlertsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, out-of-stock, low-stock

  useEffect(() => {
    loadProducts();
  }, []);

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

const getFilteredProducts = () => {
    switch (filter) {
      case "out-of-stock":
        return products.filter(product => (product.quantity || 0) === 0);
      case "low-stock":
        return products.filter(product => 
          (product.quantity || 0) > 0 && (product.quantity || 0) <= (product.lowStockThreshold || 0)
        );
      default:
        return products.filter(product => 
          (product.quantity || 0) <= (product.lowStockThreshold || 0)
        );
    }
  };

const getAlertStats = () => {
    const outOfStock = products.filter(product => (product.quantity || 0) === 0);
    const lowStock = products.filter(product => 
      (product.quantity || 0) > 0 && (product.quantity || 0) <= (product.lowStockThreshold || 0)
    );
    const totalAlerts = outOfStock.length + lowStock.length;

    return {
      totalAlerts,
      outOfStockCount: outOfStock.length,
      lowStockCount: lowStock.length,
    };
  };

const getAlertType = (product) => {
    if ((product.quantity || 0) === 0) return "critical";
    if ((product.quantity || 0) <= (product.lowStockThreshold || 0)) return "warning";
    return "success";
  };

  const getAlertMessage = (product) => {
    if ((product.quantity || 0) === 0) return "Out of stock - immediate attention required";
    if ((product.quantity || 0) <= (product.lowStockThreshold || 0)) return "Low stock - consider reordering soon";
    return "Stock level normal";
  };

  if (loading) return <Loading type="page" />;
  if (error) return <Error message={error} onRetry={loadProducts} />;

  const filteredProducts = getFilteredProducts();
  const stats = getAlertStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Stock Alerts</h1>
        <p className="text-slate-600 mt-1">Monitor products requiring attention</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Total Alerts</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalAlerts}</p>
            </div>
            <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="text-warning-500" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Out of Stock</p>
              <p className="text-3xl font-bold text-error-600">{stats.outOfStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <ApperIcon name="XCircle" className="text-error-500" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Low Stock</p>
              <p className="text-3xl font-bold text-warning-600">{stats.lowStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="text-warning-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Alerts ({stats.totalAlerts})
        </Button>
        <Button
          variant={filter === "out-of-stock" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setFilter("out-of-stock")}
        >
          Out of Stock ({stats.outOfStockCount})
        </Button>
        <Button
          variant={filter === "low-stock" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setFilter("low-stock")}
        >
          Low Stock ({stats.lowStockCount})
        </Button>
      </div>

      {/* Alerts List */}
      {filteredProducts.length === 0 ? (
        <Empty
          title="No alerts found"
          description="All products have sufficient stock levels. Great job!"
          icon="CheckCircle"
        />
      ) : (
        <div className="card">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">
              Stock Alerts ({filteredProducts.length})
            </h2>
          </div>
          
          <div className="divide-y divide-slate-200">
            {filteredProducts.map((product) => {
              const alertType = getAlertType(product);
              const alertMessage = getAlertMessage(product);
              
              return (
                <div key={product.Id} className="p-6 hover:bg-slate-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        alertType === "critical" ? "bg-error-500" : 
                        alertType === "warning" ? "bg-warning-500" : "bg-success-500"
                      }`} />
                      
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Package" className="text-slate-500" size={20} />
                      </div>
                      
                      <div className="flex-1">
<div className="flex items-center space-x-3">
                          <h3 className="font-medium text-slate-900">{product.name || 'N/A'}</h3>
                          <Badge variant={alertType === "critical" ? "error" : "warning"}>
                            {(product.quantity || 0) === 0 ? "Out of Stock" : "Low Stock"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">SKU: {product.sku || 'N/A'}</p>
                        <p className="text-sm text-slate-600">{alertMessage}</p>
                      </div>
                    </div>
                    
                    <div className="text-right min-w-[200px]">
                      <div className="flex items-center justify-end space-x-4 mb-2">
<span className="text-sm text-slate-600">Current Stock:</span>
                        <span className={`font-medium ${
                          (product.quantity || 0) === 0 ? "text-error-600" : 
                          (product.quantity || 0) <= (product.lowStockThreshold || 0) ? "text-warning-600" : "text-success-600"
                        }`}>
                          {product.quantity || 0} units
                        </span>
                      </div>
<StockIndicator 
                        quantity={product.quantity || 0} 
                        lowStockThreshold={product.lowStockThreshold || 0} 
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Threshold: {product.lowStockThreshold || 0} units
                      </p>
                      <p className="text-xs text-slate-500">
                        Updated: {format(new Date(product.lastUpdated || new Date()), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;