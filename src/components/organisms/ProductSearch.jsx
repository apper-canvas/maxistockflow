import React from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ProductSearch = ({ products, searchTerm, onSearchChange, onAddToCart }) => {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search products by name or SKU..."
      />
      
      {searchTerm && (
        <div className="card max-h-64 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-slate-600">No products found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredProducts.map((product) => (
                <div key={product.Id} className="p-4 hover:bg-slate-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Package" className="text-slate-500" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{product.name}</h4>
                          <p className="text-sm text-slate-600">{product.sku}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm font-medium text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <Badge variant={product.quantity > 0 ? "success" : "error"}>
                          {product.quantity} in stock
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onAddToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      <ApperIcon name="Plus" size={16} />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;