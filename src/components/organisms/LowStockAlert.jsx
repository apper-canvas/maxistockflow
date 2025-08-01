import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const LowStockAlert = ({ lowStockProducts, onDismiss }) => {
  if (lowStockProducts.length === 0) return null;

  return (
    <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <ApperIcon name="AlertTriangle" className="text-warning-500 mt-0.5" size={20} />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-warning-800">
            Low Stock Alert
          </h3>
          <div className="mt-2 text-sm text-warning-700">
            <p className="mb-2">
              {lowStockProducts.length} {lowStockProducts.length === 1 ? "product" : "products"} running low on stock:
            </p>
            <ul className="list-disc list-inside space-y-1">
              {lowStockProducts.slice(0, 3).map((product) => (
                <li key={product.Id}>
                  <span className="font-medium">{product.name}</span> - {product.quantity} left
                </li>
              ))}
              {lowStockProducts.length > 3 && (
                <li>and {lowStockProducts.length - 3} more...</li>
              )}
            </ul>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          <ApperIcon name="X" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default LowStockAlert;