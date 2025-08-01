import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ label, error, ...inputProps }) => {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        {...inputProps}
        className={error ? "border-error-500 focus:ring-error-500" : ""}
      />
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;