import React from "react";
import Badge from "@/components/atoms/Badge";

const StockIndicator = ({ quantity, lowStockThreshold = 10 }) => {
  const getStockStatus = () => {
    if (quantity === 0) return { variant: "error", text: "Out of Stock" };
    if (quantity <= lowStockThreshold) return { variant: "warning", text: "Low Stock" };
    return { variant: "success", text: "In Stock" };
  };

  const getStockPercentage = () => {
    const maxStock = lowStockThreshold * 3; // Assume full stock is 3x threshold
    return Math.min((quantity / maxStock) * 100, 100);
  };

  const status = getStockStatus();
  const percentage = getStockPercentage();

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-[80px]">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              quantity === 0 
                ? "bg-error-500" 
                : quantity <= lowStockThreshold 
                ? "bg-warning-500" 
                : "bg-success-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <Badge variant={status.variant} className="whitespace-nowrap">
        {status.text}
      </Badge>
    </div>
  );
};

export default StockIndicator;