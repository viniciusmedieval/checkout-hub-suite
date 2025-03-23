
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { formatCardExpiry } from "@/utils/formatters";

interface CardExpiryInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export function CardExpiryInput({ value, onChange }: CardExpiryInputProps) {
  const handleCardExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = formatCardExpiry(value);
    
    // Validate expiry date
    let isValid = false;
    if (formattedValue.length === 5) {
      const [month, year] = formattedValue.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      const isValidMonth = parseInt(month) >= 1 && parseInt(month) <= 12;
      const isValidYear = parseInt(year) >= currentYear;
      const isValidDate = isValidYear && (parseInt(year) > currentYear || parseInt(month) >= currentMonth);
      
      isValid = isValidMonth && isValidDate;
    }
    
    onChange(formattedValue, isValid);
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
        📅
      </div>
      <Input 
        id="cardExpiry" 
        placeholder="MM/AA" 
        className="pl-9 h-10 text-sm bg-black text-white" 
        value={value}
        onChange={handleCardExpiryChange}
        maxLength={5}
      />
    </div>
  );
}
