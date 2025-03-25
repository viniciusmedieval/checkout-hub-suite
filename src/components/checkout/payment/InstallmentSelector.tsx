
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/utils/formatters";
import { ConfigCheckout } from "@/lib/types/database-types";

interface InstallmentSelectorProps {
  productValue: number;
  value: string;
  onChange: (value: string) => void;
  maxInstallments?: number;
}

export function InstallmentSelector({ 
  productValue, 
  value, 
  onChange,
  maxInstallments = 12 
}: InstallmentSelectorProps) {
  // Use the provided maxInstallments or default to 12
  const actualMaxInstallments = maxInstallments || 12;
  
  // Generate installment options: up to maxInstallments
  const installments = Array.from({ length: actualMaxInstallments }, (_, i) => {
    const installmentNumber = i + 1;
    const installmentValue = productValue / installmentNumber;
    
    return {
      value: installmentNumber.toString(),
      label: `${installmentNumber}x de ${formatCurrency(installmentValue)}${installmentNumber > 1 ? ' sem juros' : ''}`
    };
  });
  
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-700">Parcelamento</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-11 bg-white text-black rounded-lg border-gray-200 focus-visible:ring-gray-300 focus-visible:ring-1 focus-visible:ring-offset-0">
          <SelectValue placeholder="Selecione o parcelamento" />
        </SelectTrigger>
        <SelectContent className="bg-white text-black border-gray-200">
          {installments.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
