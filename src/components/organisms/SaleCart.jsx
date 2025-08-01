import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SaleCart = ({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onProcessSale }) => {
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.saleQuantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.saleQuantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <ApperIcon name="ShoppingCart" className="mx-auto text-slate-400 mb-3" size={48} />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Cart is Empty</h3>
          <p className="text-slate-600">Search and add products to start a sale</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-slate-900">Sale Cart</h3>
          <Button variant="ghost" size="sm" onClick={onClearCart}>
            <ApperIcon name="Trash2" size={16} />
            Clear All
          </Button>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.Id} className="p-4 border-b border-slate-100 last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-slate-900">{item.name}</h4>
                <p className="text-sm text-slate-600">{item.sku}</p>
                <p className="text-sm font-medium text-slate-900">${item.price.toFixed(2)} each</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.Id, item.saleQuantity - 1)}
                    disabled={item.saleQuantity <= 1}
                  >
                    <ApperIcon name="Minus" size={14} />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.saleQuantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.Id, item.saleQuantity + 1)}
                    disabled={item.saleQuantity >= item.quantity}
                  >
                    <ApperIcon name="Plus" size={14} />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.Id)}
                  className="text-error-600 hover:text-error-700 hover:bg-error-50"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-slate-600">
                Available: {item.quantity - item.saleQuantity}
              </span>
              <span className="font-medium text-slate-900">
                ${(item.price * item.saleQuantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-slate-900">Total:</span>
          <span className="text-2xl font-bold text-slate-900">${totalAmount.toFixed(2)}</span>
        </div>
        
        <Button 
          variant="primary" 
          className="w-full justify-center"
          onClick={onProcessSale}
        >
          <ApperIcon name="CreditCard" size={16} />
          Process Sale
        </Button>
      </div>
    </div>
  );
};

export default SaleCart;