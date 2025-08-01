import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 text-center">
      <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="text-error-500" size={32} />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-slate-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;