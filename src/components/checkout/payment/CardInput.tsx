
import { Input } from "@/components/ui/input";
import { CreditCard, CheckCircle2 } from "lucide-react";

interface CardInputProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
}

export function CardInput({ value, onChange, isValid }: CardInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '');
    if (newValue.length <= 16) {
      onChange(newValue);
    }
  };
  
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
        <CreditCard size={16} />
      </div>
      {isValid && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
          <CheckCircle2 size={16} />
        </div>
      )}
      <Input 
        id="cardNumber" 
        placeholder="Número do cartão" 
        className="pl-9 h-10 text-sm bg-white text-black" 
        value={value}
        onChange={handleChange}
        type="tel" 
        inputMode="numeric"
      />
    </div>
  );
}
