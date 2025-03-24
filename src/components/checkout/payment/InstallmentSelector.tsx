
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/utils/formatters";

interface InstallmentSelectorProps {
  productValue: number;
  value: string;
  onChange: (value: string) => void;
}

export function InstallmentSelector({ productValue, value, onChange }: InstallmentSelectorProps) {
  // Generate installment options: up to 12x
  const installments = Array.from({ length: 12 }, (_, i) => {
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
