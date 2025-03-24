
import { Input } from "@/components/ui/input";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface CardExpiryInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export function CardExpiryInput({ value, onChange }: CardExpiryInputProps) {
  const [isValid, setIsValid] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value.replace(/\D/g, '');
    
    if (inputVal.length <= 4) {
      let formatted = inputVal;
      
      // Format as MM/YY
      if (inputVal.length > 2) {
        formatted = `${inputVal.slice(0, 2)}/${inputVal.slice(2)}`;
      }
      
      validateExpiry(inputVal, formatted);
    }
  };
  
  const validateExpiry = (raw: string, formatted: string) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    
    let isValidExpiry = false;
    
    if (raw.length === 4) {
      const month = parseInt(raw.slice(0, 2));
      const year = parseInt(raw.slice(2, 4));
      
      // Valid month (1-12)
      const isValidMonth = month >= 1 && month <= 12;
      
      // Not expired
      const isFutureDate = 
        (year > currentYear) || 
        (year === currentYear && month >= currentMonth);
      
      isValidExpiry = isValidMonth && isFutureDate;
    }
    
    setIsValid(isValidExpiry);
    onChange(formatted, isValidExpiry);
  };
  
  useEffect(() => {
    // Initial validation if there's already a value
    if (value && value.includes('/')) {
      const parts = value.split('/');
      if (parts.length === 2) {
        const raw = parts[0] + parts[1];
        validateExpiry(raw, value);
      }
    }
  }, []);
  
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
        <CalendarDays size={18} />
      </div>
      {isValid && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 z-10">
          <CheckCircle2 size={16} />
        </div>
      )}
      <Input 
        id="cardExpiry" 
        placeholder="MM/AA" 
        className="pl-10 h-11 text-sm bg-white text-black rounded-lg border-gray-200 focus-visible:ring-gray-300" 
        value={value}
        onChange={handleChange}
        type="tel"
        inputMode="numeric"
      />
    </div>
  );
}
