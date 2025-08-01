import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StatCard from "@/components/molecules/StatCard";
import ProductSearch from "@/components/organisms/ProductSearch";
import SaleCart from "@/components/organisms/SaleCart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { saleService } from "@/services/api/saleService";
import { format } from "date-fns";

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, salesData] = await Promise.all([
        productService.getAll(),
        saleService.getAll()
      ]);
      setProducts(productsData);
      setSales(salesData);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.Id === product.Id);
    
    if (existingItem) {
      if (existingItem.saleQuantity >= product.quantity) {
        toast.warning("Cannot add more items than available in stock");
        return;
      }
      handleUpdateQuantity(product.Id, existingItem.saleQuantity + 1);
    } else {
      if (product.quantity === 0) {
        toast.warning("Product is out of stock");
        return;
      }
      setCartItems(prev => [...prev, { ...product, saleQuantity: 1 }]);
      toast.success(`${product.name} added to cart`);
    }
    setSearchTerm("");
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const product = products.find(p => p.Id === productId);
    if (newQuantity > product.quantity) {
      toast.warning("Cannot exceed available stock");
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.Id === productId ? { ...item, saleQuantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.Id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const handleProcessSale = async () => {
    if (cartItems.length === 0) {
      toast.warning("Cart is empty");
      return;
    }

    try {
      // Process each sale item
      for (const item of cartItems) {
        await saleService.create({
          productId: item.Id,
          quantity: item.saleQuantity,
          price: item.price,
        });

        // Update product quantity
        const updatedQuantity = item.quantity - item.saleQuantity;
        await productService.update(item.Id, {
          ...item,
          quantity: updatedQuantity,
        });
      }

      toast.success("Sale processed successfully!");
      setCartItems([]);
      loadData(); // Reload to get updated quantities
    } catch (error) {
      toast.error("Failed to process sale. Please try again.");
      console.error("Error processing sale:", error);
    }
  };

  const getTodaysStats = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todaysSales = sales.filter(sale => 
      format(new Date(sale.timestamp), "yyyy-MM-dd") === today
    );

    const todaysRevenue = todaysSales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
    const todaysQuantity = todaysSales.reduce((sum, sale) => sum + sale.quantity, 0);
    
    return {
      totalSales: sales.length,
      todaysRevenue,
      todaysQuantity,
      cartTotal: cartItems.reduce((sum, item) => sum + (item.price * item.saleQuantity), 0),
    };
  };

  if (loading) return <Loading type="page" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = getTodaysStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sales</h1>
        <p className="text-slate-600 mt-1">Process sales and manage transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          icon="ShoppingCart"
          change="All time transactions"
        />
        <StatCard
          title="Today's Revenue"
          value={`$${stats.todaysRevenue.toFixed(2)}`}
          icon="DollarSign"
          change="Today's earnings"
        />
        <StatCard
          title="Items Sold Today"
          value={stats.todaysQuantity}
          icon="Package"
          change="Units sold today"
        />
        <StatCard
          title="Current Cart"
          value={`$${stats.cartTotal.toFixed(2)}`}
          icon="ShoppingBag"
          change={`${cartItems.length} items in cart`}
        />
      </div>

      {/* Sales Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Search */}
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ApperIcon name="Search" className="text-slate-500" size={20} />
              <h2 className="text-lg font-medium text-slate-900">Find Products</h2>
            </div>
            <ProductSearch
              products={products}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Sale Cart */}
        <div>
          <SaleCart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onProcessSale={handleProcessSale}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesPage;