
import { getInstallmentOptions } from "@/utils/formatters";

interface InstallmentSelectorProps {
  productValue: number;
  value: string;
  onChange: (value: string) => void;
}

export function InstallmentSelector({ 
  productValue, 
  value, 
  onChange 
}: InstallmentSelectorProps) {
  const installmentOptions = getInstallmentOptions(productValue);
  
  return (
    <select 
      id="installments" 
      className="w-full h-10 bg-white border border-gray-200 rounded px-3 text-sm text-gray-900"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {installmentOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
