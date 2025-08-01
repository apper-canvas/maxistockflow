import React from "react";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, change, changeColor = "text-slate-600" }) => {
  return (
    <div className="card p-6 hover-scale">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeColor} mt-1`}>{change}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
          <ApperIcon name={icon} className="text-primary-500" size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;